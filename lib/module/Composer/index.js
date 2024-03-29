/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var ComposeUser = require('./User');
var ComposePost = require('./Post');
var ComposeClub = require('./Club');
var ComposePoint = require('./Point');
var ComposeComment = require('./Comment');

// Module
module.exports = function () {
  return function (G) {
    // Public
    G.User = ComposeUser;
    G.Post = ComposePost;
    G.Club = ComposeClub;
    G.Point = ComposePoint;
    G.Comment = ComposeComment;
  };
};
