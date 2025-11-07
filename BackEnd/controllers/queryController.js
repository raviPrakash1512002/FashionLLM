/**
 * Controller for /query
 * Expects app.locals.services.federationService to be initialized
 */
exports.executeQueries = async (req, res, next) => {
  try {
    const federationService = req.app.locals.services?.federationService;
    if (!federationService) return res.status(500).json({ error: 'federation_not_initialized' });

    const { queries: userQueries, filters } = req.body;
    if (!Array.isArray(userQueries)) return res.status(400).json({ error: 'queries must be an array' });

    const queryPayload = userQueries.map((query, index) => ({ query, filters: filters?.[index] }));
    const results = await federationService.executeQuery(queryPayload);
    res.json({ results });
  } catch (error) {
    next(error);
  }
};
