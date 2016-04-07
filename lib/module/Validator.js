/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var Joi = require('joi');
var Schema = require('../config/ValidateRules');

module.exports = function () {
  return function (G) {
    G.validate = (function () {
      // private
      var check = function check(schemaName, data) {
        return new Promise(function (resolve, reject) {
          Joi.validate(data, Schema[schemaName], function (err, result) {
            if (err) {
              return reject(err);
            }

            return resolve(result);
          });
        });
      };

      // public
      return {
        check: check
      };
    })();
  };
};
