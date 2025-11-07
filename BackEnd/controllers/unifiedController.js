exports.search = async (req, res, next) => {
  try {
    const etlProcessor = req.app.locals.services?.etlProcessor;
    if (!etlProcessor) return res.status(500).json({ error: 'etl_not_initialized' });
    const filters = req.body.filters || {};
    const results = await etlProcessor.queryUnifiedData(filters);
    res.json({ results, totalCount: (results && results.length) || 0 });
  } catch (error) {
    next(error);
  }
};
