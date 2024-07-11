const { Driver, TypedData, getLogger, IamAuthService } = require('ydb-sdk');


function getSACredentialsFromJson(json_string) {
  const payload = JSON.parse(json_string);
  return {
      iamEndpoint: process.env.IAM_ENDPOINT || 'iam.api.cloud.yandex.net:443',
      serviceAccountId: payload.service_account_id,
      accessKeyId: payload.id,
      privateKey: payload.private_key
  };
}


class ydb_api {
  constructor(ydb_endpoint, ydb_database_path) {
    this.ydb_endpoint = ydb_endpoint;
    this.ydb_database_path = ydb_database_path;

    this.logger = getLogger();

    const credentials_json_string = process.env.YDB_CREDENTIALS;
    if (!credentials_json_string) {
      throw new Error('YDB_CREDENTIALS environment variable is not set');

    }
    const credentials = getSACredentialsFromJson(credentials_json_string);
    this.authService = new IamAuthService(credentials);

    this.driver = new Driver({
      endpoint: this.ydb_endpoint,
      database: this.ydb_database_path,
      authService: this.authService});

    this.init();
  }

  async init() {
    try {
      this.logger.debug('Driver initializing...');
      await this.driver.ready(10000);
      this.logger.debug('Driver initialized successfully');
    } catch (error) {
      this.logger.error('Driver initialization error: ', error);
      throw error;
    }
  }

  async query(query) {
    let result = [];
    const text_decoder = new TextDecoder();

    try {
      await this.driver.tableClient.withSession(async (session) => {
        const query_result = await session.executeQuery(query);
        if (query_result.resultSets && query_result.resultSets.length > 0) {
          const rows = TypedData.createNativeObjects(query_result.resultSets[0]);
          result = rows.map(row => {
            const obj = {};
            for (const [key, value] of Object.entries(row)) {
              if (value instanceof Uint8Array) {
                obj[key] = text_decoder.decode(value);
              } else {
                obj[key] = value;
              }
            }
            return obj;
          });
        }
      });
    } catch (error) {
      this.logger.error('Error executing query:', error);
      throw error;
    }
    return result;
  }

  async destroy() {
    await this.driver.destroy();
  }
}


module.exports = ydb_api;
