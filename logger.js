const pino = require('pino');
const { createNamespace } = require('cls-hooked');

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

const childMethodHandler = {
  apply(target, thisArg, argumentList) {
    const { cls } = thisArg;

    // eslint-disable-next-line no-use-before-define
    return createWrapper({ cls }, target.apply(thisArg, argumentList));
  },
};

const loggerObjectHandler = {
  get(target, prop) {
    if (target.proxies && target.proxies[prop]) {
      return target.proxies[prop];
    }

    return target[prop];
  },
};

const createProxies = target => ({
  trace: new Proxy(target.trace, logMethodHandler),
  debug: new Proxy(target.debug, logMethodHandler),
  info: new Proxy(target.info, logMethodHandler),
  warn: new Proxy(target.warn, logMethodHandler),
  error: new Proxy(target.error, logMethodHandler),
  fatal: new Proxy(target.fatal, logMethodHandler),
  child: new Proxy(target.child, childMethodHandler),
});

function createWrapper({ cls }, pinoInstance) {
  const baseLogger = Object.create(pinoInstance, {
    cls: {
      value: cls,
    },
  });
  const loggerWithProxies = Object.create(baseLogger, {
    proxies: {
      value: createProxies(baseLogger),
    },
  });

  return new Proxy(loggerWithProxies, loggerObjectHandler);
}

let counter = 0;

function createLogger(opts, destination) {
  const cls = createNamespace(`@@logger-${counter}`);
  counter += 1;

  const pinoInstance = pino(opts, destination);

  return createWrapper({ cls }, pinoInstance);
}

module.exports = createLogger;
