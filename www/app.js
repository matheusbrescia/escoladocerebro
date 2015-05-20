'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.viewH',
    'myApp.viewL',
    'myApp.viewG',
    'myApp.view1',
    'myApp.view2',
    'myApp.view3',
    'myApp.view4',
    'myApp.view5',
    'myApp.view6',
    'myApp.viewT'

]).factory('BackgroundService', [function () {
        var currentBackgroundClass = 'view-1-background view-2-background view-3-background view-4-background view-5-background view-6-background view-H-background view-G-background view-L-background view-R-background view-T-background home-background';
        return  {
            setCurrentBg: function (c) {
                currentBackgroundClass = c;
            },
            getCurrentBg: function () {
                return currentBackgroundClass;
            }
        };
    }])
        .controller('MainController', ['$scope', 'BackgroundService', function ($scope, backgroundService) {
                $scope.bgService = backgroundService;

            }])

        .service('SettingsService', function () {
            var _variables = {};

            return {
                get: function (varname) {
                    return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
                },
                set: function (varname, value) {
                    _variables[varname] = value;
                }
            };
        })
        .service('State', function () {
            var property = 'none';

            return {
                getProperty: function () {
                    return property;
                },
                setProperty: function (value) {
                    property = value;
                }
            };
        })
        .directive('iframeOnload', [function () {
                return {
                    scope: {
                        callBack: '&iframeOnload'
                    },
                    link: function (scope, element, attrs) {
                        element.on('load', function () {
                            return scope.callBack();
                        });
                    }
                };
            }])
        .directive('myDatepicker', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    $(function () {
                        element.datepicker({
                            showOn: "both",
                            changeYear: true,
                            changeMonth: true,
                            dateFormat: 'yy-mm-dd',
                            maxDate: new Date(),
                            yearRange: '1914:2014',
                            onSelect: function (dateText, inst) {
                                ngModelCtrl.$setViewValue(dateText);
                                scope.$apply();
                            }
                        });
                    });
                }
            };
        })
        
        .filter('trusted', ['$sce', function ($sce) {
                return function (url) {
                    return $sce.trustAsResourceUrl(url);
                };
            }])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.otherwise({redirectTo: '/viewH'});
            }])

        .controller('SalesController', ['$scope', function ($scope) {
                $scope.salesData = [
                    {hour: 1, sales: 54},
                    {hour: 2, sales: 66},
                    {hour: 3, sales: 77},
                    {hour: 4, sales: 70},
                    {hour: 5, sales: 60},
                    {hour: 6, sales: 63},
                    {hour: 7, sales: 55},
                    {hour: 8, sales: 47},
                    {hour: 9, sales: 55},
                    {hour: 10, sales: 30}
                ];
            }])

        .directive('linearChart', function ($window) {
            return{
                restrict: 'EA',
                template: "<svg width='850' height='200'></svg>",
                link: function (scope, elem, attrs) {
                    var salesDataToPlot = scope[attrs.chartData];
                    var padding = 20;
                    var pathClass = "path";
                    var xScale, yScale, xAxisGen, yAxisGen, lineFun;

                    var d3 = $window.d3;
                    var rawSvg = elem.find('svg');
                    var svg = d3.select(rawSvg[0]);

                    function setChartParameters() {

                        xScale = d3.scale.linear()
                                .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length - 1].hour])
                                .range([padding + 5, rawSvg.attr("width") - padding]);

                        yScale = d3.scale.linear()
                                .domain([0, d3.max(salesDataToPlot, function (d) {
                                        return d.sales;
                                    })])
                                .range([rawSvg.attr("height") - padding, 0]);

                        xAxisGen = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(salesDataToPlot.length - 1);

                        yAxisGen = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(5);

                        lineFun = d3.svg.line()
                                .x(function (d) {
                                    return xScale(d.hour);
                                })
                                .y(function (d) {
                                    return yScale(d.sales);
                                })
                                .interpolate("basis");
                    }

                    function drawLineChart() {

                        setChartParameters();

                        svg.append("svg:g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0,180)")
                                .call(xAxisGen);

                        svg.append("svg:g")
                                .attr("class", "y axis")
                                .attr("transform", "translate(20,0)")
                                .call(yAxisGen);

                        svg.append("svg:path")
                                .attr({
                                    d: lineFun(salesDataToPlot),
                                    "stroke": "blue",
                                    "stroke-width": 2,
                                    "fill": "none",
                                    "class": pathClass
                                });
                    }

                    drawLineChart();
                }
            };
        });
