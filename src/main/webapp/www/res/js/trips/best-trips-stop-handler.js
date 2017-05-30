/**
 * Handles the complete process of informing the user about the best trip for a
 * a selected route or for all routes at a selected stop
 */
function RFPWBestTripsStopHandler(stop, route)
{
  this._stop = stop;
  this._route = route;
  applicationContext.getLocalization().formatValue("tripsbrstoproutetitle",
    {stopTitle: stop.getTitle(), routeShortNm: route.getShortNm()}
  ).then(
    tripsbrstoproutetitle =>
      $("#dlg-trips-br-stop-route").find('.modal-title').text(tripsbrstoproutetitle)
  );
  this._jqSort = $("#dlg-trips-br-stop-route-sort");
  this._jqSortSel = this._jqSort.find("select");
  this._jqSortSel.on("change", $.proxy(this._onSortSel, this));
  this._tripsLst = [];
  this._jqTripsLst = $("#dlg-trips-br-stop-route").find(".list-group");
  this._jqTripsLst.empty();
}

RFPWBestTripsStopHandler.prototype.show = function()
{
  $("#dlg-trips-br-stop-route").modal();
  this._reqBRStopRoute();
}

RFPWBestTripsStopHandler.prototype._hideDlgBRStopRoute = function()
{
  this._cancelSchedByRouteIdDate = true;
  this._displRouteSchedule = null;
  $("#dlg-trips-br-stop-route").empty();
}

RFPWBestTripsStopHandler.prototype._reqBRStopRoute = function()
{
  this._cancelSchedByRouteIdDate = false;
  var pnlBody = $("#dlg-trips-br-stop-route > .modal-body");
  applicationContext.showLoading("loadPnl", pnlBody);
  $("#dlg-trips-br-stop-route").modal();
  var dt = applicationContext.moreHandler.getDateTimeHandler().
    getDateTimeMinutesUTC();
  applicationContext.asyncReq($.proxy(this._sucBRStopRoute, this),
    $.proxy(this._errBRStopRoute, this),
    "bestrec",
    [applicationContext.moreHandler.getCurrentCountryCode(),
      applicationContext.moreHandler.getCurrentCityCode(), this._stop.getId(),
      this._route.getShortNm(), dt.dt.toString(), dt.utc.toString()]
  );
}

RFPWBestTripsStopHandler.prototype._sucBRStopRoute = function(data)
{
  console.log("success best stop/route");
  if (!this._cancelSchedByRouteIdDate)
  {//   If the user didn't cancel the dialog, add the data
    //console.log(data);
    var jqAlert = $("#dlg-trips-br-stop-route").find('.alert');
    jqAlert.addClass("spa-rfpw-diplay-none");
    this._jqSort.removeClass("spa-rfpw-diplay-none");
    data = JSON.parse(data);
    this._tripsLst = [];
    var d = JSON.parse(data.data);
    for (var idx=0; idx<d.length; ++idx)
    {
      this._tripsLst.push(new RFPWBestRecTripStop(d[idx]));
    }
    this._onSortSel();
    //this._genTripsLst();
    applicationContext.hideLoadingPnl("div-routes-sched-body");
  }

}

RFPWBestTripsStopHandler.prototype._errBRStopRoute = function(request,
    textStatus, errorThrown)
{
  console.log("error best stop/route");
  if (!this._cancelSchedByRouteIdDate)
  {//   If the user didn't cancel the dialog, add the data
    var jqAlert = $("#dlg-trips-br-stop-route").find('.alert');
    jqAlert.removeClass("spa-rfpw-diplay-none");
    this._jqSort.addClass("spa-rfpw-diplay-none");
    applicationContext.getLocalization().formatValue("dlgtripsbrstoprouteerr",
      { err: JSON.parse(request.responseText).msg }).then(
        dlgtripsbrstoprouteerr => jqAlert.text(dlgtripsbrstoprouteerr));
    //jqAlert.text(request.responseText);
    $("#sel-routes-sched-trip").addClass("spa-rfpw-hidden");
    //applicationContext.hideLoadingPnl("div-routes-sched-body");
  }
}

RFPWBestTripsStopHandler.prototype._genTripsLst = function()
{

  var result = "";
  var time;
  for (var idx=0; idx<this._tripsLst.length; ++idx)
  {
    result += RFPWBestTripsStopHandler.LST_ITM.render(
      {time: this._tripsLst[idx].getTripInitialTime() + "->" +
        this._tripsLst[idx].getTripFinalTime(),
      pas: this._tripsLst[idx].getPassengersNumber(),
      dur: this._tripsLst[idx].getTripDuration()});
  }
  this._jqTripsLst.empty();
  this._jqTripsLst.append(result);
}

/**
 * Responds to user's action by sorting and generating the list of best trips
 */
RFPWBestTripsStopHandler.prototype._onSortSel = function()
{
  this._sortBRTrips();
  this._genTripsLst();
}

/**
 * Sort the array with the best trips received from the server
 */
RFPWBestTripsStopHandler.prototype._sortBRTrips = function()
{
  var selOpt = parseInt(this._jqSortSel.val());
  switch (selOpt)
  {
    case RFPWBestTripsStopHandler.SORT_EARLIEST:
      this._tripsLst.sort(function(a, b)
      {
        if (a.getTripInitialTime() < b.getTripInitialTime())
          return -1;
        else if (a.getTripInitialTime() > b.getTripInitialTime())
          return 1;
        else
          return 0;
      });
      break;
    case RFPWBestTripsStopHandler.SORT_DURATION:
      this._tripsLst.sort(function(a, b)
      {
        return a.getTripDuration() - b.getTripDuration();
      });
      break;
    case RFPWBestTripsStopHandler.SORT_EMPTINESS:
      this._tripsLst.sort(function(a, b)
      {
        return a.getPassengersNumber() - b.getPassengersNumber();
      });
      break;
    default:
      console.log("RFPWBestTripsStopHandler::_onSortSel - Unhandled case to sort: " + selOpt);
  }
}

RFPWBestTripsStopHandler.SORT_EARLIEST = 1;
RFPWBestTripsStopHandler.SORT_DURATION = 2;
RFPWBestTripsStopHandler.SORT_EMPTINESS = 3;

RFPWBestTripsStopHandler.LST_ITM = $.templates("<li class=\"list-group-item\">\
<i data-l10n-id=\"dlgtripsbrstoproutetm\" class=\"spa-rfpw-margin-br-info\"></i>\
<span class=\"spa-rfpw-margin-br-info\">{{:time}}</span>\
<div class=\"pull-right\">\
<span class=\"glyphicon glyphicon-user spa-rfpw-margin-br-info\">{{:pas}}</span>\
<span class=\"glyphicon glyphicon-time spa-rfpw-margin-br-info\">{{:dur}}</span>\
</div>\
</li>");
