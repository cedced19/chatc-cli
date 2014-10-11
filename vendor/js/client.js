(function($){

        var msg = $('#msgtpl').html(),
              msgline = $('#msgtpl-line').html(),
              lastsender = false,
              currentusr = '',
              uri = 'http://' + window.location.host,
              socket = io.connect(window.location.host);

        $('#msgtpl').remove();
        $('#msgtpl-line').remove();

         $.getJSON(uri + '/users', function (users) {
          for (var user in users){
            displayUser(users[user]);
          }
         });


         $.getJSON(uri + '/messages', function (messages) {
          for (var message in messages){
            displayMessage(messages[message]);
          }
         });

        $('#loginform').submit(function(event){
          event.preventDefault();
          var mail = $('#mail').val().replace(/ /g, ''),
          username = $('username').val().replace(/ /g, '');
          if(mail == ''){
                sweetAlert('Oops...', 'You must enter a  mail!', 'error');
          }else if(username == ''){
                sweetAlert('Oops...', 'You must enter a nickname!', 'error');
          }else{
                socket.emit('login', {username: $('#username').val(), mail: $('#mail').val()});
          };
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
            };
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
          sweetAlert('Oops...', message, 'error');
        });

        socket.on('disusr', function(user){
          $('#'+user.id).slideUp(100, function(){
            $('#'+user.id).remove();
          });
        });

        function displayUser (user) {
           if(user.username == currentusr){
            user.username = 'Me';
          }
          $('#users').append('<img src="' + user.avatar + '" id="' + user.id + '" alt="' + user.username + '" title="' + user.username + '">');
        }

        function displayMessage (message) {
           if(message.user.username == currentusr){
            message.user.username = 'Me';
          }else{
            $('#sound')[0].play();
          }

          if(lastsender != message.user.id){
            $('#messages').append('<div class="sep"></div>');
            $('#messages').append( '<div class="message">' + Mustache.render(msg, message) + '</div>' );
            lastsender = message.user.id;
          }else{
            $('#messages').append( '<div class="message">' + Mustache.render(msgline, message) + '</div>' );
          }
          $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 500);
        }



      })(jQuery);