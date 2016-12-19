(function (DG, analytics) {
    "use strict";

    var demoObject = {
      // userId = auto;
      action: "Generate",
      mode: "",
      length: "",
    };

    var serverUrl = "http://178.62.52.233:7001/analytics";

    function randomString(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    analytics.getLocalUserId = function () {
        if (window.sessionStorage.dg2_user_id) {
            analytics.userId = window.sessionStorage.dg2_user_id;
        } else {
            var tmpId = randomString(32);
            console.log(tmpId);
            window.sessionStorage.dg2_user_id = tmpId;
            analytics.userId = tmpId;
        }
    };

    analytics.send = function (dataset) {
        dataset = dataset || {};
        dataset.userId = analytics.userId;
        
        $.post(serverUrl, dataset).done(function (retdata) {
            console.log(retdata);
        }).catch(function (errdata) {
            console.log(errdata);
        });
    };

    analytics.init = function () {
        analytics.getLocalUserId();
        
        
        analytics.send({action: "PageLoad"});
        
        $('#playButton').click(function(){
          var data = {};
          data.action = "Play";
        
          analytics.send(data);
        });
        
        $('#generateButton').click(function(){
          var data = {};
          data.action = "Generate";
          data.mode = DG.mode;
          data.limbs = DG.limbsActive;
          data.patLen = DG.patternLength;
          data.accents = DG.accents;
          analytics.send(data);
        });
    };

    analytics.init();

})(window.drumgen2, window.drumgen2.analytics = window.drumgen2.analytics || {});