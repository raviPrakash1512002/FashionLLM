const {
  createMySQLConnection,
  vanHeusenConfig,
} = require("../config/mysql.config");
const {
  createMongoConnection,
  zaraConfig,
} = require("../config/mongodb.config");
const {
  createPostgreSQLConnection,
  peterEnglandConfig,
} = require("../config/postgresql.config");
const SchemaMapper = require("../services/schemaMapper");
const { insertZaraMockData } = require("../mockData/zaraData");
const { insertPeterEnglandData } = require("../mockData/peterEnglandData");
class DatabaseConnections {
  constructor() {
    this.connections = {};
    this.metadata = {
      [vanHeusenConfig.database]: {},
      [zaraConfig.database]: {},
      [peterEnglandConfig.database]: {},
    };
    this.schemaMapper = new SchemaMapper();
    this.mappings = {};
    this.unifiedMappings = {};
    this.unifiedSchema = {};
    this.status = {
      van_heusen: false,
      zara: false,
      peter_england: false,
    };
  }

  async initialize() {
    try
    {
      await this.initializeVanHeusen();
      await this.initializeZara();
      await this.initializePeterEngland();
      await this.generateSchemaMappings();

      console.log("All database connections established");
      console.log("Schema mappings generated:", this.mappings);

      this.unifiedMappings = this.generateUnifiedMapping();
      this.unifiedSchema = this.generateUnifiedSchema();
    } catch (error)
    {
      console.error("Failed to initialize database connections:", error);
      throw error;
    }
  }

  async initializeVanHeusen() {
    try
    {
      const connection = await createMySQLConnection(vanHeusenConfig);
      this.connections.van_heusen = connection;
      this.status.van_heusen = true;
      const [tables] = await connection.query("SHOW TABLES");
      const dbName = vanHeusenConfig.database;
      this.metadata[dbName].tables = tables.map((row) => Object.values(row)[0]);
      this.metadata[dbName].schema = {};

      for (const table of this.metadata[dbName].tables)
      {
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        this.metadata[dbName].schema[table] = columns.map((col) => col.Field);
      }
    } catch (error)
    {
      console.error("Van Heusen MySQL connection failed:", error);
      this.status.van_heusen = false;
      this.metadata[vanHeusenConfig.database] = { schema: {} };
    }
  }

  async initializeZara() {
    try
    {
      const connection = await createMongoConnection();
      this.connections.zara = connection;
      this.status.zara = true;
      const dbName = zaraConfig.database;
      
      await insertZaraMockData();
      
      const collections = await connection.db.listCollections().toArray();
      this.metadata[dbName].collections = collections.map((col) => col.name);
      this.metadata[dbName].schema = {};

      for (const collectionName of this.metadata[dbName].collections)
      {
        const sampleDoc = await connection.db
          .collection(collectionName)
          .findOne();
        this.metadata[dbName].schema[collectionName] = sampleDoc
          ? Object.keys(sampleDoc).map((field) => field)
          : [];
      }
    } catch (error)
    {
      console.error("Zara MongoDB connection failed:", error);
      this.status.zara = false;
      this.metadata[zaraConfig.database] = { schema: {} };
    }
  }

  async initializePeterEngland() {
    try
    {
      const connection = await createPostgreSQLConnection();
      this.connections.peter_england = connection;
      this.status.peter_england = true;
      
      await insertPeterEnglandData(connection);
      
      const dbName = peterEnglandConfig.database;
      const result = await connection.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      this.metadata[dbName].tables = result.rows.map((row) => row.table_name);
      this.metadata[dbName].schema = {};

      for (const table of this.metadata[dbName].tables)
      {
        const columns = await connection.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
          [table]
        );
        this.metadata[dbName].schema[table] = columns.rows.map((col) => col.column_name);
      }
    } catch (error)
    {
      console.error("Peter England PostgreSQL connection failed:", error);
      this.status.peter_england = false;
      this.metadata[peterEnglandConfig.database] = { schema: {} };
    }
  }

  async generateSchemaMappings() {
    const vanHeusenFields =
      this.metadata[vanHeusenConfig.database].schema.products || [];
    const zaraFields =
      this.metadata[zaraConfig.database].schema.fashion_items || [];
    const peterEnglandFields =
      this.metadata[peterEnglandConfig.database].schema.clothing_inventory || [];
    
    if (vanHeusenFields.length > 0)
    {
      try
      {
        this.mappings.van_heusen = await this.schemaMapper.mapSchema(
          vanHeusenFields,
          "van_heusen"
        );
      } catch (error)
      {
        console.error("Error mapping schema for Van Heusen:", error);
        this.mappings.van_heusen = {};
      }
    }

    if (zaraFields.length > 0)
    {
      try
      {
        this.mappings.zara = await this.schemaMapper.mapSchema(
          zaraFields,
          "zara"
        );
      } catch (error)
      {
        console.error("Error mapping schema for Zara:", error);
        this.mappings.zara = {};
      }
    }

    if (peterEnglandFields.length > 0)
    {
      try
      {
        this.mappings.peter_england = await this.schemaMapper.mapSchema(
          peterEnglandFields,
          "peter_england"
        );
      } catch (error)
      {
        console.error("Error mapping schema for Peter England:", error);
        this.mappings.peter_england = {};
      }
    }

}

generateUnifiedMapping() {
  const unifiedMapping = {};

  for (const [key, schema] of Object.entries(this.mappings))
  {
    unifiedMapping[key] = {};

    for (const [originalKey, unifiedKey] of Object.entries(schema.mappings))
    {
      unifiedMapping[key][unifiedKey] = originalKey;
    }
  }

  return unifiedMapping;
}

generateUnifiedSchema() {
  const unifiedSchema = {
    id:[],
    name: [],
    category: [],
    price: [],
    size: [],
    color: [],
    stock: [],
  };

  for (const schema of Object.values(this.unifiedMappings))
  {
    for (const [key, value] of Object.entries(schema))
    {
      if (key in unifiedSchema)
      {
        unifiedSchema[key].push(value);
      }
    }
  }

  return unifiedSchema;
}

  async transformData(data, sourceType) {
  return this.schemaMapper.transformData(
    data,
    this.mappings[sourceType].mappings
  );
}

getConnection(brand) {
  console.log("getconnection", brand);
  const normalizedBrand = brand.toLowerCase().replace(/[\s_-]/g, '_');
  
  const brandMap = {
    'van_heusen': 'van_heusen',
    'vanheusen': 'van_heusen',
    'zara': 'zara',
    'peter_england': 'peter_england',
    'peterengland': 'peter_england'
  };
  
  return this.connections[brandMap[normalizedBrand]] || this.connections[brand];
}

getMetadata() {
  return {
    metadata: this.metadata,
    mappings: this.mappings,
  };
}
getunifiedMappings() {
  return {
    unifiedMappings: this.unifiedMappings,
  };
}
getunifiedSchema() {
  return {
    unifiedSchema: this.unifiedSchema,
  };
}
getStatus() {
  return this.status;
}
  async closeAll() {
  try
  {
    for (const [key, connection] of Object.entries(this.connections))
    {
      if (key === "van_heusen")
      {
        await connection.end();
      } else if (key === "zara")
      {
        await connection.close();
      } else if (key === "peter_england")
      {
        await connection.end();
      }
    }
    console.log("All database connections closed");
  } catch (error)
  {
    console.error("Error closing database connections:", error);
  }
}
}

module.exports = new DatabaseConnections();
