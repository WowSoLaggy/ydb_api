const dotenv = require('dotenv');

const ydb_api = require('./ydb_api');



dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const ydb_private_key = process.env.YDB_PRIVATE_KEY;
const ydb_id = process.env.YDB_ID;
const ydb_service_account_id = process.env.YDB_SERVICE_ACCOUNT_ID;

const test_table_name = 'test_table';



async function select_all(ydb) {
  try {
    query = `SELECT * FROM \`${test_table_name}\``;

    const result = await ydb.query(query);
    console.log('Select all results:');
    result.forEach(row => console.log(row));
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function insert_test_values(ydb) {
  try {
    query = `INSERT INTO \`${test_table_name}\` (name) VALUES ('test1')`;

    await ydb.query(query);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function delete_test_values(ydb) {
  try {
    query = `DELETE FROM \`${test_table_name}\` WHERE name = 'test1'`;

    await ydb.query(query);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}


async function run_query() {
  if (!ydb_endpoint) {
    throw new Error('YDB_ENDPOINT is not set');
  }
  if (!ydb_database_path) {
    throw new Error('YDB_DATABASE_PATH is not set');
  }
  if (!ydb_private_key) {
    throw new Error('YDB_PRIVATE_KEY is not set');
  }
  if (!ydb_id) {
    throw new Error('YDB_ID is not set');
  }
  if (!ydb_service_account_id) {
    throw new Error('YDB_SERVICE_ACCOUNT_ID is not set');
  }

  console.log(`YDB_ENDPOINT: ${ydb_endpoint}`);
  console.log(`YDB_DATABASE_PATH: ${ydb_database_path}`);
  console.log(`YDB_PRIVATE_KEY: ${ydb_private_key}`);
  console.log(`YDB_ID: ${ydb_id}`);
  console.log(`YDB_SERVICE_ACCOUNT_ID: ${ydb_service_account_id}`);

  const ydb = await new ydb_api().init();
  
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await delete_test_values(ydb);
  await select_all(ydb);

  await ydb.destroy();
}


run_query();
