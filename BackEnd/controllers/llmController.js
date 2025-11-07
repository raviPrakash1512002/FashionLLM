const ResultAggregator = require('../services/resultAggregator');
const queryHandler = require('../services/queryHandler');
const { buildTextQueryPrompt, buildRecommendationPrompt } = require('../llm/prompts');

exports.textQuery = async (req, res, next) => {
  try {
    const model = req.app.locals.model;
    const extractJSON = req.app.locals.extractJSON;

    if (!model) return res.status(500).json({ error: 'llm_not_initialized' });

    const userQuery = req.body.query;
    if (!userQuery) return res.status(400).json({ error: 'query is required' });

    // Build prompt from centralized template
    const adjustedPrompt = buildTextQueryPrompt(userQuery);
    const result = await model.generateContent(adjustedPrompt);
    const parsedResponse = extractJSON(result.response.text());
    const sqlquery = parsedResponse.mysql || null;
    const mongodb = parsedResponse.mongodb || null;

    const dbResults = await queryHandler.fetchDataFromGeneratedQueries({ sqlquery, mongodb });

    // Check if no results were retrieved from both databases
    if (!dbResults.mysql && !dbResults.mongodb) {
      return res.status(404).json({ error: 'No results found' });
    }

    // Combine results from both databases (if available)
    const combinedResults = [ ...(dbResults.mysql || []), ...(dbResults.mongodb || []) ];

    // Aggregate results
    const aggregator = new ResultAggregator();
    const aggregatedResults = aggregator.aggregateResults(combinedResults);

    // Recommendations using centralized prompt
    const recommendationsPrompt = buildRecommendationPrompt(userQuery);
    const recommendationResult = await model.generateContent(recommendationsPrompt, { max_length: 120 });
    const recommendationsText = recommendationResult.response.text();

    res.json({ results: aggregatedResults, recommendations: recommendationsText });
  } catch (error) {
    next(error);
  }
};
