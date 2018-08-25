const pino = require('pino');
const { createNamespace } = require('cls-hooked');

function createLogger(opts, destination) {
  const baseLogger = pino(opts, destination);
  const cls = createNamespace('@@logger');

  return Object.assign(baseLogger, { cls });
}

module.exports = createLogger;
