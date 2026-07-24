'use strict';

const { Client } = require('@elastic/elasticsearch');

const PRODUCTS_INDEX = 'products';
const SUGGESTIONS_INDEX = 'products_suggestions';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _client = null;

function getClient() {
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth:
        process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            }
          : undefined,
      tls:
        process.env.ELASTICSEARCH_TLS_REJECT_UNAUTHORIZED === 'false'
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Index mappings
// ---------------------------------------------------------------------------

const PRODUCTS_INDEX_MAPPING = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword', ignore_above: 256 },
          suggest: { type: 'search_as_you_type' },
        },
      },
      description: { type: 'text', analyzer: 'standard' },
      brandId: { type: 'keyword' },
      brandName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      categoryId: { type: 'keyword' },
      categoryName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      tags: { type: 'keyword' },
      status: { type: 'keyword' },
      price: { type: 'double' },
      salePrice: { type: 'double' },
      stock: { type: 'integer' },
      rating: { type: 'float' },
      reviewCount: { type: 'integer' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      attributes: {
        type: 'nested',
        properties: {
          key: { type: 'keyword' },
          value: { type: 'keyword' },
        },
      },
      images: {
        type: 'nested',
        properties: {
          url: { type: 'keyword', index: false },
          altText: { type: 'text' },
          isPrimary: { type: 'boolean' },
        },
      },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

const SUGGESTIONS_INDEX_MAPPING = {
  mappings: {
    properties: {
      suggest: { type: 'completion' },
      text: { type: 'keyword' },
      weight: { type: 'integer' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

async function ensureIndex(indexName, mapping) {
  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });
  if (!exists) {
    await client.indices.create({
      index: indexName,
      body: mapping,
    });
  }
}

async function ensureProductsIndex() {
  return ensureIndex(PRODUCTS_INDEX, PRODUCTS_INDEX_MAPPING);
}

async function ensureSuggestionsIndex() {
  return ensureIndex(SUGGESTIONS_INDEX, SUGGESTIONS_INDEX_MAPPING);
}

async function deleteIndex(indexName) {
  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });
  if (exists) {
    await client.indices.delete({ index: indexName });
  }
}

async function reindexProducts() {
  await deleteIndex(PRODUCTS_INDEX);
  await ensureProductsIndex();
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------

async function indexDocument(indexName, id, document) {
  const client = getClient();
  return client.index({
    index: indexName,
    id: String(id),
    document,
    refresh: 'wait_for',
  });
}

async function indexProduct(product) {
  return indexDocument(PRODUCTS_INDEX, product.id, product);
}

async function updateDocument(indexName, id, partialDocument) {
  const client = getClient();
  return client.update({
    index: indexName,
    id: String(id),
    doc: partialDocument,
    refresh: 'wait_for',
  });
}

async function updateProduct(productId, partialProduct) {
  return updateDocument(PRODUCTS_INDEX, productId, partialProduct);
}

async function deleteDocument(indexName, id) {
  const client = getClient();
  return client.delete({
    index: indexName,
    id: String(id),
    refresh: 'wait_for',
  });
}

async function deleteProduct(productId) {
  return deleteDocument(PRODUCTS_INDEX, productId);
}

async function bulkIndexDocuments(indexName, documents) {
  if (!documents || documents.length === 0) return null;
  const client = getClient();
  const operations = documents.flatMap((doc) => [
    { index: { _index: indexName, _id: String(doc.id) } },
    doc,
  ]);
  return client.bulk({ operations, refresh: 'wait_for' });
}

async function bulkIndexProducts(products) {
  return bulkIndexDocuments(PRODUCTS_INDEX, products);
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build a full-text product search query.
 *
 * @param {object} params
 * @param {string}  [params.q]            - free-text query string
 * @param {string}  [params.categoryId]   - filter by category
 * @param {string}  [params.brandId]      - filter by brand
 * @param {number}  [params.minPrice]     - minimum price filter
 * @param {number}  [params.maxPrice]     - maximum price filter
 * @param {string}  [params.status]       - product status filter
 * @param {string}  [params.sortBy]       - field to sort by
 * @param {string}  [params.sortOrder]    - 'asc' | 'desc'
 * @param {number}  [params.from]         - pagination offset
 * @param {number}  [params.size]         - page size
 * @returns {object} Elasticsearch request body
 */
function buildProductSearchQuery(params = {}) {
  const {
    q,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    status,
    sortBy = '_score',
    sortOrder = 'desc',
    from = 0,
    size = 20,
  } = params;

  const mustClauses = [];
  const filterClauses = [];

  // Full-text search
  if (q && q.trim() !== '') {
    mustClauses.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'name.keyword^4', 'description', 'brandName', 'categoryName', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
        prefix_length: 1,
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  // Category filter
  if (categoryId) {
    filterClauses.push({ term: { categoryId } });
  }

  // Brand filter
  if (brandId) {
    filterClauses.push({ term: { brandId } });
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const rangeClause = {};
    if (minPrice !== undefined) rangeClause.gte = minPrice;
    if (maxPrice !== undefined) rangeClause.lte = maxPrice;
    filterClauses.push({ range: { price: rangeClause } });
  }

  // Status filter
  if (status) {
    filterClauses.push({ term: { status } });
  }

  // Sort
  const allowedSortFields = ['price', 'rating', 'reviewCount', 'createdAt', 'updatedAt', 'name.keyword'];
  const resolvedSortField = allowedSortFields.includes(sortBy) ? sortBy : '_score';
  const resolvedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const sort = [];
  if (resolvedSortField !== '_score') {
    sort.push({ [resolvedSortField]: { order: resolvedSortOrder } });
  } else {
    sort.push({ _score: { order: resolvedSortOrder } });
  }

  // Aggregations for facets
  const aggs = {
    categories: {
      terms: { field: 'categoryId', size: 50 },
      aggs: { categoryName: { terms: { field: 'categoryName.keyword', size: 1 } } },
    },
    brands: {
      terms: { field: 'brandId', size: 50 },
      aggs: { brandName: { terms: { field: 'brandName.keyword', size: 1 } } },
    },
    price_stats: {
      stats: { field: 'price' },
    },
    price_ranges: {
      range: {
        field: 'price',
        ranges: [
          { to: 500 },
          { from: 500, to: 1000 },
          { from: 1000, to: 5000 },
          { from: 5000, to: 10000 },
          { from: 10000 },
        ],
      },
    },
  };

  return {
    from,
    size,
    query: {
      bool: {
        must: mustClauses,
        filter: filterClauses,
      },
    },
    sort,
    aggs,
    highlight: {
      fields: {
        name: {},
        description: { fragment_size: 150, number_of_fragments: 3 },
      },
      pre_tags: ['<em>'],
      post_tags: ['</em>'],
    },
  };
}

/**
 * Build a suggestion/autocomplete query.
 *
 * @param {object} params
 * @param {string} params.q    - partial query text
 * @param {number} [params.size] - max suggestions to return
 * @returns {object} Elasticsearch request body
 */
function buildSuggestQuery(params = {}) {
  const { q = '', size = 10 } = params;

  return {
    size: 0,
    suggest: {
      product_suggest: {
        prefix: q,
        completion: {
          field: 'name.suggest',
          size,
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 'AUTO',
          },
        },
      },
    },
  };
}

/**
 * Build a query to search products by category.
 *
 * @param {object} params
 * @param {string} params.categoryId
 * @param {string} [params.sortBy]
 * @param {string} [params.sortOrder]
 * @param {number} [params.from]
 * @param {number} [params.size]
 * @returns {object} Elasticsearch request body
 */
function buildCategoryProductsQuery(params = {}) {
  const { categoryId, sortBy, sortOrder, from, size } = params;
  return buildProductSearchQuery({ categoryId, sortBy, sortOrder, from, size });
}

/**
 * Build a query to fetch a single product by id.
 *
 * @param {string} productId
 * @returns {object} Elasticsearch request body
 */
function buildGetProductQuery(productId) {
  return {
    size: 1,
    query: {
      term: { id: String(productId) },
    },
  };
}

// ---------------------------------------------------------------------------
// Search execution helpers
// ---------------------------------------------------------------------------

/**
 * Execute a search against the products index.
 *
 * @param {object} esQuery - Elasticsearch request body produced by a builder
 * @returns {Promise<object>} Raw Elasticsearch response
 */
async function searchProducts(esQuery) {
  const client = getClient();
  return client.search({
    index: PRODUCTS_INDEX,
    body: esQuery,
  });
}

/**
 * Execute a suggest query.
 *
 * @param {object} esQuery - Elasticsearch request body produced by buildSuggestQuery
 * @returns {Promise<object>} Raw Elasticsearch response
 */
async function searchSuggestions(esQuery) {
  const client = getClient();
  return client.search({
    index: PRODUCTS_INDEX,
    body: esQuery,
  });
}

/**
 * Parse a standard product search response into a structured result.
 *
 * @param {object} response - Raw Elasticsearch response
 * @returns {{ total: number, hits: object[], aggregations: object }}
 */
function parseSearchResponse(response) {
  const total =
    typeof response.hits.total === 'object'
      ? response.hits.total.value
      : response.hits.total;

  const hits = response.hits.hits.map((hit) => ({
    ...hit._source,
    _score: hit._score,
    _highlight: hit.highlight || {},
  }));

  return {
    total,
    hits,
    aggregations: response.aggregations || {},
  };
}

/**
 * Parse a suggestion response into a flat list of suggestion strings.
 *
 * @param {object} response - Raw Elasticsearch response
 * @returns {string[]}
 */
function parseSuggestResponse(response) {
  const suggestions = response.suggest && response.suggest.product_suggest;
  if (!suggestions || suggestions.length === 0) return [];
  return suggestions[0].options.map((option) => option.text);
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

async function ping() {
  const client = getClient();
  return client.ping();
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Constants
  PRODUCTS_INDEX,
  SUGGESTIONS_INDEX,

  // Client
  getClient,

  // Index helpers
  ensureIndex,
  ensureProductsIndex,
  ensureSuggestionsIndex,
  deleteIndex,
  reindexProducts,

  // Document helpers
  indexDocument,
  indexProduct,
  updateDocument,
  updateProduct,
  deleteDocument,
  deleteProduct,
  bulkIndexDocuments,
  bulkIndexProducts,

  // Query builders
  buildProductSearchQuery,
  buildSuggestQuery,
  buildCategoryProductsQuery,
  buildGetProductQuery,

  // Search execution
  searchProducts,
  searchSuggestions,

  // Response parsers
  parseSearchResponse,
  parseSuggestResponse,

  // Health
  ping,
};
