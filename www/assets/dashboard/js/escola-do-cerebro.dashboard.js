$(document).ready(function ($) {
    init();

    console.log("init");
});
$(window).resize(function () {
    //$('a').hide(); //discomment after buy 
    $('svg a').hide();
});
function feedback(msg) {
    var text = msg;
    var t;
    console.log(text)
    //  $('#console').text(text).addClass('busy');
    clearTimeout(t);
    t = setTimeout(function () {
        // $('#console').removeClass('busy');

    }, 2500);
}
function init() {
    try {
        userID = window.parent.document.getElementById("userID").value;
        dashID = window.parent.document.getElementById("dashID").value;
        EDUSCADA_ACTION = window.parent.document.getElementById("EDUSCADA_ACTION").value;
        window.parent.document.getElementById("dash-top10").onclick = ajaxPieChart;
        window.parent.document.getElementById("dash-realtime").onclick = ajaxRealTimePieChart;
        window.parent.document.getElementById("dash-everybody").onclick = ajaxLineAllPoints;
        window.parent.document.getElementById("dash-all").onclick = ajaxStockChart;
        window.parent.document.getElementById("dash-mypoints").onclick = ajaxStockPointsChart;
        window.parent.document.getElementById("dash-hability").onclick = ajaxBarHabilidades;

        console.log(userID);
        console.log(dashID);
        console.log(EDUSCADA_ACTION);
    }
    catch (e) {

        console.log(e);
    }




} 