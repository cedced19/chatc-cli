var md5 = require("MD5"),
      fastHttp = require("fast-http"),
      port = process.argv[2] || 1337;

httpServer = fastHttp(port).listen(parseInt(port, 10));
console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

var io = require('socket.io').listen(httpServer);
var users = {};


io.sockets.on('connection', function(socket){
    var me = false;

    for (var k in users){
        socket.emit('newusr', users[k]);
    };

    socket.on('newmsg', function(message){
        message.user = me;
        message.time = getTime();
        io.sockets.emit('newmsg', message);
    });

    socket.on('login', function(user){
      var md5Mail = md5(user.mail.toLowerCase()),
      error = null;

      for(var k in users){
          if(k == md5Mail){
            error = "Cette email est déjà utilisé";
          }
      }

      if(error !== null){
        socket.emit('logerr', error);
      }else{
       me = user;
       me.id = md5Mail;
       me.avatar = '//gravatar.com/avatar/' + me.id + '?s=50';
       socket.emit('logged');
       users[me.id] = me;
       io.sockets.emit('newusr', me);
    }
  });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
       delete users[me.id];
       io.sockets.emit('disusr', me);
    });
});

function getTime(){
  var date = new Date(),
    h = date.getHours(),
    m = date.getMinutes();

  return (h < 10 ? "0" : "") + h + ':' + (m < 10 ? "0" : "") + m;
}
