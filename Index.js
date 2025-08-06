// ===========================
// Punto de entrada de la aplicación CLI
// Controla el flujo del menú principal y navegación entre módulos

const showMainMenu = require('./commands/mainMenu'); // Importamos el menú principal
const chalkTheme = require('./config/chalkTheme');   // Tema de colores para estilizar textos
const showClientesMenu = require('./commands/submenus/clientesMenu'); // SubMenu clientes
const showPropuestasMenu = require('./commands/submenus/propuestasMenu');
const showProyectosMenu = require('./commands/submenus/proyectosMenu');
const showContratosMenu = require('./commands/submenus/contratosMenu');
const showEntregablesMenu = require('./commands/submenus/entregablesMenu');
const showFinanzasMenu = require('./commands/submenus/finanzasMenu');


// Función principal que inicia la aplicación
async function runApp() {
  let exit = false; // Variable de control para salir del sistema

  while (!exit) {
    // Mostramos el menú principal y capturamos la opción seleccionada
    const selected = await showMainMenu();

    // Evaluamos la opción seleccionada por el usuario
    switch (selected) {
      case chalkTheme.option('1. Gestión de Clientes'):
        await showClientesMenu();
        break;

      case chalkTheme.option('2. Gestión de Propuestas'):
        await showPropuestasMenu();
        break;

      case chalkTheme.option('3. Gestión de Proyectos'):
        await showProyectosMenu();
        break;

      case chalkTheme.option('4. Contratos'):
        await showContratosMenu();
        break;

      case chalkTheme.option('5. Entregables'):
        await showEntregablesMenu();
        break;

      case chalkTheme.option('6. Finanzas'):
        await showFinanzasMenu();
        break;

      case chalkTheme.exit('0. Salir'):
        console.log(chalkTheme.exit('\n¡Gracias por usar el gestor de portafolio freelance!\n'));
        exit = true;
        break;

      default:
        console.log(chalkTheme.info('\nOpción no reconocida.\n'));
    }

    // Esperamos un poco antes de volver a mostrar el menú (solo si no se sale)
    if (!exit) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Ejecutamos la app
runApp();