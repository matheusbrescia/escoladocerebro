'use strict';

angular.module('myApp.viewH', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/viewH', {
                    templateUrl: 'viewH/viewH.html',
                    controller: 'ViewHTabCtrl'
                });
            }])

        .controller('ViewHTabCtrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {

            BackgroundService.setCurrentBg("view-h-background");
            $scope.hidden = "hidden";
            $scope.points = [];
            $scope.stateProfessor = false;
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.stateGamer = false;
            $scope.stateMeasurements = 0;
            $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
            $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
            $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
            $scope.goPath = function (view) {
                $location.path(view);
            };
            $scope.cleanUser = function () {
                
                $scope.statePlayer = false;
                $scope.user = {
                    idusers: 0,
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
                    playerId: 0,
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
                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

            };

            if ($scope.user.idusers > 0) {
                $scope.statePlayer = true;
                console.log("statePlayer:" + $scope.user.idusers);
            } else {
                $scope.statePlayer = false;
                $scope.cleanUser();
            }
            
            if ($scope.measurements.length > 0) {
                $scope.stateMeasurements = true;
                console.log("stateMeasurements:" + $scope.measurements.length);
            } else {
                $scope.stateMeasurements = false;
                //$scope.cleanUser();
            }
            $timeout(function () {
                $scope.hidden = "";

            }, 100);


        });
 
 