(function (DG) {
    "use strict";

    $('.widget form input[type="radio"]').checkboxradio();
    $('.widget form input[type="checkbox"]').checkboxradio();
    $('.widget .button').button();

    $('#opt_pattern_length').spinner({
        change: function (event, ui) {
            if ($(this).spinner("value") > 32) {
                $(this).spinner("value", 32);
                return false;
            } else if ($(this).spinner("value") < 1) {
                $(this).spinner("value", 1);
                return false;
            }
            DG.patternLength = $(this).spinner("value");
        }
    });

    $('#opt_tempo').spinner({
        change: function (event, ui) {
            if ($(this).spinner("value") > 256) {
                $(this).spinner("value", 256);
                return false;
            } else if ($(this).spinner("value") < 1) {
                $(this).spinner("value", 1);
                return false;
            }
            DG.tempo = $(this).spinner("value");
        }
    });

})(window.drumgen2);