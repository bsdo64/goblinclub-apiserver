/**
 * Created by dobyeongsu on 2016. 1. 12..
 */
/** @module Faker */

var model = require('../db');
var _ = require('lodash');
var Goblin = require('../lib/index');

/**
 * Faker Constructor
 * @class
 * @constructor
 */
var Faker = function () {};

var Geek = {
  GB: {
    name: '사업',
    url: 'business',
    description: 'Geek of Business'
  },
  GC: {
    name: '고전',
    url: 'classics',
    description: 'Geek of Classics'
  },
  GA: {
    name: '예술',
    url: 'arts',
    description: 'Geek of Arts'
  },
  GCS: {
    name: '컴퓨터',
    url: 'computer',
    description: 'Geek of Computer Science'
  },
  GCC: {
    name: '잡담',
    url: 'communications',
    description: 'Geek of communications'
  },
  GE: {
    name: '공학',
    url: 'engineering',
    description: 'Geek of engineering'
  },
  GH: {
    name: '인문학',
    url: 'humanities',
    description: 'Geek of Humanities'
  },
  GIT: {
    name: 'IT',
    url: 'it',
    description: 'Geek of information technology'
  },
  GJ: {
    name: '법학',
    url: 'law',
    description: 'Geek of Jurisprudence'
  },
  GM: {
    name: '수학',
    url: 'math',
    description: 'Geek of Math'
  },
  GMD: {
    name: '의학',
    url: 'medicine',
    description: 'Geek of Medicine'
  },
  GMU: {
    name: '음악',
    url: 'music',
    description: 'Geek of music'
  },
  GP: {
    name: '철학',
    url: 'philosophy',
    description: 'Geek of Philosophy'
  },
  GS: {
    name: '과학',
    url: 'science',
    description: 'Geek of Science (Physics, Chemistry, Biology, etc.)'
  },
  GSS: {
    name: '사회과학',
    url: 'socialscience',
    description: 'Geek of Social Science (Psychology, Sociology, etc.)'
  },
  GTW: {
    name: '테크니컬라이팅',
    url: 'technicalwriting',
    description: 'Geek of Technical Writing'
  },
  GAT: {
    name: '거래',
    url: 'trade',
    description: 'Geek of All Trades'
  }
};
/**
 * Faker test2 method
 * @method
 * @public
 * @param {Object} app Express app instance
 * @return {Promise}
 */
Faker.prototype.test2 = function (app, cb) {
  Goblin('Composer', function (G) {
    var user = {
      email: 'webmaster@gobblinclub.com',
      nick: '고블린클럽',
      password: 'gobblinclub12'
    };

    G.User
      .signin(user)
      .then(function (result) {
        var u = result.user;

        _.forEach(Geek, function (val, key) {
          G.Club.createDefault(val, u);
          if (key === 'GAT') {
            return null;
          }
        });
      })
      .then(function () {
        cb();
      });
  });
};

module.exports = new Faker();
