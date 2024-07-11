const dotenv = require('dotenv');

const ydb_api = require('./ydb_api');




dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const table_name = process.env.YDB_TABLE_NAME;


async function select_all(ydb) {
  try {
    query = `SELECT * FROM \`${table_name}\``;

    const result = await ydb.query(query);

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
    query = `SELECT MAX(id) as max FROM \`${table_name}\``;

    const result = await ydb.query(query);

    console.log(result);
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
    }

    return result[0]['max'];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function insert_test_values(ydb) {
  try {
    const max_id = await get_max_id(ydb);
    console.log(`max_id: ${max_id}`);

    query = `INSERT INTO \`${table_name}\` (id, name, score) VALUES (${max_id + 1}, 'test1', 100)`;

    await ydb.query(query);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function delete_test_values(ydb) {
  try {
    query = `DELETE FROM \`${table_name}\` WHERE name = 'test1'`;

    await ydb.query(query);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}


async function run_query() {
  const ydb = new ydb_api(ydb_endpoint, ydb_database_path);
  
  await select_all(ydb);
  await insert_test_values(ydb);
  await select_all(ydb);
  await delete_test_values(ydb);
  await select_all(ydb);

  process.exit(0);
}


run_query();
