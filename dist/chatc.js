#!/usr/bin/env node
'use strict';
var md5 = require('MD5'),
      opn = require('opn'),
      express = require('express'),
      app = express(),
      serveStatic = require('serve-static'),
      path = require('path'),
      fs = require('fs'),
      program = require('commander'),
      pkg = require('./package.json'),
      colors = require('colors'),
      port = 7770;

program
  .version(pkg.version)
  .option('-p, --port [number]', 'specified the port')
  .parse(process.argv);

var users = {},
    messages = [];

app.get('/api/users', function(req, res) {
        res.json(users);
});

app.get('/api/messages', function(req, res) {
        res.json(messages);
});


app.use(serveStatic(__dirname));

var server = require('http').createServer(app);

if (!isNaN(parseFloat(program.port)) && isFinite(program.port)){
    port = program.port;
}

server.listen(port, function() {
    require('check-update')({packageName: pkg.name, packageVersion: pkg.version, isCLI: true}, function(err, latestVersion, defaultMessage){
        if(!err){
            console.log(defaultMessage);
        }
    });
    console.log('Server running at\n  => '+ colors.green('http://localhost:' + port) + '\nCTRL + C to shutdown');
    opn('http://localhost:' + port);
});

var io = require('socket.io').listen(server);
var users = {};


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

var getTime = function (){
  var date = new Date(),
    h = date.getHours(),
    m = date.getMinutes();

  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};
