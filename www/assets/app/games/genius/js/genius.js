// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Escola do Cérebro 1.0.0 - Educational Game Library                 │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013-2014 Cognisense Tecnologia Ltda                   │ \\
// │ Copyright © 2014 EduSCADA Labs (http://eduscada.com)               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://cognisense.com.br/license.html)     │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
var currentIndex = 0;
var currentId = "camera";

var level = 0;
var levels = [4, 6, 8];
var increment = 0;
var seeds = [];
var tseed = 1000;
var ttrans = tseed / 2;

var gameability = ["icons", "colors", "flat"];
var snd_okay = null;
var snd_err = null;
var snd_low = null;
var snd_levelup = null;

var defcolor = "genius_circle_black";
var errcolor = "genius_e";


var moves = 0;
var points = 0;
var time = 0;
var startTime = 0;
var lastClickTime = 0;
var duration = 0;
var clickIntervals = [];

var play = false;
var circles = null;
var circles4 = {
    "road": {
        "color": "trueblue",
        "background": "#0000FF",
        "index": 2
    },
    "camera": {
        "color": "truered",
        "background": "#FF0000",
        "index": 0
    },
    "user": {
        "color": "truegreen",
        "background": "#39b54a",
        "index": 1
    },
    "tint": {
        "color": "trueyellow",
        "background": "#FFFF00",
        "index": 3
    }
};
var circles6 = {
    "road": {
        "color": "trueblue",
        "background": "#0000FF",
        "index": 2
    },
    "camera": {
        "color": "truered",
        "background": "#FF0000",
        "index": 0
    },
    "user": {
        "color": "truegreen",
        "background": "#39b54a",
        "index": 1
    },
    "music": {
        "color": "truemagenta",
        "background": "#FF00FF",
        "index": 4
    },
    "tint": {
        "color": "trueyellow",
        "background": "#FFFF00",
        "index": 3
    },
    "tag": {
        "color": "truebrown",
        "background": "#8c6239",
        "index": 5
    }
};
var circles8 = {
    "road": {
        "color": "trueblue",
        "background": "#0000FF",
        "index": 2
    },
    "camera": {
        "color": "truered",
        "background": "#FF0000",
        "index": 0
    },
    "user": {
        "color": "truegreen",
        "background": "#39b54a",
        "index": 1
    },
    "tag": {
        "color": "truemagenta",
        "background": "#FF00FF",
        "index": 5
    },
    "tint": {
        "color": "trueyellow",
        "background": "#FFFF00",
        "index": 3
    },
    "music": {
        "color": "truebrown",
        "background": "#8c6239",
        "index": 4
    },
    "moon": {
        "color": "truesilver",
        "background": "#8299ce",
        "index": 6
    },
    "leaf": {
        "color": "truegold",
        "background": "#f7931e",
        "index": 7
    }
};

$(document).ready(function() {

    $("#btPlay").click(playGame);
    $(".basico").click(function() {
        chooseLevel(0);
    });
    $(".intermediario").click(function() {
        chooseLevel(1);
    });
    $(".avancado").click(function() {
        chooseLevel(2);
    });
    d("game loaded");
});

function onAnimateComplete() {
    //$("body").css("background", wincolor);
    var avgInterval = 0;
    for (var i = 0; i < clickIntervals.length; i++) {
        avgInterval += clickIntervals[i];
    }
    avgInterval = avgInterval / clickIntervals.length;
    var dp = 0;
    for (var i = 0; i < clickIntervals.length; i++) {
        dp += Math.pow(clickIntervals[i] - avgInterval, 2);
    }
    dp = Math.pow(dp / clickIntervals.length - 1, 0.5);

    logObject = {
        acuracia: (seeds.length / moves),
        velocidade: (seeds.length / (duration / 1000)),
        estabilidade: (1 / (dp)),
        time: duration,
        success: true,
        level: level
    };

    var dMult = [40, 60, 100];
    logObject.pontuacao = ((logObject.acuracia + logObject.velocidade + logObject.estabilidade) / 3) * dMult[level];

    logObject['memoria'] = logObject.pontuacao * 4;
    logObject['visuo_espacial'] = logObject.pontuacao * 1;
    logObject['resolucao_problemas'] = logObject.pontuacao * 1;
    logObject['psico_motora'] = logObject.pontuacao * 3;
    logObject['logico_matematica'] = logObject.pontuacao * 1;
    logObject['linguagem'] = logObject.pontuacao * 1;

    try {
        window.parent.saveLogObject(logObject);
    }
    catch (e) {
        d(e);
    }

    //feedback("Parabéns! Você completou essa fase!");
    return true;
}


function next() {
    //audioLevelup();
    if (onAnimateComplete()) {
        feedback((seeds.length + 1));
        play = false;
        var t;
        clearTimeout(t);
        t = setTimeout(function() {
            seed();
        }, ttrans);

    }
    increment = 0;
}

function evalClick(id) {
    if (play) {
        clickIntervals.push(new Date() - lastClickTime);
        lastClickTime = new Date();

        try {
            window.parent.setStat('numMoves', (moves++) + 1);
        }
        catch (e) {
            d(e);
        }

        var obj = eval("circles." + id);
        if (obj.index === seeds[increment]) {
            increment++;
            showSeed(id);
        } else {
            // audioErr();
            feedback("ERROU!");
            $("#wrap").addClass(errcolor);
            var t;
            clearTimeout(t);
            t = setTimeout(function() {
                $("#wrap").removeClass(errcolor);
            }, ttrans);
        }
    }

}

function rem(obj) {
//    $("#" + id).removeClass("active");
//    $("#" + id).transition({
//        x: -100,
//        opacity: 0,
//        zIndex: 0
//    }, ttrans, function() {
//        //   $("#" + id).addClass("off");
//    });
    $("#ferromenu-controller,#nav li ." + obj.color).css("-webkit-box-shadow", " 0px 0px 0px 0px " + obj.background);
    $("#ferromenu-controller,#nav li ." + obj.color).css("-moz-box-shadow", " 0px 0px 0px 0px " + obj.background);
    $("#ferromenu-controller,#nav li ." + obj.color).css("box-shadow", " 0px 0px 0px 0px " + obj.background);
//    
    //$("#ferromenu-controller,#nav li ." + obj.color).css("background-image", "url('img/" + levels[level] + "CORES/" + obj.color + ".png')");
    //$("#ferromenu-controller,#nav li ." + obj.color).removeClass("hover");
    //  $("#" + obj.id).addClass("off");
    // $("#" + obj.id).removeClass("active");

    if (increment === seeds.length) {
        next();//fechou fase
    }
}

function add(obj) {

    // $("#" + obj.id).removeClass("off");
    // $("#" + obj.id).addClass("active");
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
        rem(obj);
    }, ttrans);


//    $("#" + id).transition({
//        x: 300
//    }, 0, function() {
//      //  $("#" + id).removeClass("off");
//        $("#" + id).transition({
//            x: 0,
//            opacity: 1,
//            zIndex: 2
//        }, ttrans, function() {
//            rem(id);
//        });
//
//    });


}

function showSeed(id) {
    var obj = eval("circles." + id);
    var mul = 64 / (levels[level]);
    $("#ferromenu-controller,#nav li ." + obj.color).css("-webkit-box-shadow", " 0px 0px " + mul + "px " + mul / 2 + "px  " + obj.background);
    $("#ferromenu-controller,#nav li ." + obj.color).css("-moz-box-shadow", " 0px 0px " + mul + "px " + mul / 2 + "px  " + obj.background);
    $("#ferromenu-controller,#nav li ." + obj.color).css("box-shadow", " 0px 0px " + mul + "px " + mul / 2 + "px  " + obj.background);
    d("id:" + id + " index:" + obj.index);
    //audioTecla(obj.index);
    add(obj);
}

function start() {

    startTime = new Date();
    play = true;
    feedback("AGORA!");
    setInterval(function() {
        var endTime = new Date();
        duration = endTime - startTime;

        try {
            window.parent.setStat('runningTime', millisecondsToTime(duration));
        }
        catch (e) {
            d(e);
        }


    }, 50);

}

function feedback(msg) {
    var t;
    $('#console').text(msg).addClass('busy');
    clearTimeout(t);
    t = setTimeout(function() {
        $('#console').removeClass('busy');
    }, ttrans);

}

function findSeed(data, i) {
    var r = null;
    $.each(data, function(id, obj) {
        if (obj.index === i)
            r = id;
    });
    return r;
}

function seed() {
    var trigger = 0;
    var mul = levels[level];
    var rand = Math.floor(Math.random() * (mul));

    for (var i = 0; i < mul; i++) {
        rand = Math.floor(Math.random() * (mul));
        // seeds.push(i);

    }

    seeds.push(rand);
    seeds.sort(function() {
        return Math.random() - 0.5;
    });
    $.each(seeds, function(id, obj) {
        trigger = tseed * (id + 1);
        var tick;
        clearTimeout(tick);
        tick = setTimeout(function() {
            showSeed(findSeed(circles, obj));
        }, trigger);

    });
    trigger += tseed;
    var t;
    clearTimeout(t);
    t = setTimeout(function() {
        start();
    }, trigger);
}

function millisecondsToTime(milli) {
    var milliseconds = milli % 1000;
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);
    return minutes + ":" + seconds + "." + milliseconds;
}

function populate(data) {
    var navs = [];
    var contents = [];
    $.each(data, function(id, obj) {

        var n = "<li> <a style=\"background-image:" + "url('img/" + levels[level] + "CORES/" + obj.color + ".png')" + "\" class=\"colorRotate" + levels[level] + " " + id + " color " + obj.color + "\" href=\"javascript:evalClick('" + id + "')\" >\n\
                        <i class=\"" + id + " color " + obj.color + "\"></i></a></li>";
        var c = "<article id=\"" + id + "\" class=\"off\"><i class=\"" + id + " color " + obj.color + "\"></i><div class=\"cnt\"></div></article>";

        navs.push(n);
        contents.push(c);
    });
    $('ul#nav').html(navs.slice(0, levels[level]).join(''));
    $('section#content').html(contents.slice(0, levels[level]).join(''));
    return true;
}
//js level source
function playGame() {
    //audioLow();
    $("body").removeClass("como_jogar_genius");
    $("body").addClass("niveis_genius");
    $('#btPlay').hide();
    $('#divLevels').show();

}
//js level source
function chooseLevel(lv) {
   // audioLow();
    level = lv;
    $("body").removeClass("niveis_genius");
    $("body").addClass(defcolor);
 $("html").addClass("genius_bg");


    errcolor = "genius_e" + levels[level] + "";

    $('#divLevels').css("display", "none");

    $('#wrap').css("visibility", "visible");
    $('#wrap').css("position", "absolute");
    var radius = 120;
    switch (level)
    {
        case 2:
            $('#wrap').transition({rotate: '22deg'});

            circles = circles8;
            radius = 115;
            break;
        case 1:
            $('#wrap').transition({rotate: '30deg'});
            circles = circles6;
            radius = 115;
            break;
        default:
            circles = circles4;
            $('#wrap').transition({rotate: '45deg'});

            radius = 115;
    }

    if (populate(circles)) {
        $("#nav").ferroMenu({
            position: "center-center",
            delay: 50,
            rotation: 0,
            margin: 10,
            radius: radius,
            opened: true
        });
        seed();
    }



}

function d(v) {
    console.log(v);
}
 