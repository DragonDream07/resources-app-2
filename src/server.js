'use strict';

const createApp = require('./app');
const config = require('./config/index');
const logger = require('./utils/logger');

const app = createApp();
const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
