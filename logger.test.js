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
