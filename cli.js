#!/usr/bin/env node
'use strict';
var md5 = require('MD5'),
      opn = require('opn'),
      express = require('express'),
      app = express(),
      serveStatic = require('serve-static'),
      path = require('path'),
      fs = require('fs'),
      chalk = require('chalk'),
      port = process.argv.slice(2);

if(port.length == 0){
    console.log(chalk.red('You must enter a port!'));
    process.exit();
}

var users = new Object(),
      messages = new Array();

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    res.end(data);
  });
});

app.get('/users', function(req, res) {
        res.json(users);
});

app.get('/messages', function(req, res) {
        res.json(messages);
});


app.use(serveStatic(__dirname));

var server = require('http').createServer(app);

server.listen(port[0], function() {
    console.log('Server running at\n  => '+ chalk.green('http://localhost:' + port) + '\nCTRL + C to shutdown');
    opn('http://localhost:' + port);
});

var io = require('socket.io').listen(server);
var users = new Object();


io.sockets.on('connection', function(socket){
    var me = false;

    socket.on('newmsg', function(message){
        message.user = me;
        message.time = getTime();
        if(messages.length > 10){
          messages.shift();
        }
        messages.push(message);
        io.sockets.emit('newmsg', message);
    });

    socket.on('login', function(user){
      var md5Mail = md5(user.mail.toLowerCase()),
      error = null;

      for(var k in users){
          if(k == md5Mail){
            error = 'This email is already in use';
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

  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
