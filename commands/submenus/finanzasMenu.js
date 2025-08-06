const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  registrarMovimiento,
  listarMovimientos,
  filtrarMovimientos,
  verBalance,
  actualizarMovimiento,
  eliminarMovimiento
} = require('../../models/finanzasModel');

async function showFinanzasMenu() {
  console.log(chalkTheme.section('\n[Gestión de Finanzas]'));

  const { opcion } = await inquirer.prompt({
    type: 'list',
    name: 'opcion',
    message: '¿Qué deseas hacer?',
    choices: [
      'Registrar movimiento',
      'Listar movimientos',
      'Filtrar movimientos',
      'Ver balance financiero',
      'Actualizar movimiento',
      'Eliminar movimiento',
      'Volver'
    ]
  });

  switch (opcion) {
    case 'Registrar movimiento':
      await registrarMovimiento();
      break;

    case 'Listar movimientos':
      await listarMovimientos();
      break;

    case 'Filtrar movimientos':
      await filtrarMovimientos();
      break;

    case 'Ver balance financiero':
      await verBalance();
      break;

    case 'Actualizar movimiento':
      await actualizarMovimiento();
      break;

    case 'Eliminar movimiento':
      await eliminarMovimiento();
      break;

    case 'Volver':
    default:
      return;
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  await showFinanzasMenu();
}

module.exports = showFinanzasMenu;