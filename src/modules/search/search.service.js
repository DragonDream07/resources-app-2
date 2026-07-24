const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

const PRODUCTS_INDEX = process.env.ELASTICSEARCH_PRODUCTS_INDEX || 'products';

/**
 * Perform full-text search with faceted filter aggregations.
 *
 * @param {object} params
 * @param {string} params.q          - Full-text query string
 * @param {object} params.filters    - Key/value map of facet filters
 * @param {number} params.page       - 1-based page number
 * @param {number} params.size       - Results per page
 * @param {string} [params.sort]     - Sort option (e.g. "price_asc", "price_desc", "relevance")
 * @returns {Promise<object>}
 */
async function search({ q, filters = {}, page = 1, size = 20, sort }) {
  const from = (page - 1) * size;

  // Build must clauses
  const mustClauses = [];
  if (q && q.trim()) {
    mustClauses.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description', 'brand', 'category', 'tags'],
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  // Build filter clauses from facets
  const filterClauses = [];
  for (const [field, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      filterClauses.push({ terms: { [field]: value } });
    } else if (value !== null && value !== undefined && value !== '') {
      filterClauses.push({ term: { [field]: value } });
    }
  }

  // Build sort
  const sortConfig = buildSort(sort);

  // Build aggregations for facets
  const aggregations = {
    categories: {
      terms: { field: 'category.keyword', size: 50 },
    },
    brands: {
      terms: { field: 'brand.keyword', size: 50 },
    },
    price_ranges: {
      range: {
        field: 'price',
        ranges: [
          { key: 'under_500', to: 500 },
          { key: '500_to_1000', from: 500, to: 1000 },
          { key: '1000_to_5000', from: 1000, to: 5000 },
          { key: 'above_5000', from: 5000 },
        ],
      },
    },
    ratings: {
      terms: { field: 'rating', size: 5 },
    },
  };

  const esQuery = {
    index: PRODUCTS_INDEX,
    from,
    size,
    body: {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
        },
      },
      sort: sortConfig,
      aggs: aggregations,
      highlight: {
        fields: {
          name: {},
          description: { fragment_size: 150, number_of_fragments: 1 },
        },
      },
    },
  };

  const response = await esClient.search(esQuery);
  const hits = response.body || response;

  const total =
    typeof hits.hits.total === 'object'
      ? hits.hits.total.value
      : hits.hits.total;

  const items = hits.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    highlight: hit.highlight || {},
    ...hit._source,
  }));

  const facets = buildFacets(hits.aggregations);

  return {
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
    items,
    facets,
  };
}

/**
 * Autocomplete / suggest query.
 *
 * @param {object} params
 * @param {string} params.q    - Partial query string
 * @param {number} params.size - Number of suggestions
 * @returns {Promise<object>}
 */
async function suggest({ q, size = 10 }) {
  if (!q || !q.trim()) {
    return { suggestions: [] };
  }

  const esQuery = {
    index: PRODUCTS_INDEX,
    body: {
      suggest: {
        product_suggest: {
          prefix: q,
          completion: {
            field: 'suggest',
            size,
            skip_duplicates: true,
            fuzzy: {
              fuzziness: 1,
            },
          },
        },
      },
      // Also run a prefix query for broader name suggestions
      query: {
        bool: {
          should: [
            {
              match_phrase_prefix: {
                name: {
                  query: q,
                  max_expansions: 20,
                },
              },
            },
          ],
        },
      },
      _source: ['name', 'brand', 'category', 'imageUrl'],
      size,
    },
  };

  const response = await esClient.search(esQuery);
  const hits = response.body || response;

  // Gather completion suggestions
  const completionSuggestions = (
    (hits.suggest &&
      hits.suggest.product_suggest &&
      hits.suggest.product_suggest[0] &&
      hits.suggest.product_suggest[0].options) ||
    []
  ).map((opt) => ({
    id: opt._id,
    text: opt.text,
    ...opt._source,
  }));

  // Gather prefix match hits
  const matchSuggestions = (hits.hits && hits.hits.hits ? hits.hits.hits : []).map((hit) => ({
    id: hit._id,
    ...hit._source,
  }));

  // Merge and deduplicate by id
  const seen = new Set();
  const suggestions = [];
  for (const item of [...completionSuggestions, ...matchSuggestions]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      suggestions.push(item);
      if (suggestions.length >= size) break;
    }
  }

  return { suggestions };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSort(sort) {
  switch (sort) {
    case 'price_asc':
      return [{ price: { order: 'asc' } }];
    case 'price_desc':
      return [{ price: { order: 'desc' } }];
    case 'newest':
      return [{ createdAt: { order: 'desc' } }];
    case 'popularity':
      return [{ soldCount: { order: 'desc' } }];
    case 'rating':
      return [{ rating: { order: 'desc' } }];
    case 'relevance':
    default:
      return ['_score'];
  }
}

function buildFacets(aggregations) {
  if (!aggregations) return {};

  const facets = {};

  if (aggregations.categories) {
    facets.categories = aggregations.categories.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (aggregations.brands) {
    facets.brands = aggregations.brands.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (aggregations.price_ranges) {
    facets.priceRanges = aggregations.price_ranges.buckets.map((b) => ({
      key: b.key,
      from: b.from,
      to: b.to,
      count: b.doc_count,
    }));
  }

  if (aggregations.ratings) {
    facets.ratings = aggregations.ratings.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  return facets;
}

module.exports = { search, suggest };
