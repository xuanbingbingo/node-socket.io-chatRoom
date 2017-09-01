//服务器及页面部分
var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  users=[];//保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
server.listen(8080);
//socket部分
io.on('connection', function(socket) {
  //昵称设置
  socket.on('login', function(nickname) {
    if (users.indexOf(nickname) > -1) {
      socket.emit('nickExisted');
    } else {
      socket.userIndex = users.length;
      socket.nickname = nickname;
      users.push(nickname);
      socket.emit('loginSuccess');
      io.sockets.emit('system', nickname, users.length, 'login'); //向所有连接到服务器的客户端发送当前登陆用户的昵称
    };
  });
  socket.on('postMsg', function(msg) {
        //将消息发送到除自己外的所有用户
        // io.sockets.emit('newMsg', socket.nickname, msg);
        socket.broadcast.emit('newMsg', socket.nickname, msg);
    });
});
