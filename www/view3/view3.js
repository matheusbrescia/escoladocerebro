'use strict';

angular.module('myApp.view3', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view3', {
                    templateUrl: 'view3/view3.html',
                    controller: 'DashboardCtrl'
                });
            }])

        .controller('DashboardCtrl', function ($scope, SettingsService, $timeout, $location, BackgroundService) {
            BackgroundService.setCurrentBg("view-3-background");

            $scope.ec_query_players = 'http://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
            $scope.ec_log_games = "http://escoladocerebro.org/eduscada/c/index.php/ec_log_games";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;

            $scope.hidden = "hidden";
            $scope.title = "Dashboard";
            $scope.showTrofeu = function () {
                $scope.stateTrofel = !$scope.stateTrofel;
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
            $scope.goPath = function (view) {
                $location.path(view);

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
            
            $scope.syncData = function () {

                $scope.showAlert("Sincronizando...");
                if ($scope.logToSend > 0) {
                    var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                    var i = 0;
                    $.each(logArr, function (key, value) {
                        var localData = JSON.parse(value);
                        localData.playerId = $scope.user.playerId;
                        localData.adminId = $scope.user.adminId;

                        $.getJSON($scope.ec_log_games, {log: JSON.stringify(localData)})
                                .done(function (rjson) {
                                    if (rjson !== null) {
                                        var obj = JSON.parse(rjson);
                                        i++;
                                        $scope.$apply(function () {
                                            $scope.showAlert("Enviando... " + i);
                                            if (logArr.length === i) {
                                                localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                                $scope.points = [];
                                                $scope.logToSend = 0;
                                                $scope.statePoints = false;

                                                $scope.showAlert("Parabéns, todos os " + logArr.length + " dados enviados!");
                                                $timeout(function () { 
                                                    $scope.checkDash($scope.user.playerId);
                                                }, 300);
                                            }
                                        });

                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {

                                    $scope.showAlert("Você parece estar off-line!");
                                });
                    });

                } else {

                    $scope.showAlert("Você não tem dados para sincronizar! Jogue algum game!");
                }
            };
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
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                localStorage.brComCognisenseEscolaDoCerebroUserDashboard = JSON.stringify($scope.dashboard);
                $scope.showAlert("Nenhum jogador definido.");
            };

            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.checkDash($scope.user.playerId);
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
            }, 300);

        })
        .directive('barssum', function ($parse) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div id="chartsum" ></div>',
                link: function (scope, element, attrs) {
                    var data = attrs.data.split(',');

                    console.log(data)
                    var width = parseInt(d3.select('body').style('width'), 10) / 10,
                            height = parseInt(d3.select('body').style('height'), 10) / 10,
                            radius = Math.min(width, height) / 2 - 10;

                    // var data = d3.range(10).map(Math.random).sort(d3.descending);

                    var color = d3.scale.category20();

                    var arc = d3.svg.arc()
                            .outerRadius(radius);

                    var pie = d3.layout.pie();

                    var svg = d3.select("#chartsum").append("svg")
                            .datum(data)
                            .attr("width", width)
                            .attr("height", height)
                            .append("g")
                            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var arcs = svg.selectAll("g.arc")
                            .data(pie)
                            .enter().append("g")
                            .attr("class", "arc");

                    arcs.append("path")
                            .attr("fill", function (d, i) {
                                return color(i);
                            })
                            .transition()
                            .ease("bounce")
                            .duration(2000)
                            .attrTween("d", tweenPie)
                            .transition()
                            .ease("elastic")
                            .delay(function (d, i) {
                                return 2000 + i * 50;
                            })
                            .duration(750)
                            .attrTween("d", tweenDonut);

                    function tweenPie(b) {
                        b.innerRadius = 0;
                        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                        return function (t) {
                            return arc(i(t));
                        };
                    }

                    function tweenDonut(b) {
                        b.innerRadius = radius * .6;
                        var i = d3.interpolate({innerRadius: 0}, b);
                        return function (t) {
                            return arc(i(t));
                        };
                    }
                }
            };
        })
        .directive('barsavg', function ($parse) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div id="chartavg"></div>',
                link: function (scope, element, attrs) {
                    var data = attrs.data.split(',');

                    console.log(data)
                    var chart = d3.select('#chartavg')
                            .append("div").attr("class", "chartavg")
                            .selectAll('div')
                            .data(data).enter()
                            .append("div")
                            .transition().ease("elastic")
                            .style("width", function (d) {
                                return d + "%";
                            })
                            .text(function (d) {
                                return d + "";
                            });
                }
            };
        });