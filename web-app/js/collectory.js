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
 * Called when an ajax request returns no records.
 \************************************************************/
function noData() {
    setNumbers(0);
    $('a.recordsLink').css('display','none');
    $('#recordsBreakdown').css('display','none');
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
    var selected = document.getElementById(idOfSelect).selectedIndex;
    if (selected == 0) {
      alert(message);
      return false;
    } else {
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
function getController(uid) {
    if (!uid || uid.length < 2) {
        return "unknown"
    }
    switch (uid.substr(0,2)) {
        case "in": return "institution";
        case "co": return "collection";
        case "dr": return "dataResource";
        case "drt": return "dataResourceTemporary";
        case "dp": return "dataProvider";
        default: return "unknown"
    }
}

/************************************************************\
*
\************************************************************/
// opens email window and adds error info
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
    content = content + "Miles Nicholls\n";
    content = content + "Data Manager| Atlas of Living Australia\n";
    content = content + "CSIRO\n";

    var objWin = window.open ('mailto:' + email + '?subject=' + subject + '&body=' + encodeURI(content));
    if (objWin) objWin.close();
    if (event) {
        event.cancelBubble = true;
    }
    return false;
}

/************************************************************\
 *******        LOAD DOWNLOAD STATS        *****
\************************************************************/
function loadDownloadStats(uid, name, eventType) {
    if (eventType == '') {
        // nothing to show
        return;
    }
    var loggerServicesUrl = "http://logger.ala.org.au/service/";
    var url = loggerServicesUrl + uid + "/events/" + eventType + "/counts.json";
    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: false,
      error: function(jqXHR, textStatus, errorThrown) {
        clearStats();
      },
      success: function(data) {
        if (data.all.numberOfDownloads == '0') {
            clearStats();
        } else {
            var stats;
            if (eventType == '2000') { // images
                stats = "<p class='short-bot'>Number of images viewed from the " + name + " through the Atlas of Living Australia.</p>";
                stats += "<table class='table counts'>";
                stats += "<tr><td class='span4'>This month</td><td class='span4'><span class='number'>" +
                        addCommas(data.thisMonth.numberOfEventItems) + "</span></td></tr>";
                stats += "<tr><td class='span4'>Last 3 months</td><td class='span4'><span class='number'>" +
                        addCommas(data.last3Months.numberOfEventItems) + "</span></td></tr>";
                stats += "<tr><td class='span4'>Last 12 months</td><td class='span4'><span class='number'>" +
                        addCommas(data.lastYear.numberOfEventItems) + "</span></td></tr>";
                stats += "</table>";
            } else {  // eventType == '1002' - records
                stats = "<p class='short-bot'>Number of occurrence records downloaded from the " + name + " through the Atlas of Living Australia.</p>";
                stats += "<table class='table counts'>";
                stats += "<tr><td class='span4'>This month</td><td class='span4'><span class='number'>" +
                        addCommas(data.thisMonth.numberOfEventItems) + "</span> from <span class='number'>" +
                        addCommas(data.thisMonth.numberOfEvents) + "</span> " + pluralise('download',data.thisMonth.numberOfEvents) + "</td></tr>";
                stats += "<tr><td class='span4'>Last 3 months</td><td class='span4'><span class='number'>" +
                        addCommas(data.last3Months.numberOfEventItems) + "</span> from <span class='number'>" +
                        addCommas(data.last3Months.numberOfEvents) + "</span> " + pluralise('download',data.last3Months.numberOfEvents) + "</td></tr>";
                stats += "<tr><td class='span4'>Last 12 months</td><td class='span4'><span class='number'>" +
                        addCommas(data.lastYear.numberOfEventItems) + "</span> from <span class='number'>" +
                        addCommas(data.lastYear.numberOfEvents) + "</span> " + pluralise('download',data.lastYear.numberOfEvents) + "</td></tr>";
                stats += "</table>";
            }
            $('div#usage').html(stats);
        }
      }
    });

    // If getting stats for record downloads, include breakdown by reason over the last 12 months
    if (eventType == '1002') {
        var url2 = loggerServicesUrl + "reasonBreakdown.json?eventId=1002&entityUid=" + uid
        $.ajax({
            url: url2,
            dataType: 'jsonp',
            cache: false,
            error: function(jqXHR, textStatus, errorThrown) {
                clearStats();
            },
            success: function(data) {
                if (data.lastYear.events == '0') {
                    clearStats();
                } else {
                    var stats;
                    stats = "<p class='short-bot'>Breakdown by reason of occurrence record downloads from last 12 months:</p>";
                    stats += "<table class='table usageByReasonBreakdown'>";

                    stats += "<tr><td>Conservation management/planning</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["conservation management/planning"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["conservation management/planning"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["conservation management/planning"].events) + "</td></tr>";

                    stats += "<tr><td>Biosecurity management/planning</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["biosecurity management, planning"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["biosecurity management, planning"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["biosecurity management, planning"].events) + "</td></tr>";

                    stats += "<tr><td>Environmental impact/site assessment</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["environmental impact, site assessment"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["environmental impact, site assessment"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["environmental impact, site assessment"].events) + "</td></tr>";

                    stats += "<tr><td>Education</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["education"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["education"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["education"].events) + "</td></tr>";

                    stats += "<tr><td>Scientific research</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["scientific research"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["scientific research"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["scientific research"].events) + "</td></tr>";

                    stats += "<tr><td>Collection management</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["collection management"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["collection management"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["collection management"].events) + "</td></tr>";

                    stats += "<tr><td>Ecological research</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["ecological research"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["ecological research"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["ecological research"].events) + "</td></tr>";

                    stats += "<tr><td>Systematic research</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["systematic research"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["systematic research"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["systematic research"].events) + "</td></tr>";

                    stats += "<tr><td>Other scientific research</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["other scientific research"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["other scientific research"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["other scientific research"].events) + "</td></tr>";

                    stats += "<tr><td>Other</td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["other"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["other"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["other"].events) + "</td></tr>";

                    stats += "<tr><td>Testing</td></td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["testing"].records) + "</span></td><td> from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["testing"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["testing"].events) + "</td></tr>";

                    /*stats += "<tr><td>No reason specified:</td></td><td style='text-align: right;'><span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["unclassified"].records) + "</span></td><td>from <span class='number'>" +
                        addCommas(data.lastYear.reasonBreakdown["unclassified"].events) +
                        "</span> " + pluralise('download',data.lastYear.reasonBreakdown["unclassified"].events) + ".</td></tr>";
                    */

                    stats += "</table>";

                    // Append content to usage statistics content generated by previous ajax call
                    $('div#usage').html($('div#usage').html() + stats);
                }
            }
        });
    }
}
function clearStats() {
    $('#usage-stats').css('display','none');
}
function pluralise(word, number) {
    if (number == 1) {
        return word;
    } else {
        return word + 's';
    }
}

/************************************************************\
 *******        CHART DOWNLOAD STATS        *****
\************************************************************/
function drawVisualization(data, eventType) {
    var container = document.getElementById('usage-visualization');
    if (container != undefined) {
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        // Create and populate the data table.
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Month');
        if (eventType == '2000') {
            dataTable.addColumn('number', 'Images');
        } else {
            dataTable.addColumn('number', 'Records');
        }
        if (eventType == '1002') {
            dataTable.addColumn('number', 'Downloads');
        }
        dataTable.addRows(12);
        var idx = 0;
        for(key in data.lastYearByMonth) {
            dataTable.setValue(idx, 0, key.substring(0,3));
            dataTable.setValue(idx, 1, data.lastYearByMonth[key].numberOfEventItems);
            if (eventType == '1002') {
                dataTable.setValue(idx, 2, data.lastYearByMonth[key].numberOfEvents);
            }
            idx++;
        }
        var title, legend;
        if (eventType == '1002') {
            title = "Records downloaded through the Atlas for the last 12 months";
            legend = "right";
        } else {
            title = "Images viewed through the Atlas for the last 12 months";
            legend = "none";
        }
        // Create and draw the visualization.
        new google.visualization.ColumnChart(container).
                draw(dataTable,
                {title: title,
                    width:650, height:200,
                    legend: legend,
                    chartArea: {left:'10%',top:'auto',width:"70%",height:'auto'},
                    hAxis: {title: "Month"}}
        );
    }
}

