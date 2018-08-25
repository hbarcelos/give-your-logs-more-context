const test = require('ava');
const testMethod = require('./test/macros/test-method');
const loggerMethodUseCases = require('./test/use-cases/logger-methods');
const createLogger = require('./logger');
const parseJSONStream = require('./utils/parse-json-stream');
const streamToGenerator = require('./utils/stream-to-generator');

loggerMethodUseCases.forEach(({ input, expected }) => {
  test(
    `Logger methods: ${JSON.stringify(input)} - ${JSON.stringify(expected)}`,
    testMethod,
    input,
    expected
  );
});
