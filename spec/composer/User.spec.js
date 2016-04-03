/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var model        = require('../../db/models/index.js');
var Seed         = require('../../Seed/index');
var jsonwebtoken = require("jsonwebtoken");

describe('Composer User Test', function () {
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

  describe('Signin >>', function () {
    describe('CheckEmail >>', function () {
      it('success', function(done) {
        var email = 'bsdo2@naver.com';

        model
          .User
          .findOne({where: { email: email }})
          .then(function (user) {
            expect(user).toBeNull();
            done();
          })
      });

      it('duplicate', function(done) {
        var email = 'bsdo@naver.com';

        model
          .User
          .findOne({where: { email: email }})
          .then(function (user) {
            expect(user).not.toBeNull();
            done();
          })
      });
    });

    describe('CheckNick >>', function () {
      it('success', function(done) {
        var nick = '고블린클럽3';

        model
          .User
          .findOne({where: { nick: nick }})
          .then(function (user) {
            expect(user).toBeNull();
            done();
          })
      });

      it('duplicate', function(done) {
        var nick = '고블린클럽';

        model
          .User
          .findOne({where: { nick: nick }})
          .then(function (user) {
            expect(user).not.toBeNull();
            done();
          })
      });
    });

    describe('Signin >>', function () {
      var u = {
        email: 'test@test.com',
        nick: 'nick',
        password: 'password',
        sex: 1,
        birth: new Date()
      };

      it('success', function(done) {
        var uCreate = {
          email: u.email,
          nick: u.nick,
          password: u.password
        };
        model
          .User
          .findOrCreate({where: uCreate})
          .spread(function (newUser, created) {
            if (!created) {
              return done.fail(created);
            }

            var userId = newUser.get('id'),
                uProfile = {
                  birth: u.birth,
                  sex: u.sex,
                  description: null,
                  joined_at: new Date(),
                  user_id: userId
                };
            return model
              .UserProfile
              .create(uProfile)
              .then(function () {
                return model
                  .UserActivity
                  .create({user_id: userId})
              })
              .then(function () {
                return model
                  .UserMembership
                  .create({membership_id: 1, user_id: userId});
              })
              .then(function () {
                return model
                  .UserGrade
                  .create({grade_id: 1, user_id: userId});
              })
              .then(function () {
                return model
                  .UserPoint
                  .create({user_id: userId})
              })
              .then(function () {
                return model
                  .UserReputation
                  .create({user_id: userId})
              })
              .then(function () {
                return model
                  .User
                  .findOne({
                    where: {id: 3},
                    include: [
                      model.UserProfile,
                      model.UserActivity,
                      model.UserMembership,
                      model.UserGrade,
                      model.UserPoint,
                      model.UserReputation
                    ]
                  })
              })
              .then(function (user) {
                console.log(user.get({plain: true}));
                done();
              })
          })
          .catch(function (err) {
            done.fail(err);
          });
      });

      it('duplicate', function(done) {
        var nick = '고블린클럽';

        model
          .User
          .findOne({where: { nick: nick }})
          .then(function (user) {
            expect(user).not.toBeNull();
            done();
          })
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

  describe('====== Login =======', function () {
    
  });

  describe('====== Login =======', function () {

  });
});
