'use strict';

angular.module('myApp.viewG', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewG', {
                    templateUrl: 'viewG/viewG.html',
                    controller: 'ViewGTabCtrl'
                });
            }])

        .controller('ViewGTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-g-background");
            $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
            $scope.hidden = "hidden";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;
            $scope.stateGamer = false;
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
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                $scope.showAlert("Nenhum jogador definido.");

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
            console.log('$scope.user.playerId :' + $scope.user.playerId);
//
            if (Math.round($scope.user.idusers) > 0) {
                $scope.statePlayer = true;
                $scope.checkDash($scope.user.playerId);
                $scope.showAlert("Escolha um caminho " + $scope.user.fullname + ".");

            } else {
                $scope.statePlayer = false;
                // $scope.cleanUser();
            }
//            $.each($scope.measurements, function (key, value) {
//                //console.log('DashboardCtrl:' + key + ' = ' + value);
//
//                var localData = JSON.parse(value);
//                console.log(localData);
//                //localData.playerId = $scope.user.playerId;
//                $scope.logToSend++;
//                $scope.points.push(localData);
//                $scope.statePoints = true;
//                $.each(localData, function (k, v) {
//                    // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
//                });
//            });

            //$scope.showAlert("Você possuí dados  (" + $scope.logToSend + ")  para sincronizar!");
            if ($scope.dashboard.ngames > 0) {
                $scope.stateGamer = true;
                if ($scope.dashboard.ngames > 10) {
                    $scope.stateTesty = true;

                }

            } else {
                $scope.stateGamer = false;
            }


            $timeout(function () {

            }, 100);

        });
 