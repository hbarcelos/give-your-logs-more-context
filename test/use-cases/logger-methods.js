const useCases = [
  { input: { method: 'trace' }, expected: { level: 10 } },
  { input: { method: 'debug' }, expected: { level: 20 } },
  { input: { method: 'info' }, expected: { level: 30 } },
  { input: { method: 'warn' }, expected: { level: 40 } },
  { input: { method: 'error' }, expected: { level: 50 } },
  { input: { method: 'fatal' }, expected: { level: 60 } },
];

module.exports = useCases;
