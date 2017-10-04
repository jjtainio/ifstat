
var dataTX = [];
var dataRX = [];

var labels =[];
var datasets=[];
var myChart;
var tempData;
var speed = 1000;

var MACRO_NETWORKTYPE_NO_SERVICE = 0;
var MACRO_NETWORKTYPE_GPRS = 1;
var MACRO_NETWORKTYPE_EDGE = 2;
var MACRO_NETWORKTYPE_HSDPA = 3;
var MACRO_NETWORKTYPE_HSUPA = 4;
var MACRO_NETWORKTYPE_UMTS = 5;
var MACRO_NETWORKTYPE_CDMA = 6;
var MACRO_NETWORKTYPE_EV_DO_A = 7;
var MACRO_NETWORKTYPE_EV_DO_B = 8;
var MACRO_NETWORKTYPE_GSM = 9;
var MACRO_NETWORKTYPE_EV_DO_C = 10;
var MACRO_NETWORKTYPE_LTE = 11;
var MACRO_NETWORKTYPE_HSPA_PLUS = 12;
var MACRO_NETWORKTYPE_DC_HSPA_PLUS  = 13;

network_types=['No service', 'GPRS', 'EDGE','HSDPA', 'HSUPA', 'UMTS', 'CDMA', 'EV DO A','EV DO B','GSM','EV DO C','LTE','HSPA+','DC HSPA+'];

var palette = ["#7CCDA8","#42B3D5","#1A237E","#FFECB3","#E85285","#6A1B9A","#FEEB65","#E4521B","#4D342F"];

function get_random_color() {
    function c() {
        var hex = Math.floor(Math.random()*256).toString(16);
        return ("0"+String(hex)).substr(-2); // pad with zero
    }
    return "#"+c()+c()+c();
}

function getWanInfo()
{

    var jsonData = $.ajax({
        url: 'getWanInfo.php',
        dataType: 'json',
    }).done(function (results) {
        $("#moggulaInfo").html("Network: <b>"+results.network_name+"</b> Type: "+network_types[results.network_type]+" Max speed: "+(results.download/1000/1024).toFixed(0)+"M/"+(results.upload/1000/1024).toFixed(0)+"M. Traffic count: "+(results.usage/1024/1024).toFixed(0)+"MB ");

    });

    var jsonData = $.ajax({
        url: 'getWanInfo.php?type=signal',
        dataType: 'json',
    }).done(function (results2) {
        $("#signal").html("Signal: <b>"+results2.signal+"/5</b>");

    });


}

function drawLineChart(update) {

    getWanInfo();
    // Add a helper to format timestamp data
    Date.prototype.formatMMDDYYYY = function() {
        return (this.getMonth() + 1) +
            "/" +  this.getDate() +
            "/" +  this.getFullYear();
    }

    var jsonData = $.ajax({
        url: 'ifstat.php',
        dataType: 'json',
    }).done(function (results) {

        // Split timestamp and data into separate arrays
        var ifIdx=0;
        var colorIdx=0;
        jQuery.each(results.item.ifnames, function (interface, val) {
            dataTX = [];
            dataRX = [];

            labels = [];
            jQuery.each(val, function (measurement, values) {
                date = new Date(values.timestamp * 1000);
                time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                labels.push(time);
                dataRX.push(values.rx);
                dataTX.push(values.tx);

            });
            /*            datasets.push(
                            {
                                label: interface,
                                fillColor             : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+","+((ifIdx*5)+205)+",0.2)",
                                strokeColor           : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+","+((ifIdx*5)+205)+",1)",
                                pointColor            : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+",0,1)",
                                pointStrokeColor      : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+","+((ifIdx*5)+205)+",1)",
                                pointHighlightFill    : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+","+((ifIdx*5)+205)+",1)",
                                pointHighlightStroke  : "rgba("+((ifIdx*10)+151)+","+((ifIdx*5)+187)+","+((ifIdx*5)+205)+",1)",
                                data                  : data
                            }
                        );
                        */
            if (interface == "tun0") {
                borderColor = 'rgb(150,200,250)';
                backgroundColor = 'rgba(255,255,255,0.0)';
                label="INTERNET tx";
            }
            else {
                label=interface+' tx';

//                borderColor = 'rgba(' + ((ifIdx * 20) + 5) + ',' + ((ifIdx * 70) + 5) + ',' + ((ifIdx * 40) + 5) + ',0.5)';
                borderColor = palette[colorIdx];
                colorIdx++;
                backgroundColor = 'rgba('+((ifIdx*15)+101)+','+((ifIdx*15)+217)+','+((ifIdx*15)+200)+',0.2)';

            }


            datasets.push(
                {
                    label: label,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 2,
                    lineTension: 0.25,
                    pointRadius: 0,
                    data         : dataTX
                }
            );

            if(interface=="tun0") {
                borderColor = 'rgb(50,205,100)';
                backgroundColor = 'rgba(255,255,255,0.0)';
                label="INTERNET rx";

            }
            else {
                borderColor = palette[colorIdx];
                colorIdx++;
                backgroundColor= 'rgba('+((ifIdx*15)+151)+','+((ifIdx*15)+187)+','+((ifIdx*15)+200)+',0.2)';
                label=interface+' rx';

            }

            datasets.push(
                {
                    label: label,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 2,
                    lineTension: 0.25,
                    pointRadius: 0,
                    data         : dataRX
                }
            );

            ifIdx++;
        });
        // Create the chart.js data structure using 'labels' and 'data'

        /*
            var tempData = {
                labels : labels,
                datasets : [{
                    label: "My First dataset",
                    fillColor             : "rgba(151,187,205,0.2)",
                    strokeColor           : "rgba(151,187,205,1)",
                    pointColor            : "rgba(151,187,205,1)",
                    pointStrokeColor      : "#fff",
                    pointHighlightFill    : "#fff",
                    pointHighlightStroke  : "rgba(151,187,205,1)",
                    data                  : data
                }]
            };
    */

        if(update==0) {

            tempData= {
                labels : labels,
                datasets: datasets
            };
            var ctx = document.getElementById("myChart").getContext("2d");

            // Get the context of the canvas element we want to select

            // Instantiate a new chart

            myChart = new Chart(ctx, {
                type: 'line',
                data: tempData,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: {
                        duration: 0,
                        easing: 'linear'
                    },
                    legend: true,
                    scales: {
                        xAxes: [{
                            display: true,
                            ticks: {
                                autoSkip:true,
                                maxTicksLimit:30,
                                gridLines: {
                                    color: 'rgba(171,171,171,1)',
                                    lineWidth: 1
                                }
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'kbps'
                            },
                            gridLines: {
                                color: 'rgba(171,171,171,0.3)',
                                borderDash: [8, 4],
                                lineWidth: 1
                            }
                        }]

                    }
                }
            });

            advance();
        }
        else
        {
//            labels.shift();
//            datasets.shift();
            tempData= {
                labels : labels,
                datasets: datasets
            };
        }
    });
}

function advance(){

    // Instantiate a new chart
    myChart.data=tempData;
    myChart.update();

    setTimeout(function() {
        requestAnimationFrame(advance);
    }, 100);
}

$( document ).ready(function() {

    drawLineChart(0);

    //test code
    setInterval( function () {
        data = [];
        labels =[];
        datasets=[];

        drawLineChart(1);

    },1000);

});

