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
            $scope.title = "Escola um Jogo de Avaliação";
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
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
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
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