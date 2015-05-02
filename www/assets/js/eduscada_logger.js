
function setStat(key, value) {
    var display = $('.stat_' + key + '_display');
    if (display.length > 0)
        display.html(value + " segundos");//display.text(parseFloat(value).toFixed(0));

}

function syncData(logObject) {

    console.log("Sincronizando...");
    if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
        var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
        var logArrWalk = 0;
        $.each(logArr, function (key, value) {
            var localData = JSON.parse(value);
            $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
                    .done(function (rjson) {
                        if (rjson !== null) {
                            var obj = JSON.parse(rjson);
                            logArrWalk++;
                            if (logArr.length === logArrWalk) {
                                localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength = 0;
                                $("#baloon-header-logger .baloon-label").text("Você fez " + Math.round(logObject.pontuacao) + " pontos em " + Math.round(logObject.time / 1000) + " segundos.");
                                $("#baloon-header-logger").toggleClass("hidden");
                                $("#game_again").on("click", function () {
                                    $("#baloon-header-logger").toggleClass("hidden");
                                    document.getElementById(logObject.gameId).src = "games/" + logObject.gameId + "/" + logObject.gameId + ".html";
                                });
                                console.log("Ranking atualizado, jogue novamente!");
                                console.log(obj)
                                return true;
                            }

                        } else {
                            return false;
                        }
                    })
                    .fail(function (jqxhr, textStatus, error) {
                        console.log("Você parece estar off-line!");

                        return false;
                    });
        });
    } else {
        console.log("Você ainda não tem pontos nessa sessão!");
        return false;
    }
}
function saveLogObject(logObject) {

    if (typeof (Storage) !== "undefined") {

        if (localStorage.brComCognisenseEscolaDoCerebroUserProfile) {
            logProfile = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
            logObject.playerId = logProfile.playerId;
            logObject.adminId = logProfile.adminId;
            logObject.fullname = logProfile.fullname;
        }
        else {

            logObject.playerId = 0;
            logObject.fullname = 'convidado';
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
        var sync = syncData(logObject);


    }
    else {
        alert("-\(°_o)/¯ Tente com o navegador Google Chrome ou Firefox");
    }
}
