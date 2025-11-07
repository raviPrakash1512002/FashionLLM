const stringSimilarity = require('../utils/stringSimilarity');

class DynamicSchemaDetector {
  constructor() {
    this.standardFields = {
      id: ['id', 'product_id', 'item_id', '_id'],
      name: ['name', 'product_name', 'item_name', 'product_title', 'title'],
      category: ['category', 'type', 'product_type', 'item_type'],
      price: ['price', 'cost', 'retail_price', 'amount'],
      size: ['size', 'dimension', 'size_info'],
      color: ['color', 'colour', 'shade', 'color_variant'],
      stock: ['stock', 'quantity', 'available_quantity', 'inventory_count'],
      brand: ['brand', 'brand_name', 'brand_info']
    };

    this.fieldTypes = {
      id: 'string',
      name: 'string',
      category: 'string',
      price: 'number',
      size: 'string',
      color: 'string',
      stock: 'number',
      brand: 'string'
    };
  }

  async detectSchemaMapping(fields, brandName) {
    const mapping = {};
    const confidence = {};

    for (const standardField of Object.keys(this.standardFields)) {
      const bestMatch = this.findBestFieldMatch(standardField, fields);
      if (bestMatch.field) {
        mapping[bestMatch.field] = standardField;
        confidence[standardField] = bestMatch.confidence;
      }
    }

    const schemaInfo = {
      brand: brandName,
      mappings: mapping,
      confidence: confidence,
      fields: fields,
      detectedAt: new Date().toISOString(),
      totalFields: fields.length,
      mappedFields: Object.keys(mapping).length
    };

    console.log(`Schema detected for ${brandName}:`, schemaInfo);
    return schemaInfo;
  }

  findBestFieldMatch(standardField, availableFields) {
    let bestMatch = { field: null, confidence: 0 };
    const possibleMatches = this.standardFields[standardField];

    for (const field of availableFields) {
      const fieldLower = field.toLowerCase();
      
      for (const possibleMatch of possibleMatches) {
        const similarity = stringSimilarity.calculateSimilarity(fieldLower, possibleMatch);
        
        if (similarity > bestMatch.confidence && similarity > 0.7) {
          bestMatch = {
            field: field,
            confidence: similarity,
            standardField: standardField
          };
        }
      }
    }

    return bestMatch;
  }

  async analyzeDataStructure(sampleData, brandName) {
    if (!sampleData || sampleData.length === 0) {
      return null;
    }

    const sample = sampleData[0];
    const fields = Object.keys(sample);
    const fieldAnalysis = {};

    for (const field of fields) {
      fieldAnalysis[field] = {
        type: this.inferFieldType(sample[field]),
        sampleValue: sample[field],
        nullable: this.checkNullability(sampleData, field)
      };
    }

    const schemaMapping = await this.detectSchemaMapping(fields, brandName);
    
    return {
      ...schemaMapping,
      fieldAnalysis: fieldAnalysis,
      sampleSize: sampleData.length
    };
  }

  inferFieldType(value) {
    if (value === null || value === undefined) return 'nullable';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    if (typeof value === 'string') {
      if (/^\d+$/.test(value)) return 'string_numeric';
      if (/^\d+\.\d+$/.test(value)) return 'string_decimal';
      return 'string';
    }
    if (typeof value === 'object') return 'object';
    return 'unknown';
  }

  checkNullability(data, field) {
    const nullCount = data.filter(item => 
      item[field] === null || item[field] === undefined || item[field] === ''
    ).length;
    return nullCount / data.length;
  }

  async detectSchemaChanges(oldSchema, newFields, brandName) {
    const changes = {
      added: [],
      removed: [],
      modified: [],
      confidence_changed: []
    };

    const oldFields = oldSchema.fields || [];
    const oldMappings = oldSchema.mappings || {};

    const addedFields = newFields.filter(field => !oldFields.includes(field));
    const removedFields = oldFields.filter(field => !newFields.includes(field));

    changes.added = addedFields;
    changes.removed = removedFields;

    const newMapping = await this.detectSchemaMapping(newFields, brandName);
    
    for (const [field, standardField] of Object.entries(newMapping.mappings)) {
      if (oldMappings[field] && oldMappings[field] !== standardField) {
        changes.modified.push({
          field: field,
          oldMapping: oldMappings[field],
          newMapping: standardField
        });
      }
    }

    return {
      hasChanges: changes.added.length > 0 || changes.removed.length > 0 || changes.modified.length > 0,
      changes: changes,
      newSchema: newMapping
    };
  }

  transformDataToUnified(data, schemaMapping) {
    if (!data || !schemaMapping || !schemaMapping.mappings) {
      return data;
    }

    return data.map(item => {
      const transformedItem = { brand: schemaMapping.brand };
      
      for (const [originalField, standardField] of Object.entries(schemaMapping.mappings)) {
        if (item.hasOwnProperty(originalField)) {
          transformedItem[standardField] = this.convertFieldValue(
            item[originalField], 
            this.fieldTypes[standardField]
          );
        }
      }

      for (const [key, value] of Object.entries(item)) {
        if (!schemaMapping.mappings[key]) {
          transformedItem[`original_${key}`] = value;
        }
      }

      return transformedItem;
    });
  }

  convertFieldValue(value, targetType) {
    if (value === null || value === undefined) return value;

    switch (targetType) {
      case 'number':
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      case 'string':
        return String(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }

  generateUnifiedSchema(allSchemaMappings) {
    const unifiedSchema = {
      id: { sources: [], required: true },
      name: { sources: [], required: true },
      category: { sources: [], required: true },
      price: { sources: [], required: true },
      size: { sources: [], required: false },
      color: { sources: [], required: false },
      stock: { sources: [], required: false },
      brand: { sources: [], required: true }
    };

    for (const schemaMapping of allSchemaMappings) {
      for (const [originalField, standardField] of Object.entries(schemaMapping.mappings)) {
        if (unifiedSchema[standardField]) {
          unifiedSchema[standardField].sources.push({
            brand: schemaMapping.brand,
            originalField: originalField,
            confidence: schemaMapping.confidence[standardField] || 0
          });
        }
      }
    }

    return unifiedSchema;
  }
}

module.exports = DynamicSchemaDetector;