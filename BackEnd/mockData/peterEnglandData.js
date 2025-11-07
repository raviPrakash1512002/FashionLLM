const peterEnglandMockData = [
  {
    item_id: 'PE001',
    product_title: 'Blue Formal Shirt',
    type: 'shirts',
    retail_price: 1899,
    size_info: 'M',
    color_variant: 'blue',
    inventory_count: 35,
    brand_info: 'Peter England',
    fabric_type: 'Cotton',
    collar_type: 'Regular',
    fit_type: 'Regular'
  },
  {
    item_id: 'PE002',
    product_title: 'Black Formal Trousers',
    type: 'trousers',
    retail_price: 2299,
    size_info: '32',
    color_variant: 'black',
    inventory_count: 28,
    brand_info: 'Peter England',
    fabric_type: 'Poly Viscose',
    fit_type: 'Slim'
  },
  {
    item_id: 'PE003',
    product_title: 'White Business Shirt',
    type: 'shirts',
    retail_price: 1999,
    size_info: 'L',
    color_variant: 'white',
    inventory_count: 40,
    brand_info: 'Peter England',
    fabric_type: 'Cotton Blend',
    collar_type: 'Semi Spread',
    fit_type: 'Slim'
  },
  {
    item_id: 'PE004',
    product_title: 'Navy Blue Blazer',
    type: 'blazers',
    retail_price: 4999,
    size_info: 'L',
    color_variant: 'navy',
    inventory_count: 15,
    brand_info: 'Peter England',
    fabric_type: 'Polyester Blend',
    fit_type: 'Regular'
  },
  {
    item_id: 'PE005',
    product_title: 'Grey Casual T-Shirt',
    type: 'tshirts',
    retail_price: 899,
    size_info: 'XL',
    color_variant: 'grey',
    inventory_count: 45,
    brand_info: 'Peter England',
    fabric_type: 'Cotton Jersey',
    fit_type: 'Regular'
  },
  {
    item_id: 'PE006',
    product_title: 'Maroon Polo Shirt',
    type: 'polos',
    retail_price: 1299,
    size_info: 'M',
    color_variant: 'maroon',
    inventory_count: 25,
    brand_info: 'Peter England',
    fabric_type: 'Pique Cotton',
    collar_type: 'Polo',
    fit_type: 'Regular'
  },
  {
    item_id: 'PE007',
    product_title: 'Charcoal Formal Trousers',
    type: 'trousers',
    retail_price: 2199,
    size_info: '30',
    color_variant: 'charcoal',
    inventory_count: 22,
    brand_info: 'Peter England',
    fabric_type: 'Wool Blend',
    fit_type: 'Slim'
  },
  {
    item_id: 'PE008',
    product_title: 'Light Blue Casual Shirt',
    type: 'shirts',
    retail_price: 1799,
    size_info: 'L',
    color_variant: 'light_blue',
    inventory_count: 30,
    brand_info: 'Peter England',
    fabric_type: 'Cotton',
    collar_type: 'Button Down',
    fit_type: 'Regular'
  },
  {
    item_id: 'PE009',
    product_title: 'Black V-Neck T-Shirt',
    type: 'tshirts',
    retail_price: 799,
    size_info: 'M',
    color_variant: 'black',
    inventory_count: 50,
    brand_info: 'Peter England',
    fabric_type: 'Cotton Blend',
    fit_type: 'Slim'
  },
  {
    item_id: 'PE010',
    product_title: 'Brown Leather Belt',
    type: 'accessories',
    retail_price: 1499,
    size_info: '32',
    color_variant: 'brown',
    inventory_count: 20,
    brand_info: 'Peter England',
    fabric_type: 'Genuine Leather'
  }
];

const createPeterEnglandTable = `
  CREATE TABLE IF NOT EXISTS clothing_inventory (
    item_id VARCHAR(50) PRIMARY KEY,
    product_title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    retail_price INTEGER NOT NULL,
    size_info VARCHAR(20),
    color_variant VARCHAR(50),
    inventory_count INTEGER DEFAULT 0,
    brand_info VARCHAR(100),
    fabric_type VARCHAR(100),
    collar_type VARCHAR(50),
    fit_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

async function insertPeterEnglandData(pool) {
  try {
    await pool.query(createPeterEnglandTable);
    
    const insertQuery = `
      INSERT INTO clothing_inventory (
        item_id, product_title, type, retail_price, size_info, 
        color_variant, inventory_count, brand_info, fabric_type, 
        collar_type, fit_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (item_id) DO NOTHING
    `;
    
    for (const item of peterEnglandMockData) {
      await pool.query(insertQuery, [
        item.item_id,
        item.product_title,
        item.type,
        item.retail_price,
        item.size_info,
        item.color_variant,
        item.inventory_count,
        item.brand_info,
        item.fabric_type,
        item.collar_type || null,
        item.fit_type
      ]);
    }
    
    console.log(`${peterEnglandMockData.length} Peter England products inserted successfully`);
  } catch (error) {
    console.error('Error inserting Peter England mock data:', error);
    throw error;
  }
}

async function clearPeterEnglandData(pool) {
  try {
    await pool.query('DELETE FROM clothing_inventory');
    console.log('Peter England table cleared');
  } catch (error) {
    console.error('Error clearing Peter England data:', error);
    throw error;
  }
}

module.exports = {
  peterEnglandMockData,
  createPeterEnglandTable,
  insertPeterEnglandData,
  clearPeterEnglandData
};