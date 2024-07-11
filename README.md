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

- `YDB_CREDENTIALS`: JSON string containing the Service Account credentials.
- `IAM_ENDPOINT` (optional): The IAM endpoint for Yandex Cloud (default: `iam.api.cloud.yandex.net:443`).

The `YDB_CREDENTIALS` should be in the following JSON format:

```json
{
  "service_account_id": "<your_service_account_id>",
  "id": "<your_access_key_id>",
  "private_key": "<your_private_key>"
}
```

## Usage

Here's an example of how to use the `ydb_api` class in your project:

```javascript
const YdbApi = require('./path_to_ydb_api_file');

const ydbEndpoint = 'your_ydb_endpoint';
const ydbDatabasePath = 'your_ydb_database_path';

(async () => {
  const ydb = new YdbApi(ydbEndpoint, ydbDatabasePath);

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

## API

### Constructor

#### `new ydb_api(ydb_endpoint, ydb_database_path)`

- `ydb_endpoint`: The endpoint of your YDB.
- `ydb_database_path`: The path to your YDB database.

### Methods

#### `async init()`

Initializes the YDB driver. This method is called automatically during instantiation.

#### `async query(query)`

Executes the provided YQL query and returns the results.

- `query`: The YQL query to be executed.

#### `async destroy()`

Destroys the YDB driver instance, ensuring all resources are properly released.

## Logging

This project uses the built-in logging capabilities of the YDB SDK. Logs are generated for driver initialization, query execution, and errors.

## Error Handling

Errors during driver initialization and query execution are logged and re-thrown for proper handling by the calling code.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Issues and feature requests are also welcome.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or support, please open an issue in the repository or contact me: WowSoLaggy wowsolaggy@gmail.com

---

Make sure to replace placeholders like `<repository_url>`, `<your_ydb_endpoint>`, `<your_ydb_database_path>`, `<your_service_account_id>`, `<your_access_key_id>`, and `<your_private_key>` with actual values relevant to your setup.