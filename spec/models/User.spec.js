/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var model = require('../../db/models/index.js');
var Seed = require('../../Seed/index');

describe('Model Test', function () {
  beforeAll(function (done) {
    model
      .sequelize
      .sync({ force: true })
      .then(function () {
        Seed.init(null, function() {
          console.log('Model synced');
          done();
        })
      });
  });

  describe('====== Users =======', function () {
    it('>> findOne <<', function (done) {
      model
        .User
        .findOne({
          where: {id: 2},
          include: [
            { model: model.UserMembership, include: [ model.Membership ] },
            { model: model.UserGrade, include: [ model.Grade ] },
            { model: model.UserProfile },
          ]
        })
        .then(function (user) {
          expect(user).not.toBeNull();
          done();
        });
    });

    it('>> findOne <<', function (done) {
      model
        .User
        .findOne({
          where: {id: 2},
          include: [
            { model: model.UserMembership, include: [ model.Membership ] },
            { model: model.UserGrade, include: [ model.Grade ] },
            { model: model.UserProfile },
          ]
        })
        .then(function (user) {
          expect(user).not.toBeNull();
          done();
        });
    });
  });

});
