'use strict';

angular.module('myApp.view1', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view1', {
                    templateUrl: 'view1/view1.html',
                    controller: 'View1Ctrl'
                });
            }])

        .controller('View1Ctrl', function ($scope, $timeout, $location, SettingsService, BackgroundService) {
            BackgroundService.setCurrentBg("view-1-background");

            $scope.hidden = "hidden";
            $scope.off = "hidden";
            $scope.message = "Bem vindo!";
            $scope.stateAdmin = false;
            $scope.statePlayer = false;
            $scope.title = "Escolha um Game"; 

            $scope.checkGame = function (game) {
                $scope.gameId = game;
                SettingsService.set('game', game);

                $location.path('/view2/view2.html');
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
                    $scope.showAlert("Escolha um jogo " + $scope.user.fullname + ".");

                } else {
                   
                    $scope.cleanUser(); 
                }

            } else {
                 $scope.cleanUser();  
            }
            $timeout(function () {
                $scope.baloon.playPause();
            }, 300);
            
            $scope.goPath = function (view) {
                $location.path(view);

            };
        }); 