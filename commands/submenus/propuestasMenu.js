const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearPropuesta,
  listarPropuestas,
  buscarPropuestaPorId,
  actualizarPropuesta,
  eliminarPropuesta
} = require('../../models/propuestaModel');

async function showPropuestasMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'list',
      name: 'opcion',
      message: chalkTheme.section('\nGestión de Propuestas'),
      choices: [
        'Crear propuesta',
        'Listar propuestas',
        'Buscar propuesta por ID',
        'Actualizar propuesta',
        'Eliminar propuesta',
        'Volver al menú principal'
      ]
    }]);

    switch (opcion) {
      case 'Crear propuesta':
        await crearPropuesta();
        break;
      case 'Listar propuestas':
        await listarPropuestas();
        break;
      case 'Buscar propuesta por ID':
        await buscarPropuestaPorId();
        break;
      case 'Actualizar propuesta':
        await actualizarPropuesta();
        break;
      case 'Eliminar propuesta':
        await eliminarPropuesta();
        break;
      case 'Volver al menú principal':
        salir = true;
        break;
    }
  }
}

module.exports = showPropuestasMenu;