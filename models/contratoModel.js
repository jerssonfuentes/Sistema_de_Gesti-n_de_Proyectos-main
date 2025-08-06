// ===============================
// Modelo: contratoModel.js
// ===============================

const inquirer = require('inquirer');
const getDB = require('../config/mongoClient');
const chalkTheme = require('../config/chalkTheme');

/**
 * Crea un nuevo contrato para un cliente existente.
 */
async function crearContrato() {
  const db = await getDB();
  const clientes = await db.collection('clientes').find().toArray();

  if (!clientes.length) {
    console.log(chalkTheme.exit('\nNo hay clientes disponibles. Crea uno antes de generar un contrato.\n'));
    return;
  }

  // Seleccionar cliente por nombre
  const { clienteNombre } = await inquirer.prompt([
    {
      type: 'list',
      name: 'clienteNombre',
      message: 'Selecciona el cliente para este contrato:',
      choices: clientes.map(c => c.nombre)
    }
  ]);

  // Formulario del contrato
  const contrato = await inquirer.prompt([
    { type: 'input', name: 'freelance', message: 'Nombre del freelance:' },
    { type: 'input', name: 'proyecto', message: 'Nombre del proyecto:' },
    {
      type: 'list',
      name: 'tipo',
      message: 'Tipo de contrato:',
      choices: ['Por proyecto', 'Por horas', 'Retainer']
    },
    {
      type: 'list',
      name: 'estado',
      message: 'Estado del contrato:',
      choices: ['Activo', 'Finalizado', 'Cancelado']
    },
    {
      type: 'input',
      name: 'fecha',
      message: 'Fecha de inicio del contrato (YYYY-MM-DD):'
    },
    {
      type: 'number',
      name: 'monto',
      message: 'Monto del contrato (USD):'
    }
  ]);

  // Asociar cliente por nombre
  contrato.clienteNombre = clienteNombre;

  const resultado = await db.collection('contratos').insertOne(contrato);

  console.log(chalkTheme.success(`\n✅ Contrato creado con ID: ${resultado.insertedId}\n`));
}

/**
 * Lista todos los contratos existentes.
 */
async function listarContratos() {
  const db = await getDB();
  const contratos = await db.collection('contratos').find().toArray();

  if (!contratos.length) {
    console.log(chalkTheme.info('\nNo hay contratos registrados.\n'));
    return;
  }

  console.log(chalkTheme.section('\n📄 Lista de Contratos:\n'));
  console.table(
    contratos.map(c => ({
      ID: c._id.toString(),
      Cliente: c.clienteNombre || 'N/A',
      Freelance: c.freelance || 'N/A',
      Proyecto: c.proyecto || 'N/A',
      Tipo: c.tipo || 'N/A',
      Estado: c.estado || 'N/A',
      Fecha: c.fecha || 'N/A',
      Monto: `$${c.monto || 0}`
    }))
  );
}

/**
 * Busca contratos según diferentes criterios.
 */
async function buscarContrato() {
  const db = await getDB();

  const { criterio } = await inquirer.prompt([
    {
      type: 'list',
      name: 'criterio',
      message: '¿Cómo deseas buscar el contrato?',
      choices: [
        'Por nombre del cliente',
        'Por nombre del freelance',
        'Por estado',
        'Por tipo de contrato'
      ]
    }
  ]);

  let filtro = {};

  switch (criterio) {
    case 'Por nombre del cliente': {
      const { cliente } = await inquirer.prompt({
        type: 'input',
        name: 'cliente',
        message: 'Nombre del cliente:'
      });
      filtro = { clienteNombre: { $regex: cliente, $options: 'i' } };
      break;
    }

    case 'Por nombre del freelance': {
      const { freelance } = await inquirer.prompt({
        type: 'input',
        name: 'freelance',
        message: 'Nombre del freelance:'
      });
      filtro = { freelance: { $regex: freelance, $options: 'i' } };
      break;
    }

    case 'Por estado': {
      const { estado } = await inquirer.prompt({
        type: 'list',
        name: 'estado',
        message: 'Estado del contrato:',
        choices: ['Activo', 'Finalizado', 'Cancelado']
      });
      filtro = { estado };
      break;
    }

    case 'Por tipo de contrato': {
      const { tipo } = await inquirer.prompt({
        type: 'list',
        name: 'tipo',
        message: 'Tipo de contrato:',
        choices: ['Por proyecto', 'Por horas', 'Retainer']
      });
      filtro = { tipo };
      break;
    }
  }

  const resultados = await db.collection('contratos').find(filtro).toArray();

  if (!resultados.length) {
    console.log(chalkTheme.warning('\nNo se encontraron contratos con ese criterio.\n'));
    return;
  }

  console.log(chalkTheme.section('\n🔍 Resultados encontrados:\n'));
  console.table(
    resultados.map(c => ({
      ID: c._id.toString(),
      Cliente: c.clienteNombre || 'N/A',
      Freelance: c.freelance || 'N/A',
      Proyecto: c.proyecto || 'N/A',
      Tipo: c.tipo || 'N/A',
      Estado: c.estado || 'N/A',
      Fecha: c.fecha || 'N/A',
      Monto: `$${c.monto || 0}`
    }))
  );
}

/**
 * Permite actualizar un campo específico de un contrato.
 */
async function actualizarContrato() {
  const db = await getDB();
  const contratos = db.collection('contratos');

  const { id } = await inquirer.prompt({
    type: 'input',
    name: 'id',
    message: 'ID del contrato a actualizar:'
  });

  const contrato = await contratos.findOne({ _id: new getDB.mongo.ObjectId(id) });

  if (!contrato) {
    console.log(chalkTheme.error('❌ Contrato no encontrado o ID inválido.'));
    return;
  }

  const campos = Object.keys(contrato).filter(k => k !== '_id');
  const { campo, nuevoValor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'campo',
      message: '¿Qué campo deseas actualizar?',
      choices: campos
    },
    {
      type: 'input',
      name: 'nuevoValor',
      message: 'Ingresa el nuevo valor:'
    }
  ]);

  const result = await contratos.updateOne(
    { _id: contrato._id },
    { $set: { [campo]: nuevoValor } }
  );

  console.log(chalkTheme.success(`\n✅ Contrato actualizado. Campos modificados: ${result.modifiedCount}\n`));
}

/**
 * Elimina un contrato por su ID, previa confirmación.
 */
async function eliminarContrato() {
  const db = await getDB();
  const contratos = db.collection('contratos');

  const { id } = await inquirer.prompt({
    type: 'input',
    name: 'id',
    message: 'ID del contrato a eliminar:'
  });

  const { confirmar } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmar',
    message: '¿Estás seguro de eliminar este contrato?',
    default: false
  });

  if (!confirmar) {
    console.log(chalkTheme.info('❎ Eliminación cancelada.'));
    return;
  }

  const result = await contratos.deleteOne({ _id: new getDB.mongo.ObjectId(id) });

  if (result.deletedCount === 0) {
    console.log(chalkTheme.warning('❌ Contrato no encontrado.'));
  } else {
    console.log(chalkTheme.success('✅ Contrato eliminado correctamente.'));
  }
}

module.exports = {
  crearContrato,
  listarContratos,
  buscarContrato,
  actualizarContrato,
  eliminarContrato
};