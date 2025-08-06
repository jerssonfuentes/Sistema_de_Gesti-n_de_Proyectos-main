// Importamos ObjectId para trabajar con IDs de MongoDB
const { ObjectId } = require('mongodb');

// Importamos Inquirer para hacer preguntas interactivas en la terminal
const inquirer = require('inquirer');

// Tema de colores personalizado para mejorar la experiencia visual
const chalkTheme = require('../config/chalkTheme');

// Importamos la función que conecta con la base de datos
const getDB = require('../config/mongoClient');

// ---------------------------------------------
// FUNCIÓN PARA CREAR UN NUEVO PROYECTO
// ---------------------------------------------
async function crearProyecto() {
  const db = await getDB(); // Conectamos a la base de datos

  // Obtenemos todos los contratos registrados
  const contratos = await db.collection('contratos').find().toArray();

  // Validamos que exista al menos un contrato
  if (contratos.length === 0) {
    console.log(chalkTheme.error('\n⚠️ No hay contratos registrados. Debes crear uno antes de agregar proyectos.\n'));
    return;
  }

  // Mostramos al usuario una lista para seleccionar el contrato
  const { contratoId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'contratoId',
      message: 'Selecciona el contrato al que pertenece este proyecto:',
      choices: contratos.map(c => ({
        name: `${c.titulo} - Cliente: ${c.clienteNombre || 'No especificado'}`,
        value: c._id.toString() // Usamos el ID del contrato como valor
      }))
    }
  ]);

  // Buscamos el contrato que el usuario seleccionó
  const contratoSeleccionado = contratos.find(c => c._id.toString() === contratoId);

  // Solicitamos los datos del nuevo proyecto
  const { titulo, descripcion, estado } = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del proyecto:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del proyecto:' },
    {
      type: 'list',
      name: 'estado',
      message: 'Estado del proyecto:',
      choices: ['Activo', 'En progreso', 'Completado', 'Cancelado'] // Opciones predefinidas
    }
  ]);

  // Creamos el objeto con los datos del nuevo proyecto
  const nuevoProyecto = {
    contratoId: new ObjectId(contratoId), // Relacionamos con el contrato seleccionado
    contratoTitulo: contratoSeleccionado.titulo, // Guardamos el nombre del contrato para referencias rápidas
    titulo,
    descripcion,
    estado,
    creadoEn: new Date() // Fecha de creación
  };

  // Insertamos el proyecto en la colección "proyectos"
  await db.collection('proyectos').insertOne(nuevoProyecto);
  console.log(chalkTheme.success('\n✅ Proyecto creado correctamente y vinculado al contrato.\n'));
}

// ---------------------------------------------
// FUNCIÓN PARA LISTAR TODOS LOS PROYECTOS
// ---------------------------------------------
async function listarProyectos() {
  const db = await getDB(); // Conectamos a la base de datos
  const proyectos = await db.collection('proyectos').find().toArray(); // Obtenemos todos los proyectos

  // Si no hay proyectos, se muestra advertencia
  if (proyectos.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay proyectos registrados.\n'));
    return;
  }

  // Formateamos los datos para mostrar en forma de tabla
  const tabla = proyectos.map((p, i) => ({
    Nº: i + 1,
    Contrato: p.contratoTitulo,
    Título: p.titulo,
    Estado: p.estado
  }));

  console.log('\n📋 Proyectos Registrados:\n');
  console.table(tabla); // Mostramos tabla en consola
}

// ---------------------------------------------
// FUNCIÓN PARA BUSCAR PROYECTOS CON FILTROS
// ---------------------------------------------
async function buscarProyecto(filtro) {
  const db = await getDB(); // Conectamos a la base de datos
  const query = {}; // Inicializamos el filtro

  // Aplicamos filtros dinámicamente según los datos recibidos
  if (filtro.titulo) query.titulo = { $regex: filtro.titulo, $options: 'i' };
  if (filtro.estado) query.estado = filtro.estado;
  if (filtro.contratoId) query.contratoId = new ObjectId(filtro.contratoId);

  const resultados = await db.collection('proyectos').find(query).toArray(); // Buscamos en la colección

  // Mostramos advertencia si no hay resultados
  if (resultados.length === 0) {
    console.log(chalkTheme.warning('\n❌ No se encontraron proyectos con ese filtro.\n'));
    return;
  }

  // Mostramos resultados en tabla
  console.table(resultados.map((p, i) => ({
    Nº: i + 1,
    Contrato: p.contratoTitulo,
    Título: p.titulo,
    Estado: p.estado
  })));
}

// ---------------------------------------------
// FUNCIÓN PARA ACTUALIZAR UN PROYECTO
// ---------------------------------------------
async function actualizarProyecto(id, datos) {
  const db = await getDB(); // Conectamos a la base de datos
  const resultado = await db.collection('proyectos').updateOne(
    { _id: new ObjectId(id) }, // Filtro por ID
    { $set: datos } // Datos nuevos que reemplazarán los antiguos
  );

  // Verificamos si se modificó algún documento
  if (resultado.modifiedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ No se modificó ningún documento.'));
  } else {
    console.log(chalkTheme.success('\n✔ Proyecto actualizado correctamente.'));
  }
}

// ---------------------------------------------
// FUNCIÓN PARA ELIMINAR UN PROYECTO
// ---------------------------------------------
async function eliminarProyecto(id) {
  const db = await getDB(); // Conectamos a la base de datos
  const resultado = await db.collection('proyectos').deleteOne({ _id: new ObjectId(id) });

  // Verificamos si se eliminó algo
  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ No se eliminó ningún documento.'));
  } else {
    console.log(chalkTheme.exit('\n✔ Proyecto eliminado correctamente.'));
  }
}

// ---------------------------------------------
// EXPORTAMOS TODAS LAS FUNCIONES PARA USO EXTERNO
// ---------------------------------------------
module.exports = {
  crearProyecto,
  listarProyectos,
  buscarProyecto,
  actualizarProyecto,
  eliminarProyecto
};