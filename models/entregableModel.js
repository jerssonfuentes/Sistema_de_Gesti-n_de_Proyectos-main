// Importa ObjectId para manejar identificadores de MongoDB
const { ObjectId } = require('mongodb');

// Importa Inquirer para crear prompts interactivos en la terminal
const inquirer = require('inquirer');

// Importa temas personalizados para los estilos de consola (colores, íconos, etc.)
const chalkTheme = require('../config/chalkTheme');

// Importa la función para obtener la conexión a la base de datos
const getDB = require('../config/mongoClient');

// ----------------------------------------------
// Función para crear un nuevo entregable
async function crearEntregable() {
  const db = await getDB(); // Obtiene la conexión a la base de datos

  // Obtiene todos los proyectos existentes desde la colección "proyectos"
  const proyectos = await db.collection('proyectos').find().toArray();

  // Si no hay proyectos, muestra un mensaje y detiene la ejecución
  if (proyectos.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay proyectos registrados. Debes crear uno primero.\n'));
    return;
  }

  // Pregunta al usuario a qué proyecto quiere asociar el entregable
  const { proyectoId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'proyectoId',
      message: 'Selecciona el proyecto al que pertenece este entregable:',
      choices: proyectos.map(p => ({
        name: `${p.titulo} (Contrato: ${p.contratoTitulo})`, // Nombre visible del proyecto
        value: p._id.toString() // Valor interno del ID del proyecto
      }))
    }
  ]);

  // Busca el proyecto seleccionado en el arreglo original
  const proyectoSeleccionado = proyectos.find(p => p._id.toString() === proyectoId);

  // Solicita al usuario ingresar los datos del entregable
  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del entregable:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del entregable:' },
    { type: 'input', name: 'fechaEntrega', message: 'Fecha de entrega (YYYY-MM-DD):' }
  ]);

  // Crea el objeto que se insertará en la base de datos
  const nuevoEntregable = {
    proyectoId: new ObjectId(proyectoId), // ID del proyecto relacionado
    proyectoTitulo: proyectoSeleccionado.titulo, // Título del proyecto
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    fechaEntrega: new Date(datos.fechaEntrega), // Convierte string a tipo Date
    creadoEn: new Date() // Fecha actual de creación del entregable
  };

  // Inserta el entregable en la colección "entregables"
  const resultado = await db.collection('entregables').insertOne(nuevoEntregable);

  // Muestra un mensaje de éxito con el ID del nuevo entregable
  console.log(chalkTheme.success(`\n✅ Entregable creado con ID: ${resultado.insertedId}\n`));
}

// ----------------------------------------------
// Función para listar todos los entregables
async function listarEntregables() {
  const db = await getDB(); // Conecta a la base de datos
  const entregables = await db.collection('entregables').find().toArray(); // Trae todos los entregables

  // Si no hay ninguno, informa al usuario
  if (entregables.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay entregables registrados.\n'));
    return;
  }

  // Crea una tabla para mostrar en consola con formato
  const tabla = entregables.map((e, i) => ({
    Nº: i + 1,
    Proyecto: e.proyectoTitulo || 'Sin título',
    Título: e.titulo,
    Descripción: e.descripcion,
    'Fecha de Entrega': e.fechaEntrega
      ? e.fechaEntrega.toISOString().split('T')[0] // Muestra solo la fecha (sin hora)
      : 'No especificada'
  }));

  // Muestra título de la sección y luego la tabla en consola
  console.log(chalkTheme.title('\n📦 Entregables registrados:\n'));
  console.table(tabla);
}

// ----------------------------------------------
// Función para actualizar un entregable por su ID
async function actualizarEntregable() {
  // Pide el ID del entregable a actualizar
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del entregable a actualizar:' }
  ]);

  // Pide los nuevos datos para actualizar
  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
    { type: 'input', name: 'fechaEntrega', message: 'Nueva fecha de entrega (YYYY-MM-DD):' }
  ]);

  const db = await getDB(); // Conecta a la base de datos

  // Ejecuta la actualización en la base de datos
  const resultado = await db.collection('entregables').updateOne(
    { _id: new ObjectId(id) }, // Filtro por ID
    {
      $set: {
        titulo: nuevosDatos.titulo,
        descripcion: nuevosDatos.descripcion,
        fechaEntrega: new Date(nuevosDatos.fechaEntrega)
      }
    }
  );

  // Muestra mensajes dependiendo del resultado
  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\n❌ Entregable no encontrado.'));
  } else {
    console.log(chalkTheme.success('\n✔ Entregable actualizado correctamente.'));
  }
}

// ----------------------------------------------
// Función para eliminar un entregable por ID
async function eliminarEntregable() {
  // Pide el ID del entregable a eliminar
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del entregable a eliminar:' }
  ]);

  const db = await getDB(); // Conecta a la base de datos

  // Intenta eliminar el entregable
  const resultado = await db.collection('entregables').deleteOne({ _id: new ObjectId(id) });

  // Muestra un mensaje según si lo encontró y eliminó o no
  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ Entregable no encontrado.'));
  } else {
    console.log(chalkTheme.exit('\n✔ Entregable eliminado exitosamente.'));
  }
}

// ----------------------------------------------
// Exporta todas las funciones para usarlas desde otros archivos
module.exports = {
  crearEntregable,
  listarEntregables,
  actualizarEntregable,
  eliminarEntregable
};