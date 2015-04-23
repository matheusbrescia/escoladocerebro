function ajaxPieChart() {
    EDUSCADA_ACTION = "ranking";
  
    var chartDashboardObj = "chart_ajaxPieChart";
    console.log(EDUSCADA_ACTION);
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var data = JSON.parse(json);
                    if (data !== null) {
                        renderPieChart(data, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/board.jpg',chartDashboardObj);
                        $('a').hide(); //discomment after buy 
                    } else {

                    }
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

}

function ajaxRealTimePieChart() {
    EDUSCADA_ACTION = "realtime";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxRealTimePieChart";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var data = JSON.parse(json);
                    if (data !== null) {
                        renderRealTimePieChart(data, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/board.jpg',chartDashboardObj);
                        $('a').hide(); //discomment after buy 
                    } else {

                    }
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

}

function ajaxLineAllPoints() {
    EDUSCADA_ACTION = "allpoints";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxLineAllPoints";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idusers: userID, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    var data = [];
                    $.each(obj, function (i, val) {
                        data.push({
                            date: obj[i].timestamp,
                            value1: Number(obj[i].pontuacao),
                            value2: Number(obj[i].mypontuacao)
                        });

                        //console.log(i + " " + val + " " + obj[i].timestamp + " " + obj[i].acuracia + " " + obj[i].velocidade);
                        $.each(val, function (u, wv) {
                            //   console.log(u + " " + wv);
                        });
                    });
                    renderLineAllPoints(data, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/board.jpg',chartDashboardObj);
                    $('a').hide(); //discomment after buy  
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

    return true;

}

function ajaxStockChart() {
    EDUSCADA_ACTION = "allmypoints";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxStockChart";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idusers: userID, idgame: dashID})
            .done(function (json) {

                var d1 = [];
                var d2 = [];
                var d3 = [];
                if (json !== null) {
                    var obj = JSON.parse(json);
                    $.each(obj, function (i, val) {
                        d1.push({
                            date: obj[i].timestamp,
                            value: Number(obj[i].acuracia),
                            volume: Number(obj[i].pontuacao)
                        });
                        d2.push({
                            date: obj[i].timestamp,
                            value: Number(obj[i].velocidade),
                            volume: Number(obj[i].pontuacao)
                        });
                        d3.push({
                            date: obj[i].timestamp,
                            value: Number(obj[i].estabilidade),
                            volume: Number(obj[i].pontuacao)
                        });
                        //console.log(i + " " + val + " " + obj[i].timestamp + " " + obj[i].acuracia + " " + obj[i].velocidade);
                        $.each(val, function (u, wv) {
                            //   console.log(u + " " + wv);
                        });
                    });
                    renderStockChart(d1, d2, d3, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/images/board.jpg',chartDashboardObj);
                    $('a').hide();
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

    return true;
}

function ajaxStockPointsChart() {
    EDUSCADA_ACTION = "allmypoints";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxStockPointsChart";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idusers: userID, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var dataset = [];
                    var sum = 0;
                    var obj = JSON.parse(json);
                    $.each(obj, function (i, val) {
                        sum += Number(obj[i].pontuacao);
                        dataset.push({
                            date: obj[i].timestamp,
                            value: Number(obj[i].pontuacao),
                            volume: Number(sum)
                        });
                        //console.log(i + " " + val + " " + obj[i].timestamp + " " + obj[i].acuracia + " " + obj[i].velocidade);
                        $.each(val, function (u, wv) {
                            //   console.log(u + " " + wv);
                        });
                    });
                    renderStockPointsChart(dataset, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/',chartDashboardObj);
                    $('a').hide(); //discomment after buy
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

    return true;
}

function ajaxBarHabilidades() {

    EDUSCADA_ACTION = "habilities";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxBarHabilidades";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idusers: userID, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    if (obj !== null) {
                        var data = [
                            {
                                "habilidade": "Memória",
                                "total": obj[0].memoria,
                                "pattern": obj[0].memoria,
                                "color": "#5e5493"
                            },
                            {
                                "habilidade": "Resolução de Problemas",
                                "total": obj[0].resolucao_problemas,
                                "pattern": obj[0].resolucao_problemas,
                                "color": "#4eadf7"
                            },
                            {
                                "habilidade": "Atenção",
                                "total": obj[0].atencao,
                                "pattern": obj[0].atencao,
                                "color": "#d35890"
                            }
                        ];

                        renderBarHabilidades(data, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/board.jpg',chartDashboardObj);
                        $('a').hide(); //discomment after buy 
                    } else {

                    }
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

}

function ajaxLineMixedChart() {
    EDUSCADA_ACTION = "allmypoints";
    console.log(EDUSCADA_ACTION);
    
    var chartDashboardObj = "chart_ajaxLineMixedChart";
    $.getJSON("http://escoladocerebro.org/eduscada/c/index.php/ec_query_players", {action: EDUSCADA_ACTION, idusers: userID, idgame: dashID})
            .done(function (json) {
                if (json !== null) {
                    var obj = JSON.parse(json);
                    var chartData = [];
                    $.each(obj, function (i, val) {
                        chartData.push({
                            date: obj[i].timestamp,
                            value1: Number(obj[i].pontuacao),
                            value2: Number(obj[i].pontuacao)
                        });
                        //console.log(i + " " + val + " " + obj[i].timestamp + " " + obj[i].acuracia + " " + obj[i].velocidade);
                        $.each(val, function (u, wv) {
                            //   console.log(u + " " + wv);
                        });
                    });
                    renderLineMixedChart(chartData, 'chalk', '#516e5b', 'http://escoladocerebro.org/eduscada/dashboard/amcharts/board.jpg',chartDashboardObj);
                    $('a').hide(); //discomment after buy 

                }

            })
            .fail(function (jqxhr, textStatus, error) {
                feedback("Você parece estar off-line!");
            });

    return true;
}

