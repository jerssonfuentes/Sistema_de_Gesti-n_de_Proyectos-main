// Importa el tipo ObjectId de MongoDB, necesario para manejar identificadores únicos.
const { ObjectId } = require('mongodb');

// Importa inquirer, una librería para hacer preguntas al usuario en la terminal.
const inquirer = require('inquirer');

// Importa los estilos personalizados de consola (colores, formatos).
const chalkTheme = require('../config/chalkTheme');

// Importa la función que retorna la instancia de conexión a la base de datos.
const getDB = require('../config/mongoClient');

// Función para registrar un nuevo movimiento (Ingreso o Gasto)
async function registrarMovimiento() {
  // Obtiene la base de datos
  const db = await getDB();

  // Selecciona la colección "finanzas"
  const finanzas = db.collection('finanzas');

  // Pregunta al usuario los datos del movimiento
  const datos = await inquirer.prompt([
    { type: 'list', name: 'tipo', message: 'Tipo de movimiento:', choices: ['Ingreso', 'Gasto'] },
    { type: 'input', name: 'descripcion', message: 'Descripción:' },
    {
      type: 'input',
      name: 'monto',
      message: 'Monto (número positivo):',
      // Valida que el monto ingresado sea un número positivo
      validate: input => {
        const num = parseFloat(input);
        return (!isNaN(num) && num >= 0) || 'Ingresa un número válido y positivo.';
      }
    },
    { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' }
  ]);

  // Inserta el nuevo movimiento en la colección
  const resultado = await finanzas.insertOne({
    ...datos,
    fecha: new Date(datos.fecha), // Convierte la fecha a formato Date
    monto: parseFloat(datos.monto) // Asegura que el monto sea número
  });

  // Muestra el ID generado del nuevo movimiento
  console.log(chalkTheme.success(`\nMovimiento registrado con ID: ${resultado.insertedId}`));
}

// Función para listar todos los movimientos registrados
async function listarMovimientos() {
  const db = await getDB();
  const movimientos = await db.collection('finanzas').find().toArray();

  // Si no hay movimientos registrados, muestra mensaje
  if (!movimientos.length) {
    return console.log(chalkTheme.warning('\nNo hay movimientos registrados.\n'));
  }

  // Crea una tabla legible con los datos de cada movimiento
  const tabla = movimientos.map(m => ({
    Tipo: m.tipo,
    Descripción: m.descripcion,
    Monto: `$${m.monto.toFixed(2)}`,
    Fecha: m.fecha.toISOString().split('T')[0] // Formato: YYYY-MM-DD
  }));

  console.log(chalkTheme.title('\n📊 Registro financiero:\n'));
  console.table(tabla); // Muestra los movimientos en formato tabla
}

// Función para filtrar movimientos según tipo, mes y año
async function filtrarMovimientos() {
  const { tipo, mes, anio } = await inquirer.prompt([
    { type: 'list', name: 'tipo', message: 'Filtrar por tipo:', choices: ['Todos', 'Ingreso', 'Gasto'] },
    { type: 'input', name: 'mes', message: 'Mes (1-12, opcional):' },
    { type: 'input', name: 'anio', message: 'Año (ej. 2025, opcional):' }
  ]);

  const db = await getDB();
  const finanzas = db.collection('finanzas');

  const filtro = {};

  // Agrega filtro por tipo si no es "Todos"
  if (tipo !== 'Todos') filtro.tipo = tipo;

  // Agrega filtro por fecha (mes/año) si se especifican
  if (anio || mes) {
    const start = new Date(`${anio || '1900'}-${mes || '01'}-01`);
    const end = new Date(start);

    if (mes) {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    filtro.fecha = { $gte: start, $lt: end };
  }

  const resultados = await finanzas.find(filtro).toArray();

  if (!resultados.length) {
    return console.log(chalkTheme.warning('\nNo hay movimientos que coincidan.\n'));
  }

  console.log(chalkTheme.info('\n📅 Resultados filtrados:\n'));
  console.table(resultados.map(r => ({
    Tipo: r.tipo,
    Descripción: r.descripcion,
    Monto: `$${r.monto.toFixed(2)}`,
    Fecha: r.fecha.toISOString().split('T')[0]
  })));
}

// Función para ver el balance general por mes o año
async function verBalance() {
  // Pide año y mes al usuario
  const { anio, mes } = await inquirer.prompt([
    { name: 'anio', message: 'Año (ej. 2025):' },
    { name: 'mes', message: 'Mes (1-12, opcional):' }
  ]);

  // Define el rango de fechas para filtrar
  const start = new Date(`${anio}-${mes || '01'}-01`);
  const end = new Date(start);

  mes ? end.setMonth(end.getMonth() + 1) : end.setFullYear(end.getFullYear() + 1);

  const db = await getDB();
  const movimientos = await db.collection('finanzas').find({
    fecha: { $gte: start, $lt: end }
  }).toArray();

  // Calcula totales
  const ingresos = movimientos.filter(m => m.tipo === 'Ingreso').reduce((acc, m) => acc + m.monto, 0);
  const gastos = movimientos.filter(m => m.tipo === 'Gasto').reduce((acc, m) => acc + m.monto, 0);
  const balance = ingresos - gastos;

  // Muestra el resumen del balance
  console.log(chalkTheme.section(`\n📈 Balance financiero (${mes ? `Mes ${mes}` : 'Anual'} - ${anio})`));
  console.log(`\n💰 Ingresos: $${ingresos.toFixed(2)}`);
  console.log(`💸 Gastos:   $${gastos.toFixed(2)}`);
  console.log(`📊 Balance:  ${balance >= 0 ? chalkTheme.success(`+$${balance.toFixed(2)}`) : chalkTheme.exit(`-$${Math.abs(balance).toFixed(2)}`)}\n`);
}

// Función para actualizar un movimiento existente
async function actualizarMovimiento() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del movimiento a actualizar:' }
  ]);

  // Pregunta nuevos datos al usuario
  const nuevosDatos = await inquirer.prompt([
    { type: 'list', name: 'tipo', message: 'Nuevo tipo:', choices: ['Ingreso', 'Gasto'] },
    { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
    {
      type: 'input',
      name: 'monto',
      message: 'Nuevo monto:',
      validate: input => {
        const num = parseFloat(input);
        return (!isNaN(num) && num >= 0) || 'Ingresa un número válido.';
      }
    },
    { type: 'input', name: 'fecha', message: 'Nueva fecha (YYYY-MM-DD):' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('finanzas').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...nuevosDatos,
        fecha: new Date(nuevosDatos.fecha),
        monto: parseFloat(nuevosDatos.monto)
      }
    }
  );

  // Muestra el resultado
  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\nMovimiento no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nMovimiento actualizado correctamente.'));
  }
}

// Función para eliminar un movimiento
async function eliminarMovimiento() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del movimiento a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('finanzas').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\nMovimiento no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nMovimiento eliminado exitosamente.'));
  }
}

// Exporta todas las funciones para poder usarlas en otros archivos
module.exports = {
  registrarMovimiento,
  listarMovimientos,
  filtrarMovimientos,
  verBalance,
  actualizarMovimiento,
  eliminarMovimiento
};