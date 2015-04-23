var chartData1 = [];
var chartData2 = [];
var chartData3 = [];
var userID = 1;
var dashID = "connectome";
var chartDashboardObj = "chart_dashboard";

function init() {

    try {
        userID = Number(window.parent.document.getElementById("userID").value);
        dashID = new String(window.parent.document.getElementById("dashID").value);
        console.log("userID " + userID + " dashID " + dashID);
    }
    catch (e) {
        console.log("ZERO PRA TI");
    }


    $('a').contents().unwrap();//discomment after buy
    $.ajax({
        url: "http://escoladocerebro.org/eduscada/c/index.php/ec_query_players",
        type: 'POST',
        data: {action: "points", idusers: userID, idgame: dashID, level: "0"},
        crossDomain: true,
        dataType: 'json',
        headers: {Accept: "application/json", "Access-Control-Allow-Origin": "*"},
        beforeSend: function(x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        success: function(d) {
            if (d !== null) {
                var obj = JSON.parse(d);
                $.each(obj, function(i, val) {


                    chartData1.push({
                        date: obj[i].timestamp,
                        value: Number(obj[i].acuracia),
                        volume: Number(obj[i].pontuacao)
                    });
                    chartData2.push({
                        date: obj[i].timestamp,
                        value: Number(obj[i].velocidade),
                        volume: Number(obj[i].pontuacao)
                    });
                    chartData3.push({
                        date: obj[i].timestamp,
                        value: Number(obj[i].estabilidade),
                        volume: Number(obj[i].pontuacao)
                    });

                    //console.log(i + " " + val + " " + obj[i].timestamp + " " + obj[i].acuracia + " " + obj[i].velocidade);
                    $.each(val, function(u, wv) {
                        //   console.log(u + " " + wv);
                    });
                });
                makeChart(chartDashboardObj, 'chalk', '#282828', '/eduscada/dashboard/amcharts/images/board.jpg');
                $('a').contents().unwrap();//discomment after buy
            }
        }
    });

    return true;
}

function makeChart(div, theme, bgColor, bgImage) {
    var chart;
    if (chart) {
        chart.clear();
    }

    if (document.body) {
        document.body.style.backgroundColor = bgColor;
        document.body.style.backgroundImage = "url(" + bgImage + ")";
    }

    AmCharts.dayNames = "Domingo Segunda Terça Quarta Quinta Sexta Sábado".split(" ");
    AmCharts.shortDayNames = "Dom Seg Ter Qua Qui Sex Sab".split(" ");
    AmCharts.monthNames = "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" ");
    AmCharts.shortMonthNames = "Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" ");

    AmCharts.makeChart(div, {
        type: "stock",
        theme: theme,
        pathToImages: "/eduscada/dashboard/amcharts/images/",
        dataSets: [{
                title: "Acurácia",
                fieldMappings: [{
                        fromField: "value",
                        toField: "value"
                    }, {
                        fromField: "volume",
                        toField: "volume"
                    }],
                dataProvider: chartData1,
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
                dataProvider: chartData2,
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
                dataProvider: chartData3,
                categoryField: "date"
            }],
        panels: [{
                showCategoryAxis: false,
                title: "Indicadores",
                percentHeight: 70,
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
                percentHeight: 30,
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
            width: 85,
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
            width: 85,
            compareText: "Compare com:",
            comboBoxSelectText: "Selecione...",
            selectText: "Selecione: "
        }
    });

}

$(document).ready(function() {
    init();
});