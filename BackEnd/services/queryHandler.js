const { createMySQLConnection, vanHeusenConfig } = require('../config/mysql.config');
const { createMongoConnection } = require('../config/mongodb.config');
const { createPostgreSQLConnection, peterEnglandConfig } = require('../config/postgresql.config');
const DatabaseConnections = require("../config/db.connections");

const remapFields = (query, mapping) => {
  const remappedQuery = {};
  for (const [key, value] of Object.entries(query)) {
    const mappedKey = mapping[key] || key;
    remappedQuery[mappedKey] = value;
  }
  return remappedQuery;
};

const fetchDataFromGeneratedQueries = async ({ sqlquery, mongodb, postgresql }) => {
  const results = {
    mysql: null,
    mongodb: null,
    postgresql: null,
  };

  const dbStatus = DatabaseConnections.getStatus();
  const mappings = DatabaseConnections.getunifiedMappings().unifiedMappings;

  // Handle MySQL Query (Van Heusen)
  if (sqlquery && dbStatus.van_heusen) {
    try {
      const mysqlConnection = await createMySQLConnection(vanHeusenConfig);

      const remappedSqlQuery = sqlquery.replace(
        /\b(category|color|size|price|stock|description|name)\b/g,
        (match) => mappings.van_heusen[match] || match
      );

      console.log('Executing MySQL Query (Van Heusen):', remappedSqlQuery);
      const [rows] = await mysqlConnection.execute(remappedSqlQuery);
      const vanHeusenResponse = rows.map((row) => ({ ...row, Brand: "Van Heusen" }));
      results.mysql = vanHeusenResponse;
      await mysqlConnection.end();
    } catch (error) {
      console.error('Error executing MySQL query:', error);
      results.mysql = null;
    }
  } else if (!dbStatus.van_heusen) {
    console.warn('MySQL database (Van Heusen) is unavailable.');
  }

  // Handle MongoDB Query (Zara)
  if (mongodb && dbStatus.zara) {
    try {
      const mongoConnection = await createMongoConnection();

      const remappedMongoQuery = remapFields(mongodb, mappings.zara || {});

      console.log('Executing MongoDB Query (Zara):', remappedMongoQuery);
      const mongoResults = await mongoConnection.db
        .collection('fashion_items')
        .find(remappedMongoQuery)
        .toArray();
      const zaraResponse = mongoResults.map((item) => ({ ...item, Brand: "Zara" }));
      results.mongodb = zaraResponse;
    } catch (error) {
      console.error('Error executing MongoDB query:', error);
      results.mongodb = null;
    }
  } else if (!dbStatus.zara) {
    console.warn('MongoDB database (Zara) is unavailable.');
  }

  // Handle PostgreSQL Query (Peter England)
  if (postgresql && dbStatus.peter_england) {
    try {
      const pgConnection = await createPostgreSQLConnection(peterEnglandConfig);

      const remappedPgQuery = postgresql.replace(
        /\b(type|color_variant|size_info|retail_price|inventory_count|product_title|item_id)\b/g,
        (match) => mappings.peter_england[match] || match
      );

      console.log('Executing PostgreSQL Query (Peter England):', remappedPgQuery);
      const pgResult = await pgConnection.query(remappedPgQuery);
      const peterEnglandResponse = pgResult.rows.map((row) => ({ ...row, Brand: "Peter England" }));
      results.postgresql = peterEnglandResponse;
      await pgConnection.end();
    } catch (error) {
      console.error('Error executing PostgreSQL query:', error);
      results.postgresql = null;
    }
  } else if (!dbStatus.peter_england) {
    console.warn('PostgreSQL database (Peter England) is unavailable.');
  }

  return results;
};

module.exports = {
  fetchDataFromGeneratedQueries,
};