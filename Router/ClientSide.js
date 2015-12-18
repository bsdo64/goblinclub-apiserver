/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();

var jsonWebToken = require('jsonwebtoken');
var _ = require('lodash');
var shortId = require('shortid');
var moment = require('moment');

var Model = require('../db');
var Post = Model.post;
var User = Model.user;
var Club = Model.club;
var Comment = Model.comment;

moment.locale('ko');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/best', function (req, res) {
  var result = {
    PostStore: {},
    ClubStore: {}
  };

  Post.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [
      {model: User, required: true, attributes: ['nick', 'id']},
      {model: Club, required: true}
    ]
  }).then(function (bestPosts) {
    _.map(bestPosts, function (bestPost) {
      bestPost.setDataValue('createdAt', moment(bestPost.createdAt).fromNow());
      bestPost.setDataValue('updatedAt', moment(bestPost.updatedAt).fromNow());
      return bestPost;
    });
    result.PostStore.bestList = bestPosts;

    return Club.findAll({where: {type: 'default'}});
  }).then(function (defaultClubs) {
    result.ClubStore.defaultClubList = defaultClubs;
    res.send(result);
  });
});

router.post('/login', function (req, res) {
  var user = req.body.user;

  try {
    var token = jsonWebToken.sign(user, 'secret', {expiresIn: '7d'});

    res.cookie('token', token, {
      expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
      httpOnly: true
    });

    res.json({
      token: token,
      user: user,
      message: 'Loggined!'
    });
  } catch (err) {
    res.json({
      message: 'can\'t make token',
      error: err
    });
  }
});

router.post('/signin', function (req, res) {
  var user = req.body.user;
  var newUser = {
    email: user.signinEmail,
    nick: user.signinNick,
    password: user.signinPassword
  };

  User.findOrCreate({
    where: newUser
  }).spread(function (user) {
    console.log(user.get({
      plain: true
    }));
    try {
      var token = jsonWebToken.sign(user, 'secret', {expiresIn: '7d'});

      res.cookie('token', token, {
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        httpOnly: true
      });

      res.json({
        token: token,
        user: user,
        message: 'Loggined!'
      });
    }catch (err) {
      res.json({
        message: 'can\'t make token',
        error: err
      });
    }
  }).catch(function (err) {
    res.json({
      type: 'signinUser',
      message: '회원가입 오류',
      error: err
    });
  });
});

router.post('/submit', function (req, res) {
  var post = req.body.post;
  var author = req.body.author;

  var createdPost, clubList = [];

  if (!post || !author) {
    res.status(400).json({
      message: 'Fill out',
      error: 'Fill out'
    });
  }

  User.find({
    where: author
  }).then(function (user) {
    return Post.create({
      uid: shortId.generate(),
      title: post.title,
      content: post.content,
      author: user.get('id')
    });
  }).then(function (newPost) {
    createdPost = newPost;
    clubList.push(post.defaultClubList);
    clubList.push(post.subscribeClubList);
    _.flatten(clubList, true);
    _.compact(clubList);

    return Club.findAll({where: {id: {$or: clubList}}});
  }).then(function (clubs) {
    return createdPost.setClubs(clubs);
  }).then(function (club_post) {
    var postId = club_post[0][0].get()['postId'];
    console.log(postId);
    return Post.find({
      where: {uid: postId},
      include: [
        {model: User, required: true, attributes: ['nick', 'id']},
        {model: Club, required: true}
      ]
    });
  }).then(function (post) {
    console.log(post);
    res.send(post);
  });
});

router.get('/club/:clubName/:article', function (req, res) {
  var article = req.params.article;
  var clubName = req.params.clubName;

  var result = {
    PostStore: {},
    ClubStore: {}
  };

  Post.findOne({
    where: {uid: article},
    include: [
      {model: User, required: true, attributes: ['nick', 'id']},
      {model: Club, required: true}
    ]
  }).then(function (post) {
    post.setDataValue('createdAt', moment(post.createdAt).fromNow());
    post.setDataValue('updatedAt', moment(post.updatedAt).fromNow());
    result.PostStore.readingPost = post;

    return Comment.findAll({
      limit: 5,
      include: [{
        model: Comment,
        include: [{model: User}],
        as: 'descendents',
        hierarchy: true
      }, {
        model: User
      }],
      where: {hierarchyLevel: 1, postId: post.uid}
    });
  }).then(function (comments) {
    result.PostStore.commentList = comments;

    return Club.find({where: {url: clubName}}).then(function (club) {
      if (!club) {
        return [];
      }
      return club.getPosts({
        order: [['createdAt', 'DESC']],
        include: [User, Club]
      });
    });
  }).then(function (posts) {
    _.map(posts, function (post) {
      post.setDataValue('createdAt', moment(post.createdAt).fromNow());
      post.setDataValue('updatedAt', moment(post.updatedAt).fromNow());
      return post;
    });
    result.PostStore.postList = posts;

    res.send(result);
  });
});

router.get('/', function (req, res) {
  res.json({a: 1});
});

module.exports = router;
