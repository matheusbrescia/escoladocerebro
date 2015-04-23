
var userID = 0;
var adminID = 0;
var userSex = 0;
var login = "anonimo";
var pass = "target0";
var partner = false;
var gameID = "";
var dashID = "";

var playerId = userID;
var currencies = [{"value": "Afghan afghani"}, {"value": "Albanian lek"}];
var circles = [{"value": "Circle"}, {"value": "Square"}];
var profileJSON = null;
var currentIndex = 0;
var currentId = "home";
var check = true;
var colors = {
    "home": {
        "background": "#152836",
        "index": 0
    },
    "ranking": {
        "background": "#166BA2",
        "index": 1
    },
    "dashboard": {
        "background": "#152836",
        "index": 2
    },
    "profile": {
        "background": "#152836",
        "index": 3
    }
    , "games": {
        "background": "#E9931A",
        "index": 4
    }


};

$(document).ready(function () {
    setPageTittle("Escola do Cérebro!");
    $("html").addClass("quadro_azul");
    $('body').hide().fadeIn(500);
//    $("#nav").ferroMenu({
//        position: "top-left",
//        delay: 50,
//        drag: false,
//        rotation: 0,
//        radius: 100,
//        margin: 15,
//        opened: true,
//        openedTime: 1000
//    });


    $('#nav, .ferromenu-controller, .points, .exit').hide();
    $('#userID').val(userID);
    $('#userLogin').val(login);

    try {
        adminID = window.parent.document.getElementById("adminID").value;
    }
    catch (e) {
        adminID = 138;
    }

    console.log("userID" + userID)
    console.log("userLogin" + login)
    console.log("adminID" + adminID)


    if (localStorage.brComCognisenseEscolaDoCerebroUserProfile) {
        var profile = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
        login = profile.login;
        pass = ""; 
        var digits = profile.pass.toString().split('');
        for (var i = 0; i < digits.length; i++) {
            pass += "target" + digits[i];
        }
        console.log("remote:login" + login)
        console.log("remote:pass" + pass)

        MyCtrlAppLogin();
    } else {
        feedback("Você precisa estar logado!Use o app Escola do Cérebro para uma melhor experiência!");
        $('.login-section').css("opacity", "1");
        goTo("home");
    }

});

function goTo(id) {

    if (check) {
        var obj = eval("colors." + id);
        if (currentId === "profile") {
            MyCtrlUpdateRegister();
        }
        if (id === "home") {
            MyCtrlHome();
        }
        if (id === "games") {
            MyCtrlGames();
        }
        if (id === "ranking") {
            MyCtrlRanking();
        }

        if (id === "profile") {
            MyCtrlProfile();
        }
        $(".activity").addClass("off");
        $(".activity").transition({
            x: -0,
            opacity: 0,
            zIndex: 0
        }, 100);
        $("#" + currentId).removeClass("activity");
        $("#" + id).addClass("activity");
        $("." + id + "_li").addClass("active_shadow");
        $("." + currentId + "_li").removeClass("active_shadow");
        $("#" + id).transition({
            x: 0
        }, 0, function () {
            $("#" + id).removeClass("off");
            $("#" + id).transition({
                x: 0,
                opacity: 1,
                zIndex: 2
            }, 100);

        });
        currentIndex = obj.index;
        currentId = id;


    } else {
        feedback("Campos em vermelho obrigatórios!");
        notifyClass("#page-tittle", "red", "Campos em vermelho obrigatórios!");
    }
}

function adjustMenu() {

    $(".ferromenu-controller").css({"z-index": 0});
    $(".games_li").css({
        '-moz-transform': 'translate(-150px,0px)',
        '-webkit-transform': 'translate(-150px,0px)',
        '-o-transform': 'translate(-150px,0px)',
        '-ms-transform': 'translate(-150px,0px)',
        'transform': 'translate(-150px,0px)'
    });
    $(".ranking_li").css({
        '-moz-transform': 'translate(-50px,0px)',
        '-webkit-transform': 'translate(-50px,0px)',
        '-o-transform': 'translate(-50px,0px)',
        '-ms-transform': 'translate(-50px,0px)',
        'transform': 'translate(-50px,0px)'
    });
    $(".dashboard_li").css({
        '-moz-transform': 'translate(50px,0px)',
        '-webkit-transform': 'translate(50px,0px)',
        '-o-transform': 'translate(50px,0px)',
        '-ms-transform': 'translate(50px,0px)',
        'transform': 'translate(50px,0px)'
    });
    $(".profile_li").css({
        '-moz-transform': 'translate(150px,0px)',
        '-webkit-transform': 'translate(150px,0px)',
        '-o-transform': 'translate(150px,0px)',
        '-ms-transform': 'translate(150px,0px)',
        'transform': 'translate(150px,0px)'
    });
}

function checkAuth() {
    if (userID === 0) {
        setPageTittle("Faça Login para continuar!");
        feedback("Faça Login para continuar!");
        window.location = "index.html";
    }

}

function checkRegister() {

    if ($("#type-select").val().length === 0) {
        $("#type-select").addClass('has-error');
    } else {
        $("#type-select").removeClass('has-error');
    }
    if ($("#group-select").val().length !== 0 && checkCircles()) {
        $("#group-select").removeClass('has-error');
    } else {
        $("#group-select").addClass('has-error');
    }
    if ($("#birthday-select").val().length === 0) {
        $("#birthday-select").addClass('has-error');
    } else {
        $("#birthday-select").removeClass('has-error');
    }
    if ($("#city").val().length === 0) {
        $("#city").addClass('has-error');
    } else {
        $("#city").removeClass('has-error');
    }
    if ($("#state").val().length === 0) {
        $("#state").addClass('has-error');
    } else {
        $("#state").removeClass('has-error');
    }
    if ($("#country").val().length === 0) {
        $("#country").addClass('has-error');
    } else {
        $("#country").removeClass('has-error');
    }
    if ($("#fullname").val().length === 0) {
        $("#fullname").addClass('has-error');
    } else {
        $("#fullname").removeClass('has-error');
    }

    check = true;
    $('#profile :input').each(function (i) {
        if ($(this).hasClass('has-error')) {
            check = false;
        }
    });

    return check;
}

function setStat(key, value) {
    var display = $('#stat_' + key + '_display');
    if (display.length > 0)
        display.text(value);//display.text(parseFloat(value).toFixed(0));
}

function saveLogObject(logObject) {


    logObject.playerId = userID;
    logObject.gameId = gameID;
    logObject.adminId = adminID;
    logObject.timestamp = (new Date()).getTime();
    feedback("Você entrou no Ranking!");
    console.log(logObject);
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(logObject)})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    feedback("Parabéns. Você foi muito bem!");
                    console.log(obj);
                    if (gameID !== "memos" && gameID !== "genius") {
                        document.getElementById('game-frame').src = "games/" + gameID + "/" + gameID + ".html";
                        setStat('numMoves', 0);
                        setStat('runningTime', 0);
                        setPageTittle("Game " + gameID);

                    }
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });


}

function feedback(msg) {
    var text = msg;
    var t;
    $('#console').text(text).addClass('busy');
    clearTimeout(t);
    t = setTimeout(function () {
        $('#console').removeClass('busy');

    }, 2500);
}

function notifyClass(el, cl, msg) {
    var t;
    $(el).toggleClass(cl, '1500', "easeOutBounce", function () {
    });
    clearTimeout(t);
    t = setTimeout(function () {
        $(el).toggleClass(cl, '3000', "easeOutBounce", function () {
            setPageTittle(msg);
        });
    }, 2500);
}

function setPageTittle(t) {
    $('#page-tittle').html(t);

}

function probable() {
    var response = "";
    var input = $("#target").val().toUpperCase();
    response = '<div><button class="btn-primary btn-block probable_login">' + input + '</button></div><br>';
    $.each(currencies, function (i) {
        var str = currencies[i].value;
        var n = str.search(input);
        if (n > -1) {
            response += '<div><button class="btn-primary btn-block probable_login">' + str + '</button></div><br>';
        }

    });

    $('#response').fadeIn();
    $("#response").html(response);
    $(".probable_login").on({
        click: function () {
            var input = $(this).text();
            login = input;
            $('#response').fadeOut();
            $('#target').val(login);
        },
        mouseenter: function () {
            $(this).focus();
        },
        mouseleave: function () {
            $(this).focus();
        }
    });

}

function checkCircles() {
    var is = false;
    var input = $("#group-select").val().toUpperCase();
    $.each(circles, function (i) {
        if (input.toUpperCase() === circles[i].value.toUpperCase()) {
            is = true;
        }

    });
    return is;
}

function groups() {
    var response = "";
    var input = $("#group-select").val().toUpperCase();
    response = '<div><button class="btn-primary btn-block probable_group">' + input + '</button></div><br>';
    $.each(circles, function (i) {
        var str = circles[i].value;
        var n = str.search(input);
        if (n > -1) {
            response += '<div><button class="btn-primary btn-block probable_group">' + str + '</button></div><br>';
        }

    });

    $('#group-response').fadeIn();
    $("#group-response").html(response);
    $(".probable_group").on({
        click: function () {
            var input = $(this).text();
            $('#group-response').fadeOut();
            $('#group-select').val(input);
        },
        mouseenter: function () {
            $(this).focus();
        },
        mouseleave: function () {
            $(this).focus();
            checkRegister();
        }
    });
    checkRegister();
}

function MyCtrlLogin() {

    login = typeof $("#target").val() !== "" ? login : $("#target").val();
    pass = "";
    $('#btns_pass').find("button").each(function () {
        if ($(this).hasClass('active')) {
            pass += this.id;
        }
    });
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "login", login: login, pass: pass})
            .done(function (json) {
                if (json !== null) {
                    profileJSON = json;
                    var obj = JSON.parse(profileJSON);
                    playerId = userID = obj[0].idusers;
                    if (userID == 0) {
                        setPageTittle("Login e Senha não conferem!");
                        notifyClass("#btn-register", "red", "");
                        notifyClass("#page-tittle", "red", "Faça Login ou Crie um Perfil!");
                    } else {

                        $('#userID').val(userID);
                        $('#userLogin').val(login);
                        feedback("Bem Vindo, " + login + ".");
                        goTo("profile");
                    }


                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

}
function MyCtrlAppLogin() {

    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "login", login: login, pass: pass})
            .done(function (json) {
                if (json !== null) {
                    profileJSON = json;
                    var obj = JSON.parse(profileJSON);
                    playerId = userID = obj[0].idusers;
                    if (userID == 0) {
                        setPageTittle("Login e Senha não conferem!");
                        notifyClass("#btn-register", "red", "");
                        notifyClass("#page-tittle", "red", "Faça Login ou Crie um Perfil!");
                    } else {

                        $('#userID').val(userID);
                        $('#userLogin').val(login);
                        feedback("Momentinho, " + login + ".");
                        goTo("ranking");
                        $('.exit').show('2000', "easeOutBounce", function () {
                            //setPageTittle("Você está online " + login);
                        });
                    }


                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

}
function MyCtrlHome() {
    setPageTittle("Faça Login para continuar!");
    $('.points').hide("slow");
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "circles"})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    circles = obj;
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "list"})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    currencies = obj;
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });
    $("#btns_pass button").click(function () {
        $('#' + this.id).toggleClass('active');
        $('#' + this.id).trigger("blur");
    });
}
function MyCtrlGames() {
    setPageTittle("Games");
    $('.points').show("slow");
    initModal("games", "game");
}
function MyCtrlRanking() {
    $('.points').hide("slow");
    setPageTittle("Desempenho Geral");
    initModal("dashboard", "ranking");
}

function MyCtrlUpdateRegister() {
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "update", idusers: userID, type: $("#type-select").val(), serie: $("#serie-select").val(), group: $("#group-select").val().toUpperCase(), day: $("#birthday-select").val(), city: $("#city").val(), state: $("#state").val(), country: $("#country").val(), email: $("#email").val(), sex: userSex, fullname: $("#fullname").val(), partner: partner})
            .done(function (json) {
                if (json !== null) {
                    profileJSON = json;
                    feedback("Okay, " + login);

                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });
}
function MyCtrlRegister() {
    login = typeof $("#target").val() !== "" ? login : $("#target").val();
    pass = "";
    $('#btns_pass').find("button").each(function () {
        if ($(this).hasClass('active')) {
            pass += this.id;
        }
    });
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: "register", login: login, pass: pass, idadmin: adminID})
            .done(function (json) {
                if (json !== null) {
                    profileJSON = json;
                    var obj = JSON.parse(profileJSON);
                    playerId = userID = obj[0].idusers;

                    if (userID == 0) {
                        setPageTittle("Digite um NOME e escolha uma SENHA para seu Perfil!");
                        notifyClass("#btn-register", "red");
                        notifyClass("#page-tittle", "red");
                    } else if (userID < 0) {
                        setPageTittle("NOME já existe!");
                        notifyClass("#btn-login", "red");
                        notifyClass("#page-tittle", "red");
                    } else {
                        goTo("profile");
                        $('#userID').val(userID);
                        $('#userLogin').val(login);
                        feedback("Bem Vindo, " + login + ".");

                        //$.fn.ferroMenu.toggleMenu("#nav");
                    }


                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });
}
function MyCtrlProfile() {

    $('.exit, #nav, .ferromenu-controller').show('2000', "easeOutBounce", function () {
        setPageTittle("Você está online " + login);
    });
    $('.points').hide("slow");
    var obj = JSON.parse(profileJSON);
    $("#type-select").val(obj[0].type);
    $("#serie-select").val(obj[0].serie);
    $("#group-select").val(obj[0].group);
    $("#birthday-select").val(obj[0].day);
    $("#city").val(obj[0].city);
    $("#state").val(obj[0].state);
    $("#country").val(obj[0].country);
    $("#email").val(obj[0].email);
    $("#fullname").val(obj[0].fullname);
    if (obj[0].partner)
        $('#partner').addClass('active fa fa-check');
    $('#' + obj[0].sex).addClass('active fa fa-check');
    userSex = obj[0].sex;
    if (userSex === "sex0") {
        $(".menina").hide("drop", {direction: "right"}, 1000);
        $(".menino").show("drop", {direction: "right"}, 1000);
    }
    else {
        $(".menina").show("drop", {direction: "left"}, 1000);
        $(".menino").hide("drop", {direction: "left"}, 1000);
    }

    $(".sex0").click(function () {
        $("#sex1").removeClass('active fa fa-check');
        $("#sex0").addClass('active fa fa-check');
        $(".menina").hide("drop", {direction: "right"}, 1000);
        $(".menino").show("drop", {direction: "left"}, 1000);
        userSex = this.id;
    });
    $(".sex1").click(function () {
        $("#sex0").removeClass('active fa fa-check');
        $("#sex1").addClass('active fa fa-check');
        $(".menina").show("drop", {direction: "right"}, 1000);
        $(".menino").hide("drop", {direction: "left"}, 1000);
        userSex = this.id;
    });

    $("#partner").click(function () {
        $("#partner").toggleClass('active fa fa-check');
        partner = $("#partner").hasClass('active fa fa-check');
        console.log($("#partner").hasClass('active fa fa-check'));
        $('#' + this.id).trigger("blur");
    });

    var serie = [{'1': '1'}, {'2': '2'}, {'3': '3'}, {'4': '4'}, {'5': '5'}, {'6': '6'}, {'7': '7'}, {'8': '8'}, {'9': '9'}, {'10': 'Outra'}];
    var serie_select = $('#serie-select');
    serie_select.empty();
    $.each(serie, function (i, val) {
        serie_select.append($('<option />', {value: (i + 1), text: val[i + 1]}));
    });

    var type = [{'1': 'Pública Municipal'}, {'2': 'Pública Estadual'}, {'3': 'Pública Federal'}, {'4': 'Privada'}, {'5': 'Outra'}];
    var type_select = $('#type-select');
    type_select.empty();
    $.each(type, function (i, val) {
        type_select.append($('<option />', {value: (i + 1), text: val[i + 1]}));
    });

    $('.input-group.date').datepicker({
        format: "yyyy-mm-dd",
        language: "pt-BR",
        autoclose: true,
        todayHighlight: true
    });
    setPageTittle("Perfil " + login);



    if (checkRegister() && currentIndex === 0) {
        setTimeout(function () {
            goTo("dashboard");
        }, 100);
    }
}
function initModal(folder, type) {

    var bsModal = null;
    $("[data-toggle=modal]").click(function (e) {
        e.preventDefault();
        var trgId = $(this).attr('data-target');

        if (bsModal == null)
            bsModal = $(trgId).modal;

        $.fn.bsModal = bsModal;
        var res = $(this).attr("id").split("_");
        dashID = gameID = res[1];
        $('#dashID').val(dashID);
        setPageTittle(type + " " + gameID);
        setStat('numMoves', 0);
        setStat('runningTime', 0);
        if (type == "game") {
            $(trgId + " .dash-controls").html("");
            var url = "<iframe class=\"loading bg-center\" id=\"" + type + "-frame\" src=\"" + folder + "/" + gameID + "/" + gameID + ".html  \" ></iframe>";
            $(trgId + " .modal-body").html(url);
            $('iframe').css("width", "535px");
        }

        if (type == "ranking") {
            var url = "\
            <button id=\"dash-top10\" class=\"btn btn-primary icon-dash-all \">Top 10</button> \n\
            <button id=\"dash-realtime\" class=\"btn btn-primary icon-dash-all\">Tempo Real</button> \n\
            <button id=\"dash-everybody\" class=\"btn btn-primary icon-dash-all\">Comparação</button> \n\
            <button id=\"dash-all\" class=\"btn btn-primary icon-dash-all\">Indicadores</button>\n\
            <button id=\"dash-mypoints\" class=\"btn btn-primary icon-dash-all\">Pontos</button>\n\
            <button id=\"dash-hability\" class=\"btn btn-primary icon-dash-all\">Habilidades</button> ";
            $(trgId + " .dash-controls").html(url);
            var url = "<iframe class=\"loading bg-center\" id=\"" + type + "-frame\" src=\"" + folder + "/escola-do-cerebro-ranking.html\" ></iframe>";
            $(trgId + " .modal-body").html(url);
            $('#' + type + '-frame').bind('load', function () {
                document.getElementById("" + type + "-frame").contentWindow.init();
                $('#dash-top10').trigger("click");

                $('iframe').css("width", "90%");
            });
        }

        $("#ModalLabel").text(type + " " + gameID);
        $(trgId).bsModal('show');
        $(trgId).on('hidden.bs.modal', function () {
            $(trgId + " .modal-body").html("");
            setPageTittle(login + ", escolha uma categoria de " + type + ".");
        });
    });

}
