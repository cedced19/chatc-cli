(function($){
var lastsender = false,
              currentusr = '',
              uri = 'http://' + window.location.host,
              socket = io.connect(window.location.host);

        var displayUser = function (user) {
           if(user.username == currentusr){
            user.username = 'Me';
          }
          $('#users').append('<img src="' + user.avatar + '" id="' + user.id + '" alt="' + user.username + '" title="' + user.username + '">');
        }

        var displayMessage = function (message) {
            if(message.user.username == currentusr){
                message.user.username = 'Me';
            }else{
                $('#sound')[0].play();
            }

          $('#messages').append( '<div class="message">' + Mustache.render($('#message-template').html(), message) + '</div>' );
          $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 500);
        }

        var generateId = function () {
                 var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
                 var stringLength = 8;
                 var randomstring = "";
                 for(var i = 0; i < stringLength; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum, rnum + 1);
            }
            return randomstring;
        }



         $.getJSON(uri + '/api/', function (data) {
          for (var message in data.messages){
            displayMessage(data.messages[message]);
          }
          for (var user in data.users){
            displayUser(data.users[user]);
          }
         });

        $('#loginform').submit(function(event){
          event.preventDefault();
          var mail = $('#mail').val().replace(/ /g, ''),
          username = $('#username').val().replace(/ /g, '');
          if(username == ''){
                $('#loginform').hide();
                sweetAlert({
                    title: 'Oops...',
                    text: 'You must enter a  username!',
                    type: 'error'
                }, function () {
                    $('#loginform').show();
                });
          }else if(mail == ''){
                socket.emit('login', {username: $('#username').val(), mail: generateId()});
          }else{
                socket.emit('login', {username: $('#username').val(), mail: $('#mail').val()});
          }
          return false;
          });

        $('#msgform').submit(function(event){
          event.preventDefault();
          var message = $('#message').val().replace(/ /g, '');
          if(message == ''){
              sweetAlert('Oops...', 'You must enter a  message!', 'error');
            }else{
              socket.emit('newmsg', {message : twttr.txt.autoLink(twttr.txt.htmlEscape($('#message').val())) });
              $('#message').val('');
            }
            $('#message').focus();
            return false;
        });

        socket.on('newmsg', function(message){
          displayMessage(message);
        });

        socket.on('logged', function(){
          $('#login').fadeOut();
          currentusr = $('#username').val();
          $('#message').focus();
        });

        socket.on('newusr', function(user){
          displayUser(user);
        });

        socket.on('logerr', function(message){
            $('#loginform').hide();
            sweetAlert({
                title: 'Oops...',
                text: message,
                type: 'error'
            }, function () {
                $('#loginform').show();
            });
        });

        socket.on('disusr', function(user){
          $('#'+user.id).slideUp(100, function(){
            $('#'+user.id).remove();
          });
        });

})(jQuery);
