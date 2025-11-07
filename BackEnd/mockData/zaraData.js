const mongoose = require('mongoose');

const zaraCollectionSchema = new mongoose.Schema({
  product_id: String,
  item_name: String,
  product_type: String,
  cost: Number,
  dimension: String,
  shade: String,
  available_quantity: Number,
  brand_name: String,
  material: String,
  season: String,
  created_at: Date,
  last_updated: Date
}, { collection: 'fashion_items' });

const ZaraProduct = mongoose.model('ZaraProduct', zaraCollectionSchema);

const zaraMockData = [
  {
    product_id: "ZR001",
    item_name: "Classic White Oxford Shirt",
    product_type: "shirts",
    cost: 2999,
    dimension: "L",
    shade: "white",
    available_quantity: 25,
    brand_name: "Zara",
    material: "Cotton",
    season: "All Season",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR002", 
    item_name: "Slim Fit Black Jeans",
    product_type: "jeans",
    cost: 3999,
    dimension: "32",
    shade: "black",
    available_quantity: 18,
    brand_name: "Zara",
    material: "Denim",
    season: "All Season",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR003",
    item_name: "Navy Blue Blazer",
    product_type: "jackets",
    cost: 7999,
    dimension: "M",
    shade: "navy",
    available_quantity: 12,
    brand_name: "Zara",
    material: "Wool Blend",
    season: "Winter",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR004",
    item_name: "Casual Grey T-Shirt",
    product_type: "tshirts",
    cost: 1499,
    dimension: "XL",
    shade: "grey",
    available_quantity: 30,
    brand_name: "Zara",
    material: "Cotton Blend",
    season: "Summer",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR005",
    item_name: "Striped Casual Shirt",
    product_type: "shirts",
    cost: 2499,
    dimension: "M",
    shade: "blue",
    available_quantity: 20,
    brand_name: "Zara",
    material: "Cotton",
    season: "Spring",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR006",
    item_name: "Dark Blue Skinny Jeans",
    product_type: "jeans",
    cost: 4299,
    dimension: "30",
    shade: "dark_blue",
    available_quantity: 15,
    brand_name: "Zara",
    material: "Stretch Denim",
    season: "All Season",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR007",
    item_name: "Red Polo T-Shirt",
    product_type: "tshirts",
    cost: 1799,
    dimension: "L",
    shade: "red",
    available_quantity: 22,
    brand_name: "Zara",
    material: "Pique Cotton",
    season: "Summer",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR008",
    item_name: "Black Leather Jacket",
    product_type: "jackets",
    cost: 12999,
    dimension: "XL",
    shade: "black",
    available_quantity: 8,
    brand_name: "Zara",
    material: "Genuine Leather",
    season: "All Season",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR009",
    item_name: "White Linen Shirt",
    product_type: "shirts",
    cost: 3299,
    dimension: "L",
    shade: "white",
    available_quantity: 16,
    brand_name: "Zara",
    material: "Linen",
    season: "Summer",
    created_at: new Date(),
    last_updated: new Date()
  },
  {
    product_id: "ZR010",
    item_name: "Green Cargo Pants",
    product_type: "pants",
    cost: 3799,
    dimension: "32",
    shade: "green",
    available_quantity: 14,
    brand_name: "Zara",
    material: "Cotton Twill",
    season: "All Season",
    created_at: new Date(),
    last_updated: new Date()
  }
];

async function insertZaraMockData() {
  try {
    // Clear existing data first to avoid conflicts
    await ZaraProduct.deleteMany({});
    
    const result = await ZaraProduct.insertMany(zaraMockData);
    console.log(`${result.length} Zara products inserted successfully`);
    return result;
  } catch (error) {
    console.error('Error inserting Zara mock data:', error);
    throw error;
  }
}

async function clearZaraData() {
  try {
    await ZaraProduct.deleteMany({});
    console.log('Zara collection cleared');
  } catch (error) {
    console.error('Error clearing Zara data:', error);
    throw error;
  }
}

module.exports = {
  ZaraProduct,
  zaraMockData,
  insertZaraMockData,
  clearZaraData
};