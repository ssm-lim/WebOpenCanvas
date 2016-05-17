var express = require('express');

function generateId(param){
    var len = param || 5;
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    return id;
}

function generateRoom(io){
  var room = generateId(7);
  while(io.nsps['/' + room]){
    room = generateId(7);
  }
  return room;
}

module.exports = function(io){
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var ret = {};
    ret.roomNo = generateRoom(io);

    res.render('index', ret);
  });

  return router;
};
