// load the Google packages
google.charts.load('current', {'packages': ['corechart', 'table', 'controls']});

google.setOnLoadCallback(DrawChart); // call back DrawChar function when google API loaded


/// PREPARATION
// declare base url of google spreadsheet
var base_url = "https://docs.google.com/spreadsheets/d/1pfwkJfSusgSxtF1sdCyWbm1-nVaMw1skap-y3yo_9nQ/gviz/tq?sheet=";

// DrawChart function that will make charts for visualization
function DrawChart(){
    DrawChartSheet('total_spend_trend', 'SELECT A, B, I', geototalResponseHandler);
    DrawChartSheet('total_spend_trend', 'SELECT A, B, C, D, E, F, G, H, I', bartotalResponseHandler);
    DrawChartSheet('total_spend', 'SELECT A, B, C, D, E', colspendResponseHandler);
    DrawChartSheet('shareGDP', 'SELECT A, B, C, D, E', colshareResponseHandler);
    DrawChartSheet('capita_spend', 'SELECT A, B, C, D, E', colspendcapitaResponseHandler);
    DrawChartSheet('capita_spend', 'SELECT A, B, C, D, E', barratioResponseHandler);
    DrawChartSheet('shareGDP', 'SELECT A, B, C, D, E, F', lineshareResponseHandler);
    DrawChartSheet('capita_spend_grow', 'SELECT A, B, C, D', coltrendcapitaResponseHandler);
    DrawChartSheet('pct_change', 'SELECT A, B, C, D, E, F, G', colchangeResponseHandler);
    DrawChartSheet('total_change', 'SELECT A, B, H', geochangeResponseHandler);
    DrawChartSheet('total_spend_grow', 'SELECT A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U', linegrowthResponseHandler);


}

// customize category filter for Field (Military = default, Health, Education)
var FieldFilter = {
    controlType: 'CategoryFilter',      // type of filter
    options: {
        filterColumnLabel: 'Field', // define column selected as the filter
        ui: {
            label: 'Field',
            caption: 'Select ...',
            allowNone: false,
            allowMultiple: false,
            labelStacking: 'vertical',
            selectedValuesLayout: 'belowStacked',
        },
        fontName: "Times New Roman"
    },
    state: {selectedValues: ['Military']}, // initial selection when none are selected
};

// customize category filter for Country
var CountryFilter = {
    controlType: 'CategoryFilter',
    options: {
        filterColumnLabel: 'Country',
        ui: {
            label: 'Country',
            caption: 'Select ...',
            allowNone: false,
            allowMultiple: false,
            labelStacking: 'vertical',
        },
        fontName: "Times New Roman"
    },
    state: {selectedValues: ['United States']},
};

// customize range filter 
var RangeFilter = {
    controlType: 'NumberRangeFilter',   // select type of filter
    options: {
        filterColumnLabel: 'Annual Change',  // column that will be used for range filter
        ui: {
            label: 'Annual Growth',
            labelStacking: 'vertical',
            format: {pattern: '$#,### Million'}  // format of values in the filter
        },
        minValue: -2500,
        maxValue: 28000
    }
};

// customize category filter for Year
var YearFilter = {
    controlType: 'CategoryFilter',
    options: {
        filterColumnLabel: 'Year',
        ui: {
            label: 'Year',
            caption: 'Select ...',
            allowNone: false,
            allowMultiple: false,
            labelStacking: 'vertical',
        },
        fontName: "Times New Roman"
    },
    state: {selectedValues: [2016]},
};


// DrawChartSheet function that handle each query, data sheet and apply Response Handler to the data retrieved
function DrawChartSheet(sheetName, sqlquery, responseHandler) {
    var queryString = encodeURIComponent(sqlquery); // encode sql query
    var query = new google.visualization.Query(base_url + sheetName + "&headers=1&tq=" + queryString);
    
    // Send the query with a callback function
    query.send(responseHandler);
}
    


/// OVERVIEW

// customize GeoChart for Total Expenditure
var GeoTotalOpts = {
    chartType: 'GeoChart',
    containerId: 'geo_total_chart_div',
    view : {columns : [0,2]},
    options: {
        title: 'Total Expenditure Distribution',
        datalessRegionColor: '#FFFFFF',
        defaultColor: '#BDBDBD',
        colorAxis: {colors: ['#00E676','#C6FF00','#EEFF41','#FFFF00','#FF9100','#FF5722']},
        backgroundColor: '#ECEFF1',
        legend: {
            numberFormat: '$###.## Billion'
        }
    }
};

// ResponseHandler for GeoChart of Total Expenditure
function geototalResponseHandler(response) {
    var data = response.getDataTable();

    var dashboard = new google.visualization.Dashboard(document.getElementById('geo_total_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(GeoTotalOpts); // chartWrapper

    var filter = FieldFilter; // declare filter option
    filter.containerId = 'geo_total_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}


// customize BarChart for Total Expenditure
var BarTotalOpts = {
    chartType: 'BarChart',
    containerId: 'bar_total_chart_div',
    options: {
        title: 'Total Expenditure',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        vAxis: {textStyle: {fontSize: 15}},
        hAxis: {title: 'Expenditure in billions ($)', format: 'short'},
        width: '100%',
        height: 600,
        legend: {position: 'top', maxLines: 1},
        bar: {groupWidth: '60%'},
        isStacked: true,
        annotations: {
            alwaysOutside: true,
            textStyle: {fontSize: 15},
        }
    }
};


// ResponseHandler for BarChart of Total Expenditure
function bartotalResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 8, desc: true}); // sort by total expenditure

    var view = new google.visualization.DataView(data);
    view.setColumns([0,2,3,4,5,6,7,{
        calc: function(dt, row){
            return Math.floor(dt.getFormattedValue(row, 8)) + 'B'
        },
        type: 'string',
        //sourceColumn: 8,
        role: 'annotation',
    }]);



    var dashboard = new google.visualization.Dashboard(document.getElementById('bar_total_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(BarTotalOpts); // chartWrapper
    //chart.setDataTable(data);
    chart.setView(view);

    var filter = FieldFilter; // declare filter option
    filter.containerId = 'bar_total_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);

}

/// ANALYSIS

// customize ColumnChart for expenditure
var ColSpendOpts = {
    chartType: 'ColumnChart',
    containerId: 'col_spend_chart_div',
    view: {columns: [0, 2, 3, 4]},
    options: {
        title: 'Expenditure on Education, Healthcare, and Military',
        backgroundColor: '#FAFAFA',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, slantedText:true, slantedTextAngle:45},
        vAxis: {title: 'Expenditure in billions ($)', format: '#B'},
        width: '100%',
        height: 600,
        colors: ['#00C853', '#FF6F00', '#0091EA'],
    }
};

// ResponseHandler for Column Chart of Spending
function colspendResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 0, desc:false}); // sort by name

    var dashboard = new google.visualization.Dashboard(document.getElementById('col_spend_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(ColSpendOpts); // chartWrapper

    var filter = YearFilter; // declare filter option
    filter.containerId = 'col_spend_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}

// ColChart Option for Share of GDP
var ColShareOpts = {
    chartType: 'ColumnChart',
    containerId: 'col_share_chart_div',
    view: {columns: [0, 2, 3, 4]},
    options: {
        title: 'Expenditure as Share of GDP',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, slantedText:true, slantedTextAngle:45},
        vAxis: {title: 'Share of GDP', format: "#'%"},
        width: '100%',
        height: 600,
        colors: ['#00C853', '#FF6F00', '#0091EA'],
        
    }
};

// ResponseHandler for Column Chart of Share of GDP
function colshareResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 0, desc:false}); // sort by name

    var dashboard = new google.visualization.Dashboard(document.getElementById('col_share_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(ColShareOpts); // chartWrapper

    var filter = YearFilter; // declare filter option
    filter.containerId = 'col_share_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}

// ColChart Option for Spending per Capita
var ColSpendCapitaOpts = {
    chartType: 'ColumnChart',
    containerId: 'col_spend_capita_chart_div',
    view: {columns: [0, 2, 3, 4]},
    options: {
        title: 'Expenditure per Capita',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, slantedText:true, slantedTextAngle:45},
        vAxis: {title: 'Expenditure ($)', format: 'short'},
        width: '100%',
        height: 600,
        colors: ['#00C853', '#FF6F00', '#0091EA'],
        
    }
};

// ResponseHandler for Column Chart of Spending per Capita
function colspendcapitaResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 0, desc:false}); // sort by name

    var dashboard = new google.visualization.Dashboard(document.getElementById('col_spend_capita_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(ColSpendCapitaOpts); // chartWrapper

    var filter = YearFilter; // declare filter option
    filter.containerId = 'col_spend_capita_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}

/// Trending

// Combo Chart Option for Share of GDP
var LineShareOpts = {
    chartType: 'ComboChart',
    containerId: 'line_share_chart_div',
    view: {columns: [1, 2, 3, 4, 5]},
    options: {
        title: "Expenditure's Growth as Share of GDP",
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, title : 'Year', format :'####'},
        vAxis: {title: 'Share of GDP', format: "##'%'"},
        width: '100%',
        height: 600,
       seriesType: 'bars',
       series: {3: {type: 'line', color: '#00BFA5', lineWidth: 2.5, pointShape : 'diamond', pointSize: 10} ,  
        }
    }

};

// ResponseHandler for Line Chart of share
function lineshareResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 1, desc:false}); // sort by year

    var dashboard = new google.visualization.Dashboard(document.getElementById('line_share_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(LineShareOpts); // chartWrapper

    var filter = CountryFilter; // declare filter option
    filter.containerId = 'line_share_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}

// customize BarChart for Spending Ratio
var BarRatioOpts = {
    chartType: 'BarChart',
    containerId: 'bar_ratio_chart_div',
    view : {columns : [1,2,3,4]},
    options: {
        title: 'Expenditure Ratio',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        vAxis: {textStyle: {fontSize: 15}, title: 'Year', format : '####'},
        hAxis: {minValue: 0, ticks: [0, 0.25, 0.50, 0.75, 1]},
        width: '100%',
        height: 600,
        legend: {position: 'top', maxLines: 1},
        bar: {groupWidth: '60%'},
        isStacked: 'percent',
        colors: ['#64DD17', '#FFA000', '#0091EA'],
    }
};

function barratioResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 1, desc: false}); // sort by year

    var dashboard = new google.visualization.Dashboard(document.getElementById('bar_ratio_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(BarRatioOpts); // chartWrapper

    var filter = CountryFilter; // declare filter option
    filter.containerId = 'bar_ratio_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);

}

// Col + Line Chart Option for Trending per Capita
var ColTrendCapitaOpts = {
    chartType: 'ComboChart',
    containerId: 'col_trend_capita_chart_div',
    view: {columns: [1,2,2,2]},
    options: {
        title: 'Per Capita Expenditure by Year',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {title: 'Year', format: '####'},
        vAxis: {title: 'Expenditure per Capita ($)', format: 'short'},
        width: '100%',
        height: 600,
        bar: { groupWidth: '40%'},
        legend: 'none',
        series: {1: {type: 'line', color:'#00E676', lineWidth : 2.5, pointSize: 15, pointShape: 'triangle'},
                0: {type: 'bars', color:'#0091EA'},
                2: {type: 'line', color:'#FF3D00', lineWidth : 0, pointSize: 15, pointShape: 'triangle'}
        }
    }
};


function coltrendcapitaResponseHandler(response){
    var data = response.getDataTable();

    var dashboard = new google.visualization.Dashboard(document.getElementById('col_trend_capita_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(ColTrendCapitaOpts); // chartWrapper


    var filter1 = CountryFilter; // declare filter option
    filter1.containerId = 'col_trend_capita_control_div1'; // declare containerId for filter option
    var control1 = new google.visualization.ControlWrapper(filter1); // controlWrapper

    var filter2 = FieldFilter; // declare filter option
    filter2.containerId = 'col_trend_capita_control_div2'; // declare containerId for filter option
    var control2 = new google.visualization.ControlWrapper(filter2); // controlWrapper
    

    dashboard.bind([control1,control2], chart);
    dashboard.draw(data);
}

/// Annual Change

// customize ColChart for Percentage Change
var ColChangeOpts = {
    chartType: 'ColumnChart',
    containerId: 'col_change_chart_div',
    view: {columns: [0,2,3,4,5,6]},
    options: {
        title: 'Expenditure Change as Percentage of Previous Year',
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, slantedText:true, slantedTextAngle:45},
        vAxis: {title: 'Percentage (%)', format: 'percent'},
        width:  '100%',
        height: 600,
        bar: { groupWidth: '70%' },
          
    }
};

function colchangeResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 0, desc:false}); // sort by name

    var dashboard = new google.visualization.Dashboard(document.getElementById('col_change_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(ColChangeOpts); // chartWrapper

    var filter = FieldFilter; // declare filter option
    filter.containerId = 'col_change_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}


// GeoChart for Expenditure Change
var GeoChangeOpts = {
    chartType: 'GeoChart',
    containerId: 'geo_change_chart_div',
    view : {columns : [0,2]},
    options: {
        title: 'Annual Change of Expenditure',
        datalessRegionColor: '#FFFFFF',
        defaultColor: '#BDBDBD',
        colorAxis: {colors: ['#00E676','#C6FF00','#EEFF41','#FFFF00','#FF9100','#FF5722']},
        backgroundColor: '#ECEFF1',
        legend: {
            numberFormat: '+$#.## Million;-$#.## Million'
        }
    }
};

// ResponseHandler for GeoChart of Total Expenditure Change
function geochangeResponseHandler(response) {
    var data = response.getDataTable();

    var dashboard = new google.visualization.Dashboard(document.getElementById('geo_change_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(GeoChangeOpts); // chartWrapper

    var filter1 = FieldFilter; // declare filter option
    filter1.containerId = 'geo_change_control_div1'; // declare containerId for filter option
    var control1 = new google.visualization.ControlWrapper(filter1); // controlWrapper

    var filter2 = RangeFilter; // declare filter option
    filter2.containerId = 'geo_change_control_div2'; // declare containerId for filter option
    var control2 = new google.visualization.ControlWrapper(filter2); // controlWrapper

    dashboard.bind([control1, control2], chart);
    dashboard.draw(data);

      
    changeRangepositive = function() {
        control2.setState({'lowValue': 0, 'highValue': 28000});
        control2.draw();
    };

    changeRangenegative = function() {
        control2.setState({'lowValue': -2500, 'highValue': 0});
        control2.draw();
    };

    resetRange= function() {
        control2.setState({'lowValue': -2500, 'highValue': 28000});
        control2.draw();
    };  
}

// customize Line Chart for absolute spending growth
var LineGrowthOpts = {
    chartType: 'LineChart',
    containerId: 'line_growth_chart_div',
    view: {columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
    options: {
        title: "Growth in Absolute Spending",
        backgroundColor: '#F7F7F7',
        fontName: "Helvetica Neue",
        hAxis: {textStyle: {fontSize: 12}, title : 'Year', format :'####'},
        vAxis: {title: 'Spending in billions ($)', format: '#B'},
        width: '100%',
        height: 600,
        lineWidth: 1.5,     
        colors: ['#64DD17', '#FFA000', '#FF3D00','#D500F9','#2E7D32','#76FF03','#64FFDA',
        '#6D4C41','#F44336','#0091EA','#DCE775','#616161','#4DD0E1','#6200EA','#26A69A','#FFB74D','#E91E63','#9C27B0','#EF6C00'],
        legend: {position: 'top'},
    }
};

function linegrowthResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 1, desc:false}); // sort by year

    var dashboard = new google.visualization.Dashboard(document.getElementById('line_growth_dashboard_div')); // dashboard

    var chart = new google.visualization.ChartWrapper(LineGrowthOpts); // chartWrapper

    var filter = FieldFilter; // declare filter option
    filter.containerId = 'line_growth_control_div'; // declare containerId for filter option
    var control = new google.visualization.ControlWrapper(filter); // controlWrapper
    

    dashboard.bind(control, chart);
    dashboard.draw(data);
   
}












