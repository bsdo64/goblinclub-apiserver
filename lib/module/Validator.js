/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var Joi = require('joi');
var Schema = require('../config/Validator');

module.exports = function () {
  return function (G) {
    G.validate = (function () {
      // private
      var _checkValidate = function _checkValidate(schema, data) {
        return new Promise(function (resolve, reject) {
          Joi.validate(data, schema, function (err, result) {
            if (err) {
              return reject(err);
            }

            return resolve(result);
          });
        });
      };

      // public
      var signinUser = function (user) {
        var schema = Schema.signinUser;
        return _checkValidate(schema, user);
      };

      var loginUser = function (user) {
        var schema = Schema.loginUser;
        return _checkValidate(schema, user);
      };

      return {
        signinUser: signinUser,
        loginUser: loginUser
      };
    })();
  };
};
