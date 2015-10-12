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

            $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
            $scope.ec_log_games = "https://escoladocerebro.org/eduscada/c/index.php/ec_log_games";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;
            $scope.hidden = "hidden";
            $scope.title = "Dashboard";
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.dashboardall = JSON.parse(window.localStorage['org.escoladocerebro.dashboardall'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
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

                                $scope.dashboard = JSON.parse(json)[0];
                                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                $timeout(function () {
                                    $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");
                                    if ($scope.measurements.length > 0) {
                                        $scope.statePoints = true;
                                        $.each($scope.measurements, function (key, value) {
                                            //console.log('DashboardCtrl:' + key + ' = ' + value); 
                                            var localData = JSON.parse(value);
                                            console.log(localData);
                                            //localData.playerId = $scope.user.playerId; 
                                            $scope.points.push(localData);
                                            $scope.statePoints = true;
                                            $.each(localData, function (k, v) {
                                                // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
                                            });
                                        });
                                    } else {
                                        $scope.statePoints = false;
                                    }

                                    if ($scope.dashboard.ngames > 0) {
                                        $scope.stateGamer = true;
                                    } else {
                                        $scope.stateGamer = false;
                                    }
                                }, 1000);
                            } else {
                                $scope.$apply(function () {
                                    $timeout(function () {
                                        $scope.showAlert("Sem dados no dashboard!");

                                    }, 1000);

                                });
                            }
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {

                                $scope.showAlert("Você parece estar OFF-LINE!");
                            });

                        });

            };
            $scope.checkDashAll = function (player) {

                $.getJSON($scope.ec_query_players, {action: "dashboardbyall"})
                        .done(function (json) {
                            if (json !== null) {
                                $scope.dashboardall = JSON.parse(json)[0];
                                $scope.checkDash(player);
                            } else {
                                $scope.$apply(function () {
                                    $timeout(function () {
                                        $scope.showAlert("Sem dados no dashboard!");
                                    }, 1000);

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

                var sampleWalker = 0;
                var sampleLength = $scope.measurements.length;

                if (sampleLength > 0) { 
                    $scope.showAlert("Sincronizando " + sampleLength + " jogadas.");
                } else { 
                    $scope.showAlert("Você não tem dados para sincronizar.");
                }
                $.each($scope.measurements, function (key, value) {
                    var lastSample = JSON.parse(value);
                    lastSample.playerId = $scope.user.playerId;
                    lastSample.adminId = $scope.user.adminId;
                      console.log("Sincronizando..." + sampleWalker + " dados.");
                    $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(lastSample)})
                            .done(function (json) {
                                if (json !== null) {
                                    sampleWalker++;
                                    if (sampleLength === sampleWalker) {
                                        var measurements = [];
                                        localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
                                        $scope.points = [];
                                        $scope.statePoints = false;
                                        $scope.showAlert("Parabéns, todos os " + sampleLength + " dados enviados!");
                                        return true;
                                    }
                                    console.log("Sincronizando..." + sampleWalker + " dados.");
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                             $scope.showAlert("Aconteceu algum bug ao enviar os dados!");
                                        }, 1000); 
                                    });
                                   
                                    return false;
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                        $timeout(function () {
                                             $scope.showAlert("Você parece estar off-line!");
                                        }, 1000); 
                                    });
                                
                                return false;
                            });
                });

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
                $scope.dashboardall = {
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
                window.localStorage['org.escoladocerebro.dashboardall'] = JSON.stringify($scope.dashboardall);
                $scope.showAlert("Nenhum jogador definido.");
            };

            if ($scope.user.playerId > 0) {
                $scope.statePlayer = true;
                $scope.checkDashAll($scope.user.playerId);
            } else {
                $scope.statePlayer = false;
                $scope.cleanUser();
            }


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
        })
        .directive("sparklinechart", function () {

            return {
                restrict: "E",
                scope: {
                    data: "@"
                },
                compile: function (tElement, tAttrs, transclude) {
                    tElement.replaceWith("<span>" + tAttrs.data + "</span>");
                    return function (scope, element, attrs) {
                        attrs.$observe("data", function (newValue) {
                            element.html(newValue);
                            element.sparkline('html',
                                    {type: 'line',
                                        width: '100%',
                                        height: '100px',
                                        lineColor: '#8688c7',
                                        barWidth: 11,
                                        sliceColors: ['#8688c7', '#1aacc3', '#9de49d', '#9074b1', '#66aa00', '#dd4477'],
                                        barColor: '#1aacc3',
                                        borderWidth: 1,
                                        borderColor: '#8688c7',
                                        tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{percent.1}}%)',
                                        tooltipValueLookups: {
                                            'names': {
                                                0: 'acuracia ',
                                                1: 'velocidade',
                                                2: 'estabilidade'
                                            }
                                        }

                                    }
                            );
                        });
                    };
                }
            };
        });