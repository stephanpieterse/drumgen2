/* globals Vex */
var VF = Vex.Flow;
window.drumgen2 = window.drumgen2 || {};
var DG = window.drumgen2;

/* ENUMS AND SUCH */
(function (DG) {
    "use strict";

    DG.MODES = {
        RUDIMENTS: 1,
        PATTERNS: 2
    };

    DG.LIMBS = {
        RIGHTHAND: 1,
        LEFTHAND: 2,
        RIGHTFOOT: 3,
        LEFTFOOT: 4
    };

    DG.accentGenerator = function (pattern) {
        var current = -1;
        return {
            next: function () {
                current += 1;
                if (current >= pattern.length) {
                    current = 0;
                }
                return pattern[current];
            },
            valueOf: function () {
                return pattern;
            }
        };
    };

})(DG);

/* FUNCTIONS AND SUCH */
(function (DG) {
    "use strict";

    DG.init = function () {
        DG.signatureNumerator = "4";
        DG.signatureDenominator = "4";
        DG.tempo = 120;
        DG.mode = DG.MODES.PATTERNS;
        DG.accents = false;
        DG.patternLength = 8;
        DG.limbsActive = {};

        for (var j in DG.LIMBS) {
            DG.limbsActive[DG.LIMBS[j]] = true;
        }

    };

    DG.tempoAsMS = function () {
        var retVal = DG.tempo / 60;
        console.log(retVal);
        retVal = 100 / retVal;
        console.log(retVal);
        retVal = retVal * 10;
        console.log(retVal);
        return retVal;
    };

    DG.setMode = function (newMode) {
        DG.mode = newMode;
        switch (DG.mode) {
        case DG.MODES.RUDIMENTS:
            $('#DGlimbs').hide();
            break;
        case DG.MODES.PATTERNS:
            $('#DGlimbs').show();
            break;
        }
    };

    DG.switchAccents = function () {
        DG.accents = !DG.accents;
    };

    DG.switchLimb = function (limb) {
        DG.limbsActive[limb] = !DG.limbsActive[limb];
    };

    DG.getNewPatternSet = function () {
        var patterns = {
            notePattern: DG.getNewPattern(DG.patternLength),
            rudimentPattern: DG.getNewPattern(DG.patternLength),
            accentPattern: DG.getNewPattern(DG.patternLength)
        };
        return patterns;
    };

    DG.getNewPattern = function (plen) {
        var newPat = "";

        while (newPat.length < plen) {
            newPat += "" + Math.round((Math.random())); //   Math.round((Math.random() * max) + min);
        }

        return newPat;
    };

    DG.straightPattern = function (plen, char) {
        var newPat = "";

        while (newPat.length < plen) {
            newPat += "" + char;
        }

        return newPat;
    };

    DG.VFUtils = {
        newArticulation: function (s) {
            return new VF.Articulation(s).setPosition(VF.Modifier.Position.ABOVE);
        },
        newAnnotation: function (text) {
            return new VF.Annotation(text).setFont("Times", "12", "italic");
        },
        newBasicNote: function (note, duration, rest) {
            var noteOpts = {};
            if (rest) {
                return new VF.StaveNote({
                    clef: "percussion",
                    keys: [note.substring(0, 3)],
                    duration: duration + "r",
                    auto_stem: true
                });
            } else {
                return new VF.StaveNote({
                    clef: "percussion",
                    keys: [note],
                    duration: duration + "",
                    auto_stem: true
                });
            }

        },
        newBasicChord: function (notes, duration) {
            return new VF.StaveNote({
                clef: "percussion",
                keys: notes.sort(),
                duration: duration + "",
            });
        }
    };


    DG.rudimentsFromPattern = function (patterns, noteName, noteDuration) {
        var newNotes = [];
        noteName = noteName || "c/5";

        var notePattern = patterns.notePattern || DG.straightPattern(25, "1");
        var rudimentPattern = patterns.rudimentPattern || DG.straightPattern(25, "0");
        var accentPattern = patterns.accentPattern || DG.straightPattern(25, "0");

        for (var j = 0; j <= notePattern.length; j++) {
            var rudiAnnot = "";

            switch (rudimentPattern[j]) {
            case '0':
                rudiAnnot = "L";
                break;
            case '1':
                rudiAnnot = "R";
                break;
            }

            switch (notePattern[j]) {
            case '0':
                newNotes.push(DG.VFUtils.newBasicNote(noteName, noteDuration, true));
                break;
            case '1':
                var finPat = DG.VFUtils.newBasicNote(noteName, noteDuration);
                finPat = finPat.addAnnotation(0, DG.VFUtils.newAnnotation(rudiAnnot, 1, j));
                if (DG.accents && accentPattern[j] === '1') {
                    finPat = finPat.addArticulation(0, DG.VFUtils.newArticulation("a>"));
                }
                newNotes.push(finPat);
                break;
            }
        }

        return newNotes;
    };

    DG.notesFromPattern = function (patterns, noteName, noteDuration) {
        var newNotes = [];
        noteName = noteName || "c/5";
        var j = 0;

        var notePattern = patterns.notePattern || DG.straightPattern(25, "1");
        var rudimentPattern = patterns.rudimentPattern || DG.straightPattern(25, "0");
        var accentPattern = patterns.accentPattern || DG.straightPattern(25, "0");
        var accGen = DG.accentGenerator(patterns.accentPattern || DG.straightPattern(25, "0"));

        for (j = 0; j <= notePattern.length; j++) {
            switch (notePattern[j]) {
            case '0':
                newNotes.push(DG.VFUtils.newBasicNote(noteName, noteDuration, true));
                break;
            case '1':
                var finPat = DG.VFUtils.newBasicNote(noteName, noteDuration);
                if (DG.accents && accGen.next() === '1') {
                    finPat = finPat.addArticulation(0, DG.VFUtils.newArticulation("a>"));
                }
                newNotes.push(finPat);
                break;
            }
        }

        return newNotes;
    };

    DG.getConsolidatedVoice = function (noteDuration) {

        var newNotes = [];
        for (var j = 0; j < DG.fullPattern.length; j++) {
            if (DG.fullPattern[j].length !== 0) {
                var chordNotes = [];
                for (var k in DG.fullPattern[j]) {
                    chordNotes.push(DG.fullPattern[j][k].note);
                }
                newNotes.push(DG.VFUtils.newBasicChord(chordNotes, noteDuration));
            } else {
                newNotes.push(DG.VFUtils.newBasicNote("c/5", noteDuration, true));
            }
        }

        return newNotes;
    };

    DG.fillPattern = function (patterns, noteName) {
        var newNotes = [];
        noteName = noteName || "c/5";
        var j = 0;

        var notePattern = patterns.notePattern || DG.straightPattern(25, "1");
        var rudimentPattern = patterns.rudimentPattern || DG.straightPattern(25, "0");
        var accentPattern = patterns.accentPattern || DG.straightPattern(25, "0");
        var accGen = DG.accentGenerator(patterns.accentPattern || DG.straightPattern(25, "0"));

        for (j = 0; j <= notePattern.length; j++) {
            switch (notePattern[j]) {
            case '0':
                // DG.fullPattern[j].push(noteName + "");
                break;
            case '1':
                var tmpPush = {
                    note: noteName + ""
                };
                if (DG.accents) {
                    tmpPush.accent = accGen.next();
                }
                DG.fullPattern[j].push(tmpPush);
                break;
            }
        }

        return true;
    };

    DG.cleanFillArray = function () {
        for (var p = 0; p <= DG.patternLength; p++) {
            if (DG.fullPattern[p].length > 1) {
                // remove all rests i guess
            }
        }
    };

    DG.clearChart = function () {
        var div = document.getElementById("mainstave");
        div.innerHTML = "";
    };

    DG.drawChart = function () {
        DG.clearChart();
        var div = document.getElementById("mainstave");
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        DG.fullPattern = [];

        for (var p = 0; p < DG.patternLength; p++) {
            DG.fullPattern[p] = [];
        }

        // Configure the rendering context.
        renderer.resize(800, 400);
        var context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        var totalStaves = 0;
        for (var l in DG.limbsActive) {
            if (DG.limbsActive[l]) {
                totalStaves += 1;
            }
        }

        DG.staves = [];
        for (var s = 0; s < totalStaves; s++) {
            var tmpStave = new VF.Stave(10, 75*(s), 700);

            tmpStave.addClef("percussion").addTimeSignature(DG.patternLength + "/" + DG.signatureDenominator);

            tmpStave.setConfigForLines([{
                visible: false
            }, {
                visible: false
            }, {
                visible: true
            }, {
                visible: false
            }, {
                visible: false
            }]).setContext(context).draw();
            DG.staves.push(tmpStave);
        }
        // Create a stave of width 400 at position 10, 40 on the canvas.
        // var stave = new VF.Stave(10, 40, 700);
        // DG.stave = stave;

        // stave.addClef("percussion").addTimeSignature(DG.signatureNumerator + "/" + DG.signatureDenominator);
        // stave.addClef("percussion").addTimeSignature(DG.patternLength + "/" + DG.signatureDenominator);
        // 
        // stave.setConfigForLines([{
        //     visible: false
        // }, {
        //     visible: false
        // }, {
        //     visible: true
        // }, {
        //     visible: false
        // }, {
        //     visible: false
        // }]).setContext(context).draw();

        var voices = [];
        var notes = [];

        switch (DG.mode) {
        case DG.MODES.RUDIMENTS:
            notes = DG.rudimentsFromPattern(DG.getNewPatternSet(), "f/4", 4);

            voices = [
                new VF.Voice({
                    num_beats: DG.patternLength,
                    beat_value: 4
                }).addTickables(notes)
            ];

            break;

        case DG.MODES.PATTERNS:
            var n = 0;
            var patSet;
            if (DG.limbsActive[DG.LIMBS.RIGHTHAND]) {
                patSet = DG.getNewPatternSet();
                notes = DG.notesFromPattern(patSet, "g/5/x2", 4);
                DG.fillPattern(patSet, "g/5/x2", 4);

                voices.push(new VF.Voice({
                    num_beats: DG.patternLength,
                    beat_value: 4
                }).addTickables(notes));
            }
            if (DG.limbsActive[DG.LIMBS.LEFTHAND]) {
                patSet = DG.getNewPatternSet();
                notes = DG.notesFromPattern(patSet, "c/5", 4);
                DG.fillPattern(patSet, "c/5", 4);
                voices.push(new VF.Voice({
                    num_beats: DG.patternLength,
                    beat_value: 4
                }).addTickables(notes));
            }
            if (DG.limbsActive[DG.LIMBS.RIGHTFOOT]) {
                patSet = DG.getNewPatternSet();
                notes = DG.notesFromPattern(patSet, "c/4", 4);
                DG.fillPattern(patSet, "c/4", 4);

                voices.push(new VF.Voice({
                    num_beats: DG.patternLength,
                    beat_value: 4
                }).addTickables(notes));
            }
            if (DG.limbsActive[DG.LIMBS.LEFTFOOT]) {
                patSet = DG.getNewPatternSet();
                notes = DG.notesFromPattern(patSet, "b/3/x2", 4);
                DG.fillPattern(patSet, "b/3/x2", 4);

                voices.push(new VF.Voice({
                    num_beats: DG.patternLength,
                    beat_value: 4
                }).addTickables(notes));
            }
            break;
        }
        console.log(DG.fullPattern);
        voices = [new VF.Voice({
            num_beats: DG.patternLength,
            beat_value: 4
        }).addTickables(DG.getConsolidatedVoice(4))];
        console.log(DG.getConsolidatedVoice(4));
        // var formatter = new VF.Formatter().joinVoices(voices).format(voices, 650);

        // Render voices
        // voices.forEach(function(v) {
        //   v.draw(context, stave);
        // });

        var notesToDraw = DG.getConsolidatedVoice(16);

        var beams = VF.Beam.generateBeams(notesToDraw, {
            beam_rests: true,
            beam_middle_only: true
        });

        for(var v in DG.staves){
          VF.Formatter.FormatAndDraw(context, DG.staves[v], notesToDraw);
          beams.forEach(function (b) {
              b.setContext(context).draw();
          });
        }
        // VF.Formatter.FormatAndDraw(context, stave, notesToDraw);
        // beams.forEach(function (b) {
        //     b.setContext(context).draw();
        // });

    };

    DG.showPlayButton = function () {
        $('#playButton').show();
    };

})(DG);

DG.init();
DG.drawChart();