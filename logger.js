const pino = require('pino');

function createLogger(opts, destination) {
  return pino(opts, destination);
}

module.exports = createLogger;
