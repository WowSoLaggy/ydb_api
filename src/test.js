const dotenv = require('dotenv');
const fs = require('fs');

const ydb_api = require('./ydb_api');




dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const test_table_name = process.env.YDB_TEST_TABLE_NAME;



async function select_all(ydb) {
  try {
    query = `SELECT * FROM \`${test_table_name}\``;

    const result = await ydb.query(query);

    console.log('Select all results:');
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function get_max_id(ydb) {
  try {
    query = `SELECT MAX(id) as max FROM \`${test_table_name}\``;

    const result = await ydb.query(query);
    return result[0]['max'];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function insert_test_values(ydb) {
  try {
    const max_id = await get_max_id(ydb);

    query = `INSERT INTO \`${test_table_name}\` (id, name) VALUES (${max_id + 1}, 'test1')`;

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
  if (!test_table_name) {
    throw new Error('YDB_TEST_TABLE_NAME is not set');
  }

  console.log(`YDB_ENDPOINT: ${ydb_endpoint}`);
  console.log(`YDB_DATABASE_PATH: ${ydb_database_path}`);
  console.log(`YDB_TEST_TABLE_NAME: ${test_table_name}`);

  // read 'ydb_credentials' from file './../authorized_key.json' - read this file as a json string
  let ydb_credentials;
  try {
    const credentialsRaw = fs.readFileSync('./authorized_key.json', 'utf8');
    ydb_credentials = JSON.stringify(JSON.parse(credentialsRaw));
  } catch (err) {
    console.error('Error reading ydb_credentials:', err);
    ydb_credentials = null;
  }

  if (!ydb_credentials) {
    throw new Error('YDB_CREDENTIALS is not set');
  }
  console.log(`YDB_CREDENTIALS: ${ydb_credentials}`);
  process.env.YDB_CREDENTIALS = ydb_credentials;

  const ydb = await new ydb_api(ydb_endpoint, ydb_database_path).init();
  
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await delete_test_values(ydb);
  await select_all(ydb);

  process.exit(0);
}


run_query();
