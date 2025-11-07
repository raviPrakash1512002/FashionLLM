exports.status = async (req, res, next) => {
  try {
    const etlProcessor = req.app.locals.services?.etlProcessor;
    if (!etlProcessor) return res.status(500).json({ error: 'etl_not_initialized' });
    const stats = etlProcessor.getProcessingStats?.() || {};
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const etlProcessor = req.app.locals.services?.etlProcessor;
    if (!etlProcessor) return res.status(500).json({ error: 'etl_not_initialized' });
    const result = await etlProcessor.forceRefresh();
    res.json({ message: 'ETL refresh completed', result });
  } catch (error) {
    next(error);
  }
};
