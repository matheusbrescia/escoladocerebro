
var pathToImages = "amcharts/images/";

function renderStockChart(d1, d2, d3, theme, bgColor, bgImage,chartDashboardObj) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
      //  document.body.style.backgroundColor = bgColor;
        //  document.body.style.backgroundImage = "url(" + bgImage + ")";
    }

    AmCharts.dayNames = "Domingo Segunda Terça Quarta Quinta Sexta Sábado".split(" ");
    AmCharts.shortDayNames = "Dom Seg Ter Qua Qui Sex Sab".split(" ");
    AmCharts.monthNames = "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ");
    AmCharts.shortMonthNames = "Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" ");

    AmCharts.makeChart("" + chartDashboardObj, {
        type: "stock",
        theme: theme,
        pathToImages: pathToImages,
        dataSets: [{
                title: "Acurácia",
                fieldMappings: [{
                        fromField: "value",
                        toField: "value"
                    }, {
                        fromField: "volume",
                        toField: "volume"
                    }],
                dataProvider: d1,
                categoryField: "date"
            },
            {
                title: "Velocidade",
                fieldMappings: [{
                        fromField: "value",
                        toField: "value"
                    }, {
                        fromField: "volume",
                        toField: "volume"
                    }],
                dataProvider: d2,
                categoryField: "date"
            },
            {
                title: "Estabilidade",
                fieldMappings: [{
                        fromField: "value",
                        toField: "value"
                    }, {
                        fromField: "volume",
                        toField: "volume"
                    }],
                dataProvider: d3,
                categoryField: "date"
            }],
        panels: [{
                showCategoryAxis: false,
                title: "Indicadores",
                percentHeight: 50,
                stockGraphs: [{
                        id: "g1",
                        valueField: "value",
                        comparable: true,
                        compareField: "value",
                        bullet: "round",
                        bulletBorderColor: "#FFFFFF",
                        bulletBorderAlpha: 1,
                        balloonText: "[[title]]:<b>[[value]]</b>",
                        compareGraphBalloonText: "[[title]]:<b>[[value]]</b>",
                        compareGraphBullet: "round",
                        compareGraphBulletBorderColor: "#FFFFFF",
                        compareGraphBulletBorderAlpha: 1
                    }],
                stockLegend: {
                    periodValueTextComparing: "[[percents.value.close]]%",
                    periodValueTextRegular: "[[value.close]]"
                }
            },
            {
                title: "Pontuação",
                percentHeight: 50,
                stockGraphs: [{
                        valueField: "volume",
                        type: "column",
                        showBalloon: false,
                        fillAlphas: 1
                    }],
                stockLegend: {
                    periodValueTextRegular: "[[value.close]]"
                }
            }],
        chartScrollbarSettings: {
            graph: "g1"
        },
        chartCursorSettings: {
            valueBalloonsEnabled: true
        },
        periodSelector: {
            position: "left",
            width: 90,
            inputFieldsEnabled: false,
            fromText: "De: ",
            toText: "Até: ",
            periods: [{
                    period: "DD",
                    count: 10,
                    label: "10 dias"
                }, {
                    period: "MM",
                    selected: true,
                    count: 1,
                    label: "1 mês"
                }, {
                    period: "YYYY",
                    count: 1,
                    label: "1 ano"
                }, {
                    period: "YTD",
                    label: "YTD"
                }, {
                    period: "MAX",
                    label: "MAX"
                }]
        },
        dataSetSelector: {
            position: "left",
            width: 90,
            compareText: "Compare com:",
            comboBoxSelectText: "Selecione...",
            selectText: "Indicadores: "
        }
    });
}

function renderStockPointsChart(dataset, theme, bgColor, bgImage,chartDashboardObj) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
      //  document.body.style.backgroundColor = bgColor;
        //  document.body.style.backgroundImage = "url(" + bgImage + ")";
    }

    AmCharts.dayNames = "Domingo Segunda Terça Quarta Quinta Sexta Sábado".split(" ");
    AmCharts.shortDayNames = "Dom Seg Ter Qua Qui Sex Sab".split(" ");
    AmCharts.monthNames = "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ");
    AmCharts.shortMonthNames = "Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" ");
    AmCharts.makeChart("" + chartDashboardObj, {
        type: "stock",
        theme: theme,
        categoryAxesSettings: {
            minPeriod: "mm"
        },
        pathToImages: pathToImages,
        dataSets: [{
                title: "Pontuação",
                fieldMappings: [{
                        fromField: "value",
                        toField: "value"
                    }, {
                        fromField: "volume",
                        toField: "volume"
                    }],
                dataProvider: dataset,
                categoryField: "date"
            }],
        panels: [{
                showCategoryAxis: false,
                title: "Evolução",
                percentHeight: 50,
                stockGraphs: [{
                        id: "g1",
                        valueField: "value",
                        type: "smoothedLine",
                        lineThickness: 2,
                        bullet: "round"
                    }],
                stockLegend: {
                    valueTextRegular: " ",
                    markerType: "none"
                }
            },
            {
                title: "Experiência Acumulada",
                percentHeight: 50,
                stockGraphs: [{
                        valueField: "volume",
                        type: "column",
                        cornerRadiusTop: 2,
                        fillAlphas: 1
                    }],
                stockLegend: {
                    valueTextRegular: " ",
                    markerType: "none"
                }
            }
        ],
        chartScrollbarSettings: {
            graph: "g1",
            usePeriod: "10mm",
            position: "bottom"
        },
        chartCursorSettings: {
            valueBalloonsEnabled: true
        },
        periodSelector: {
            position: "bottom",
            inputFieldsEnabled: false,
            dateFormat: "YYYY-MM-DD JJ:NN",
            fromText: "De: ",
            toText: "Até: ",
            inputFieldWidth: 150,
            periods: [{
                    period: "hh",
                    count: 1,
                    label: "1 hora"

                }, {
                    period: "hh",
                    count: 10,
                    label: "10 horas"
                }, {
                    period: "MAX",
                    label: "MAX"
                }]
        },
        panelsSettings: {
            usePrefixes: true
        }
    });
}

function renderLineMixedChart(data, theme, bgColor, bgImage,chartDashboardObj) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
     //   document.body.style.backgroundColor = bgColor;
        //  document.body.style.backgroundImage = "url(" + bgImage + ")";
    }

    AmCharts.dayNames = "Domingo Segunda Terça Quarta Quinta Sexta Sábado".split(" ");
    AmCharts.shortDayNames = "Dom Seg Ter Qua Qui Sex Sab".split(" ");
    AmCharts.monthNames = "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ");
    AmCharts.shortMonthNames = "Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" ");
    AmCharts.makeChart("" + chartDashboardObj, {
        "type": "xy",
        "theme": theme,
        "pathToImages": pathToImages,
        "dataProvider": data,
        "graphs": [{
                "balloonText": "[[title]]: [[value]]",
                "lineThickness": 2,
                "title": "intra-day",
                "valueField": "value1"
            }, {
                "balloonText": "[[title]]: [[value]]",
                "columnWidth": 20,
                "fillAlphas": 1,
                "title": "daily",
                "type": "column",
                "valueField": "value2"
            }],
        "zoomOutButtonRollOverAlpha": 0.15,
        "chartCursor": {
            "categoryBalloonDateFormat": "MMM DD JJ:NN",
            "cursorPosition": "mouse",
            "showNextAvailable": true
        },
        "autoMarginOffset": 5,
        "columnWidth": 1,
        "categoryField": "date",
        "categoryAxis": {
            "minPeriod": "hh",
            "parseDates": true
        },
        "exportConfig": {
            "menuTop": "20px",
            "menuRight": "20px",
            "menuItems": [{
                    "icon": pathToImages+'export.png',
                    "format": 'png'
                }]
        }
    });
}

function renderPieChart(data, theme, bgColor, bgImage,chartDashboardObj) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
      //  document.body.style.backgroundColor = bgColor;
        //  document.body.style.backgroundImage = "url(" + bgImage + ")";
    }
    AmCharts.makeChart("" + chartDashboardObj, {
        "type": "pie",
        "theme": theme,
        "dataProvider": data,
        "valueField": "pontos",
        "titleField": "nome",
        "outlineAlpha": 0.4,
        "depth3D": 15,
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "angle": 30,
        "exportConfig": {
            menuItems: [{
                    "icon": pathToImages+'export.png',
                    format: 'png'
                }]
        }
    });
}

function renderRealTimePieChart(data, theme, bgColor, bgImage,chartDashboardObj) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
    //    document.body.style.backgroundColor = bgColor;
        //  document.body.style.backgroundImage = "url(" + bgImage + ")";
    }
    AmCharts.makeChart("" + chartDashboardObj, {
        "type": "funnel",
        "theme": theme,
        "dataProvider": data,
        "balloon": {
            "fixedPosition": true
        },
        "valueField": "pontos",
        "titleField": "nome",
        "marginRight": 210,
        "marginLeft": 50,
        "startX": -500,
        "rotate": true,
        "labelPosition": "right",
        "balloonText": "[[title]]: [[value]]n[[description]]",
        "exportConfig": {
            "menuItems": [{
                    "icon": pathToImages+'export.png',
                    "format": 'png'
                }]
        }
    });
//    AmCharts.makeChart("" + chartDashboardObj, {
//        "type": "pie",
//        "theme": theme,
//        "dataProvider": data,
//        "valueField": "pontos",
//        "titleField": "nome",
//        "outlineAlpha": 0.4,
//        "depth3D": 15,
//        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
//        "angle": 30,
//        "exportConfig": {
//            menuItems: [{
//                    icon: 'amcharts/images/export.png',
//                    format: 'png'
//                }]
//        }
//    });
}

function renderBarHabilidades(data, theme, bgColor, bgImage,chartDashboardObj) {

    AmCharts.makeChart("" + chartDashboardObj, {
        type: "serial",
        theme: theme,
        dataProvider: data,
        categoryField: "habilidade",
        startDuration: 1,
        rotate: true,
        categoryAxis: {
            gridPosition: "start"
        },
        valueAxes: [{
                position: "top",
                title: "Habilidade",
                minorGridEnabled: true
            }],
        graphs: [{
                type: "column",
                title: "Total",
                valueField: "total",
                "colorField": "color",
                fillAlphas: 1,
                balloonText: "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>"
            }, {
                type: "line",
                title: "Máximo",
                valueField: "pattern",
                lineThickness: 2,
                bullet: "round",
                balloonText: "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>"
            }],
        legend: {
            useGraphSettings: true
        },
        creditsPosition: "top-right",
        exportConfig: {
            menuRight: '20px',
            menuBottom: '50px',
            menuItems: [{
                    "icon": pathToImages+'export.png',
                    format: 'png'
                }]
        }

    });

}

function renderLineAllPoints(data, theme, bgColor, bgImage,chartDashboardObj) {
    AmCharts.makeChart("" + chartDashboardObj, {
        "type": "serial",
        "theme": theme,
        "pathToImages": pathToImages,
        "dataProvider": data,
        "graphs": [{
                "balloonText": "[[title]]: [[value]]",
                "lineThickness": 2,
                "title": "Geral",
                "connect": false,
                "valueField": "value1"
            }, {
                "balloonText": "[[title]]: [[value]]",
                "columnWidth": 20,
                "fillAlphas": 1,
                "title": "Minha Pontução",
                "type": "column",
                "valueField": "value2"
            }],
        "zoomOutButtonRollOverAlpha": 0.15,
        "chartCursor": {
            "categoryBalloonDateFormat": "MMM DD JJ:NN",
            "cursorPosition": "mouse",
            "showNextAvailable": true
        },
        "autoMarginOffset": 5,
        "columnWidth": 1,
        "categoryField": "date",
        "categoryAxis": {
            "minPeriod": "hh",
            "parseDates": true
        },
        "exportConfig": {
            "menuTop": "20px",
            "menuRight": "20px",
            "menuItems": [{
                    "icon": pathToImages+'export.png',
                    "format": 'png'
                }]
        }
    });
//    AmCharts.makeChart("" + chartDashboardObj, {
//        "type": "serial",
//        "theme": theme,
//        "pathToImages": "/assets/dashboard/amcharts/images/",
//        "dataProvider": data,
//        "valueAxes": [{
//                "axisAlpha": 0,
//                "dashLength": 4,
//                "position": "left"
//            }],
//        "graphs": [{
//                "bulletSize": 14,
//                "customBullet": "/assets/dashboard/amcharts/images/lens.png",
//                "customBulletField": "customBullet",
//                "valueField": "value"
//            }],
//        "marginTop": 20,
//        "marginRight": 20,
//        "marginLeft": 40,
//        "marginBottom": 20,
//        "chartCursor": {graphBulletSize: 1.5},
//        "autoMargins": false,
//        "dataDateFormat": "YYYY-MM-DD",
//        "categoryField": "date",
//        "categoryAxis": {
//            "parseDates": true,
//            "axisAlpha": 0,
//            "gridAlpha": 0,
//            "inside": true,
//            "tickLength": 0
//        },
//        "exportConfig": {
//            "menuTop": "20px",
//            "menuRight": "20px",
//            "menuItems": [{
//                    "icon": 'amcharts/images/export.png',
//                    "format": 'png'
//                }]
//        }
//    });

}
