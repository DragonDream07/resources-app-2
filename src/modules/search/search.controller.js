const searchService = require('./search.service');

/**
 * GET /search
 * Full-text search with optional faceted filters, pagination
 */
async function search(req, res, next) {
  try {
    const { q, filters, page, size, sort } = req.query;
    const result = await searchService.search({
      q,
      filters: filters ? (typeof filters === 'string' ? JSON.parse(filters) : filters) : {},
      page: page ? parseInt(page, 10) : 1,
      size: size ? parseInt(size, 10) : 20,
      sort,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /search/suggest
 * Autocomplete suggestions based on partial query
 */
async function suggest(req, res, next) {
  try {
    const { q, size } = req.query;
    const result = await searchService.suggest({
      q,
      size: size ? parseInt(size, 10) : 10,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { search, suggest };
