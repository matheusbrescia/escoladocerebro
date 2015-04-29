$(document).ready(function ($) {
    var nRows = 8;
    var nColumns = 10;
    var nTest = 0;
    var nClicks = 0;
    var nTimeInterval = null;
    var nTimeToStart = 30000;
    var nTimeToTest = 10000;
    var nLevel = 1;
    var nPoints = [];
    var nPeaces = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var bugs = false;
    function log(t) {
        console.log(t);
    }
    function gamePscicotest() {
        nPeaces = [];
        nTest++;
        var peaces = [];
        for (var i = 0; i < 22; i++) {
            peaces.push({"value": ("peaces_" + i), "state": false});
        }
        while (nPeaces.length < 3) {
            var randomnumber = Math.floor((Math.random() * 22) + 0);
            var found = false;
            for (var i = 0; i < nPeaces.length; i++) {
                if (nPeaces[i] == randomnumber) {
                    found = true;
                    break
                }
            }
            if (!found)
                nPeaces[nPeaces.length] = randomnumber;
        }

        var board = [];
        for (var i = 0; i < 10; i++) {
            if (nLevel == 1) {
                board.push(peaces[nPeaces[0]]);
            }
            if (nLevel == 2) {
                if (i < 5) {
                    board.push(peaces[nPeaces[0]]);
                } else {
                    board.push(peaces[nPeaces[1]]);
                }

            }
            if (nLevel == 3) {
                if (i < 4) {
                    board.push(peaces[nPeaces[0]]);
                }
                if (i >= 4 && i < 7) {
                    board.push(peaces[nPeaces[1]]);
                }
                if (i >= 7) {
                    board.push(peaces[nPeaces[2]]);
                }
            }
        }
        if (nLevel == 1) {
            peaces.splice(peaces[nPeaces[0]], 1);
        }
        if (nLevel == 2) {
            peaces.splice(peaces[nPeaces[0]], 1);
            peaces.splice(peaces[nPeaces[1]], 1);
        }
        if (nLevel == 3) {
            peaces.splice(peaces[nPeaces[0]], 1);
            peaces.splice(peaces[nPeaces[1]], 1);
            peaces.splice(peaces[nPeaces[2]], 1);
        }

        for (var i = 0; i < 70; i++) {
            if (nLevel == 1) {
                board.push(peaces[Math.floor((Math.random() * 21) + 0)]);
            }
            if (nLevel == 2) {
                board.push(peaces[Math.floor((Math.random() * 20) + 0)]);
            }
            if (nLevel == 3) {
                board.push(peaces[Math.floor((Math.random() * 19) + 0)]);
            }
        }
        board.sort(function () {
            return .5 - Math.random();
        });
        var nBreak = (nColumns - 1);
        var gamePage = "<div class=\"layout\" id=\"layout\">";
        $.each(board, function (i) {
            var str = board[i].value;
            var res = str.split("_");

            if ((i % nColumns) == 0) {
                gamePage += '<div class="row">';
            }
            gamePage += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">';
            gamePage += '<button type="button" data-toggle="button"  class="btn btn-primary btn-board ">' + res[1] + '<img src="/assets/img/pattern_1/ts' + res[1] + '.png" </img></button></div>';

            if ((i % nColumns) == nBreak) {
                gamePage += "</div> ";
            }

        });
        gamePage += " </div>";
        if (nLevel == 1) {
            $(".peaces-logo").html("");
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[0] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[0] + '.png" </img></button></div>');

        }
        if (nLevel == 2) {
            $(".peaces-logo").html("");
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[1] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[0] + '.png" </img></button></div>');
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[1] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[1] + '.png" </img></button></div>');

        }
        if (nLevel == 3) {
            $(".peaces-logo").html("");
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[0] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[0] + '.png" </img></button></div>');
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[1] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[1] + '.png" </img></button></div>');
            $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + nPeaces[2] + '" class="btn btn-primary ">   <img src="/assets/img/pattern_1/ts' + nPeaces[2] + '.png" </img></button></div>');

        }

        $("#board").html(gamePage);
        $(".btn-board").on("click", function (e) {
            nClicks++;
            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();

            if (nLevel == 1) {
                if (nPeaces[0] == $(this).text()) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            if (nLevel == 2) {
                if ((nPeaces[0] == $(this).text()) || (nPeaces[1] == $(this).text())) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            if (nLevel == 3) {
                if ((nPeaces[0] == $(this).text()) || (nPeaces[1] == $(this).text()) || (nPeaces[2] == $(this).text())) {
                    nPoints.push($(this).text());
                    $("#points").text(nPoints.length);
                }
            }
            $(".total_points").text(nPoints.length);
            $(".total_clicks").text(nClicks);
            log("nPoints.length " + nPoints.length)
            log("nClicks " + nClicks)
        });
        log("gamePscicotest nTest" + nTest)
    }
    function gameStop() {
        log("stop");
        clearInterval(nTimeInterval);
        $("#board").hide();
        $(".peaces-logo").html("");
    }
    function gameStart() {
        $("#board").show();
        $(".teste_model").hide();
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        gameRunner();
        nTimeInterval = setInterval(function () {
            gameRunner();
        }, nTimeToTest);
    }
    function gameRunner() {

        if (nTest == 5 && nLevel < 2) {
            gameStop();
            $("#test_model_2").show();
            nLevel = 2;
            setTimeout(gameStart, nTimeToStart);
            return true;
        }
        if (nTest == 10 && nLevel < 3) {
            gameStop();
            $("#test_model_3").show();
            nLevel = 3;
            setTimeout(gameStart, nTimeToStart);
            return true;
        }
        if (nTest == 15) {
            nTest++;
            gameStop();
            $("#test_model_end").show();
            nPlay = false;
            onAnimateComplete();
            return true;
        }
        if (nTest < 15) {
            gamePscicotest();

        }

    }
    function gameTime() {

        var endTime = new Date();

        var timeDiff = endTime - nStartTime;

        if (nPlay) {
            $("#time").text(millisecondsToTime(timeDiff));
            $(".total_times").text(millisecondsToTime(timeDiff));

            setTimeout(gameTime, 1000);
        }
        // $('.progress-bar').css('width', 100*( seconds/30)+'%').attr('aria-valuenow', 100*(seconds/30));
    }
    function onAnimateComplete() {
        var avgInterval = 0;
        var duration = new Date() - nStartTime;
        for (var i = 0; i < nClickIntervals.length; i++) {
            avgInterval += nClickIntervals[i];
        }
        avgInterval = avgInterval / nClickIntervals.length;

        var dp = 0;
        for (var i = 0; i < nClickIntervals.length; i++) {
            dp += Math.pow(nClickIntervals[i] - avgInterval, 2);
        }
        dp = Math.pow(dp / nClickIntervals.length - 1, 0.5);

        var logObject = {
            acuracia: ((nRows * nColumns) / (nPoints.length - 1)),
            velocidade: ((nRows * nColumns) / (duration / 1000)),
            estabilidade: (1 / (dp)),
            time: duration,
            success: true,
            level: nLevel
        };

        var dMult = [40, 60, 100];
        logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[nLevel];
        logObject.gameId = "attention";
        logObject.timestamp = (new Date()).getTime();
        logObject['memoria'] = logObject.pontuacao * 1;
        logObject['visuo_espacial'] = logObject.pontuacao * 1;
        logObject['resolucao_problemas'] = logObject.pontuacao * 1;
        logObject['psico_motora'] = logObject.pontuacao * 1;
        logObject['logico_matematica'] = logObject.pontuacao * 1;
        logObject['linguagem'] = logObject.pontuacao * 1;

        var tr;
        var text = "Parabéns! Seu tempo foi de:  " + duration + "";

        clearTimeout(tr);
        tr = setTimeout(function () {
            log(text)
        }, 2000);

        try {
            window.parent.saveLogObject(logObject);
        }
        catch (e) {
            $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(logObject)})
                    .done(function (rjson) {
                        if (rjson !== null) {
                            var obj = JSON.parse(rjson);
                            console.log("Ranking OFF atualizado, jogue novamente!");
                            console.log(obj)
                        } else {
                            return false;
                        }
                    })
                    .fail(function (jqxhr, textStatus, error) {
                        console.log("Você parece estar off-line!");

                        return false;
                    });

        }
    }
    function millisecondsToTime(milli) {
        var milliseconds = milli % 1000;
        var seconds = Math.floor((milli / 1000) % 60);
        var minutes = Math.floor((milli / (60 * 1000)) % 60);
        return minutes + ":" + seconds;
    }
    $("#btn_start_test").on("click", function () {

        $(".hello").hide();
        $("#test_model_1").show();
        $("#navbar-T ul").removeClass("hidden");
        nStartTime = new Date();
        nLastClickTime = new Date();
        setTimeout(gameStart, nTimeToStart);
        setTimeout(gameTime, 1000);
    });
    $(".btn-toggle .btn").on("click", function () {
        $(".btn-toggle .btn").toggleClass("active")
        if ($(this).text() == "TESTE") {
            alert("MODO TESTE: passando as atividades rapidinho")
            nTimeToStart = 3000;
            nTimeToTest = 3000;
            bugs = true;
        } else {
            alert("MODO APLICAÇÃO: vá em frente, 30s para instrução e 10s para resposta")
            nTimeToStart = 30000;
            nTimeToTest = 10000;
            bugs = false;
        }
    });
    $(".teste_model").hide();

});