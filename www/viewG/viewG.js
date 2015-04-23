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

            $scope.hidden = "hidden";
            $scope.stateAdmin = false;
            $scope.statePlayer = false;

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

                $timeout(function () {
                    $location.path(view);
                }, 500);

            };
            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.showAlert("Escolha um caminho " + $scope.user.fullname + ".");

                } else {
                    $scope.statePlayer = false;
                    $scope.showAlert("Nenhum jogador definido.");

                }

            } else {
                $scope.statePlayer = false;
                $scope.showAlert("Nenhum jogador definido.");

            }
            $timeout(function () {
                $scope.baloon.playPause();
            }, 300);
        });
 