/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var request = require('supertest');
var app = require('../server.js');

function finish_test (done) {
  return function (err) {
    if (err) {
      done.fail(err)
    } else {
      done()
    }
  }
}

describe('API Test', function(){
  describe('ServerSide', function() {
    it('GET / ', function(done){
      request(app)
        .get('/compose')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(finish_test(done))
    });
    it('GET /club/game ', function(done){
      request(app)
        .get('/compose/club/game')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(finish_test(done))
    })
  });
});