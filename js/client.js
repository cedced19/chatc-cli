(function($){

        var msg = $('#msgtpl').html();
        var msgline = $('#msgtpl-line').html();
        $('#msgtpl').remove();
        $('#msgtpl-line').remove();
        var lastsender = false;
        var currentusr = "";

        var socket = io.connect(window.location.host);

        $('#loginform').submit(function(event){
          event.preventDefault();

          if($('#mail').val() == ''){
                alert('Vous devez entrer un mail !');
          }else if($('#username').val() == ''){
                alert('Vous devez entrer un pseudo !');
          }else{
                socket.emit('login', {username: $('#username').val(), mail: $('#mail').val()});
                currentusr = $('#username').val();
                $('#message').focus();
          };
          return false;
          });

        $('#msgform').submit(function(event){
          event.preventDefault();
          if($('#message').val() == ''){
              alert('Vous devez entrer un message !');
            }else{
              socket.emit('newmsg', {message : twttr.txt.autoLink(twttr.txt.htmlEscape($('#message').val())) });
              $('#message').val('');
            };
            $('#message').focus();
            return false;
        });

        socket.on('newmsg', function(message){
          if(message.user.username == currentusr){
            message.user.username = "Moi";
          }else{
            $('#sound')[0].play();
          };

          if(lastsender != message.user.id){
            $('#messages').append('<div class="sep"></div>');
            $('#messages').append( '<div class="message">' + Mustache.render(msg, message) + '</div>' );
            lastsender = message.user.id;
          }else{
            $('#messages').append( '<div class="message">' + Mustache.render(msgline, message) + '</div>' );
          };

          $("#messages").animate({ scrollTop: $("#messages").prop("scrollHeight") }, 500);
        });

        socket.on('logged', function(){
          $('#login').fadeOut();
        });

        socket.on('newusr', function(user){
          if(user.username == currentusr){
            user.username = "Moi";
          }
          $('#users').append('<img src="' + user.avatar + '" id="' + user.id + '" alt="' + user.username + '" title="' + user.username + '">')
        });

        socket.on('logerr', function(message){
          alert(message);
        });

        socket.on('disusr', function(user){
          $('#'+user.id).slideUp(100, function(){
            $('#'+user.id).remove();
          });
        });


      })(jQuery);