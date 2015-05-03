'use strict';

angular.module('myApp.viewG', ['ngRoute', 'mediaPlayer'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewG', {
                    templateUrl: 'viewG/viewG.html',
                    controller: 'ViewGTabCtrl'
                });
            }])

        .controller('ViewGTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-g-background");
            $scope.ec_query_players = 'http://escoladocerebro.org/eduscada/c/index.php/ec_query_players';

            $scope.hidden = "hidden";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;

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
                                    // $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");
                                }, 5000);
                            } else {
                                $scope.$apply(function () {
                                    $timeout(function () {
                                        //   $scope.showAlert("Sem dados no dashboard!");

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


            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.checkDash($scope.user.playerId);
                    $scope.showAlert("Escolha um caminho " + $scope.user.fullname + ".");

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
                //  $scope.showAlert("Parabéns, todos seus dados estão sincronizados!");
            }
            if (localStorage.brComCognisenseEscolaDoCerebroUserDashboard && localStorage.brComCognisenseEscolaDoCerebroUserDashboard != 0) {
                $scope.dashboard = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserDashboard);
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                    if ($scope.dashboard.ngames > 10) {
                        $scope.stateTesty = true;

                    }

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
 