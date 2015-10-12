'use strict';

angular.module('myApp.view5', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view5', {
                    templateUrl: 'view5/view5.html',
                    controller: 'View5TabCtrl'
                });
            }])

        .controller('View5TabCtrl', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
            BackgroundService.setCurrentBg("view-5-background");

            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.title = "Perfil do Jogador";
            $scope.professorChecked = "Sou Professor";
            $scope.stateProfessor = false;
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.stateCoded = false;
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
            $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
            $scope.crypta = "https://escoladocerebro.org/crypta.php";
            $scope.circles = [];

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
            $scope.showProfessor = function () {

                $timeout(function () {
                    if ($scope.stateAdmin) {
                        $scope.showAlert("Você está online como " + $scope.user.adminLogin);
                        $scope.adminChecked = "Sair";
                    } else {
                        $scope.adminChecked = "Entrar";
                        $scope.showAlert("Peça o código para seu professor, ou crie um na escoladocerebro.org!");
                    }


                }, 500);
            };
            $scope.checkProfessor = function () {
                $scope.stateProfessor = !$scope.stateProfessor;
                if ($scope.stateProfessor) {
                    $scope.showAlert("Entre com login e senha que você registrou em escoladocerebro.org!");
                    $scope.professorChecked = "Sou Aluno";
                } else {
                    $scope.showAlert("Digite o código!");
                    $scope.professorChecked = "Sou Professor";
                }

            };
            $scope.syncData = function () {

                $scope.showAlert("Sincronizando..." + $scope.measurements.length + " dados.");
                var sampleWalker = 0;
                var sampleLength = $scope.measurements.length;
                $.each($scope.measurements, function (key, value) {
                    var lastSample = JSON.parse(value);
                    lastSample.playerId = $scope.user.playerId;
                    lastSample.adminId = $scope.user.adminId;
                    $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(lastSample)})
                            .done(function (json) {
                                if (json !== null) {
                                    sampleWalker++;
                                    if (sampleLength === sampleWalker) {
                                        var measurements = [];
                                        localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
                                        $scope.points = [];
                                        $scope.showAlert("Parabéns, todos os " + sampleLength + " dados enviados!");
                                        return true;
                                    }
                                    console.log("Sincronizando..." + sampleWalker + " dados.");
                                } else {
                                    $scope.showAlert("Aconteceu algum bug ao enviar os dados!");
                                    return false;
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.showAlert("Você parece estar off-line!");
                                return false;
                            });
                });

            };

            $scope.checkCode = function () {
                $scope.circles = [];
                $scope.showAlert("Verificando código...");
                $.getJSON($scope.ec_query_players, {action: "circles_of_professor", login: $scope.user.adminLogin})
                        .done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);

                                $scope.$apply(function () {
                                    $scope.circles = obj;
                                    $scope.circle = $scope.circles[0];
                                    $scope.stateCoded = true;
                                    $scope.showAlert("Você pode escolher ficar sem Grupo!");
                                });
                            } else {
                                $scope.$apply(function () {
                                    $scope.stateCoded = false;
                                    $scope.showAlert("Você pode escolher ficar sem Grupo!");
                                });
                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {
                                $scope.stateCoded = false;
                                $scope.showAlert("Você pode escolher ficar sem Grupo!");
                            });

                        });

            };
            $scope.checkAdmin = function () {
                $scope.showAlert("Um momento...");

                if ($scope.stateAdmin) {
                    $scope.showAlert("Até mais, volte logo " + $scope.user.adminLogin + "!");
                    $scope.stateAdmin = false;
                    $scope.adminChecked = "Entrar";
                } else {
                    $.getJSON($scope.crypta, {action: "login", login: $scope.user.adminLogin, pass: $scope.user.adminPass})
                            .done(function (json) {

                                if (json !== null) {
                                    var obj = JSON.parse(json);
                                    if (obj[0].adminId > 0) {
                                        $scope.$apply(function () {
                                            $scope.user.adminId = obj[0].adminId;
                                            $scope.stateAdmin = true;
                                            $scope.stateCoded = true;
                                            $scope.stateProfessor = true;

                                            $scope.showAlert("Bem vindo " + $scope.user.adminLogin);
                                            $scope.adminChecked = "Sair";
                                            window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                                            $scope.checkCode();
                                        });
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.stateAdmin = false;
                                            $scope.adminChecked = "Entrar";
                                            $scope.showAlert("Login e Senha do Professor não conferem!");
                                        });

                                    }
                                } else {
                                    $scope.$apply(function () {
                                        $scope.stateAdmin = false;
                                        $scope.adminChecked = "Entrar";
                                        $scope.showAlert("Login e Senha do Professor não conferem!");
                                    });

                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.stateAdmin = false;
                                    $scope.adminChecked = "Entrar";
                                    $scope.showAlert("Login e Senha do Professor não conferem!");
                                });

                            });

                }

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

                                            if (state === "checkin") {
                                                $timeout(function () {

                                                    $location.path("viewG");
                                                }, 500);

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
            $scope.createUser = function () {
                var pass = "";
                var digits = $scope.user.pass.toString().split('');
                for (var i = 0; i < digits.length; i++) {
                    pass += "target" + digits[i];
                }
                $scope.show();
                $.getJSON($scope.ec_query_players, {action: "register", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminId})
                        .done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);
                                if (obj[0].idusers > 0) {
                                    $scope.checkUser("");
                                } else {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Login de Jogador já existe! Escolha outro nome ou apelido para LOGIN.");
                                    });

                                }
                            } else {
                                $scope.$apply(function () {
                                    $scope.showAlert("Login de Jogador já existe! Escolha outro nome ou apelido para LOGIN.");
                                });

                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {
                                $scope.showAlert("Você parece estar OFF-LINE! Vamos guardar os seus dados por um momento.");
                            });

                        });


            };
            $scope.saveUser = function () {
                $scope.showAlert("Atualizando " + $scope.user.fullname + ", momentinho...");
                if ($scope.user.playerId > 0) {

                    $.getJSON($scope.ec_query_players, {
                        action: "updateOff",
                        idusers: $scope.user.playerId,
                        escola: $scope.user.escola,
                        serie: $scope.user.serie,
                        group: $scope.user.group,
                        day: $scope.user.day,
                        city: $scope.user.city,
                        state: $scope.user.state,
                        country: $scope.user.country,
                        email: $scope.user.email,
                        sexo: $scope.user.sexo,
                        fullname: $scope.user.fullname.toUpperCase(),
                        chamada: $scope.user.chamada,
                        partner: $scope.user.partner
                    }).done(function (json) {
                        if (json !== null) {
                            var obj = JSON.parse(json);
                            if (obj[0].idusers > 0) {

                                $scope.$apply(function () {
                                    $scope.checkUser("");
                                    $scope.showAlert("Pronto, " + $scope.user.fullname + "  atualizado! Parabéns!");
                                });

                            }
                        } else {
                            $scope.$apply(function () {
                                $scope.showAlert("Opa! Você parece estar OFF-LINE!");
                            });

                        }
                    }).fail(function (jqxhr, textStatus, error) {
                        $scope.$apply(function () {
                            $scope.showAlert("Você precisa fazer Login primeiro.");
                        });

                    });
                } else {
                    $scope.$apply(function () {
                        $scope.showAlert("Você precisa fazer Login primeiro.");
                    });

                }

            };
            $scope.cleanUser = function () {
                console.log("cleanUser... " + $scope.user);

                $scope.statePlayer = false;

                $scope.user = {
                    playerId: 0,
                    adminId: 0,
                    adminPass: '',
                    adminLogin: '',
                    fullname: '',
                    login: '',
                    pass: '',
                    day: '',
                    group: '',
                    serie: '',
                    chamada: '',
                    escola: '',
                    idusers: 0,
                    city: '',
                    state: '',
                    country: '',
                    email: '',
                    sexo: '',
                    partner: ''
                };
                $scope.dashboard = {
                    ngames: '',
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
            $scope.logout = function ( ) {
                $scope.cleanUser();
                $location.path("viewH");
            };
            $scope.changePass = function (pass) {
                $scope.user.pass += pass;
            };
            $scope.changeCircle = function (item) {
                $scope.user.group = item.label;

                if (item.value > 0) {

                    $scope.showAlert("Toque em adicionar para completar!");
                } else {

                    $scope.showAlert("Você está sem Grupo!");
                }
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
            };
            $scope.addCircle = function ( ) {
                //$scope.user.group = $scope.group ;
                if (angular.isUndefined($scope.circle)) {
                    $scope.showAlert("Nenhum grupo foi adicionado!");
                } else {
                    $scope.user.group = $scope.circle.label;
                    $scope.showAlert("Grupo " + $scope.circle.label + " adicionado!");

                }
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
            };

            $scope.goPath = function (view) {

                $location.path(view);

            };
            if ($scope.user.playerId > 0) {
                $scope.statePlayer = true;
            } else {
                $scope.statePlayer = false;
                $scope.cleanUser();
            }

            if ($scope.dashboard.ngames > 0) {
                $scope.stateGamer = true;
            } else {
                $scope.stateGamer = false;
            }


        });
