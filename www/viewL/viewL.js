'use strict';

angular.module('myApp.viewL', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewL', {
                    templateUrl: 'viewL/viewL.html',
                    controller: 'ViewLTabCtrl'
                });
            }])

        .controller('ViewLTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-l-background");
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;
            $scope.stateAdmin = false;
            $scope.stateGamer = false;
            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.message = "Bem vindo!";
            $scope.title = "Perfil do Jogador";
            $scope.circles = [];
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
            $scope.crypta = "https://escoladocerebro.org/crypta.php";
            $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';

            $scope.cleanUser = function () {
               
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
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                $scope.showAlert("Nenhum jogador definido.");
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

            };
            $scope.checkDash = function (player) {

                $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                        .done(function (json) {
                            if (json !== null) {

                                $scope.dashboard = JSON.parse(json)[0];
                                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

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
                if ($scope.user.login === "" || $scope.user.pass === "") {
                    $scope.showAlert("Digite um login e senha ou crie um novo!");
                } else {
                    $.getJSON($scope.ec_query_players, {action: "login", login: $scope.user.login, pass: pass})
                            .done(function (json) {
                                if (json !== null) {
                                    $scope.user = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                                    if (Math.round($scope.user.idusers) > 0) {

                                        $scope.$apply(function () {
                                            $scope.statePlayer = true;

                                            $scope.showAlert("Bem Vindo, " + $scope.user.login);
                                            $scope.checkDash($scope.user.playerId);

                                            if (state === "register") {
                                                $timeout(function () { 
                                                    $location.path("view5");
                                                }, 100);

                                            }
                                            if (state === "checkin") {
                                                $timeout(function () { 
                                                    $location.path("viewG");
                                                }, 100);

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
                $.getJSON($scope.ec_query_players, {action: "register", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminId || 0})
                        .done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);
                                if (Math.round(obj[0].idusers) > 0) {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Logando... ");
                                        $scope.checkUser("register");
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


            };
            $scope.goPath = function (view) {
                $location.path(view);
            };
            $scope.changePass = function (pass) {
                $scope.user.pass += pass;
            };

            if ($scope.user.playerId > 0) {
                $scope.statePlayer = true;
                $scope.checkUser("silent");
            } else {
                $scope.statePlayer = false;
                $scope.cleanUser();
                $scope.showAlert("Digite seu login e senha ou se ainda não tem cadastro clique em Criar login");
            }
            
            $timeout(function () {
                
            }, 500);
        }); 