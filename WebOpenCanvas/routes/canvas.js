var express = require('express');

function isExistUser(room, user){
  var sockets = Object.keys(room.sockets);
  for(var i = 0; i < sockets.length; i++){
    if(room.sockets[sockets[i]].info.user == user){
      return true;
    }
  }
  return false;
}

function rejectJoin(socket, code){
  socket.emit('join-reject', {
    code : code
  });
}

function sendMsg(room, socket, msg){
  room.emit('serverMsg', {
    id : socket.info.id,
    user : socket.info.user,
    msg : msg
  });
}

function changePerson(room, socket, status){
  if(status){
    room.info.person++;
    room.info.users.push({
      id : socket.info.id,
      user : socket.info.user
    });
  } else {
    room.info.person--;
    for(var i=0; i<room.info.users.length; i++){
      if(room.info.users[i] && room.info.users[i].id == socket.info.id){
        room.info.users.splice(i, 1);
      }
    }
  }
  room.emit('changePerson', {
    id : socket.info.id,
    user : socket.info.user,
    person : room.info.person,
    status : status
  });
}

module.exports = function(io){
  var router = express.Router();

  router.post('/', function(req, res) {
      var type = req.body.type;

      var ret = {};
          ret.width = req.body.width;
          ret.height = req.body.height;
          ret.person = req.body.person;
          ret.roomNo = req.body.roomNo;

      if(type && parseInt(type) > 0){
        ret.isRoom = true;

        var room = io.of(ret.roomNo);
            room.info = {};
            room.info.width = ret.width;
            room.info.height = ret.height;

            room.info.users = [];
            room.info.person = 0;
            room.info.max = ret.person;

            room.info.roomNo = ret.roomNo;
            console.log('[socket] Create a room ' + room.info.roomNo + ".");

            room.on('connection', function(socket){

              socket.info = {};
              socket.info.roomNo = room.info.roomNo;
              socket.info.id = socket.id.split('#')[1];

              if(room.info.max > room.info.person){

                socket.join(room.info.roomNo);
                console.log('[socket] Socket connected..................');

                socket.on('join', function(data){
                  if(isExistUser(room, data.user)){
                    rejectJoin(socket, 'duplicated');
                  } else {
                    socket.info.user = data.user;
                    console.log('[socket] Enter ' + socket.info.user + '(' + socket.info.id + ') in ' + room.info.roomNo + ".");
                    socket.emit('join-ok', {
                      socket : socket.info,
                      room : room.info
                    });
                    changePerson(room, socket, true);

                    socket.on('clientMsg', function(data){
                      sendMsg(room, socket, data.msg);
                    });

                    socket.on('disconnect', function(){
                      socket.leave(socket.info.roomNo);
                      changePerson(room, socket, false);
                      console.log('[socket] Exit ' + socket.info.user + '(' + socket.info.id + ') in ' + room.info.roomNo + ".");
                    });

                    socket.on('mousedown', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('mousedown', data);
                    });
                    socket.on('mousemove', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('mousemove', data);
                    });
                    socket.on('mouseup', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('mouseup', data);
                    });
                    socket.on('mouseout', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('mouseout', data);
                    });
                    socket.on('undo', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('undo', data);
                    });
                    socket.on('redo', function(data){
                      data.id = socket.info.id;
                      data.user = socket.info.user;
                      socket.broadcast.emit('redo', data);
                    });

                  }
                });

              } else {
                socket.emit('disconnection', {
                  code : 'max'
                });
              }

          });
          ret.isRoom = true;
      } else {
        ret.isRoom = false;
      }

      res.render('canvas', ret);

  });

  router.get('/:roomNo', function(req, res) {
    var room = io.of(req.params.roomNo);
    var ret = {};
    ret.isRoom = true;
    ret.width = room.info.width;
    ret.height = room.info.height;
    ret.roomNo = room.info.roomNo;
    res.render('canvas', ret);
  });
  return router;
};
