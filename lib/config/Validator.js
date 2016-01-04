/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var Joi = require('joi');
var schema = {
  signinUser: Joi.object().keys({
    email: Joi.string().email().required(),
    nick: Joi.string().min(2).max(10).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }).with('email', 'nick', 'password').required(),

  loginUser: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }).with('email', 'password').required()
};

module.exports = schema;
