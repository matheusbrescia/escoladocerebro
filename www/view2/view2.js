'use strict';

angular.module('myApp.view2', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view2', {
                    templateUrl: 'view2/view2.html',
                    controller: 'View2Ctrl'
                });
            }])

        .controller('View2Ctrl', function ($scope, $location, $timeout, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-2-background");
            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.points = [];
            $scope.statePlayer = false;
            $scope.statePoints = false;
            $scope.stateSendPoints = false;
            $scope.title = "Games ";
            $scope.fc = 0;
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
             $scope.gameUrl = "games/index.html";
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
            if (SettingsService.get('game')) {
                $scope.gameIcon = "icone-" + SettingsService.get('game');
                $scope.title = "Game " + SettingsService.get('game');
                $scope.gameId = SettingsService.get('game');
                $scope.gameUrl = "games/" + SettingsService.get('game') + "/" + SettingsService.get('game') + ".html";
                $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";
                $scope.showAlert("Toque em Jogar para iniciar.");

            } else {

                $location.path("view1");
            }


            $scope.iframeLoadedCallBack = function () {
                console.log("iframeLoadedCallBack:" + $scope.fc)
                if ($scope.fc < 1) {
                    document.getElementById($scope.gameId).src += ''; 
                }
                $scope.fc++;

                if ($scope.fc > 1) {
                    $scope.showAlert("Jogue para ganhar experiência.");
                    $scope.off = "hidden";
                }
                $scope.syncData = function () {
                     
                    $scope.showAlert("Sincronizando...");
                    if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                        var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                        var logArrWalk = 0;
                        $.each(logArr, function (key, value) {
                            var localData = JSON.parse(value);
                            localData.playerId = $scope.user.playerId;
                            localData.adminId = $scope.user.adminId;
                            $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
                                    .done(function (rjson) {
                                        if (rjson !== null) {
                                            var obj = JSON.parse(rjson);
                                            logArrWalk++;
                                            $scope.$apply(function () {
                                                if (logArr.length === logArrWalk) {
                                                    localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                                    localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength = 0;
                                                    $scope.points = [];
                                                    $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
                                                    $scope.showAlert("Ranking atualizado, jogue novamente!");
                                                    console.log(obj)
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
            };
            $scope.change = function () {
                $scope.showAlert("Jogue para ganhar experiência.");
                $scope.off = "";
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
 

        });
 