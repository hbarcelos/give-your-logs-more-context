const pino = require('pino');
const { createNamespace } = require('cls-hooked');

const logMethods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

const logMethodHandler = {
  apply(target, thisArg, argumentList) {
    // eslint-disable-next-line camelcase
    const { id, _ns_name, ...clsContext } =
      ((thisArg || {}).cls || {}).active || {};

    const [context, ...rest] = argumentList;

    let finalArgList = argumentList;
    if (typeof context === 'string') {
      // Log was called only with message, no local context
      const message = context;
      finalArgList = [clsContext, message, ...rest];
    } else {
      // Log was called local context, so we merge it into clsContext
      const fullContext = Object.assign({}, clsContext, context);
      finalArgList = [fullContext, ...rest];
    }

    return target.apply(thisArg, finalArgList);
  },
};

const loggerObjectHandler = {
  get(target, prop) {
    if (!logMethods.includes(prop)) {
      return target[prop];
    }

    return new Proxy(target[prop], logMethodHandler);
  },
};

let counter = 0;

function createLogger(opts, destination) {
  const baseLogger = pino(opts, destination);
  const cls = createNamespace(`@@logger-${counter}`);

  counter += 1;

  return new Proxy(Object.assign(baseLogger, { cls }), loggerObjectHandler);
}

module.exports = createLogger;
