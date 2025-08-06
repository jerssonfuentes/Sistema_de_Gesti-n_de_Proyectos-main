🧠 Gestor de Portafolio Freelance

Un sistema de línea de comandos (CLI) desarrollado en Node.js que permite a freelancers de diseño gráfico administrar sus proyectos, clientes, contratos, entregables, finanzas y propuestas de manera estructurada y profesional, aplicando principios SOLID y patrones de diseño para mantener un código limpio, escalable y mantenible.

📦 Características principales

- Gestión de clientes

- Registro y seguimiento de propuestas

- Gestión de proyectos con estado y seguimiento

- Creación y control de contratos

- Registro de entregables por fecha

- Módulo financiero: ingresos, egresos, balance

- Navegación CLI intuitiva y estilizada

⚙️ Instrucciones de instalación y uso

Clona este repositorio:

cd gestor-freelance-cli

```

Instala las dependencias:

```
npm install inquirer chalk mongodb

```

Asegúrate de tener MongoDB ejecutándose localmente. Si no, inícialo con:

```
net start MongoDB     # En Windows
brew services start mongodb-community  # En Mac con Homebrew
```

Ejecuta la aplicación:

node index.js

📁 Estructura del proyecto
```
├── commands/
│   ├── mainMenu.js
│   └── submenus/
│       ├── clientesMenu.js
│       ├── propuestasMenu.js
│       ├── proyectosMenu.js
│       ├── contratosMenu.js
│       ├── entregablesMenu.js
│       └── finanzasMenu.js
│
├── config/
│   ├── chalkTheme.js
│   └── mongoClient.js
│
├── models/
│   ├── clienteModel.js
│   ├── propuestaModel.js
│   ├── proyectoModel.js
│   ├── contratoModel.js
│   ├── entregableModel.js
│   └── finanzasModel.js
│
├── index.js
└── README.md
```

🧱 Principios SOLID aplicados

- S (Single Responsibility): Cada archivo model tiene una sola responsabilidad sobre una entidad (cliente, proyecto, etc).

- O (Open/Closed): Los menús están diseñados para extenderse sin modificar los existentes.

- L (Liskov Substitution): Las funciones en cada módulo cumplen sus contratos sin romper la aplicación.

- I (Interface Segregation): Separación clara de menús, lógica de datos y configuración.

- D (Dependency Inversion): Uso de funciones inyectadas desde la capa de modelos a los submenús sin dependencias rígidas.

🧰 Patrones de diseño utilizados

- Command Pattern: Cada submenú actúa como un "comando" invocado desde el menú principal.

- Repository Pattern: La conexión a MongoDB y sus operaciones están encapsuladas en los modelos.

- Factory Pattern (básico): Algunas entradas de datos podrían derivar en distintos flujos, creando abstracciones.

📦 Librerías npm utilizadas

Paquete	Propósito

- inquirer	Interfaz CLI interactiva para el usuario

- chalk	Estilizado de texto con colores

- mongodb	Conexión y consultas a la base de datos



