/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var Joi = require('joi');
var schema = {
  signinUser: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9_!@#$%^&*~]*$/).min(2).max(20).required(),
    nick: Joi.string().regex(/^[a-zA-Z0-9가-힣]*$/).min(2).max(10).required(),
    sex: Joi.boolean(),
    birth: Joi.date(),
    day: Joi.string(),
    month: Joi.string(),
    year: Joi.string()
  }).with('email', 'nick', 'password', 'sex', 'date').required(),

  loginUser: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9_]*$/).min(2).max(20).required()
  }).with('email', 'password').required()
};

module.exports = schema;
