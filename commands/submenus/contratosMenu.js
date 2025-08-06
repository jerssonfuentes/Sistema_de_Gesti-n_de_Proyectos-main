
const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearContrato,
  listarContratos,
  buscarContrato,
  actualizarContrato,
  eliminarContrato
} = require('../../models/contratoModel');

async function showContratosMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'opcion',
        message: chalkTheme.section('Gestión de Contratos'),
        choices: [
          'Crear contrato',
          'Listar contratos',
          'Buscar contrato',
          'Actualizar contrato',
          'Eliminar contrato',
          'Volver al menú principal'
        ]
      }
    ]);

    switch (opcion) {
      case 'Crear contrato':
        await crearContrato();
        break;
      case 'Listar contratos':
        await listarContratos();
        break;
      case 'Buscar contrato':
        await buscarContrato();
        break;
      case 'Actualizar contrato':
        await actualizarContrato();
        break;
      case 'Eliminar contrato':
        await eliminarContrato();
        break;
      case 'Volver al menú principal':
        salir = true;
        break;
    }
  }
}

module.exports = showContratosMenu;
