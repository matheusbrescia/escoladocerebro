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
            $scope.hidden = "hidden";
            $scope.title = "Ranking";
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
                    $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;

                } else {
                    $location.path('viewL');
                }

            } else {
                $location.path('viewL');

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
            $scope.iframeLoadedCallBack = function () {
                $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
            };
        });
 