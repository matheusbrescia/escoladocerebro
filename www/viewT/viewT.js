'use strict';

angular.module('myApp.viewT', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewT', {
                    templateUrl: 'viewT/viewT.html',
                    controller: 'ViewTCtrl'
                });
            }])

        .controller('ViewTCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-T-background");

            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.message = "Bem vindo!";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;
            $scope.title = "Escolha um Teste";

            $scope.checkPsicotest = function (game) {
                $scope.gameId = game;
                SettingsService.set('game', game);
                $scope.gameIcon = "icone-" + SettingsService.get('game');
                $scope.title = "Game " + SettingsService.get('game');
                $scope.gameId = SettingsService.get('game');
                $scope.gameUrl = "games/" + SettingsService.get('game') + "/" + SettingsService.get('game') + ".html";
                $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";
                $scope.showAlert("Toque em Jogar para iniciar.");
                 $('#modal_psicotest').modal('show');
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

                console.log(txt)
            };
            $scope.closeAlert = function (txt) {

                $scope.hidden = "hidden";

            };


            $scope.iframeLoadedCallBack = function () {


                $scope.fc++;

                if ($scope.fc > 1) {
                    $scope.showAlert("Teste para ganhar experiência.");
                    $scope.off = "hidden";
                }
              
                $timeout(function () {
                    $scope.button.playPause();
                     
                }, 300);
            };
            $scope.goPath = function (view) {
                $location.path(view);

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
                    $scope.showAlert("Escolha um jogo " + $scope.user.fullname + ".");

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
                    if (localData !== null) {
                        //localData.playerId = $scope.user.playerId;
                        $scope.logToSend++;
                        $scope.points.push(localData);
                        $scope.statePoints = true;
                        $.each(localData, function (k, v) {
                            // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
                        });
                    }
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
               // $scope.baloon.playPause();
            }, 300);
        }); 