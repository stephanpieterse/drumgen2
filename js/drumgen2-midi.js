/* globals MIDI, DG */
(function (DG) {
    "use strict";
    window.onload = function () {
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: "acoustic_grand_piano",
            onprogress: function (state, progress) {
                console.log(state, progress);
            },
            onsuccess: function () {
                // playAll();
                DG.showPlayButton();
            }
        });
    };
})(window.drumgen2);

DG.playAll = function () {
    "use strict";
    var delays = DG.tempoAsMS();
    for (var n in DG.fullPattern) {

        for (var m in DG.fullPattern[n]) {

            var nChord = [];
            switch (DG.fullPattern[n][m].note) {
            case "c/4":
                nChord.push(36);
                break;
            case "c/5":
                nChord.push(38);
                break;
            case "g/5/x2":
                nChord.push(52);
                break;
            case "b/3/x2":
                nChord.push(46);
                break;
            }

            var velocity;
            var delay = n * delays / 1000;
            console.log(delay);
            if (DG.fullPattern[n][m].accent) {
                velocity = 125;
            } else {
                velocity = 75;
            }
            MIDI.setVolume(0, 127);
            MIDI.chordOn(0, nChord, velocity, delay);
            MIDI.chordOff(0, nChord, delay + 0.4);
            // (function(i, notes){
            //   setTimeout(function(){
            //     var delay = 0; // play one note every quarter second
            //     var velocity = 127; // how hard the note hits
            //     MIDI.setVolume(0, 127);
            //     MIDI.chordOn(0, notes, velocity, delay);
            //     MIDI.chordOff(0, notes, delay + 1);
            //   }, i * delays);
            // })(n, nChord);
        }
    }

};

// 36 bd   -- c/4
// 29 / 38 snare   --- c/5
// // 42 hh // 52 open    -- g/5/x2
// 46 fh    -b/3/x2