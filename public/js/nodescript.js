

function afterSetExtremes(e) {

    var chart = Highcharts.charts[0];

    chart.showLoading('Loading data from server...');
    $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?start=' + Math.round(e.min) +
            '&end=' + Math.round(e.max) + '&callback=?', function (data) {

        chart.series[0].setData(data);
        chart.hideLoading();
    });
}


$.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function(data) {

    data = [].concat(data, [
        [Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]
    ]);

    Highcharts.stockChart('container', {
        chart: {
            type: 'candlestick',
            zoomType: 'x'
        },
        credits: {
            enabled: false
        },

        navigator: {
            adaptToUpdatedData: false,
            series: {
                data: data
            }
        },

        scrollbar: {
            liveRedraw: false
        },

        title: {
            text: 'AAPL Stock Price History'
        },

        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 1,
                text: '1d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 4
        },

        xAxis: {
            events: {
                afterSetExtremes: afterSetExtremes
            },
            minRange: 3600 * 1000 * 24
        },

        yAxis: {
            floor: 0
        },

        series: [{
            data: data,
            name: 'AAPL',
            dataGrouping: {
                enabled: false
            }
        }]
    });
});

