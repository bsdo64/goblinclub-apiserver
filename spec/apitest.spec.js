/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var request = require('supertest');
var app = require('../server.js');
var model = require('../db');

describe('API Test', function () {
  console.log('DB initTime - 2000 ms');
  beforeAll(function (done) {
    setTimeout(function () {
      done();
      return null;
    }, 2000);
  });

  afterAll(function (done) {
    model.sequelize.sync({force: true})
      .then(function () {
        console.log('DB reset');
        done();
      });
  });

  describe('ServerSide', function () {
    it('GET / ', function (done) {
      request(app)
        .get('/compose')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
    it('GET /club/game ', function (done) {
      request(app)
        .get('/compose/club/game')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
