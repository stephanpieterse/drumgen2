(function (DG) {
  "use strict";

  $('.widget form input[type="radio"]').checkboxradio();
  $('.widget form input[type="checkbox"]').checkboxradio();
  $('.widget .button').button();
  
  $('#opt_pattern_length').spinner({
    spin: function (event, ui) {
      if (ui.value > 32) {
        $(this).spinner("value", 1);
        return false;
      } else if (ui.value < 1) {
        $(this).spinner("value", 32);
        return false;
      }
      DG.patternLength = ui.value;
    }
  });
  
  $('#opt_tempo').spinner({
    spin: function (event, ui) {
      if (ui.value > 256) {
        $(this).spinner("value", 1);
        return false;
      } else if (ui.value < 1) {
        $(this).spinner("value", 256);
        return false;
      }
      DG.tempo = ui.value;
    }
  });

})(window.drumgen2);