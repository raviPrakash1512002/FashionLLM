const dbConnections = require('./config/db.connections');
const { insertZaraMockData } = require('./mockData/zaraData');
const { insertPeterEnglandData } = require('./mockData/peterEnglandData');

async function setupDatabases() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Initialize all database connections
    await dbConnections.initialize();
    
    console.log('✅ All databases connected and initialized');
    console.log('📊 Database Status:', dbConnections.getStatus());
    console.log('🔄 Schema Mappings Generated');
    console.log('📋 Unified Schema Created');
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend server: npm start or node server.js');
    console.log('2. Start the frontend: cd ../FrontEnd && npm start');
    console.log('3. Open http://localhost:3000 in your browser');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabases();