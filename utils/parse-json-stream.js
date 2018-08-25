const { Transform } = require('stream');

const parseJSONStream = () =>
  new Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      try {
        const data = JSON.parse(chunk.toString('utf8'));
        return cb(null, data);
      } catch (err) {
        return cb(err);
      }
    },
  });

module.exports = parseJSONStream;
