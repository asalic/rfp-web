
//   In GTFS, these names have ids ranging from 0 to 7, therefore
//   there is no need for a map to store the types
RFPWRoutesHandler.ROUTE_TYPE_STR = ["Tram", "Metro", "Rail", "Bus", "Ferry",
  "Cable car", "Gondola", "Funicular"];

function RFPWRoutesHandler(routesTabDOM)
{
  "use strict";
  this.routesTabDOM = routesTabDOM;
  this.routesLoaded = false;
  this.MAX_STARS = 5;
  this.routesLst = [];
  $("#inp-filter-routes-by-nm").on("input paste change",
    $.proxy(this._filterRoutesByNm, this));
  // this.routeTypesStr = ["T", "M", "R", "B", "F",
  //   "C", "G", "F"];
  //this.idCountRoutes = new Map();
  this._cancelSchedByRouteIdDate = true;
  $('#dlg-routes-sched').on('hidden.bs.modal',
    $.proxy(this._hideDlgShowSched, this));
  $("#sel-routes-sched-trip").on("change",
    $.proxy(this._onTripSchedChg, this));
  this._displRouteSchedule = null;
}

RFPWRoutesHandler.prototype._hideDlgShowSched = function()
{
  this._cancelSchedByRouteIdDate = true;
  this._displRouteSchedule = null;
  $("#sel-routes-sched-trip").empty();
}

RFPWRoutesHandler.prototype._reqSchedByRouteIdDate = function(routeId)
{
  this._cancelSchedByRouteIdDate = false;
  applicationContext.showLoadingPnl("div-routes-sched-body");
  $("#sel-routes-sched-trip").removeClass("spa-rfpw-hidden");
  $("#tbl-routes-sched").removeClass("spa-rfpw-hidden");
  $("#spn-routes-sched-err-req").addClass("spa-rfpw-hidden");
  $("#dlg-routes-sched").modal();

  var dt = applicationContext.moreHandler.getDateTimeHandler().
    getDateTimeMinutesUTC();
  applicationContext.asyncReq($.proxy(this._sucSchedByRouteIdDate, this, routeId),
    $.proxy(this._errSchedByRouteIdDate, this, routeId),
    "schedroutestop",
    [applicationContext.moreHandler.getCurrentCountryCode(),
      applicationContext.moreHandler.getCurrentCityCode(), routeId, dt.dt.toString(),
      dt.utc.toString()]
  );
}

RFPWRoutesHandler.prototype._sucSchedByRouteIdDate = function(routeId, data)
{
  //console.log(routeId);
  if (!this._cancelSchedByRouteIdDate)
  {//   If the user didn't cancel the dialog, add the data
    //console.log(data);
    this._displRouteSchedule = new RFPWRouteSchedule(data.data);
    var tripsSel = $("#sel-routes-sched-trip");
    tripsSel.empty();
    for (var idx=0; idx<this._displRouteSchedule.getNumTrips(); ++idx)
    {
      tripsSel.append("<option value=\"" + idx + "\">" +
        this._displRouteSchedule.getFirstStopNameByTripIdx(idx) +
        " -> " +
        this._displRouteSchedule.getLastStopNameByTripIdx(idx) +
        "</option>");
        //console.log(this._displRouteSchedule.getFirstStopNameByTripIdx(idx));
    }
    $("#sel-routes-sched-trip option[value=\"0\"]").attr("selected", "selected");
    this._onTripSchedChg();
    applicationContext.hideLoadingPnl("div-routes-sched-body");
  }

}

RFPWRoutesHandler.prototype._errSchedByRouteIdDate = function(routeId, request,
    textStatus, errorThrown)
{
  if (!this._cancelSchedByRouteIdDate)
  {//   If the user didn't cancel the dialog, add the data
    $("#spn-routes-sched-err-req").removeClass("spa-rfpw-hidden");
    $('#spn-routes-sched-err-req').append(document.createTextNode(request.responseText));
    $("#sel-routes-sched-trip").addClass("spa-rfpw-hidden");
    $("#tbl-routes-sched").addClass("spa-rfpw-hidden");
    applicationContext.hideLoadingPnl("div-routes-sched-body");
  }
}

RFPWRoutesHandler.prototype._onTripSchedChg = function()
{
  var schedId = $("#sel-routes-sched-trip").val();
  //console.log(schedId);
  var stopsTimes = this._displRouteSchedule.getStopsByTripIdx(parseInt(schedId));
  var schedB = $("#tblb-routes-sched");
  schedB.empty();
  for (var idx=0; idx<stopsTimes.length; ++idx)
  {
    schedB.append("<tr><td class=\"spa-rfpw-diplay-none\">" + idx + "</td>" +
      "<td>" + stopsTimes[idx].getStopName() + "</td>" +
      "<td>" + stopsTimes[idx].getArrivalTimes().join(", ") + "</td>" +
      "</tr>");
  }
}

RFPWRoutesHandler.prototype.reqAllRoutes = function()
{
  applicationContext.showLoadingPnl("routes-main-lst");

  $("#spn-routes-err-req").addClass("spa-rfpw-hidden");
  applicationContext.asyncReq($.proxy(this._sucAllRoutes, this),
    $.proxy(this._errAllRoutes, this),
    "routes",
    [applicationContext.moreHandler.getCurrentCountryCode(),
      applicationContext.moreHandler.getCurrentCityCode()]
  );
}


RFPWRoutesHandler.prototype._sucAllRoutes = function(srvRoutesLst)
{
  //var routesObj = this.routesObj;
  var routesLstSrv = srvRoutesLst.data;
  this.routesLst = [];
  $("#routes-lst-empty").hide();
  //console.log(routesLst);
  //var lines = JSON.parse(data);
  for (var bl in routesLstSrv)
  {
    var r = new RFPWRoute(routesLstSrv[bl]);
    //console.log(routesLst[bl]);
    //delete routesLstSrv[bl];
    //console.log(r.id);
    this.routesLst.push(r);
    this.routesTabDOM.append(this.genRouteRow(r));
    //   Listen to clicks/taps on show routes on the map
    $("#btn-show-route-map" + r.getUId()).
       on("click tap",
        $.proxy(this._reqShapesByRouteId, this, r)
      );
    $("#btn-routes-show-sched" + r.getUId()).
       on("click tap",
        $.proxy(this._reqSchedByRouteIdDate, this, r.getId())
      );
  }
  //   The data has been loaded, signal that
  this.routesLoaded = true;
  //   Remove the reference to the Routes class' instance
  //routesObj = null;

  applicationContext.hideLoadingPnl("routes-main-lst");
}

RFPWRoutesHandler.prototype._errAllRoutes = function(request,
    textStatus, errorThrown)
{
  $("#spn-routes-err-req").removeClass("spa-rfpw-hidden");
  $('#spn-routes-err-req').append(document.createTextNode(request.responseText));
  applicationContext.hideLoadingPnl("routes-main-lst");
}


// RFPWMapHandler.prototype.onResizeWait = function()
// {
//   applicationContext.waitForFinalEvent(
//     $.proxy(this._onResize, this), 500, "Resize from Maphandler");
// }
//
// RFPWMapHandler.prototype._onResize = function()
// {
//   this.setHeightMap();
//   $("#spa-rfpw-hidden").height();
// }

RFPWRoutesHandler.prototype.rmAlRoutes = function()
{
  this.routesLoaded = false;
  this.routesLst = [];
  this.routesTabDOM.empty();
  $("#routes-lst-empty").show();
}


RFPWRoutesHandler.prototype._reqShapesByRouteId = function(route)
{
  console.log("load route: " + route.getId());
  applicationContext.showLoadingPnl("routes-main-lst");

  applicationContext.asyncReq($.proxy(this._sucShapesByRouteId, this, route),
    $.proxy(this._errShapesByRouteId, this, route),
    "shapes",
    [applicationContext.moreHandler.getCurrentCountryCode(),
      applicationContext.moreHandler.getCurrentCityCode(),
      route.getId()]
  );
}

RFPWRoutesHandler.prototype._sucShapesByRouteId = function(route, data)
{
  //console.log(data.length);
  var dJ = data.data;
  console.log(dJ);
  applicationContext.hideLoadingPnl("routes-main-lst");
  applicationContext.switchTab(RFPWApplicationContext.TAB_TRIPS);
  //console.log(data);
  //var dataJson = JSON.parse(data);
  //console.log(dJ.length);
  route.setPaths(dJ);
  applicationContext.mapHandler.drawRoute(route);
}

RFPWRoutesHandler.prototype._errShapesByRouteId = function(routeId, data)
{

    applicationContext.hideLoadingPnl("routes-main-lst");
}

RFPWRoutesHandler.prototype._filterRoutesByNm = function(event)
{
  //this = event.data.routesObj;
  //console.log();
  var txt = $("#inp-filter-routes-by-nm").val().toLowerCase().split(/[ ,\t]+/).join(')(?=.*');
  var reTxt = new RegExp("(?=.*" + txt + ")");
  //console.log("^(?=.*" + txt + ").*");
  if (this.routesLoaded)
  {
    for (var idx in this.routesLst)
    {
      //console.log(this.routesLst[idx]["route_long_name"]);
      name = (this.routesLst[idx].longNm + " " +
        this.routesLst[idx].shortNm).toLowerCase();
      if (name.match(reTxt) === null)
      {
        $("#div-route-row"+ this.routesLst[idx].getUId()).hide();
      } else {
        $("#div-route-row"+ this.routesLst[idx].getUId()).show();
      }
    }
  }// if (this.routesLoaded)
}

RFPWRoutesHandler.prototype.genStarsDOM = function(num)
{
  var result = "";
  for (var idx=0; idx<num; ++idx)
  {
    result += '<span class="glyphicon glyphicon-star"></span>';
  }
  for (var idx=num; idx<this.MAX_STARS; ++idx)
  {
    result += '<span class="glyphicon glyphicon-star-empty"></span>';
  }
  return result;
}

RFPWRoutesHandler.prototype.genRouteRow = function(routeInfo)
{
  var showStartStopStop = (routeInfo.startStop === null ||
    routeInfo.endStop === null ? "spa-rfpw-diplay-none" : "");
  return '<div id="div-route-row'+ routeInfo.getUId() +
            '" class="panel panel-default">'+
      '<div data-toggle="collapse" data-target="#collapse' +
        routeInfo.getUId() + '" class="panel-heading">'+
        '<div style="background-color: ' + routeInfo.color + ';" class="spa-rfpw-vert-bar" ></div>'+
        '<div class="spa-rfpw-nm-star pull-left">' +
          routeInfo.shortNm + '<br />'+
          this.genStarsDOM(routeInfo.stars) +
        '</div>' +
        '<div class="' + showStartStopStop + ' pull-right">' +
          '<span class="glyphicon glyphicon-triangle-right"></span>' +
            routeInfo.startStop + '<br />' +
          '<span class="glyphicon glyphicon-triangle-left"></span>' +
            routeInfo.endStop +
        '</div>' +
        '<div class="clearfix"></div>' +
      '</div>'+
      '<div id="collapse' + routeInfo.getUId() +
        '" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
          '<div class="spa-rfpw-progress-graph">'+
            '<div class="spa-rfpw-progress-bar" style="width:' +
              routeInfo.crowdedness + '%">' +
              '<p class="spa-rfpw-progress-text">Crowdedness:&nbsp;' +
                routeInfo.crowdedness + '%</p>'+
            '</div>'+
          '</div>'+
          '<div class="spa-rfpw-progress-graph">'+
            '<div class="spa-rfpw-progress-bar" style="width:' +
              routeInfo.responsivness + '%">'+
              '<p class="spa-rfpw-progress-text">Responsiveness:&nbsp;' +
                routeInfo.responsivness + '%</p>'+
            '</div>'+
          '</div>'+
          '<div class="spa-rfpw-progress-graph">'+
            '<div class="spa-rfpw-progress-bar" style="width:' +
              routeInfo.conservation + '%">'+
              '<p class="spa-rfpw-progress-text">Conservation:&nbsp;' +
                routeInfo.conservation + '%</p>'+
            '</div>'+
          '</div>'+
          '<button id="btn-show-route-map'+ routeInfo.getUId() +
          '" class="btn btn-default bus-line-btn">Show On Map</button>'+
          '<button id="btn-routes-show-sched'+ routeInfo.getUId() +
          '" class="btn btn-default bus-line-btn schedule-btn pull-right">Schedule</button>'+
        '</div>'+
      '</div>';
}


RFPWRoutesHandler.prototype.hasRoutes = function(routeID)
{
  return this.routesLoaded;
}

RFPWRoutesHandler.prototype.getRoutes = function(routeID)
{
  console.log("show route for " + this.idCountRoutes[routeID]);
}

RFPWRoutesHandler.prototype.getRouteColorById = function(routeId)
{
  for (var routeIdx in this.routesLst)
  {
    //console.log(this.routesLst[routeIdx]["route_color"]);
    if (this.routesLst[routeIdx].id === routeId)
      return this.routesLst[routeIdx].color;
  }
  console.log("Unable to find route id " + routeId);
  return null;
}

RFPWRoutesHandler.prototype.getRouteShortNmById = function(routeId)
{
  for (var routeIdx in this.routesLst)
    if (this.routesLst[routeIdx].getId() === routeId)
      return this.routesLst[routeIdx].getShortNm();
  console.log("Unable to find route id " + routeId);
  return null;
}

RFPWRoutesHandler.prototype.getRouteById = function(routeId)
{
  for (var routeIdx in this.routesLst)
    if (this.routesLst[routeIdx].getId() === routeId)
      return this.routesLst[routeIdx];
  console.log("Unable to find route id " + routeId);
  return null;
}

RFPWRoutesHandler.prototype.getRouteTypeStrById = function(routeId)
{
  for (var routeIdx in this.routesLst)
    if (this.routesLst[routeIdx].getId() === routeId)
      return RFPWRoutesHandler.ROUTE_TYPE_STR[this.routesLst[routeIdx].type][0];
  console.log("Unable to find route id " + routeId);
  return null;
}

RFPWRoutesHandler.prototype.getRouteColorByPos = function(routePos)
{
  // console.log(routeID);
  // for (var routeIdx in this.routesLst)
  // {
  //   //console.log(this.routesLst[routeIdx]["route_color"]);
  //   if (this.routesLst[routeIdx].id === routeID)
  //     return this.routesLst[routeIdx].color;
  // }
  return this.routesLst[routePos].color;
}

RFPWRoutesHandler.prototype.getRouteShortNmByPos = function(routePos)
{
  // for (var routeIdx in this.routesLst)
  //   if (this.routesLst[routeIdx].id === routeID)
  //     return this.routesLst[routeIdx].shortNm;
  return this.routesLst[routePos].shortNm;
}

RFPWRoutesHandler.prototype.getRouteTypeStrByPos = function(routePos)
{
  // for (var routeIdx in this.routesLst)
  //   if (this.routesLst[routeIdx].id === routeID)
  //     return Routes.ROUTE_TYPE_STR[this.routesLst[routeIdx].type][0];
  return RFPWRoutesHandler.ROUTE_TYPE_STR[this.routesLst[routePos].type][0];
}

RFPWRoutesHandler.prototype.getRouteIDByPos = function(routePos)
{
  this.routesLst[routePos].getId();
}
