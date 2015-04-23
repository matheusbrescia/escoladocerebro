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
            $scope.message = "Bem vindo!";
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.title = "Games ";
            $scope.fc = 0;
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
                $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
                $scope.fc++;
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
                    if ($scope.fc > 1) {
                        $scope.showAlert("Você fez " + Math.round(points) + " nessa jogada!");
                        $scope.syncData();
                    }
                } else {
                    $scope.showAlert("Você ainda não tem pontos! Jogue para conquistá-los.");
                }

                $scope.syncData = function () {
                    localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                    $scope.showAlert("Sincronizando...");
                    if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                        var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                        var logArrWalk = 0;

                        $.each(logArr, function (key, value) {
                            var localData = JSON.parse(value);
                            localData.playerId = $scope.user.playerId;
                            localData.adminId = $scope.user.adminId;

                            $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
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

                $timeout(function () {
                    $scope.button.playPause();
                }, 500);
            };

            $scope.goPath = function (view) {
                $location.path(view);

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
                localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                $scope.showAlert("Nenhum jogador definido.");
            };

            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.showAlert("Toque para iniciar o game " + $scope.user.fullname + ".");

                } else { 
                    $scope.cleanUser(); 
                }

            } else { 
                 $scope.cleanUser();

            }

        });
 