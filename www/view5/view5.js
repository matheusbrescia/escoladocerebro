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
            $scope.ec_query_players = 'http://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
            $scope.crypta = "http://escoladocerebro.org/crypta.php";
            $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.title = "Perfil do Jogador";
            $scope.professorChecked = "Sou Professor";
            $scope.stateProfessor = false;
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.stateCoded = false;

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
                                            localStorage.adminId = $scope.user.adminId;
                                            $scope.stateAdmin = true;
                                            $scope.stateCoded = true;
                                            $scope.stateProfessor = true;

                                            $scope.showAlert("Bem vindo " + $scope.user.adminLogin);
                                            $scope.adminChecked = "Sair";
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

                $timeout(function () {
                    // myPopup.close(); //close the popup after 3 seconds for some reason
                }, 3000);
            };
            $scope.checkUser = function () {
                console.log("checking... " + $scope.user.login + " " + $scope.user.pass);
                $scope.showAlert("Momentinho " + $scope.user.login + "...");
                var pass = "";
                var digits = $scope.user.pass.toString().split('');
                for (var i = 0; i < digits.length; i++) {
                    pass += "target" + digits[i];
                }

                $.getJSON($scope.ec_query_players, {action: "login", login: $scope.user.login, pass: pass})
                        .done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);
                                if (obj[0].idusers > 0) {
                                    $scope.$apply(function () {

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

                                        $scope.showAlert("Aqui você pode editar seu perfil " + $scope.user.login + ".");
                                        localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                                        $scope.statePlayer = true;
                                        $scope.checkDash($scope.user.playerId);
                                        console.log(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                                    });
                                } else {
                                    $scope.$apply(function () {

                                        $scope.showAlert("Login e Senha do Jogador não conferem! Faça Login ou Crie um Perfil!");

                                    });
                                }
                            } else {
                                $scope.$apply(function () {

                                    $scope.showAlert("Login e Senha do Jogador não conferem! Faça Login ou Crie um Perfil!");

                                });
                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {

                            $scope.showAlert("Você parece estar off-line!");
                        });



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
                                    $scope.checkUser();
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

                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);

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
                        day: $scope.user.nascimento,
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

                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                console.log("USER_UPDATE " + localStorage.brComCognisenseEscolaDoCerebroUserProfile)
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
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                localStorage.brComCognisenseEscolaDoCerebroUserDashboard = JSON.stringify($scope.dashboard);
                console.log("cleanUser... " + $scope.user.login + " " + $scope.user.pass);

            };
            
            $scope.changePass = function (pass) {
                $scope.user.pass += pass;
                console.log(pass)
            };
            $scope.changeCircle = function (item) {
                $scope.user.group = item.label;
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);

                if (item.value > 0) {

                    $scope.showAlert("Toque em adicionar para completar!");
                } else {

                    $scope.showAlert("Você está sem Grupo!");
                }
            };
            $scope.addCircle = function ( ) {
                //$scope.user.group = $scope.group ;
                if (angular.isUndefined($scope.circle)) {
                    $scope.showAlert("Nenhum grupo foi adicionado!");
                } else {
                    $scope.user.group = $scope.circle.label;
                    $scope.showAlert("Grupo " + $scope.circle.label + " adicionado!");

                }
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);

            };

            $scope.syncData = function () {

                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                console.log(localStorage.brComCognisenseEscolaDoCerebroUserProfile)

                $scope.showAlert("Sincronizando...");
                if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                    var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                    var i = 0;

                    $.each(logArr, function (key, value) {
                        var localData = JSON.parse(value);
                        localData.playerId = $scope.user.playerId;
                        localData.adminId = $scope.user.adminId;

                        $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
                                .done(function (rjson) {

                                    if (rjson !== null) {
                                        var obj = JSON.parse(rjson);
                                        i++;
                                        $scope.$apply(function () {
                                            if (logArr.length === i) {
                                                localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                                localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength = 0;
                                                $scope.points = [];

                                                $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
                                                $scope.showAlert("Parabéns, todos os " + logArr.length + " dados enviados!");
                                            }
                                        });

                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {

                                    $scope.showAlert("Você parece estar off-line!");
                                });
                    });

                } else {

                    $scope.showAlert("Você ainda não tem pontos nessa sessão!");
                }
            };
            
            $scope.goPath = function (view) {

                $timeout(function () {
                    var points = 0;
                    if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                        var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                        $.each(logArr, function (key, value) {
                            var localData = JSON.parse(value);
                            $.each(localData, function (k, v) {
                                if (k === "pontuacao")
                                    points = v;
                            });
                        });
                    } else {
                        $scope.$apply(function () {
                            $scope.showAlert("Você ainda não tem pontos! Jogue para conquistá-los.");
                        });

                    }

                    $location.path(view);
                }, 500);

            };
            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }

            } else {
                $scope.cleanUser();
                $scope.statePlayer = false;

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
                $scope.showAlert("Parabéns, todos seus dados estão sincronizados!");
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

         
            $timeout(function () {
                $scope.baloon.playPause();

            }, 100);

        });
