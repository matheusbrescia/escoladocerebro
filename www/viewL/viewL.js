'use strict';

angular.module('myApp.viewL', ['ngRoute', 'mediaPlayer'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewL', {
                    templateUrl: 'viewL/viewL.html',
                    controller: 'ViewLTabCtrl'
                });
            }])

        .controller('ViewLTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-l-background");

            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.message = "Bem vindo!";
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.title = "Perfil do Jogador";

            $scope.crypta = "http://escoladocerebro.org/crypta.php";
            $scope.circles = [];

            $scope.ec_query_players = 'http://escoladocerebro.org/eduscada/c/index.php/ec_query_players';

            $scope.cleanUser = function () {
                console.log("saindo..." + $scope.user);
                $scope.statePlayer = false;

                $scope.user = {
                    playerId: 0,
                    adminId: 0,
                    adminPass: '',
                    adminLogin: '',
                    fullname: '',
                    login: '',
                    pass: '',
                    nascimento: '',
                    group: '',
                    serie: '',
                    chamada: '',
                    escola: '',
                    idusers: 0,
                    day: '',
                    city: '',
                    state: '',
                    country: '',
                    email: '',
                    sexo: '',
                    partner: ''
                };
                $scope.dashboard = {
                    ngames: 0,
                    acuracia: '',
                    velocidade: '',
                    estabilidade: '',
                    total_time: '',
                    pontuacao_avg: '',
                    pontuacao_sum: '',
                    idadmin: '',
                    barssum: '0,0,0',
                    barsavg: '0,0,0'
                };
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                localStorage.brComCognisenseEscolaDoCerebroUserDashboard = JSON.stringify($scope.dashboard);
                console.log("tu tá offline!" + $scope.user);

            };
            $scope.showProfessor = function () {

                $timeout(function () {
                    // myPopup.close(); //close the popup after 3 seconds for some reason
                }, 3000);
            };
            $scope.show = function () {
                $scope.hidden = "alert";
            };
            $scope.hide = function () {

                $scope.hidden = "hidden";
            };
            $scope.showAlert = function (txt) {
                $scope.hidden = "alert";
                $scope.message = txt;

            };
            $scope.closeAlert = function (txt) {

                $scope.hidden = "hidden";
                $scope.button.playPause();

            };
            $scope.checkDash = function (player) {

                $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                        .done(function (json) {
                            if (json !== null) {

                                var obj = JSON.parse(json);
                                $scope.dashboard.ngames = obj[0].ngames;
                                $scope.dashboard.acuracia = obj[0].acuracia;
                                $scope.dashboard.velocidade = obj[0].velocidade;
                                $scope.dashboard.estabilidade = obj[0].estabilidade;
                                $scope.dashboard.total_time = obj[0].total_time;
                                $scope.dashboard.pontuacao_avg = obj[0].pontuacao_avg;
                                $scope.dashboard.pontuacao_sum = obj[0].pontuacao_sum;
                                $scope.dashboard.idadmin = obj[0].idadmin;
                                $scope.dashboard.barssum = obj[0].barssum;
                                $scope.dashboard.barsavg = obj[0].barsavg;

                                localStorage.brComCognisenseEscolaDoCerebroUserDashboard = JSON.stringify($scope.dashboard);
//                                var obj = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserDashboard);
//                                console.log(obj[0].ngames);
//                                console.log($scope.dashboard[0].ngames);
                                $timeout(function () {
                                    $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");
                                }, 5000);
                            } else {
                                $scope.$apply(function () {
                                    $timeout(function () {
                                        $scope.showAlert("Sem dados no dashboard!");

                                    }, 5000);

                                });
                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {

                                $scope.showAlert("Você parece estar OFF-LINE!");
                            });

                        });

            };
            $scope.checkUser = function (state) {
                console.log("checkUser: " + $scope.user.login + " " + $scope.user.pass);

                var pass = "";
                var digits = $scope.user.pass.toString().split('');
                for (var i = 0; i < digits.length; i++) {
                    pass += "target" + digits[i];
                }
                $scope.showAlert("Momentinho...");
                if ($scope.user.login == "" || $scope.user.pass == "") {
                    $scope.showAlert("Digite um login e senha ou crie um novo!");
                } else {
                    $.getJSON($scope.ec_query_players, {action: "login", login: $scope.user.login, pass: pass})
                            .done(function (json) {
                                if (json !== null) {
                                    var obj = JSON.parse(json);
                                    if (Math.round(obj[0].idusers) > 0) {


                                        $scope.$apply(function () {
                                            $scope.statePlayer = true;

                                            $scope.user.playerId = obj[0].idusers;
                                            $scope.user.nascimento = obj[0].day;
                                            $scope.user.adminId = obj[0].adminId;
                                            $scope.user.fullname = obj[0].fullname;
                                            $scope.user.idusers = obj[0].idusers;
                                            $scope.user.escola = obj[0].escola;
                                            $scope.user.serie = obj[0].serie;
                                            $scope.user.sexo = obj[0].sexo;
                                            $scope.user.group = obj[0].group;
                                            $scope.user.chamada = obj[0].chamada;
                                            $scope.user.city = obj[0].city;
                                            $scope.user.state = obj[0].state;
                                            $scope.user.country = obj[0].country;
                                            $scope.user.email = obj[0].email;
                                            $scope.user.partner = obj[0].partner;

                                            $scope.showAlert("Bem Vindo, " + $scope.user.login);
                                            $scope.checkDash($scope.user.playerId);
                                            localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                                            console.log(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                                            if (state === "checkin") {
                                                $location.path("viewG");
                                            }
                                        });
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.statePlayer = false;
                                            $scope.showAlert("Login e Senha do Jogador não conferem!");

                                        });
                                    }
                                } else {
                                    $scope.$apply(function () {
                                        $scope.statePlayer = false;
                                        $scope.showAlert("Login e Senha do Jogador não conferem!");

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.off = "off";
                                    $scope.statePlayer = false;
                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });

                            });

                }



            };

            $scope.createUser = function () {
                var pass = "";
                var digits = $scope.user.pass.toString().split('');
                for (var i = 0; i < digits.length; i++) {
                    pass += "target" + digits[i];
                }
                $scope.showAlert("Criando jogador...");
                $.getJSON($scope.ec_query_players, {action: "register", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminId})
                        .done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);
                                if (Math.round(obj[0].idusers) > 0) {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Logando... ");
                                        $scope.checkUser("silent");
                                    });

                                } else {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Login de Jogador não confere ou já existe! ");
                                    });

                                }
                            } else {
                                $scope.$apply(function () {
                                    $scope.showAlert("Login de Jogador não confere ou já existe! ");
                                });

                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {
                                $scope.off = "off";
                                $scope.showAlert("Você parece estar OFF-LINE! ");
                            });

                        });

                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);

            };



            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;

                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }
                $scope.checkUser("silent");
            } else {
                $scope.cleanUser();
                $scope.statePlayer = false;
                $scope.showAlert("Digite seu login e senha ou se ainda não tem cadastro clique em Criar login");
            }
            if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr && localStorage.brComCognisenseEscolaDoCerebroLogObjectArr != 0) {
                var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                $scope.logToSend = 0;
                $.each(logArr, function (key, value) {
                    //console.log('DashboardCtrl:' + key + ' = ' + value);

                    var localData = JSON.parse(value);
                    console.log(localData);
                    //localData.playerId = $scope.user.playerId;
                    $scope.logToSend++;
                    $scope.points.push(localData);
                    $scope.statePoints = true;
                    $.each(localData, function (k, v) {
                        // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
                    });
                });

                $scope.showAlert("Você possuí dados  (" + $scope.logToSend + ")  para sincronizar!");
            } else {
                $scope.logToSend = 0;
                $scope.showAlert("Digite seu login e senha ou se ainda não tem cadastro clique em “Criar login”");
            }
            if (localStorage.brComCognisenseEscolaDoCerebroUserDashboard && localStorage.brComCognisenseEscolaDoCerebroUserDashboard != 0) {
                $scope.dashboard = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserDashboard);
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                } else {
                    $scope.stateGamer = false;
                }

            } else {
                $scope.stateGamer = false;
            }


            $scope.goPath = function (view) {
                $location.path(view);

            };

            $scope.changePass = function (pass) {
                $scope.user.pass += pass;
                console.log(pass)
            };
            $timeout(function () {
                $scope.baloon.playPause();
            }, 500);
        }); 