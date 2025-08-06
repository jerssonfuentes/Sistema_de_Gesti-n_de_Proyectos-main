// =======================
// Módulo para mostrar el menú principal del sistema de portafolio freelance
// Utiliza inquirer para opciones interactivas y chalkTheme para estilos de colores

const inquirer = require('inquirer');              // Librería para preguntas CLI
const chalkTheme = require('../config/chalkTheme'); // Tema de colores personalizados

// Función asincrónica que muestra el menú principal
async function showMainMenu() {
  console.clear(); // Limpia la consola cada vez que se muestra el menú

  // Banner del sistema
  console.log(chalkTheme.banner('=== Gestor de Portafolio Freelance ===\n'));

  // Mostrar opciones con inquirer
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: chalkTheme.title('Selecciona una opción:'),
      loop: false, // <--- IMPORTANTE: Desactiva el menú en modo ruleta
      choices: [
        chalkTheme.option('1. Gestión de Clientes'),
        chalkTheme.option('2. Gestión de Propuestas'),
        chalkTheme.option('3. Gestión de Proyectos'),
        chalkTheme.option('4. Contratos'),
        chalkTheme.option('5. Entregables'),
        chalkTheme.option('6. Finanzas'),
        new inquirer.Separator(),               // Separador visual
        chalkTheme.exit('0. Salir')             // Opción para salir
      ]
    }
  ]);

  // Retornamos la opción elegida para que sea manejada desde index.js
  return answer.option;
}

// Exportamos la función para usarla en otros módulos
module.exports = showMainMenu;