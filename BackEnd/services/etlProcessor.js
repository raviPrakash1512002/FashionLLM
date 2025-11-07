const DynamicSchemaDetector = require('./dynamicSchemaDetector');

class ETLProcessor {
  constructor(dbConnections) {
    this.dbConnections = dbConnections;
    this.schemaDetector = new DynamicSchemaDetector();
    this.lastProcessedTime = new Date();
    this.processInterval = 5 * 60 * 1000; // 5 minutes
    this.cachedSchemas = {};
    this.unifiedData = [];
  }

  async startBatchProcessing() {
    console.log('Starting ETL batch processing every 5 minutes...');
    
    await this.processBatch();
    
    setInterval(async () => {
      try {
        await this.processBatch();
      } catch (error) {
        console.error('Error in batch processing:', error);
      }
    }, this.processInterval);
  }

  async processBatch() {
    console.log(`\\n=== ETL Batch Process Started at ${new Date().toISOString()} ===`);
    
    const startTime = Date.now();
    const brands = ['van_heusen', 'zara', 'peter_england'];
    const batchResults = [];

    for (const brand of brands) {
      try {
        const result = await this.processBrandData(brand);
        if (result) {
          batchResults.push(result);
        }
      } catch (error) {
        console.error(`Error processing ${brand}:`, error);
      }
    }

    await this.combineAndStoreUnifiedData(batchResults);
    
    const processingTime = Date.now() - startTime;
    console.log(`=== ETL Batch Process Completed in ${processingTime}ms ===\\n`);
    
    this.lastProcessedTime = new Date();
    return batchResults;
  }

  async processBrandData(brand) {
    console.log(`Processing ${brand} data...`);
    
    if (!this.dbConnections.status[brand]) {
      console.log(`${brand} database not available, skipping...`);
      return null;
    }

    const connection = this.dbConnections.getConnection(brand);
    if (!connection) {
      console.log(`No connection available for ${brand}`);
      return null;
    }

    let rawData = [];
    let fields = [];

    try {
      switch (brand) {
        case 'van_heusen':
          const mysqlResult = await connection.query('SELECT * FROM products LIMIT 100');
          rawData = mysqlResult[0];
          fields = Object.keys(rawData[0] || {});
          break;

        case 'zara':
          const mongoData = await connection.db.collection('fashion_items').find({}).limit(100).toArray();
          rawData = mongoData;
          fields = Object.keys(rawData[0] || {});
          break;

        case 'peter_england':
          const pgResult = await connection.query('SELECT * FROM clothing_inventory LIMIT 100');
          rawData = pgResult.rows;
          fields = Object.keys(rawData[0] || {});
          break;
      }

      if (rawData.length === 0) {
        console.log(`No data found for ${brand}`);
        return null;
      }

      const hasSchemaChanged = await this.detectSchemaChanges(brand, fields);
      let schemaMapping;

      if (hasSchemaChanged || !this.cachedSchemas[brand]) {
        console.log(`Schema changes detected for ${brand}, updating mapping...`);
        schemaMapping = await this.schemaDetector.analyzeDataStructure(rawData, brand);
        this.cachedSchemas[brand] = schemaMapping;
      } else {
        schemaMapping = this.cachedSchemas[brand];
      }

      const transformedData = this.schemaDetector.transformDataToUnified(rawData, schemaMapping);
      
      console.log(`Processed ${transformedData.length} records for ${brand}`);
      
      return {
        brand: brand,
        originalCount: rawData.length,
        transformedCount: transformedData.length,
        data: transformedData,
        schema: schemaMapping,
        processedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error processing ${brand} data:`, error);
      return null;
    }
  }

  async detectSchemaChanges(brand, currentFields) {
    if (!this.cachedSchemas[brand]) {
      return true; // First time processing
    }

    const cachedFields = this.cachedSchemas[brand].fields || [];
    
    const addedFields = currentFields.filter(field => !cachedFields.includes(field));
    const removedFields = cachedFields.filter(field => !currentFields.includes(field));
    
    return addedFields.length > 0 || removedFields.length > 0;
  }

  async combineAndStoreUnifiedData(batchResults) {
    const unifiedBatch = [];
    
    for (const result of batchResults) {
      if (result && result.data) {
        unifiedBatch.push(...result.data);
      }
    }

    this.unifiedData = unifiedBatch;
    
    console.log(`Unified data contains ${unifiedBatch.length} total records`);
    console.log(`Brands processed: ${batchResults.map(r => r?.brand).filter(Boolean).join(', ')}`);
    
    return unifiedBatch;
  }

  getUnifiedData() {
    return this.unifiedData;
  }

  getLastProcessedTime() {
    return this.lastProcessedTime;
  }

  getCachedSchemas() {
    return this.cachedSchemas;
  }

  async queryUnifiedData(filters = {}) {
    let results = [...this.unifiedData];

    if (filters.brand) {
      results = results.filter(item => 
        item.brand && item.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.category) {
      results = results.filter(item => 
        item.category && item.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice) {
      results = results.filter(item => 
        item.price && item.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      results = results.filter(item => 
        item.price && item.price <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.size) {
      results = results.filter(item => 
        item.size && item.size.toLowerCase() === filters.size.toLowerCase()
      );
    }

    if (filters.color) {
      results = results.filter(item => 
        item.color && item.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    return results;
  }

  async forceRefresh() {
    console.log('Forcing ETL refresh...');
    this.cachedSchemas = {};
    return await this.processBatch();
  }

  getProcessingStats() {
    return {
      lastProcessedTime: this.lastProcessedTime,
      totalUnifiedRecords: this.unifiedData.length,
      cachedSchemas: Object.keys(this.cachedSchemas),
      processInterval: this.processInterval / 1000 / 60, // in minutes
      brandStatus: this.dbConnections.getStatus()
    };
  }
}

module.exports = ETLProcessor;