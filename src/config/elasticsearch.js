'use strict';

const { Client } = require('@elastic/elasticsearch');
const config = require('./index');

/**
 * Elasticsearch client configuration derived from config/index.js
 */
const elasticsearchConfig = {
  node: config.elasticsearch.node,
  ...(config.elasticsearch.username && config.elasticsearch.password
    ? {
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      }
    : {}),
};

const elasticsearchClient = new Client(elasticsearchConfig);

module.exports = {
  elasticsearchConfig,
  elasticsearchClient,
};
