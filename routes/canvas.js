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
  } else {
    room.info.person--;
  }
  room.emit('changePerson', {
    id : socket.info.id,
    user : socket.info.user,
    person : room.info.person,
    status : status
  });
}

// on : connection : 접속
// - join : 대화명 등록
// join-ok -> chat셋, canvas셋, layer셋
// join-reject -> alert
//
//
// chat set - sockets 인포 가져오기
//
// sysMsg
// sendMsg
// receiveMsg
//
// canvas
//
// mousemove
// mouseout
// mousedown
// mouseup
// undo
// redo
//
//
// layer
// addUser
// removeUser
// isMovableLayer
// moveLayer
// (나중) addLayer
// (나중) removeLayer

module.exports = function(io){
  var router = express.Router();

  router.post('/', function(req, res) {
      var type = req.body.type;

      var ret = {};
          ret.width = req.body.width;
          ret.height = req.body.height;
          ret.person = req.body.person;

      if(type && parseInt(type) > 0){
        ret.isRoom = true;
        ret.roomNo = generateRoom(io);

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
                console.log('[socket] Socket connected..................');

                socket.join(room.info.roomNo);
                socket.on('join', function(data){
                  if(isExistUser(room, data.user)){
                    rejectJoin(socket, 'duplicated');
                  } else {
                    console.log('[socket] Enter ' + socket.info.user + '('+ socket.info.id +') in ' + room.info.roomNo + ".");
                    socket.info.user = data.user;
                    socket.emit('join-ok', socket.info);
                    changePerson(room, socket, true);
                  }
                });

                socket.on('clientMsg', function(data){
                  sendMsg(room, socket, data.msg);
                });

              } else {
                socket.emit('disconnection', {
                  code : 'max'
                });
              }



              room.on('disconnection', function(socket){
                var info = socket.info;
                socket.leave(info.roomNo);
                changePerson(room, socket, false);
                console.log('[socket] Exit ' + socket.info.user + '('+ socket.info.id +') in ' + room.info.roomNo + ".");

                if(room.info.person){
                  // http://stackoverflow.com/questions/33304856/how-to-remove-io-onconnection-listener
                  room.removeListener('connection', connectionHandler);
                }
              });

            socket.on('mousedown', function(data){
              data.id = socket.info.id;
              data.user = socket.info.user;
              room.broadcast('mousedown', data);
            });
            socket.on('mousemove', function(data){
              data.id = socket.info.id;
              data.user = socket.info.user;
              room.broadcast('mousemove', data);
            });
            socket.on('mouseup', function(data){
              data.id = socket.info.id;
              data.user = socket.info.user;
              room.broadcast('mouseup', data);
            });
            socket.on('mouseout', function(data){
              data.id = socket.info.id;
              data.user = socket.info.user;
              room.broadcast('mouseout', data);
            });

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
