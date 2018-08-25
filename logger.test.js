const test = require('ava');
const createLogger = require('./logger');
const parseJSONStream = require('./utils/parse-json-stream');
const streamToGenerator = require('./utils/stream-to-generator');

const loggerMethodUseCases = [
  { input: { method: 'trace' }, expected: { level: 10 } },
  { input: { method: 'debug' }, expected: { level: 20 } },
  { input: { method: 'info' }, expected: { level: 30 } },
  { input: { method: 'warn' }, expected: { level: 40 } },
  { input: { method: 'error' }, expected: { level: 50 } },
  { input: { method: 'fatal' }, expected: { level: 60 } },
];

async function testMethod(t, input = {}, expected = {}) {
  const { method } = input;
  const { level } = expected;

  const stream = parseJSONStream();
  const logger = createLogger({ level: 'trace' }, stream);

  const gen = streamToGenerator(stream);

  logger[method]('foo');

  const data = await gen.next().value;

  t.is(data.level, level);
}

loggerMethodUseCases.forEach(({ input, expected }) => {
  test(
    `Logger methods: ${JSON.stringify(input)} - ${JSON.stringify(expected)}`,
    testMethod,
    input,
    expected
  );
});

test(`Properly logs message with context object`, async t => {
  const stream = parseJSONStream();
  const gen = streamToGenerator(stream);
  const logger = createLogger({}, stream);

  const context = { dummy: 'value' };
  const message = 'foo';

  logger.info(context, message);

  const entry = await gen.next().value;

  t.deepEqual(entry.dummy, context.dummy);
  t.deepEqual(entry.msg, message);
});

test(`Exposes a CLS namespace`, t => {
  const logger = createLogger();

  t.truthy(logger.cls);
});

test(`2 different loggers don't share the same namespace`, t => {
  const logger = createLogger();
  const anotherLogger = createLogger();

  t.notDeepEqual(logger.cls, anotherLogger.cls);
});

test.cb(`Should properly log message with cls context`, t => {
  const stream = parseJSONStream();
  const gen = streamToGenerator(stream);
  const logger = createLogger({}, stream);

  const msg = 'foo';
  const clsValues = {
    dummy: 'value',
    another: 'another value',
  };

  logger.cls.run(() => {
    logger.cls.set('dummy', clsValues.dummy);
    logger.cls.set('another', clsValues.another);
    process.nextTick(async () => {
      logger.info(msg);

      const entry = await gen.next().value;

      t.is(entry.dummy, clsValues.dummy);
      t.is(entry.another, clsValues.another);

      t.end();
    });
  });
});

test.cb(
  `Should properly log message with both cls and local context,
    And local context should have precedence over cls context`,
  t => {
    const stream = parseJSONStream();
    const gen = streamToGenerator(stream);
    const logger = createLogger({}, stream);

    const msg = 'foo';
    const clsValues = {
      dummy: 'value',
      precedence: 'will be overwitten',
    };

    logger.cls.run(() => {
      logger.cls.set('dummy', clsValues.dummy);
      logger.cls.set('another', clsValues.another);
      process.nextTick(async () => {
        const localValues = { precedence: 'local' };
        logger.info(localValues, msg);

        const entry = await gen.next().value;

        t.is(entry.precedence, localValues.precedence);

        t.end();
      });
    });
  }
);
