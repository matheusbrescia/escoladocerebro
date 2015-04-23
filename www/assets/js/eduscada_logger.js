 
function setStat(key, value) {
    var display = $('.stat_' + key + '_display');
    if (display.length > 0)
        display.html(value + " segundos");//display.text(parseFloat(value).toFixed(0));

}

function saveLogObject(logObject) {

    if (logObject.gameId !== "memos" && logObject.gameId !== "genius") {
        document.getElementById(logObject.gameId).src = "games/" + logObject.gameId + "/" + logObject.gameId + ".html";
        setStat('numMoves', 0);
        setStat('runningTime', 0);
    }
  
    if (typeof (Storage) !== "undefined") {

        if (localStorage.brComCognisenseEscolaDoCerebroUserProfile) {
            logProfile = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
            logObject.playerId = logProfile.playerId;
            logObject.adminId = logProfile.adminId;
            logObject.fullname = logProfile.fullname;
        }
        else {

            logObject.playerId = 0;
            logObject.fullname = '';
            logObject.adminId = 138;
        }
       
        if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
            localStorage.brComCognisenseEscolaDoCerebroLogObjectArr += "|" + JSON.stringify(logObject);
            console.log("Parabéns, você fez " + Math.round(logObject.pontuacao) + " pontos nessa partida.");

            //  $(".icone-" + logObject.gameId).trigger("click");
        }
        else {
            localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = JSON.stringify(logObject);
            // $(".icone-" + logObject.gameId).trigger("click");
            console.log("Parabéns, você fez " + Math.round(logObject.pontuacao) + " pontos nessa partida.");
        }
 
    }
    else {
        alert("-\(°_o)/¯ Tente com o navegador Google Chrome ou Firefox");
    }



}


//        (function (i, s, o, g, r, a, m) {
//            i['GoogleAnalyticsObject'] = r;
//            i[r] = i[r] || function () {
//                (i[r].q = i[r].q || []).push(arguments)
//            }, i[r].l = 1 * new Date();
//            a = s.createElement(o),
//                    m = s.getElementsByTagName(o)[0];
//            a.async = 1;
//            a.src = g;
//            m.parentNode.insertBefore(a, m)
//        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//
//        ga('create', 'UA-5156382-22', 'escoladocerebro.org');
//        ga('send', 'pageview');
