$(document).ready(function ($) {
    var nRows = 1;
    var nColumns = 4;
    var nTest = 0;
    var nTestPeaces = 11;
    var nClicks = 0;
    var nTimeInterval = null;
    var nLevel = 1;
    var nPoints = [];
    var peaces = [];
    var clone_peaces = [];
    var nPlay = true;
    var nStartTime = new Date();
    var nLastClickTime = new Date();
    var nClickIntervals = [];
    var bugs = false;
    function log(t) {
        console.log(t);
    }
    function gamePscicotest() {
        var board = [];
        var nBreak = (nColumns - 1);
        var p = peaces[nTest].value.split("_");
        if (nTest > 5) {
            nLevel = 2;
               $("#state").text(nLevel);
        }
        $(".peaces-logo").html("");
        $(".peaces-logo").append('<button type="button" data-toggle="button" id="cur_' + peaces[nTest].value + '" class="btn btn-primary ">   <img src="/assets/img/pattern_3/ts' + p[1] + '.png" </img></button></div>');
        for (var i = 0; i < 4; i++) {
            board.push(i + 1);
        }
        if (bugs) {
            log(JSON.stringify(board))
        } else {
            board.sort(function () {
                return .5 - Math.random();
            });
        }
        var gamePage = "<div class=\"layout\" id=\"layout\">";
        $.each(board, function (i) {
            var str = board[i];

            if ((i % nColumns) == 0) {
                gamePage += '<div class="row">';
            }
            gamePage += '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">';
            gamePage += '<button type="button" data-toggle="button"   class="btn btn-primary btn-board">' + str + '<img src="/assets/img/pattern_3/ts' + nTest + '_' + str + '.png" </img></button></div>';

            if ((i % nColumns) == nBreak) {
                gamePage += "</div> ";
            }

        });
        gamePage += " </div>";
        $("#board").html(gamePage);
        $(".btn-board").on("click", function (e) {

            $(this).prop('disabled', true);
            nClickIntervals.push(new Date() - nLastClickTime);
            nLastClickTime = new Date();
            if ($(this).text() == "1") {
                nPoints.push($(this).text());
                $("#points").text(nPoints.length);
            }

            $(".total_points").text(nPoints.length);
            $(".total_clicks").text(nClicks);
            log("total_points " + nPoints.length)
            log("total_clicks " + nClicks)
            log("$(this).text() " + $(this).text())

            if (nTest === nTestPeaces) {
                gameStop();
                $("#test_model_end").show();
                nPlay = false;
                onAnimateComplete();
                return true;
            }
            nClicks++;
            gamePscicotest();
        });
        nTest++;
        log("gamePscicotest nTest" + nTest)
        log(JSON.stringify(board))
    }
    function gameStop() {
        log("stop");
        clearInterval(nTimeInterval);
        $("#board").hide();
        $(".peaces-logo").html("");
    }
    function gameStart() {
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        for (var i = 0; i < nTestPeaces; i++) {
            peaces.push({"value": ("peaces_" + i), "state": false, "response": ("response_" + i)});
        }
     
        if (bugs) {

        } else {
            peaces.sort(function () {
                return .5 - Math.random();
            });

        }

        clone_peaces = peaces.slice();
        log(JSON.stringify(peaces))

    }
    function gamePlayerOkayDude() {
        $("#board").show();
        $(".teste_model").hide();
        $("#points").text(nPoints.length);
        $("#state").text(nLevel);
        nClicks++;
        nClickIntervals.push(new Date() - nLastClickTime);
        nLastClickTime = new Date();
        gamePscicotest();
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
        logObject.gameId = "psicomemo";
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
            console.log("ZERO PRA TI:\n" + JSON.stringify(logObject));
        }
    }
    function millisecondsToTime(milli) {
        var milliseconds = milli % 1000;
        var seconds = Math.floor((milli / 1000) % 60);
        var minutes = Math.floor((milli / (60 * 1000)) % 60);
        return minutes + ":" + seconds;
    }
    $("#hello").on("click", function () {
        $(".board").hide();
        $(".hello").hide();
        $("#test_model_1").show();
        $("#navbar ul").removeClass("hidden");
        nStartTime = new Date();
        nLastClickTime = new Date();
        gameStart();
        setTimeout(gameTime, 1000);
    });
    $("#test_model_1 button").on("click", function () {
        nLevel = 1;
        gamePlayerOkayDude();
    });
    $("#test_model_2 button").on("click", function () {
        nLevel = 2;
        gamePlayerOkayDude();
    });
    $(".btn-toggle .btn").on("click", function () {
        $(".btn-toggle .btn").toggleClass("active")
        if ($(this).text() == "TESTE") {
            alert("MODO TESTE: primeira escolha sempre correta")
            bugs = true;
        } else {
            alert("MODO APLICAÇÃO: vá em frente")
            bugs = false;
        }
    });
    $(".teste_model").hide();
});