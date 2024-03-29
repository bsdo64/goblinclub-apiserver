/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var request = require('supertest');
var app = require('../server.js');
var model = require('../db/models/index.js');
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
        server = app.listen(3031, function () {
          console.log('DB inital-TEST');
          done();
        });
      });
  });

  describe('ServerSide', function () {
    var composeUrl = '/compose';

    it('GET / ', function (done) {
      request(app)
        .get(composeUrl + '/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function (res) {
          expect(res.body.PostStore.bestList).toEqual([]);
          expect(res.body.ClubStore.defaultClubList).toEqual([]);
          expect(res.body.UserStore.loadedAuth).toEqual(false);
          expect(res.body.UserStore.authFail).toEqual(false);
          expect(res.body.UserStore.loadingAuth).toEqual(false);
          expect(res.body.UserStore.auth).toEqual({});
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
    it('GET /submit ', function (done) {
      request(app)
        .get(composeUrl + '/submit')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(function (res) {
          expect(res.body.name).toEqual('ComposerError');
          expect(res.body.message).toEqual('Not Login');
        })
        .end(doneNext(done));
    });
    it('GET /submit/club ', function (done) {
      request(app)
        .get(composeUrl + '/submit/club')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(function (res) {
          expect(res.body.name).toEqual('ComposerError');
          expect(res.body.message).toEqual('Not Login');
        })
        .end(doneNext(done));
    });
    it('GET /notfound ', function (done) {
      request(app)
        .get(composeUrl + '/notfound')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(doneNext(done));
    });
    it('GET /test - wrong url', function (done) {
      request(app)
        .get(composeUrl + '/test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(function (res) {
          expect(res.body.msg).toEqual('There\'s no endpoint!');
        })
        .end(doneNext(done));
    });
  });

  afterAll(function (done) {
    server.close(function () {
      console.log('API-server Test Closed');
      done();
    });
  });
});
