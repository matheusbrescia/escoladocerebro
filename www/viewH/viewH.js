'use strict';

angular.module('myApp.viewH', ['ngRoute', 'mediaPlayer'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewH', {
                    templateUrl: 'viewH/viewH.html',
                    controller: 'ViewHTabCtrl'
                });
            }])

        .controller('ViewHTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {

            BackgroundService.setCurrentBg("view-h-background");
            $scope.hidden = "hidden";
            $scope.stateProfessor = false;
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
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
                $scope.dashboard = {
                    ngames: '',
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

            };

            if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                } else {
                    $scope.cleanUser();
                }
            } else {
                $scope.cleanUser();
            }
            if (localStorage.brComCognisenseEscolaDoCerebroUserDashboard && localStorage.brComCognisenseEscolaDoCerebroUserDashboard != 0) {
                $scope.dashboard = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserDashboard);
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;

                } else {
                    $scope.stateGamer = false ;
                }

            } else {
                $scope.cleanUser();  
            }
            $timeout(function () {
                $scope.hidden = "";
                $scope.baloon.playPause();
            }, 300);

        });
 