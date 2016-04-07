/**
 * Created by dobyeongsu on 2016. 4. 7..
 */
var Redis = require('ioredis');
var redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  db: 0
});

module.exports = redis;
