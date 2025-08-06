const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearProyecto,
  listarProyectos,
  buscarProyecto,
  actualizarProyecto,
  eliminarProyecto
} = require('../../models/proyectoModel');

async function showProyectosMenu() {
  console.log(chalkTheme.section('\n[Gestión de Proyectos]'));

  const { opcion } = await inquirer.prompt({
    type: 'list',
    name: 'opcion',
    message: '¿Qué deseas hacer?',
    choices: [
      'Crear proyecto',
      'Listar proyectos',
      'Buscar proyecto',
      'Actualizar proyecto',
      'Eliminar proyecto',
      'Volver'
    ]
  });

  switch (opcion) {
    case 'Crear proyecto':
      await crearProyecto(); // Ya hace toda la lógica con búsqueda de cliente por nombre
      break;

    case 'Listar proyectos':
      await listarProyectos();
      break;

    case 'Buscar proyecto':
      const filtros = await inquirer.prompt([
        { name: 'cliente', message: 'Buscar por nombre del cliente (opcional):' },
        { name: 'estado', message: 'Buscar por estado (opcional):' },
        { name: 'titulo', message: 'Buscar por título (opcional):' }
      ]);
      await buscarProyecto(filtros);
      break;

    case 'Actualizar proyecto':
      const { idActualizar } = await inquirer.prompt({
        name: 'idActualizar',
        message: 'ID del proyecto a actualizar:'
      });

      const nuevosDatos = await inquirer.prompt([
        { name: 'titulo', message: 'Nuevo título (dejar vacío si no cambia):' },
        { name: 'descripcion', message: 'Nueva descripción (opcional):' },
        { name: 'estado', message: 'Nuevo estado (dejar vacío si no cambia):' }
      ]);
      await actualizarProyecto(idActualizar, nuevosDatos);
      break;

    case 'Eliminar proyecto':
      const { idEliminar } = await inquirer.prompt({
        name: 'idEliminar',
        message: 'ID del proyecto a eliminar:'
      });
      await eliminarProyecto(idEliminar);
      break;

    case 'Volver':
    default:
      return;
  }

}

module.exports = showProyectosMenu;