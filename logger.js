const pino = require('pino');
const { createNamespace } = require('cls-hooked');

let counter = 0;

function createLogger(opts, destination) {
  const baseLogger = pino(opts, destination);
  const cls = createNamespace(`@@logger-${counter}`);

  counter += 1;

  return Object.assign(baseLogger, { cls });
}

module.exports = createLogger;
