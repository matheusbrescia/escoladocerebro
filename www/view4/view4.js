'use strict';

angular.module('myApp.view4', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view4', {
                    templateUrl: 'view4/view4.html',
                    controller: 'RankingCtrl'
                });
            }])
        .controller('RankingCtrl', function ($scope, $http, SettingsService, $location, $timeout, BackgroundService) {
            BackgroundService.setCurrentBg("view-4-background");
            $scope.dashUrl = "games/ranking/ranking.html";
            $scope.hidden = "hidden";
            $scope.title = "Ranking";
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
              $scope.statePoints = false;
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
            $scope.show = function () {
                $scope.hidden = "alert";
            };
            $scope.hide = function () {

                $scope.hidden = "hidden";
            };
            $scope.showAlert = function (txt) {
                $scope.hidden = "alert";
                $scope.message = txt;

                console.log(txt)
            };
            $scope.closeAlert = function (txt) {

                $scope.hidden = "hidden";

            };
            $scope.syncDash = function ( ) {
                $scope.showAlert("Momentinho, vamos atualizar o ranking...");
                $scope.dashUrl = "games/ranking/ranking.html";
                $timeout(function () {
                    $scope.showAlert("Pronto, aqui você pode ver sobre o seu desempenho!");
                }, 300);
            };
            $scope.goPath = function (view) {

                $location.path(view);
            };

            $scope.iframeLoadedCallBack = function () {

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
 