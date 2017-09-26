RFPWBRCreateTripHandler.TRIP_STOP_SEL_FROM = 11;
RFPWBRCreateTripHandler.TRIP_STOP_SEL_TO = 12;
RFPWBRCreateTripHandler.TRIP_STOP_SEL_NONE = 13;

function RFPWBRCreateTripHandler(mapHandler)
{
  this._dlgJQ = $("#dlg-trips-br-trips");
  this._mapHandler = mapHandler;
  this._tripStopSelId = RFPWBRCreateTripHandler.TRIP_STOP_SEL_NONE;
  this._createTripStopSelJQ = $("#div-trips-create-trip-stop-sel-msg");
  var mtsh = applicationContext.getMainTabSelectorHeight();
  this._createTripStopSelJQ.height(mtsh);
  $("#btn-trips-br-trips-from").on("click",
    $.proxy(this._onCreateTripStopSel, this,
      RFPWBRCreateTripHandler.TRIP_STOP_SEL_FROM));
  $("#btn-trips-br-trips-to").on("click",
    $.proxy(this._onCreateTripStopSel, this,
      RFPWBRCreateTripHandler.TRIP_STOP_SEL_TO));
  $("#btn-trips-create-trip-stop-sel-cancel").on("click",
    $.proxy(this._onCreateTripStopSelCancelClick, this));
  $("#inp-trips-br-trips-from").val("");
  $("#inp-trips-br-trips-to").val("");

  this._fromStop = null;
  this._toStop = null;
  this._stopsMH = [];//this._mapHandler.getStops();
  $("#btn-trips-br-trips-create").on("click",
    $.proxy(this._reqCreateTrip, this));
  
  this._tripRecs = [];
  this._tripRecsById = null;
  this._stopsMH = this._mapHandler.getStops();
  this._tripRecs = [];
  this._tripRecsById = Object.create(null);
  //this._jqTripRecsLst = $("#dlg-trips-br-trips").find(".list-group");
}

RFPWBRCreateTripHandler.prototype.destroy = function()
{
  $("#btn-trips-br-trips-from").off("click");
  $("#btn-trips-br-trips-to").off("click");
  $("#btn-trips-create-trip-stop-sel-cancel").off("click");
  $("#btn-trips-br-trips-create").off("click");
  $("#inp-trips-br-trips-from").typeahead("destroy");
  $("#inp-trips-br-trips-to").typeahead("destroy");
  this._rmTripsHTML();
}

RFPWBRCreateTripHandler.prototype.showCreateTripDlg = function()
{
  var stops = [];
  // Create the list of stops that will show in the autocomplete
  for (var idx=0; idx<this._stopsMH.length; ++idx)
  {
    stops.push(
      {
        id: this._stopsMH[idx].getId(),
        idxStopsMH: idx,
        title: this._stopsMH[idx].getTitle(),
        name: this._genAutocompleteStop(this._stopsMH[idx])
     }
    );
  }
  // Initialize the autocomplete structures
  $("#inp-trips-br-trips-from").typeahead("destroy");
  $("#inp-trips-br-trips-from").typeahead({
    source: stops,
    autoSelect: true,
    afterSelect: $.proxy(this._selStopTypeAheadFrom, this)
  });
  $("#inp-trips-br-trips-to").typeahead("destroy");
  $("#inp-trips-br-trips-to").typeahead({
    source: stops,
    autoSelect: true,
    afterSelect: $.proxy(this._selStopTypeAheadTo, this)
  });
  this._dlgJQ.modal({
    backdrop: 'static',
    keyboard: false
  });
}

RFPWBRCreateTripHandler.prototype.clear = function()
{
  this._rmTripsHTML();
  this._fromStop = null;
  this._toStop = null;
}

RFPWBRCreateTripHandler.prototype._reqCreateTrip = function()
{
  this._rmTripsHTML();
  //var stopFrom = this._stopsMH[this._fromStop.idxStopsMH];
  //var stopTo = this._stopsMH[this._toStop.idxStopsMH];
  //console.log("Create trip from " + this._fromStop.getLat() + "," + this._fromStop.getLng() +
//		  this._toStop.getLat() + "," + this._toStop.getLng());
  applicationContext.asyncReq($.proxy(this._sucCreateTrip, this),
    $.proxy(this._errCreateTrip, this),
    "br/create_trip",
    [applicationContext.moreHandler.getCurrentCountryCode(),
      applicationContext.moreHandler.getCurrentCityCode(),
      this._fromStop.getLat(),
      this._fromStop.getLng(),
      this._toStop.getLat(),
      this._toStop.getLng(),
      0, 0
    ]
  );
}

RFPWBRCreateTripHandler.prototype._rmTripsHTML = function()
{
  var jqTripRecsLst = $("#dlg-trips-br-trips").find(".list-group");
  //jqTripRecsLst.children().off();
  jqTripRecsLst.empty();
  this._tripRecs = [];
  this._tripRecsById = Object.create(null);
}

RFPWBRCreateTripHandler.prototype._sucCreateTrip = function(data)
{
  if (data["errorMsg"].length == 0)
  {
    var tripRecs = data["data"];
    this._tripRecs = [];
    this._tripRecsById = Object.create(null);
    for (var idxTR=0; idxTR<tripRecs.length; ++idxTR)
    {
      var tempTR = new RFPWTripRec(tripRecs[idxTR]);
      tempTR.setFromStopName(this._fromStop.getTitle());
      tempTR.setToStopName(this._toStop.getTitle());
      this._tripRecs.push(tempTR);
      this._tripRecsById[tempTR.getId()] = tempTR;
      $("#dlg-trips-br-trips").find(".list-group").append(tempTR.getHTMLRepresentation());
      $("#btn-br-rfpw-trip-rec-" + tempTR.getId()).on("click",
          $.proxy(this._showOnMap, this, tempTR)
      );
      $("#btn-br-rfpw-trip-rec-fav-" + tempTR.getId()).on("click",
          $.proxy(this._addFav, this, tempTR)
      );
    }
  }
}

RFPWBRCreateTripHandler.prototype._addFav = function(tripObj)
{
  
  if (applicationContext.favsHandler.isFavsLoaded())
  {
    $("#btn-br-rfpw-trip-rec-fav-" + tripObj.getId()).prop("disabled", true);
    applicationContext.favsHandler.addFavTrip(tripObj, 
        $.proxy(this._addFavSuc, this, tripObj.getId()),
        $.proxy(this._addFavErr, this, tripObj.getId()));
  } else
  {
    $.notify($("#notify-w-trips-favs-not-load").text(), 
      {
        className: "warn",
        globalPosition: 'top left'
      }
    );
    console.warn("Favorites have not finished loading yet, please wait until the loading is complete");
  }
}

RFPWBRCreateTripHandler.prototype._addFavSuc = function(tripId)
{
  $("#btn-br-rfpw-trip-rec-fav-" + tripId).prop("disabled", false);
  $.notify($("#notify-i-trips-fav-add-suc").text(), 
      {
        className: "success",
        globalPosition: 'top left'
      }
    );
}

RFPWBRCreateTripHandler.prototype._addFavErr = function(tripObj)
{
  $("#btn-br-rfpw-trip-rec-fav-" + tripObj.getId()).prop("disabled", false);
  $.notify($("#notify-w-trips-fav-add-err").text(), 
      {
        className: "warn",
        globalPosition: 'top left'
      }
    );
}

RFPWBRCreateTripHandler.prototype._errCreateTrip = function(request,
    textStatus, errorThrown)
{
  $.notify($("#notify-e-trips-create-trip-err").text(), 
      {
        className: "error",
        globalPosition: 'top left'
      }
    );
  console.error("Error creating trip: " + request.responseText);

}

RFPWBRCreateTripHandler.prototype._showOnMap = function(tripRec)
{
  this._mapHandler.drawBRTripRec(tripRec);
  this._dlgJQ.modal("hide");
}

RFPWBRCreateTripHandler.prototype._selStopTypeAheadFrom = function(item)
{
  this._tripStopSelId = RFPWBRCreateTripHandler.TRIP_STOP_SEL_FROM;
  this.selectStop(this._stopsMH[item.idxStopsMH]);
}

RFPWBRCreateTripHandler.prototype._selStopTypeAheadTo = function(item)
{
  this._tripStopSelId = RFPWBRCreateTripHandler.TRIP_STOP_SEL_TO;
  this.selectStop(this._stopsMH[item.idxStopsMH]);
}

RFPWBRCreateTripHandler.prototype.selectStop = function(stop)
{
  console.log("select stop: " + JSON.stringify(stop));
  if (this._tripStopSelId === RFPWBRCreateTripHandler.TRIP_STOP_SEL_FROM)
  {
    $("#inp-trips-br-trips-from").val(stop.getTitle());
    this._fromStop = stop;
  } else if (this._tripStopSelId === RFPWBRCreateTripHandler.TRIP_STOP_SEL_TO)
  {
    $("#inp-trips-br-trips-to").val(stop.getTitle());
    this._toStop = stop;
  }
  this._onCreateTripStopSelExit();
}

RFPWBRCreateTripHandler.prototype._genAutocompleteStop = function(stop)
{
  var renderedStop = "";
  var routes = "";
  var routesIds = stop.getRoutesIds();
  for (var routesIdx in routesIds)
  {
    routes += this._mapHandler.genRouteIcon(
      0, routesIdx,
      applicationContext.routesHandler.getRouteShortNmById(routesIds[routesIdx]),
      applicationContext.routesHandler.getRouteColorById(routesIds[routesIdx]),
      applicationContext.routesHandler.getRouteTypeStrById(routesIds[routesIdx]));
    routesIdx++;
    if (routesIdx % 4 === 0)
      routes += "<br />"
    --routesIdx;
  }
  renderedStop += "<div class=\"scrollFix\"><b>" + stop.getTitle() + "</b><br>" +
    parseFloat(stop.getLat()).toFixed(4) + "&deg;" +
      (parseFloat(stop.getLat()).toFixed(4) < 0 ? 'S' : 'N') +
      "&nbsp&nbsp" +
      parseFloat(stop.getLng()).toFixed(4) + "&deg;" +
      (parseFloat(stop.getLng()).toFixed(4) < 0 ? 'W' : 'E') +
      //"</div>";
    "<br>" + routes + "<br></div>";
  return renderedStop;
}

RFPWBRCreateTripHandler.prototype._onCreateTripStopSel = function(selectionId, e)
{
  e.preventDefault();
  this._tripStopSelId = selectionId;
  // Disable the UI
  this._mapHandler._chgStateTripsMoreBtns(true);
  // Show message over tab switch
  this._createTripStopSelJQ.removeClass("spa-rfpw-diplay-none");
  // Hide the dialog
  this._dlgJQ.modal("hide");
}

RFPWBRCreateTripHandler.prototype._onCreateTripStopSelCancelClick = function(e)
{
  e.preventDefault();
  this._onCreateTripStopSelExit();
}

RFPWBRCreateTripHandler.prototype._onCreateTripStopSelExit = function()
{
  // Enable the UI
  this._mapHandler._chgStateTripsMoreBtns(false);
  // Hide message over tab switch
  this._createTripStopSelJQ.addClass("spa-rfpw-diplay-none");
  this._tripStopSelId = RFPWBRCreateTripHandler.TRIP_STOP_SEL_NONE;
  // Show the dialog
  this._dlgJQ.modal("show");
}

RFPWBRCreateTripHandler.prototype.isSelStop = function()
{return this._tripStopSelId != RFPWBRCreateTripHandler.TRIP_STOP_SEL_NONE;}

//RFPWBRCreateTripHandler.LST_ITM_TRIP = $.templates("<li class=\"list-group-item\">\
//<i data-l10n-id=\"dlgtripsbrstoproutetm\" class=\"spa-rfpw-margin-br-info\"></i>\
//<span class=\"spa-rfpw-margin-br-info\">{{:time}}</span>\
//<div class=\"pull-right\">\
//<button id=\"btn-accept-storage-usr\"\
//class=\"btn btn-link alert-link pull-right\" data-dismiss=\"alert\"\
//data-l10n-id=\"btntripsbrviewmap\"></button>\
//</div>\
//</li>");
