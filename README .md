# Freelancer CLI

## Descripción del proyecto

**Freelancer CLI** es una aplicación de línea de comandos desarrollada en Node.js que permite a freelancers gestionar su portafolio profesional. Incluye funcionalidades para registrar clientes, propuestas, proyectos, contratos, entregables y finanzas, todo desde una interfaz CLI intuitiva.

Esta aplicación está diseñada con una arquitectura limpia, siguiendo principios SOLID, patrones de diseño y utilizando MongoDB (sin mongoose) con transacciones para garantizar la integridad de los datos.

## Instrucciones de instalación y uso

### Requisitos previos

- Node.js (v18 o superior)
- MongoDB en local (ejecutando en `mongodb://localhost:27017`)
- Git (opcional)

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jerssonfuentes/freelancer-cli
   cd freelancer-cli
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura la base de datos si es necesario en `config/database.js`.

4. Ejecuta el programa principal:

   ```bash
   node index.js
   ```

## Estructura del proyecto

```
freelancer-cli/
│
├── config/
│   └── database.js         # Configuración de la conexión a MongoDB
│
├── controllers/            # Controladores para cada entidad
│
├── entities/               # Entidades de dominio (Cliente, Proyecto, etc.)
│
├── repositories/           # Acceso a datos (DAO)
│
├── services/               # Lógica de negocio (coordinación entre entidades y repositorios)
│
├── utils/
│   └── menu.js             # Funcionalidad del menú CLI
│
├── prueba/
│   └── dbTest.js           # Script para probar conexión a MongoDB
│
├── index.js                # Punto de entrada de la aplicación
└── README.md               # Documentación
```

## Principios SOLID aplicados

- **S** - *Single Responsibility Principle*: Cada clase tiene una única responsabilidad (por ejemplo, los repositorios sólo se encargan del acceso a datos).
- **O** - *Open/Closed Principle*: Las entidades pueden extenderse sin ser modificadas.
- **L** - *Liskov Substitution Principle*: Las clases hijas pueden sustituir a las clases padres sin afectar el funcionamiento.
- **I** - *Interface Segregation Principle*: Los servicios no están forzados a depender de métodos que no usan.
- **D** - *Dependency Inversion Principle*: Los servicios dependen de abstracciones, no de implementaciones concretas.

## Patrones de diseño usados y ubicación

- **Repository Pattern**: Separa la lógica de persistencia de la lógica de negocio. Implementado en la carpeta `repositories/`.
- **Factory Pattern**: Facilita la creación de objetos con una lógica centralizada. Puede aplicarse al instanciar entidades o servicios según configuración.
- **Command Pattern** *(opcional)*: Puede implementarse en el futuro para encapsular operaciones del CLI como comandos independientes.

## Consideraciones técnicas

- Base de datos: MongoDB sin `mongoose`, usando el driver oficial.
- Control de errores centralizado.
- Transacciones de MongoDB para operaciones críticas.
- Estructura modular orientada a escalabilidad.
- Uso de `async/await` para control de flujos asincrónicos.
- Compatible con entornos Linux, Windows y macOS.

---

## Autores

- Nicolás Espitia
- Jersson Fuentes