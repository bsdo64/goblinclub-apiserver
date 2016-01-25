/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var request = require('supertest');
var app = require('../server.js');
var model = require('../db/index.js');
var server;

function doneNext(done) {
  return function (err, res) {
    if (err) {
      done.fail(err);
    } else {
      done();
    }
  };
}
describe('API Test', function () {
  beforeAll(function (done) {
    model.sequelize.sync({force: true})
      .then(function () {
        server = app.listen(3002, function () {
          console.log('DB inital-TEST');
          done();
        });
      });
  });

  describe('ClientSide', function () {
    var composeUrl = '/ajax';

    it('GET / ', function (done) {
      request(app)
        .get(composeUrl + '/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function (res) {
          expect(res.body.a).toEqual(1);
        })
        .end(doneNext(done));
    });
    it('GET /best ', function (done) {
      request(app)
        .get(composeUrl + '/best')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function (res) {
          expect(res.body.PostStore.bestList).toEqual([]);
          expect(res.body.ClubStore.defaultClubList).toEqual([]);
        })
        .end(doneNext(done));
    });
    it('GET /club/:clubName ', function (done) {
      request(app)
        .get(composeUrl + '/club/test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(function (res) {
          expect(res.body.name).toEqual('ComposerError');
          expect(res.body.message).toEqual('No Club');
        })
        .end(doneNext(done));
    });
    it('GET /club/:clubName/:postName ', function (done) {
      request(app)
        .get(composeUrl + '/club/test/test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(function (res) {
          expect(res.body.name).toEqual('ComposerError');
          expect(res.body.message).toEqual('No Club');
        })
        .end(doneNext(done));
    });
  });

  afterAll(function (done) {
    server.close(function () {
      console.log('API-client Test Closed');
      done();
    });
  });
});
