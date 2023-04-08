class BadRequest extends Error {
  constructor(msg) {
    super(msg);
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
