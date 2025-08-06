// Importamos ObjectId para convertir strings a IDs de MongoDB
const { ObjectId } = require('mongodb');

// Librería para hacer preguntas interactivas por consola
const inquirer = require('inquirer');

// Tema de colores personalizado para mensajes en consola
const chalkTheme = require('../config/chalkTheme');

// Función para obtener la instancia de la base de datos
const getDB = require('../config/mongoClient');

// Función para crear una nueva propuesta
async function crearPropuesta() {
  const db = await getDB(); // Conectamos a la base de datos
  const propuestas = db.collection('propuestas'); // Accedemos a la colección de propuestas
  const clientes = await db.collection('clientes').find().toArray(); // Obtenemos todos los clientes

  // Verificamos si hay clientes registrados
  if (clientes.length === 0) {
    console.log(chalkTheme.exit('\nNo hay clientes registrados. Crea un cliente antes de crear una propuesta.\n'));
    return;
  }

  // Preguntamos al usuario qué cliente desea asignar a la propuesta
  const { clienteId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'clienteId',
      message: 'Selecciona un cliente para esta propuesta:',
      choices: clientes.map(c => ({
        name: `${c.nombre} (${c.email || 'sin email'})`, // Nombre y email como texto visible
        value: c._id.toString() // ID como valor
      }))
    }
  ]);

  // Encontramos el cliente seleccionado a partir del ID
  const clienteSeleccionado = clientes.find(c => c._id.toString() === clienteId);

  // Preguntamos los datos de la propuesta
  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título de la propuesta:' },
    { type: 'editor', name: 'contenido', message: 'Contenido o descripción de la propuesta:' }, // Usa editor por consola
    { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
  ]);

  // Insertamos la propuesta en la base de datos
  const resultado = await propuestas.insertOne({
    titulo: datos.titulo,
    contenido: datos.contenido,
    fecha: new Date(datos.fecha), // Convertimos string a objeto Date
    clienteId: new ObjectId(clienteId), // Asociamos ID de cliente
    clienteNombre: clienteSeleccionado.nombre, // Guardamos el nombre del cliente
  });

  // Confirmación en consola
  console.log(chalkTheme.success(`\nPropuesta creada con ID: ${resultado.insertedId}`));
}
// Listar todas las propuestas
// Función para listar todas las propuestas registradas
async function listarPropuestas() {
  const db = await getDB(); // Conectamos a la base de datos
  const propuestas = await db.collection('propuestas').find().toArray(); // Traemos todas las propuestas

  // Si no hay ninguna, lo informamos
  if (propuestas.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay propuestas registradas.\n'));
    return;
  }

  // Creamos una tabla con información resumida
  const tabla = propuestas.map((p, i) => ({
    Nº: i + 1,
    Título: p.titulo,
    Cliente: p.clienteNombre, // Posible error: debería ser `p.clienteNombre`
    Fecha: p.fecha ? p.fecha.toISOString().split('T')[0] : 'Sin fecha', // Formato YYYY-MM-DD
  }));

  console.log(chalkTheme.title('\n📄 Propuestas registradas:\n'));
  console.table(tabla); // Mostramos tabla por consola
}
// Buscar y ver detalles de una propuesta desde un listado
// Función para seleccionar y ver detalles de una propuesta
async function verDetallePropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray(); // Obtenemos todas las propuestas

  // Si no hay ninguna, lo informamos
  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas registradas.\n'));
    return;
  }

  // Preguntamos cuál propuesta se desea visualizar
  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para ver detalles:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  // Buscamos y mostramos detalles completos
  const propuesta = propuestas.find(p => p._id.toString() === propuestaId);
  console.log(chalkTheme.info('\nDetalles de la propuesta:'));
  console.log(propuesta);
}
// Actualizar una propuesta desde listado
// Función para actualizar una propuesta existente
async function actualizarPropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray(); // Obtenemos todas las propuestas

  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas para actualizar.\n'));
    return;
  }

  // Preguntamos cuál se desea actualizar
  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para actualizar:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  // Pedimos los nuevos datos de la propuesta
  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'editor', name: 'contenido', message: 'Nuevo contenido:' },
    { type: 'input', name: 'fecha', message: 'Nueva fecha (YYYY-MM-DD):' },
  ]);

  // Realizamos la actualización en la base de datos
  const resultado = await db.collection('propuestas').updateOne(
    { _id: new ObjectId(propuestaId) },
    {
      $set: {
        titulo: nuevosDatos.titulo,
        contenido: nuevosDatos.contenido,
        fecha: new Date(nuevosDatos.fecha),
      }
    }
  );

  // Informamos si se modificó algo
  if (resultado.modifiedCount > 0) {
    console.log(chalkTheme.success('\nPropuesta actualizada correctamente.'));
  } else {
    console.log(chalkTheme.warning('\nNo se realizó ninguna modificación.'));
  }
}
// Eliminar una propuesta desde listado
// Función para eliminar una propuesta existente
async function eliminarPropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray(); // Obtenemos todas las propuestas

  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas para eliminar.\n'));
    return;
  }

  // Preguntamos cuál se desea eliminar
  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para eliminar:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  // Confirmación de seguridad antes de eliminar
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmDelete',
      message: '¿Estás seguro de eliminar esta propuesta?',
      default: false
    }
  ]);

  // Si el usuario cancela, salimos
  if (!confirm.confirmDelete) {
    console.log(chalkTheme.info('Eliminación cancelada.'));
    return;
  }

  // Ejecutamos la eliminación
  const result = await db.collection('propuestas').deleteOne({ _id: new ObjectId(propuestaId) });

  if (result.deletedCount === 0) {
    console.log(chalkTheme.warning('\nPropuesta no encontrada o ya eliminada.'));
  } else {
    console.log(chalkTheme.success('\nPropuesta eliminada exitosamente.'));
  }
}
// Exportamos todas las funciones para que puedan ser usadas en otros archivos
module.exports = {
  crearPropuesta,
  listarPropuestas,
  verDetallePropuesta,
  actualizarPropuesta,
  eliminarPropuesta
};