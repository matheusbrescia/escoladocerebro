'use strict';

angular.module('myApp.view6', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view6', {
                    templateUrl: 'view6/view6.html',
                    controller: 'view6Ctrl'
                });
            }])

        .controller('view6Ctrl', function ($scope, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-6-background");

            if (SettingsService.get('game')) {
                $scope.gameIcon = "icone-" + SettingsService.get('game');

                $scope.gameId = SettingsService.get('game');
                var folder = "dashboard";
                $scope.gameUrl = "\"" + folder + "/"  + "escola-do-cerebro-ranking.html.html";
               
                $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";

            } else {

                $location.path("viewG");
            }

            $scope.iframeLoadedCallBack = function () {
                $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
            };

            $scope.goBack = function ( ) {
                // $state.go("tabs.home");
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
                    console.log("Você ainda não tem pontos! Jogue para conquistá-los.");
                }

                $location.path("view6");
            };


        });
 