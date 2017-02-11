// Polyfill for older browsers
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, fromIndex) {
        if (fromIndex == null) {
          fromIndex = 0;
        }
        else if (fromIndex < 0) {
          fromIndex = Math.max(0, this.length + fromIndex);
        }

        for (var i = fromIndex, j = this.length; i < j; i++) {
          if (this[i] === obj)
            return i;
        }

        return -1;
    };
}

function compatibilityCheck() {
    if (!Raphael.svg) return false;
    if (!Modernizr.audio) return false;
    if (!Modernizr.fontface) return false; //Not strictly necessary, could issue a warning
    return true;
}

$(window).on('load', function() {
  $('#loading').hide();
  
  if (compatibilityCheck()) {
    game = new Game();
    game.menu();
  }
  else {
    $('.unsupported-banner').show();
  }
});
