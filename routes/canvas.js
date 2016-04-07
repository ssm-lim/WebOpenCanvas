var express = require('express');

module.exports = function(io){
  var router = express.Router();

  io.on('connection', function(socket){
    console.log('ㅇㅅㅇ/ 소켓 연결');

    socket.on('mousedown', function(data){
      console.log('mousedown');
      socket.emit('mousedown', data);
    });
    socket.on('mousemove', function(data){
      socket.emit('mousemove', data);
    });
    socket.on('mouseup', function(data){
      socket.emit('mouseup', data);
    });

  });


  router.get('/', function(req, res) {
      var width = req.query.width,
          height = req.query.height,
          person = req.query.person,
          ret = {};

      if(parseInt(person) > 2){
        ret.isParty = true;
      } else {
        ret.isParty = false;
      }

      ret.width = width;
      ret.height = height;

      res.render('canvas', ret);

  });

  return router;
};
