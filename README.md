# ydb-api

This project provides a class for interacting with Yandex Database (YDB) using the YDB SDK for Node.js. It supports initialization, querying, and proper handling of credentials for secure access. All the code (including this readme file) is generated using AI tools.

## Features

- Initialization of YDB driver with proper credentials.
- Execution of queries on YDB and handling of results.
- Secure management of Service Account credentials using environment variables.

## Installation

To use this project, clone the repository and install the required dependencies:

```bash
git clone <repository_url>
cd ydb-api
npm install
```

## Environment Variables

Ensure that the following environment variables are set:

- `YDB_ENDPOINT`: The endpoint of your YDB instance.
- `YDB_DATABASE`: The path to your YDB database.
- `YDB_SERVICE_ACCOUNT_ID`: The Service Account ID for authentication.
- `YDB_ACCESS_KEY_ID`: The Access Key ID for authentication.
- `YDB_PRIVATE_KEY`: The private key for the Service Account (use multiline string).

Example of the .env file:
```
YDB_ENDPOINT="grpcs://ydb.serverless.yandexcloud.net:2135"
YDB_DATABASE_PATH="/ru-central1/****************/*****************"
YDB_PRIVATE_KEY="PLEASE DO NOT REMOVE THIS LINE! Yandex.Cloud SA Key ID .... \n-----END PRIVATE KEY-----\n"
YDB_ID="******************"
YDB_SERVICE_ACCOUNT_ID="******************"
```

## Usage

Here's an example of how to use the `ydb_api` class in your project:

```javascript
const ydb_api = require('./path_to_ydb_api_file');

(async () => {
  const ydb = await new ydb_api().init();

  try {
    const query = 'YOUR YQL QUERY HERE';
    const result = await ydb.query(query);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await ydb.destroy();
  }
})();
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Issues and feature requests are also welcome.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or support, please open an issue in the repository or contact me: WowSoLaggy wowsolaggy@gmail.com

---

Make sure to replace placeholders like `<repository_url>`, `<your_ydb_endpoint>`, `<your_ydb_database_path>`, `<your_service_account_id>`, `<your_access_key_id>`, and `<your_private_key>` with actual values relevant to your setup.