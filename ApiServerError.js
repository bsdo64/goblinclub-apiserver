function ApiServerError() {
}

ApiServerError.prototype = {
  CheckUserAuthError: function CheckUserAuthError() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'CheckUserAuthError';
    this.stack = temp.stack;
    this.message = temp.message;

    Object.create(Error.prototype, {
      constructor: {
        value: CheckUserAuthError,
        writable: true,
        configurable: true
      }
    });
  }
};

module.exports = new ApiServerError();
