const { Driver, TypedData, IamAuthService, getSACredentialsFromJson } = require('ydb-sdk');


class ydb_api {
  constructor() {
    if (!process.env.YDB_ENDPOINT) {
      throw new Error('YDB_ENDPOINT is not set');
    }
    if (!process.env.YDB_DATABASE_PATH) {
      throw new Error('YDB_DATABASE_PATH is not set');
    }
    if (!process.env.ACCESS_KEY_PATH) {
      throw new Error('ACCESS_KEY_PATH is not set');
    }

    const saCredentials = getSACredentialsFromJson(process.env.ACCESS_KEY_PATH);
    const authService = new IamAuthService(saCredentials);

    this.driver = new Driver({
      endpoint: process.env.YDB_ENDPOINT,
      database: process.env.YDB_DATABASE_PATH,
      authService: authService});
  }

  async init() {
    try {
      console.log('Driver initializing...');
      await this.driver.ready(3000);
      console.log('Driver initialized successfully');
    }
    catch (error) {
      console.error('Driver initialization error: ', error);
      throw error;
    }
    return this;
  }

  async query(query) {
    let query_result;
    try {
      await this.driver.tableClient.withSession(async (session) => {
        query_result = await session.executeQuery(query);
      });
    }
    catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }

    if (query_result && query_result.resultSets && query_result.resultSets.length > 0) {
      const rows = TypedData.createNativeObjects(query_result.resultSets[0]);
      const text_decoder = new TextDecoder();

      // Convert TypedData rows to plain objects and decode Uint8Array values to strings.
      // Note: YDB returns strings as Uint8Array
      const result = rows.map(row => {
        const decoded = {};
        for (const [key, value] of Object.entries(row)) {
          decoded[key] = value instanceof Uint8Array
            ? text_decoder.decode(value)
            : value;
        }
        return decoded;
      });

      return result;
    }
  }

  async destroy() {
    await this.driver.destroy();
  }
}


module.exports = ydb_api;
