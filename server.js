var http = require("http"),
    md5 = require("MD5"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 1337;

httpServer = http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {'Content-Type': 'text/html'});
      fs.createReadStream('404.html').pipe(response);
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        fs.createReadStream('500.html').pipe(response);
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

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
          message.h = '0' + message.h;
        }

        if(message.m < 10 ){
          message.m = '0' + message.m;
        }
        io.sockets.emit('newmsg', message);
    });

    socket.on('login', function(user){
       me = user;
       me.id = md5(user.mail);
       me.avatar = '//gravatar.com/avatar/' + me.id + '?s=50';
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