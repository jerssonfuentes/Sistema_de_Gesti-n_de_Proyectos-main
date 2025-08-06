// ==========================================
// Submenú de gestión de clientes
// Conecta con la lógica del módulo clientesModule.js
// ==========================================

const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearCliente,
  listarClientes,
  buscarCliente,  // 👈 nombre debe coincidir con el export
  actualizarCliente,
  eliminarCliente
} = require('../../models/clienteModel');

async function showClientesMenu() {
  console.clear();
  console.log(chalkTheme.section('\n[Gestión de Clientes]\n'));

  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalkTheme.title('¿Qué deseas hacer?'),
      choices: [
        chalkTheme.option('1. Crear cliente'),
        chalkTheme.option('2. Listar clientes'),
        chalkTheme.option('3. Buscar cliente'),
        chalkTheme.option('4. Actualizar cliente'),
        chalkTheme.option('5. Eliminar cliente'),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  switch (opcion) {
    case chalkTheme.option('1. Crear cliente'):
      await crearCliente();
      break;
    case chalkTheme.option('2. Listar clientes'):
      await listarClientes();
      break;
    case chalkTheme.option('3. Buscar cliente'):
      await buscarCliente();
      break;
    case chalkTheme.option('4. Actualizar cliente'):
      await actualizarCliente();
      break;
    case chalkTheme.option('5. Eliminar cliente'):
      await eliminarCliente();
      break;
    case chalkTheme.exit('0. Volver al menú principal'):
      return;
  }

  await inquirer.prompt([
    {
      type: 'input',
      name: 'pause',
      message: chalkTheme.info('\nPresiona ENTER para continuar...')
    }
  ]);

  return await showClientesMenu();
}

module.exports = showClientesMenu;