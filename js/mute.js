(function($){

    var mute = $('#mute'),
          unmute = $('#unmute'),
          player= $('#sound');

          unmute.css( 'display', 'none');
          mute.css( 'display', 'block');

          mute.click(function(){
            unmute.css( 'display', 'block');
            mute.css( 'display', 'none');
            player.prop('muted', true);
          });

          unmute.click(function(){
            unmute.css( 'display', 'none');
            mute.css( 'display', 'block');
            player.prop('muted', false);
          });

})(jQuery);