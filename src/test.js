const dotenv = require('dotenv');

const ydb_api = require('./ydb_api');



dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;

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
  console.log('Starting YDB test...');

  if (!ydb_endpoint) {
    throw new Error('YDB_ENDPOINT is not set');
  }
  if (!ydb_database_path) {
    throw new Error('YDB_DATABASE_PATH is not set');
  }

  console.log(`YDB_ENDPOINT: ${ydb_endpoint}`);
  console.log(`YDB_DATABASE_PATH: ${ydb_database_path}`);

  const ydb = await new ydb_api().init();
  
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await delete_test_values(ydb);
  await select_all(ydb);

  await ydb.destroy();

  console.log('YDB test completed');
}


run_query();
