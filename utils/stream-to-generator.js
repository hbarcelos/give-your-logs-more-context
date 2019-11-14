function* streamToGenerator(stream) {
  while (true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject)),
    ]);

    if (!res) {
      break;
    }
  }
}

module.exports = streamToGenerator;
