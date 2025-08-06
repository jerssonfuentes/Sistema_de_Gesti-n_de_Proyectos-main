const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearEntregable,
  listarEntregables,
  actualizarEntregable,
  eliminarEntregable
} = require('../../models/entregableModel');

async function showEntregablesMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'list',
      name: 'opcion',
      message: chalkTheme.section('\nGestión de Entregables'),
      choices: [
        'Crear entregable',
        'Listar entregables',
        'Actualizar entregable',
        'Eliminar entregable',
        'Volver al menú principal'
      ]
    }]);

    switch (opcion) {
      case 'Crear entregable':
        await crearEntregable();
        break;
      case 'Listar entregables':
        await listarEntregables();
        break;
      case 'Actualizar entregable':
        await actualizarEntregable();
        break;
      case 'Eliminar entregable':
        await eliminarEntregable();
        break;
      case 'Volver al menú principal':
        salir = true;
        break;
    }
  }
}

module.exports = showEntregablesMenu;