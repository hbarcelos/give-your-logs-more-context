const parseJSONStream = require('../../utils/parse-json-stream');
const streamToGenerator = require('../../utils/stream-to-generator');
const createLogger = require('../../logger');

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

module.exports = testMethod;
