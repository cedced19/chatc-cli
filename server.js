var http = require('http');
var md5 = require('MD5')

httpServer = http.createServer(function(req, res) {
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = {};


io.sockets.on('connection', function(socket){
    var me = false;

    for (var k in users){
        socket.emit('newusr', users[k]);
    };

    socket.on('newmsg', function(message){
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();

          if(message.h < 10 ){
            message.h = '0' + message.h
          }

          if(message.m < 10 ){
            message.m = '0' + message.m
           }

        io.sockets.emit('newmsg', message);
    });

    socket.on('login', function(user){
       me = user;
       me.id = user.mail.replace('@', '-').replace('.', '-');
       me.avatar = '//gravatar.com/avatar/' + md5(user.mail) + '?s=50';
       socket.emit('logged');
       users[me.id] = me;
       io.sockets.emit('newusr', me);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
       delete users[me.id];
       io.sockets.emit('disusr', me);
    });


});