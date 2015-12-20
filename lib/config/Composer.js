/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var Model = require('../../db');
var User = Model.user;
var Post = Model.post;
var Club = Model.club;
var Comment = Model.comment;

var queryOptions = {
  findOneUser: {
    byEmail: {where: {email: 'test@test.com'}}
  },
  '/ajax': {

  },
  '/compose': {
    '/': [{
      order: [
        ['createdAt', 'DESC']
      ],
      include: [
        {model: User, required: true, attributes: ['nick', 'id']},
        {model: Club, required: true}
      ]
    }, {
      where: {type: 'default'}
    }]
  }
};

module.exports = queryOptions;
