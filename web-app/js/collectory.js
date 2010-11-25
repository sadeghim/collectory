/*------------------------- TAXA BREAKDOWN CHARTS ------------------------------*/

var instanceUid;
var taxaThreshold;
// the server base url
var baseUrl;
var biocacheUrl = "http://biocache.ala.org.au/";  // TODO: inject this
var taxaChartOptions = {
    width: 400,
    height: 400,
    chartArea: {left:0, top:30, width:"90%", height: "75%"},
    is3D: false,
    titleTextStyle: {color: "#555", fontName: 'Arial', fontSize: 15},
    sliceVisibilityThreshold: 0,
    legend: "left"
};
/************************************************************\
* Ajax request for taxa breakdown
\************************************************************/
function loadTaxonChart(serverUrl, uid, threshold, options) {
  instanceUid = uid;
  taxaThreshold = threshold;
  baseUrl = serverUrl;
  setChartOptions(taxaChartOptions, options);
  var taxonUrl = baseUrl + "/public/taxonBreakdown/" + uid +
          "?threshold=" + threshold;
  $.get(taxonUrl, {}, taxonBreakdownRequestHandler);
}
/************************************************************\
* Ajax request for rank breakdown
\************************************************************/
function loadTaxonChartByRank(uid, name, rank) {
  var taxonUrl = baseUrl + "/public/rankBreakdown/" + uid +
          "?name=" + name +
          "&rank=" + rank;
  $.get(taxonUrl, {}, taxonBreakdownRequestHandler);
}
/************************************************************\
* Handler for taxa breakdown - hides chart if no data
\************************************************************/
function taxonBreakdownRequestHandler(response) {
  if (response.error == undefined) {
    var data = new google.visualization.DataTable(response);
    if (data.getNumberOfRows() > 0) {
      drawTaxonChart(data);
    } else {
        // no data
        $('div#taxonChart').css("display","none");
        $('div#taxonChartCaption').css("display","none");
    }
  } else {
    // an error occurred
    $('div#taxonChart').css("display","none");
    $('div#taxonChartCaption').css("display","none");
  }
}
/************************************************************\
* Draw the chart
\************************************************************/
function drawTaxonChart(dataTable) {
  var chart = new google.visualization.PieChart(document.getElementById('taxonChart'));

  if (dataTable.getTableProperty('scope') == "all") {
    taxaChartOptions.title = "Records by " + dataTable.getTableProperty('rank');
  } else {
    taxaChartOptions.title = dataTable.getTableProperty('name') + " records by " + dataTable.getTableProperty('rank')
  }
  google.visualization.events.addListener(chart, 'select', function() {
    var rank = dataTable.getTableProperty('rank');
    var name = dataTable.getValue(chart.getSelection()[0].row,0);
    // differentiate between clicks on legend versus slices
    if (chart.getSelection()[0].column == undefined) {
      // clicked legend - show records
      var scope = dataTable.getTableProperty('scope');
      if (scope == "genus" && rank == "species") {
        name = dataTable.getTableProperty('name') + " " + name;
      }
      document.location.href = biocacheUrl + "occurrences/searchForUID?q=" +
              instanceUid + "&fq=" +
              rank + ":" + name;
    } else {
      // clicked slice - drill down unless already at species
      if (rank != "species") {
        $('div#taxonChart').html('<img class="taxon-loading" alt="loading..." src="' + baseUrl + '/images/ala/ajax-loader.gif"/>');
        loadTaxonChartByRank(instanceUid, dataTable.getValue(chart.getSelection()[0].row,0), dataTable.getTableProperty('rank'));
      }
      if ($('span#resetTaxonChart').html() == "") {
        $('span#resetTaxonChart').html("reset to " + dataTable.getTableProperty('rank'));
      }
    }
  });

  //chart.draw(data, {width: 450, height: 300, title: 'My Daily Activities'});
  chart.draw(dataTable, taxaChartOptions);

  // show taxon caption
  $('div#taxonChartCaption').css('visibility', 'visible');
}
/************************************************************\
*
\************************************************************/
function resetTaxonChart() {
  $('div#taxonChart').html('<img class="taxon-loading" alt="loading..." src="' + baseUrl + '/images/ala/ajax-loader.gif"/>');
  loadTaxonChart(baseUrl, instanceUid, taxaThreshold);
  $('span#resetTaxonChart').html("");
}
/*--(end)------------------ taxa breakdown charts ------------------------------*/


/*------------------------ DECADE BREAKDOWN CHARTS -----------------------------*/
var decadeChartOptions = {
    width: 500,
    height: 300,
    chartArea: {left:50, top:30, width: "88%", height: "75%"},
    title: "Additions by decade",
    titleTextStyle: {color: "#555", fontName: 'Arial', fontSize: 15},
    legend: "none"
};
/************************************************************\
* Draw the chart
\************************************************************/
function drawDecadeChart(decadeData, uid, options) {
  setChartOptions(decadeChartOptions, options);

  var dataTable = new google.visualization.DataTable(decadeData,0.6);

  if (dataTable.getNumberOfRows() > 0) {
    var vis = new google.visualization.ColumnChart(document.getElementById('decadeChart'));

    google.visualization.events.addListener(vis, 'select', function() {
    var decade = dataTable.getValue(vis.getSelection()[0].row,0);
    // TODO: handle 'earlier' label
    if (decade != 'earlier' && decade.length > 3) {
        decade = decade.substr(0,4);
        var dateTo = addDecade(decade);
        var dateRange = "occurrence_date:[" + decade + "-01-01T12:00:00Z%20TO%20" + dateTo + "-01-01T12:00:00Z]";
        // eg. occurrence_date:[1990-01-01T12:00:00Z%20TO%202000-01-01T12:00:00Z]
        document.location.href = biocacheUrl + "occurrences/searchForUID?q=" +
            uid + "&fq=" + dateRange;
      }
    });
    vis.draw(dataTable, decadeChartOptions);
    // show caption
    $('span.decadeChartCaption').css('visibility', 'visible');
  } else {
    // no data
    $('div#decadeChart').css("display","none");
  }
}
/************************************************************\
* increment year by a decade, eg 1990 -> 2000
\************************************************************/
function addDecade(from) {
  var num = parseInt(from);
  return num + 10;
}
/*--(end)----------------- decade breakdown charts -----------------------------*/

/*----------------------------- RECORDS MAP ------------------------------------*/
/************************************************************\
* Draw the map and legend
\************************************************************/
function mapRequestHandler(response) {
  if (response.error != undefined) {
    // set map url
    $('#recordsMap').attr("src","${resource(dir:'images/map',file:'mapaus1_white-340.png')}");
    // set legend url
    $('#mapLegend').attr("src","${resource(dir:'images/map',file:'mapping-data-not-available.png')}");
  } else {
    // set map url
    $('#recordsMap').attr("src",response.mapUrl);
    // set legend url
    $('#mapLegend').attr("src",response.legendUrl);
  }
}
/*--(end)---------------------- records map ------------------------------------*/


/*------------------------ GENERAL RECORDS & STATS -----------------------------*/
/************************************************************\
* Build phrase with num records and set to elements with id = numBiocacheRecords
\************************************************************/
function setNumbers(totalBiocacheRecords) {
  var recordsClause = "";
  switch (totalBiocacheRecords) {
    case 0: recordsClause = "No records"; break;
    case 1: recordsClause = "1 record"; break;
    default: recordsClause = addCommas(totalBiocacheRecords) + " records";
  }
  $('#numBiocacheRecords').html(recordsClause);
}
/************************************************************\
* Set options for a chart
\************************************************************/
function setChartOptions(globalOptions, options) {
    // override with passed options
    if (options != undefined) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                globalOptions[key] = options[key];
            }
        }
    }
}
/************************************************************\
* Add commas to number strings
\************************************************************/
function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
/*--(end)----------------- general records & stats -----------------------------*/


/************************************************************\
*
\************************************************************/
function toggleRow( whichLayer ) {
  var elem, vis;
  if( document.getElementById ) // this is the way the standards work
    elem = document.getElementById( whichLayer );
  else if( document.all ) // this is the way old msie versions work
      elem = document.all[whichLayer];
  else if( document.layers ) // this is the way nn4 works
    elem = document.layers[whichLayer];
  vis = elem.style;
  // if the style.display value is blank we try to figure it out here
  if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
    vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'table-row':'none';
  vis.display = (vis.display==''||vis.display=='table-row')?'none':'table-row';
}

/************************************************************\
*
\************************************************************/
function toggleLayer( whichLayer ) {
  var elem, vis;
  if( document.getElementById ) // this is the way the standards work
    elem = document.getElementById( whichLayer );
  else if( document.all ) // this is the way old msie versions work
      elem = document.all[whichLayer];
  else if( document.layers ) // this is the way nn4 works
    elem = document.layers[whichLayer];
  vis = elem.style;
  // if the style.display value is blank we try to figure it out here
  if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
    vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
  vis.display = (vis.display==''||vis.display=='block')?'none':'block';
}

/************************************************************\
*
\************************************************************/
function toggleHelp(obj) {
  node = findPrevious(obj.parentNode, 'td', 4);
  var div;
  if (node)
    div = node.childNodes[0];
  for(;div = div.nextSibling;) {
    if (div.className && div.className == 'fieldHelp') {
      vis = div.style;
      // if the style.display value is blank we try to figure it out here
      if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
        vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
      vis.display = (vis.display==''||vis.display=='block')?'none':'block';
    }
  }
}

/************************************************************\
*
\************************************************************/
function findPrevious(o, tag, limit){
  for(tag = tag.toLowerCase(); o = o.previousSibling;)
      if(o.tagName && o.tagName.toLowerCase() == tag)
          return o;
      else if(limit && o == limit)
          return null;
  return null;
}

/************************************************************\
*
\************************************************************/
  function anySelected(idOfSelect, message) {
    var d = new Date();
    var time = d.getHours();
    var selected = document.getElementById(idOfSelect).selectedIndex
    if (selected == 0) {
      alert(message);
      return false;
    } else {
      document.getElementById('event').value = 'add';
      return true;
    }
  }

/************************************************************\
*
\************************************************************/
// opens email window for slightly obfuscated email addy
var strEncodedAtSign = "(SPAM_MAIL@ALA.ORG.AU)";
function sendEmail(strEncoded) {
    var strAddress;
    strAddress = strEncoded.split(strEncodedAtSign);
    strAddress = strAddress.join("@");
    var objWin = window.open ('mailto:' + strAddress + '?subject=' + document.title + '&body=' + document.title + ' \n(' + window.location.href + ')','_blank');
    if (objWin) objWin.close();
    if (event) {
        event.cancelBubble = true;
    }
    return false;
}

/************************************************************\
*
\************************************************************/
// opens email window and adds error info
var strEncodedAtSign = "(SPAM_MAIL@ALA.ORG.AU)";
function sendBugEmail(strEncoded, message) {
    var strAddress;
    strAddress = strEncoded.split(strEncodedAtSign);
    strAddress = strAddress.join("@");
    var body = document.title + ' \n(' + window.location.href + ')\n' + message;
    var objWin = window.open ('mailto:' + strAddress + '?subject=' + document.title + '&body=' + body,'_blank');
    if (objWin) objWin.close();
    if (event) {
        event.cancelBubble = true;
    }
    return false;
}

/************************************************************\
*
\************************************************************/
function initializeLocationMap(canBeMapped,lat,lng) {
  var map;
  var marker;
  if (canBeMapped) {
    if (lat == undefined || lat == 0 || lat == -1 ) {lat = -35.294325779329654}
    if (lng == undefined || lng == 0 || lng == -1 ) {lng = 149.10602960586547}
    var latLng = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById('mapCanvas'), {
      zoom: 14,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      streetViewControl: false
    });
    marker = new google.maps.Marker({
      position: latLng,
      title: 'Edit section to change pin location',
      map: map
    });
  } else {
    var middleOfAus = new google.maps.LatLng(-28.2,133);
    map = new google.maps.Map(document.getElementById('mapCanvas'), {
      zoom: 2,
      center: middleOfAus,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      streetViewControl: false
    });
  }
}

/************************************************************\
*
\************************************************************/
function contactCurator(email, firstName, uid, instUid, name) {
    var subject = "Request to review web pages presenting information about the " + name + ".";
    var content = "Dear " + firstName + ",\n\n";
    content = content + "The web address for the Atlas of Living Australia is: http://www.ala.org.au.\n\n";
    content = content + "However, you can find:\n\n";
    content = content + "Your Collection page at: http://collections.ala.org.au/public/show/" + uid + ".\n\n";
    if (instUid != "") {
        content = content + "Your Institution page at: http://collections.ala.org.au/public/showInstitution/" + instUid + ".\n\n";
    }
    content = content + "Or explore your collections community at: http://collections.ala.org.au/public/map.\n\n";
    content = content + "After consulting the website, please respond to this email with any feedback and edits that you would like made to your Collections and Institution pages before Monday the 25th of October 2010.\n\n";
    content = content + "Regards,\n";
    content = content + "The Atlas of Living Australia\n\n";
    content = content + "Dr. Peter Neville\n";
    content = content + "Research Projects Officer | Atlas of Living Australia\n";
    content = content + "CSIRO\n";

    var objWin = window.open ('mailto:' + email + '?subject=' + subject + '&body=' + encodeURI(content));
    if (objWin) objWin.close();
    if (event) {
        event.cancelBubble = true;
    }
    return false;
}

