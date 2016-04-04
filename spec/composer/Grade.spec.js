/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var model        = require('../../db/models/index.js');
var Seed         = require('../../Seed/index');
var Promise      = require('bluebird');

describe('Composer Post Test', function () {
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

  describe('>> Create Post', function () {
    it('>> Tags with Post', function (done) {
      var tags = [];
      Promise.each([
          {name: '우리'},
          {name: '친구'},
          {name: '안녕'},
          {name: '우리들'},
          {name: '만가워'},
        ], function(tag, index, length) {
          return model.Tag.findOrCreate({where : tag})
            .spread(function (data, created) {
              if (created) {
                tags.push(data);
              } else {
                tags.push(data);
              }
            })
        })
        .then(function(result) {
          expect(tags.length).toEqual(5);
          return model.Post.create({
            title: '제목',
            content: '내용',
            club_id: 1,
            user_id: 1
          })
        })
        .then(function (post) {
          expect(tags.length).toEqual(5);
          return post.setTags(tags);
        })
        .then(function (post) {
          return model.Post.findOne({
            where: { title: '제목' },
            include: [
              { model: model.Tag, attributes: ['name'] },
              { model: model.User, attributes: ['nick', 'id'] },
            ]
          })
        })
        .then(function (post) {
          expect(post.get('Tags').length).toEqual(5);
          done();
        })
    })
  });

});
