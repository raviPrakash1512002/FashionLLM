// backend/server.js
const express = require("express");
const cors = require("cors");
const queryHandler = require("./services/queryHandler");
const dbConnections = require("./config/db.connections");
const QueryFederation = require("./services/queryFederation");
const QueryAnalyzer = require("./services/queryAnalyzer");
const QueryDecomposer = require("./services/queryDecomposer");
const SchemaMapper = require("./services/schemaMapper");
const ResultAggregator = require("./services/resultAggregator");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ETLProcessor = require("./services/etlProcessor");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Read API key from env (do not hardcode keys in repository)
const GA_KEY = process.env.GOOGLE_API_KEY || '';
let model = null;
if (GA_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GA_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenerativeAI model:', e && e.message);
  }
}

function extractJSON(rawResponse) {
  try {
    if (typeof rawResponse !== 'string') {
      console.error('rawResponse is not a string:', rawResponse);
      return { error: 'Invalid response format from LLM' };
    }
    const first = rawResponse.indexOf('{');
    const last = rawResponse.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      const jsonText = rawResponse.substring(first, last + 1);
      return JSON.parse(jsonText);
    }
    return { error: 'No JSON object found in response' };
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return { error: 'Invalid JSON format' };
  }
}

async function initialize() {
  await dbConnections.initialize();
  const queryAnalyzer = new QueryAnalyzer();
  const queryDecomposer = new QueryDecomposer(new SchemaMapper());
  const federationService = new QueryFederation(dbConnections, queryAnalyzer, queryDecomposer);

  // Initialize ETL Processor
  const etlProcessor = new ETLProcessor(dbConnections);
  await etlProcessor.startBatchProcessing();

  // expose initialized services and utilities on app.locals for controllers/routes
  app.locals.services = { dbConnections, federationService, etlProcessor };
  app.locals.model = model;
  app.locals.extractJSON = extractJSON;

  // mount routers
  const queryRouter = require('./routes/query');
  const etlRouter = require('./routes/etl');
  const unifiedRouter = require('./routes/unified');
  const llmRouter = require('./routes/llm');

  app.use('/query', queryRouter);
  app.use('/etl', etlRouter);
  app.use('/unified', unifiedRouter);
  app.use('/llm', llmRouter);

  // basic health endpoint
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // error handler
  app.use((err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    res.status(err?.status || 500).json({ error: err?.message || 'internal_error' });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

initialize().catch((err) => {
  console.error('Failed to initialize the server:', err);
});
