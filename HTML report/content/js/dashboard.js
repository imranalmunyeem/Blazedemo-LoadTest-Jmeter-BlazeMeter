/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.28571428571429, "KoPercent": 0.7142857142857143};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7693222354340071, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7946428571428571, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/register-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://blazedemo.com/register-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/register-1"], "isController": false}, {"data": [0.78125, 500, 1500, "https://blazedemo.com/password/reset-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-4"], "isController": false}, {"data": [0.7615384615384615, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/password/reset-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://blazedemo.com/password/reset-2"], "isController": false}, {"data": [0.6076923076923076, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-5"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-0"], "isController": false}, {"data": [0.9538461538461539, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.5230769230769231, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/index.php-1"], "isController": false}, {"data": [0.09848484848484848, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9883720930232558, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.9767441860465116, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/home-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://blazedemo.com/home-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://blazedemo.com/home-1"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://blazedemo.com/register"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9767441860465116, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.8111111111111111, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5089285714285714, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://blazedemo.com/password/reset"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.0, 500, 1500, "BlazeMeter-Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.7051282051282052, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/index.php"], "isController": false}, {"data": [0.03571428571428571, 500, 1500, "https://blazedemo.com/home"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1680, 12, 0.7142857142857143, 540.8607142857134, 44, 2679, 395.5, 1031.0, 1330.6499999999987, 2166.57, 39.0806736763748, 1455.223196371662, 43.5836109059505], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/reserve.php-0", 56, 0, 0.0, 496.9821428571429, 357, 727, 469.5, 640.7, 680.45, 727.0, 1.8363666174782751, 10.421021888834234, 1.0885493523528447], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 55, 0, 0.0, 310.76363636363635, 252, 840, 283.0, 357.99999999999994, 517.3999999999983, 840.0, 1.8837551803267458, 0.3237704216186595, 1.2104598717333972], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 55, 0, 0.0, 286.81818181818187, 257, 391, 275.0, 337.4, 371.0, 391.0, 1.8839487565938207, 0.3256434862471741, 1.2105842596081386], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 55, 0, 0.0, 98.09090909090908, 58, 216, 84.0, 166.0, 192.59999999999997, 216.0, 1.8976641479487977, 0.3984353435634682, 1.182333717179036], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 55, 0, 0.0, 303.96363636363634, 255, 773, 279.0, 349.79999999999995, 427.59999999999934, 773.0, 1.883884226751156, 0.32379260147285494, 1.2068633327624594], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 55, 0, 0.0, 301.6, 253, 808, 282.0, 350.4, 376.5999999999999, 808.0, 1.8842714721299119, 0.32201905041282675, 1.2107916295522285], "isController": false}, {"data": ["https://blazedemo.com/register-2", 13, 0, 0.0, 297.30769230769226, 257, 379, 289.0, 374.2, 379.0, 379.0, 1.4722536806342015, 0.2549237330124575, 1.6214476571347678], "isController": false}, {"data": ["https://blazedemo.com/register-0", 13, 0, 0.0, 536.8461538461538, 403, 1031, 478.0, 920.1999999999999, 1031.0, 1031.0, 1.4577259475218658, 8.790157546535099, 1.476560747925544], "isController": false}, {"data": ["https://blazedemo.com/register-1", 13, 0, 0.0, 312.15384615384613, 285, 432, 297.0, 410.79999999999995, 432.0, 432.0, 1.4742572011794057, 0.25482766075073715, 1.6265336173168519], "isController": false}, {"data": ["https://blazedemo.com/password/reset-0", 16, 0, 0.0, 502.37500000000006, 382, 646, 474.5, 628.5, 646.0, 646.0, 1.3389121338912136, 5.978687238493724, 1.366043410041841], "isController": false}, {"data": ["https://blazedemo.com/index.php-4", 2, 0, 0.0, 275.5, 268, 283, 275.5, 283.0, 283.0, 283.0, 3.0627871362940278, 0.5294075421133231, 3.4187165007656968], "isController": false}, {"data": ["https://blazedemo.com/-5", 65, 0, 0.0, 484.27692307692297, 271, 1080, 498.0, 661.5999999999999, 762.1999999999999, 1080.0, 1.5736593632732114, 5.789983620324416, 0.8771921528870597], "isController": false}, {"data": ["https://blazedemo.com/password/reset-1", 16, 0, 0.0, 297.0625, 261, 352, 295.0, 338.0, 352.0, 352.0, 1.3559322033898307, 0.23437499999999997, 1.4943061440677965], "isController": false}, {"data": ["https://blazedemo.com/index.php-3", 2, 0, 0.0, 279.5, 276, 283, 279.5, 283.0, 283.0, 283.0, 3.0257186081694405, 0.5200453857791225, 3.3773402042360057], "isController": false}, {"data": ["https://blazedemo.com/-4", 65, 0, 0.0, 907.9538461538459, 263, 1220, 978.0, 1131.8, 1174.6, 1220.0, 1.574078558628372, 179.89582418904683, 0.8745879395311669], "isController": false}, {"data": ["https://blazedemo.com/password/reset-2", 16, 0, 0.0, 324.18750000000006, 260, 706, 304.5, 460.30000000000024, 706.0, 706.0, 1.3511231210944097, 0.2335437426110454, 1.4863673788211451], "isController": false}, {"data": ["https://blazedemo.com/-3", 65, 0, 0.0, 650.3999999999999, 269, 1321, 656.0, 845.8, 960.6999999999995, 1321.0, 1.5737736671347635, 56.04109667812697, 0.8758372021935984], "isController": false}, {"data": ["https://blazedemo.com/index.php-5", 2, 0, 0.0, 279.5, 268, 291, 279.5, 291.0, 291.0, 291.0, 3.0627871362940278, 0.5234255359877489, 3.4187165007656968], "isController": false}, {"data": ["https://blazedemo.com/-2", 65, 0, 0.0, 621.2153846153846, 275, 1071, 637.0, 852.4, 1047.5, 1071.0, 1.5737736671347635, 41.13526584669023, 0.8727634254999758], "isController": false}, {"data": ["https://blazedemo.com/index.php-0", 2, 0, 0.0, 448.0, 405, 491, 448.0, 491.0, 491.0, 491.0, 2.5348542458808616, 7.990731939163497, 2.57446134347275], "isController": false}, {"data": ["https://blazedemo.com/-1", 65, 0, 0.0, 350.3846153846154, 96, 951, 328.0, 521.7999999999998, 649.4999999999998, 951.0, 1.5811238141571393, 129.6737696880321, 0.8322516951471661], "isController": false}, {"data": ["https://blazedemo.com/-0", 65, 0, 0.0, 679.9692307692309, 395, 1385, 636.0, 844.6, 978.4, 1385.0, 1.5321154979375369, 4.829754714201532, 0.8052353417796111], "isController": false}, {"data": ["https://blazedemo.com/index.php-2", 2, 0, 0.0, 284.0, 283, 285, 284.0, 285.0, 285.0, 285.0, 2.985074626865672, 0.5130597014925373, 3.3261427238805967], "isController": false}, {"data": ["https://blazedemo.com/index.php-1", 2, 0, 0.0, 89.5, 79, 100, 89.5, 100.0, 100.0, 100.0, 4.310344827586206, 0.9050040409482758, 2.479290140086207], "isController": false}, {"data": ["https://blazedemo.com/", 66, 1, 1.5151515151515151, 1605.7727272727277, 111, 2334, 1651.5, 1936.4, 2233.4, 2334.0, 1.5355979525360635, 400.6526927495347, 4.954498276814798], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 48, 3, 6.25, 769.7708333333334, 44, 1415, 766.5, 1047.5, 1238.9999999999998, 1415.0, 1.6795549179467442, 132.71063734516602, 5.733968779523426], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 43, 0, 0.0, 289.79069767441854, 252, 566, 275.0, 334.00000000000006, 370.19999999999993, 566.0, 1.6236831174715856, 0.2774849077710229, 1.043343253219046], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 43, 0, 0.0, 301.3720930232558, 252, 831, 282.0, 315.8, 506.5999999999995, 831.0, 1.6236831174715856, 0.2806561638598346, 1.043343253219046], "isController": false}, {"data": ["https://blazedemo.com/home-2", 23, 0, 0.0, 1084.913043478261, 782, 1334, 1054.0, 1283.2, 1325.1999999999998, 1334.0, 1.43516785224011, 170.9783857091601, 2.2078989805628355], "isController": false}, {"data": ["https://blazedemo.com/home-3", 23, 0, 0.0, 1055.9130434782608, 734, 1267, 1081.0, 1215.2, 1260.0, 1267.0, 1.4195778298975434, 408.3767749544809, 1.4408546205715342], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 40, 1, 2.5, 859.1750000000001, 471, 1277, 820.5, 1074.9, 1255.5499999999997, 1277.0, 1.6921905406548778, 8.413525097300955, 6.284075164988577], "isController": false}, {"data": ["https://blazedemo.com/home-0", 27, 0, 0.0, 491.48148148148147, 364, 636, 487.0, 607.0, 634.0, 636.0, 1.45748987854251, 1.9020959851551957, 0.7130883097165992], "isController": false}, {"data": ["https://blazedemo.com/home-1", 27, 2, 7.407407407407407, 541.666666666667, 257, 854, 539.0, 724.0, 821.1999999999998, 854.0, 1.4657184734813529, 7.754079074154498, 1.3719375135714673], "isController": false}, {"data": ["https://blazedemo.com/register", 14, 1, 7.142857142857143, 796.0714285714286, 85, 1331, 788.5, 1193.5, 1331.0, 1331.0, 1.512205659969756, 9.267533822099807, 4.518051955065889], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 43, 0, 0.0, 284.32558139534893, 259, 377, 277.0, 312.4, 339.5999999999999, 377.0, 1.6236218093943513, 0.2790599984896541, 1.0433038579897296], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 43, 0, 0.0, 306.90697674418595, 253, 886, 281.0, 341.0, 500.1999999999996, 886.0, 1.6238670694864048, 0.2791021525679758, 1.0402898413897281], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 43, 0, 0.0, 193.83720930232556, 120, 476, 173.0, 265.6, 332.5999999999998, 476.0, 1.6311976025188726, 133.7805049362695, 0.9366642483213838], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 45, 0, 0.0, 494.04444444444437, 387, 734, 471.0, 632.6, 711.9, 734.0, 1.576402998668815, 7.982079636814265, 1.0068042589154347], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 56, 0, 0.0, 839.6607142857144, 412, 1259, 809.0, 1037.5000000000005, 1227.6, 1259.0, 1.8363666174782751, 12.039659421626496, 6.8444878258730935], "isController": false}, {"data": ["https://blazedemo.com/password/reset", 17, 1, 5.882352941176471, 811.9411764705883, 422, 1256, 772.0, 1000.7999999999997, 1256.0, 1256.0, 1.3284363522700633, 6.242613014769086, 4.028959424083769], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 38, 0, 0.0, 301.578947368421, 256, 799, 285.0, 329.1, 386.6999999999988, 799.0, 1.6440963959676371, 0.2809735051702505, 1.056460379440142], "isController": false}, {"data": ["BlazeMeter-Test", 2, 0, 0.0, 9540.5, 9523, 9558, 9540.5, 9558.0, 9558.0, 9558.0, 0.1246261216350947, 111.39469774270938, 4.617495170737787], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-4", 38, 0, 0.0, 286.2894736842105, 254, 365, 286.5, 320.1, 355.5, 365.0, 1.6464471403812824, 0.28459096078856155, 1.0579709163778164], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 38, 0, 0.0, 283.342105263158, 257, 360, 278.5, 321.0, 359.05, 360.0, 1.646375806940774, 0.2829708418179455, 1.0579250790693644], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 38, 0, 0.0, 293.5000000000001, 256, 517, 279.0, 313.90000000000003, 495.1499999999999, 517.0, 1.646375806940774, 0.2829708418179455, 1.0547095013214332], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 38, 0, 0.0, 92.52631578947367, 61, 171, 86.0, 127.2, 150.09999999999994, 171.0, 1.658374792703151, 0.3481939262023217, 1.033245232172471], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 39, 0, 0.0, 550.2051282051283, 379, 940, 519.0, 725.0, 760.0, 940.0, 1.6622623817236382, 6.89903820539596, 1.1622850247208252], "isController": false}, {"data": ["https://blazedemo.com/index.php", 2, 0, 0.0, 737.5, 697, 778, 737.5, 778.0, 778.0, 778.0, 1.858736059479554, 7.527518006505575, 11.252250813197024], "isController": false}, {"data": ["https://blazedemo.com/home", 28, 3, 10.714285714285714, 1943.3571428571433, 441, 2679, 2150.0, 2371.3, 2594.3999999999996, 2679.0, 1.48975791433892, 507.45434914538436, 5.1721701250332535], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, 100.0, 0.7142857142857143], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1680, 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/", 66, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 48, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 40, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/home-1", 27, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["https://blazedemo.com/register", 14, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/password/reset", 17, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/home", 28, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
