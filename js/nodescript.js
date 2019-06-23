graph('AAPL')

var tickers = null;

$.getJSON("../json/tickers.json", function(data) {
    tickers = data.sort(function(a, b) {
        return a.length - b.length;
    });
});

function search() {
    $('#tickers').empty();
    var filter = $('#inputSearch').val().toUpperCase()
    if (filter != '') {
        var num = 0
        for (var i in tickers) {
            if (tickers[i].toUpperCase().slice(0, filter.length) == filter) {
                $('#tickers').append("<li>" + tickers[i] + "</li>");
                num++
            }
            if (num == 5) {
                break
            }
        }
    }
}
$(document).ready(function() {
    $('#tickers').on('click', 'li', function() {
        graph($(this).text())
        $('#tickers').empty()
        $('#inputSearch').val('')
    })
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({ hint: CodeMirror.hint.anyword });
    }
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        theme: "base16-dark",
    });

    editor.setSize(null, 700);
    // output functions are configurable.  This one just appends some text
    // to a pre element.
});

function graph(ticker) {
    function afterSetExtremes(e) {

        var url = 'https://quantitate.trade/getData/' + ticker + '&' + Math.round(e.min) + '&' + Math.round(e.max)
        console.log(url)

        var chart = Highcharts.charts[Highcharts.charts.length - 1];

        console.log(Highcharts.charts)

        chart.showLoading('Loading data from server...');
        $.getJSON('https://quantitate.trade/getData/' + ticker + '&' + Math.round(e.min) + '&' + Math.round(e.max), function(data) {
            chart.series[0].setData(data);
            chart.hideLoading();
        });
    }

    $.getJSON('https://quantitate.trade/getData/' + ticker + '&2000-01-01&2020-10-10', function(data) {

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
                text: ticker + ' Stock Price History'
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
                name: ticker,
                dataGrouping: {
                    enabled: false
                }
            }]
        });
    });
}
