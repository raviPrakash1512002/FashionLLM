# FashionHub - Advanced ETL Fashion Aggregation System

A modern, scalable fashion e-commerce aggregation platform that unifies data from multiple brands with different database schemas using dynamic ETL processing.

## 🏗️ System Architecture

### Multi-Database ETL Pipeline
- **MySQL** - Van Heusen (existing schema)
- **MongoDB** - Zara (completely different schema)  
- **PostgreSQL** - Peter England (different field names)

### Key Features
- ✅ **Dynamic Schema Detection**: Automatically detects and maps different field structures
- ✅ **Smart Field Mapping**: AI-powered field similarity matching
- ✅ **Batch Processing**: ETL updates every 5 minutes
- ✅ **Unified Search**: Search across all brands with a single query
- ✅ **Modern UI**: Professional, responsive React interface
- ✅ **Real-time Updates**: Live ETL status monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL (for Van Heusen data)
- MongoDB (for Zara data) 
- PostgreSQL (for Peter England data)

### Installation

1. **Clone and setup backend:**
```bash
cd BackEnd
npm install
node setup.js  # Initializes all databases with mock data
```

2. **Start backend server:**
```bash
npm start
# Server runs on http://localhost:5000
```

3. **Setup and start frontend:**
```bash
cd ../FrontEnd
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 📊 Database Schemas

### Van Heusen (MySQL)
```sql
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10,2),
  size VARCHAR(20),
  color VARCHAR(50),
  stock INT
);
```

### Zara (MongoDB)
```javascript
{
  product_id: String,
  item_name: String,
  product_type: String,
  cost: Number,
  dimension: String,
  shade: String,
  available_quantity: Number,
  brand_name: String
}
```

### Peter England (PostgreSQL)
```sql
CREATE TABLE clothing_inventory (
  item_id VARCHAR(50),
  product_title VARCHAR(255),
  type VARCHAR(100),
  retail_price INTEGER,
  size_info VARCHAR(20),
  color_variant VARCHAR(50),
  inventory_count INTEGER
);
```

## 🔄 ETL Process

### Dynamic Schema Mapping
The system automatically detects field mappings using similarity algorithms:

- `name/item_name/product_title` → `name`
- `price/cost/retail_price` → `price`
- `size/dimension/size_info` → `size`
- `color/shade/color_variant` → `color`
- `stock/available_quantity/inventory_count` → `stock`

### Batch Processing
- Runs every 5 minutes
- Detects schema changes automatically
- Updates unified data store
- Maintains brand-specific field mapping cache

## 🎨 Modern UI Features

### Professional Design
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and smooth animations
- Modern card-based product display
- Responsive grid layout

### Advanced Search
- Natural language processing
- Brand-specific filtering
- Price range filtering
- Multi-attribute search

### User Experience
- Loading states with spinners
- Empty state illustrations
- Real-time ETL status display
- Professional product cards

## 🔍 API Endpoints

### ETL Management
- `GET /etl/status` - Get ETL processing statistics
- `POST /etl/refresh` - Force ETL refresh

### Search & Query
- `POST /text-query` - Natural language search
- `POST /unified-search` - Advanced filtering
- `POST /query` - Legacy structured query

## 🏷️ Example Queries

### Natural Language
- "Show me blue shirts under 2000 from Zara"
- "Find black jeans size 32 from Van Heusen"
- "Peter England white shirts in size L"

### Filtered Search
```javascript
{
  filters: {
    brand: "Zara",
    category: "shirts",
    minPrice: 1000,
    maxPrice: 3000,
    size: "L",
    color: "blue"
  }
}
```

## 📈 Performance Features

- **Caching**: Schema mappings cached for performance
- **Batch Processing**: Efficient 5-minute update cycles  
- **Connection Pooling**: Optimized database connections
- **Lazy Loading**: Components load on demand

## 🛠️ Configuration

### Database Connections
Configure in `/BackEnd/config/`:
- `mysql.config.js` - Van Heusen MySQL settings
- `mongodb.config.js` - Zara MongoDB settings  
- `postgresql.config.js` - Peter England PostgreSQL settings

### ETL Settings
Modify batch interval in `etlProcessor.js`:
```javascript
this.processInterval = 5 * 60 * 1000; // 5 minutes
```

## 🔧 Development

### Backend Structure
```
BackEnd/
├── config/           # Database configurations
├── services/         # Core business logic
├── mockData/         # Sample data for testing
└── utils/            # Helper utilities
```

### Frontend Structure  
```
FrontEnd/
├── src/
│   ├── App.js        # Main React component
│   └── App.css       # Modern styling
└── public/           # Static assets
```

## 🌟 Key Innovations

1. **Dynamic Schema Detection**: Automatically adapts to new database schemas
2. **Smart Field Mapping**: Uses string similarity algorithms for field matching
3. **Multi-Database ETL**: Handles MySQL, MongoDB, and PostgreSQL simultaneously
4. **Modern UI**: Professional glassmorphism design with smooth animations
5. **Unified Search**: Single interface for searching across all brands

## 📊 Monitoring

The system provides real-time monitoring through:
- ETL processing status
- Active database connections
- Unified record counts
- Schema mapping confidence scores

## 🚀 Production Deployment

For production deployment:
1. Set up proper database credentials
2. Configure environment variables
3. Enable SSL/TLS for database connections
4. Set up monitoring and logging
5. Configure reverse proxy (nginx)

---

Built with ❤️ using Node.js, React, and modern web technologies.