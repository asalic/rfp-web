RFPWMapHandler.BTN_RM_LAYER_ROOT_ID = "btn-rm-layer-";
RFPWMapHandler.CHK_LAYER_ROOT_ID = "chk-layer-";
RFPWMapHandler.LI_LAYER_ROOT_ID = "li-layer-";

RFPWMapHandler.NUM_MAX_CALL_GENSTOPCONTENT = 10;

RFPWMapHandler.MAX_LAT = -90;
RFPWMapHandler.MIN_LAT = 90;
RFPWMapHandler.MAX_LNG = -180;
RFPWMapHandler.MIN_LNG = 180;
RFPWMapHandler.MY_LOC_ICON_PATH = "/res/img/my-location.svg";
RFPWMapHandler.MY_LOC_DEFAULT_ZOOM = 14;


/**
 * Represents the handler of the tab containing the map. It is the uniwue and
 * general handler of this tab
 * 
 * @constructor
 * @param {string}
 *          mapContainerId - The html id of the container in which the map will
 *          be appended
 */
function RFPWMapHandler(mapContainerId)
{
    this.routeLayer = null;
    this.mapContainerId = mapContainerId;
    this.mapLoaded = false;
    this._sentimentAnalysisLoaded = false;
    this._trafficJamLoaded = false;
    this._stopsLoaded = false;
    this.infowindow = undefined;
    //this.mapLayers = [];
    this.mapLayers = Object.create(null);
    this._markers = [];
    // Interval to check if routes are loaded
    this.gencpc = null;
    this.gencpcCount = 0;
    this._stops = [];
    //this._sentimentAnalysisVals = [];
    //this._trafficJamVals = [];
    this.bounds = null;
    this.maxLat = RFPWMapHandler.MAX_LAT;
    this.minLat = RFPWMapHandler.MIN_LAT;
    this.maxLng = RFPWMapHandler.MAX_LNG;
    this.minLng = RFPWMapHandler.MIN_LNG;

    this._map = null;
    this._myLocIcon = L.icon({
          iconUrl:  RFPWMapHandler.MY_LOC_ICON_PATH,
          iconSize: [32, 32], // size of the icon
          popupAnchor: [0,-15]
          });
    this._myLocMarker = null;
    this._createTripHandler = null;
    this._mapLayerFactory = new RFPWMapLayerFactory();
}

RFPWMapHandler.prototype.init = function()
{
  this._initMap();
  
  $("#btn-trips-my-loc").on("click tap",
    $.proxy(this.getLocation, this));
  $("#btn-trips-create-trip").on("click tap",
    $.proxy(this._onCreateTrip, this));
  $("#btn-trips-layers").on("click tap",
    $.proxy(this.showLayersDlg, this));
  $("#btn-trips-back-city").on("click tap",
    $.proxy(this.focusSelectedCity, this));
  $("#btn-trips-sentiment-analysis").on("click tap",
      $.proxy(this.reqSentimentAnalysis, this, null, null));
  $("#btn-trips-traffic-jam").on("click tap",
      $.proxy(this.reqTrafficJam, this, null, null));
  
  // Only activate the first time map init if the app started in another tab than the map
  if ($("ul#navbar li.active").find("a").attr("href") != "#div-trips")
  {
    $("a[href='#div-trips']").on('shown.bs.tab', $.proxy(this._firstTimeShowMap, this, 
        "a[href='#div-trips']", "navbar"));
  }
  // console.log(document.l10n.get('btntripsmyloctp'));

  // Add tooltips buttons on map
//  applicationContext.getLocalization().formatValue('btntripsmyloctp').then(
//    btntripsmyloctp => $("#btn-trips-my-loc").attr("title", btntripsmyloctp)
//  );

//  applicationContext.getLocalization().formatValue('btntripscreatetriptp').then(
//    btntripscreatetriptp => $("#btn-trips-create-trip").attr("title", btntripscreatetriptp)
//  );

//  applicationContext.getLocalization().formatValue('btntripslayerstp').then(
//    btntripslayerstp => $("#btn-trips-layers").attr("title", btntripslayerstp)
//  );

//  applicationContext.getLocalization().formatValue('btntripsbackcitytp').then(
//    btntripsbackcitytp => $("#btn-trips-back-city").attr("title", btntripsbackcitytp)
//  );

  applicationContext.getLocalization().formatValue('inptripsbrtripsfrom').then(
    inptripsbrtripsfrom => $("#inp-trips-br-trips-from").attr("placeholder", inptripsbrtripsfrom)
  );

  applicationContext.getLocalization().formatValue('inptripsbrtripsto').then(
    inptripsbrtripsto => $("#inp-trips-br-trips-to").attr("placeholder", inptripsbrtripsto)
  );
  // $("#btn-trips-my-loc").attr("title",
  // "boom");//document.l10n.get("btn-trips-my-loc-tp"));
}

/**
 * When the app starts and the map tab is not active,
 * Leaflet won't load the map at all. This method
 * triggers map loading when the tab is switched.
 * Afterwards, it removes itself as a listener
 */
RFPWMapHandler.prototype._firstTimeShowMap = function(jqIdTriggerElId)
{
  
    this._map.invalidateSize();
    this.onResize();
  $(jqIdTriggerElId).off('shown.bs.tab', $.proxy(this._firstTimeShowMap, this));
}

RFPWMapHandler.prototype._initMap = function()
{
  this._map = L.map('map-canvas', {zoomControl:false}).setView(
    [applicationContext.moreHandler.getCurrentCity().getLat(),
    applicationContext.moreHandler.getCurrentCity().getLng()], 11);
  L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
  }).addTo( this._map );
  this._map.on('layeradd', $.proxy(this.onLayerAdd, this));
  //this._map.invalidateSize();
  this.mapLoaded = true;
  //this.onResize();
}

RFPWMapHandler.prototype.onLayerAdd = function(ILayer) 
{
  if($.isFunction(ILayer.layer.getContainer)) { 
    $("img", ILayer.layer.getContainer()).error(this.reloadImg); 
   }
}

RFPWMapHandler.prototype._chgStateTripsMoreBtns = function(disabled)
{
  $("#btn-trips-my-loc").prop("disabled", disabled);
  $("#btn-trips-create-trip").prop("disabled", disabled);
  $("#btn-trips-layers").prop("disabled", disabled);
  $("#btn-trips-back-city").prop("disabled", disabled);
  $("#btn-trips-sentiment-analysis").prop("disabled", disabled);
  $("#btn-trips-traffic-jam").prop("disabled", disabled);
  
}

RFPWMapHandler.prototype._onCreateTrip = function()
{
  if (!applicationContext.moreHandler.getCurrentCity().getHasBRTrips()
      && !applicationContext.moreHandler.getCurrentCity().getHasOTP())
  {
    $.notify($("#notify-i-trips-create-trip-non").text(), 
        {
          className: "info",
          globalPosition: 'top left'
        }
      );
  } else
  {
    // Create the dialog once
    if (this._createTripHandler == null)
    {
      this._createTripHandler = new RFPWBRCreateTripHandler(this);
    }
    this._createTripHandler.showCreateTripDlg();
  }
}

RFPWMapHandler.prototype.showLayersDlg = function()
{
  // Clear the list of layers
  $("#dlg-trips-layers-content").empty();
  // Regenerate the list of layers
  var layersCnt = "";
  var keys = Object.keys(this.mapLayers);
  for (var idx=0; idx<keys.length; ++idx)
  {
    var rmBtnHTML = (this.mapLayers[keys[idx]].isRemovable() ?
      ('<button id="' + RFPWMapHandler.BTN_RM_LAYER_ROOT_ID + keys[idx] +
      '" class="btn btn-default pull-right glyphicon glyphicon-trash spa-rfpw-btn-rm-layer" ></button>') : '');

    $("#dlg-trips-layers-content").append(
      '<li id="' + RFPWMapHandler.LI_LAYER_ROOT_ID + keys[idx] +
          '" class="list-group-item"><div class="checkbox">' +
          '<label><input id="' + RFPWMapHandler.CHK_LAYER_ROOT_ID + keys[idx] +
          '" type="checkbox" value="' + keys[idx] +
          '" ' + (this.mapLayers[keys[idx]].isShown() ? 'checked' : '') + '>' +
          this.mapLayers[keys[idx]].getNm() + '</label>' + rmBtnHTML + '</div></li>');
    $("#" + RFPWMapHandler.BTN_RM_LAYER_ROOT_ID + keys[idx]).on('click tap',
      $.proxy(this.rmLayer, this, keys[idx]));
    $("#" + RFPWMapHandler.CHK_LAYER_ROOT_ID + keys[idx]).on('change',
      $.proxy(this.toggleVisibilityLayer, this, keys[idx]));
  }
  $("#dlg-trips-layers").modal();
}

RFPWMapHandler.prototype.toggleVisibilityLayer = function(mlCount)
{
  // console.log("ckh is checked " + $("#" + MapHandler.CHK_LAYER_ROOT_ID +
  // idx).is(':checked'));
  this.mapLayers[mlCount].toggleLayerVisibility();
}

RFPWMapHandler.prototype.clearLocation = function(idx)
{
  this.rmAllLayers();
  this._stops = [];
}

RFPWMapHandler.prototype.rmAllLayers = function()
{
  var keys = Object.keys(this.mapLayers);
  for (var idx=0; idx<keys.length; ++idx)
    this.rmLayer(keys[idx]);
}

RFPWMapHandler.prototype.rmLayer = function(mlCount)
{
  this.mapLayers[mlCount].remove();
  delete this.mapLayers[mlCount];
  //this.mapLayers.splice(idx, 1);
  $("#" + RFPWMapHandler.LI_LAYER_ROOT_ID + mlCount).remove();
}

RFPWMapHandler.prototype.rmLayerByType = function(layerType)
{
  for (var ml in this.mapLayers) {
    if (this.mapLayers[ml] !== undefined && this.mapLayers[ml] !== null) {
        if (this.mapLayers[ml].getMLType() === layerType)
        {
           this.rmLayer(ml);
        }
    }
  }
  //this.mapLayers.splice(idx, 1);
}

RFPWMapHandler.prototype.setHeightMap = function()
{
  // console.log("heightRows: " + $("#navbar").height());
  $("#map-container").css('height', $(window).height() - $("#navbar").height() -
    $("#div-trips-more-container").height());
}

RFPWMapHandler.prototype.onResize = function()
{
  this.setHeightMap();
  // this._markers = [];
  // google.maps.event.trigger(this._map, "resize");
  // this._map.setCenter(this._map.getCenter());
  this._map.fitBounds(new L.LatLngBounds([[this.minLat, this.minLng],
    [this.maxLat, this.maxLng]]));
  this._map.invalidateSize();
  // this._map.setCenter(this.bounds.getCenter());
  // console.log("on resize");
}

RFPWMapHandler.prototype.addStops2Map = function(callBSuc, callBErr)
{
  this._stopsLoaded = false;
  applicationContext.asyncReq($.proxy(this._sucAddStops2Map, this, callBSuc),
   $.proxy(this._errAddStops2Map, this, callBErr),
   "stops",
   [applicationContext.moreHandler.getCurrentCountryCode(),
     applicationContext.moreHandler.getCurrentCityCode()]
  );
}

RFPWMapHandler.prototype._sucAddStops2Map = function(callBSuc, stopsLst)
{
  var stopsLst = stopsLst.data;
  this._stops = [];
  this._markers = [];
  this.maxLat = RFPWMapHandler.MAX_LAT;
  this.minLat = RFPWMapHandler.MIN_LAT;
  this.maxLng = RFPWMapHandler.MAX_LNG;
  this.minLng = RFPWMapHandler.MIN_LNG;

  var markers = L.markerClusterGroup();

  for (var idx in stopsLst)
  {
    var stop = new RFPWStop(stopsLst[idx]);
    // /console.log(stopsLst[idx]);
    delete stopsLst[idx];
    if (stop.getLat() < this.minLat)
      this.minLat = stop.getLat();
    if (stop.getLat() > this.maxLat)
      this.maxLat = stop.getLat();
    if (stop.getLng() < this.minLng)
      this.minLng = stop.getLng();
    if (stop.getLng() > this.maxLng)
      this.maxLng = stop.getLng();
    var marker = L.marker(new L.LatLng(stop.getLat(), stop.getLng()),
      { title: stop.getTitle() });
    marker.name = stop.getTitle();
    marker.markerIdx = idx;
    marker.stopIdx = idx;
    marker.gtfsId = stop.getId();
    marker.routesIds = stop.getRoutesIds();
		markers.addLayer(marker);

    this._stops.push(stop);

    // console.log(marker);
    // google.maps.event.addListener(marker, "click",
    // $.proxy(this.genStopContent, this, marker)
    // );
  }
  markers.on('click', $.proxy(this._onMarkerClick, this));

  this._map.addLayer(markers);
  this._map.fitBounds(new L.LatLngBounds([[this.minLat, this.minLng],
    [this.maxLat, this.maxLng]]));

  var ml = this._mapLayerFactory.createMLAllStops(this._map,
      markers);
  this.mapLayers[ml.getCount()] = ml;
  this._chgStateTripsMoreBtns(false);
  // var extent = ol.extent.createEmpty();
  // ol.extent.extend(extent, clusters.getSource().getExtent());
  // this._map.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326',
  // 'EPSG:3857'), this._map.getSize());
  // this.bounds = new google.maps.LatLngBounds(
  // {lat: this.minLat, lng: this.minLng},
  // {lat: this.maxLat, lng: this.maxLng});
  // this._map.fitBounds(this.bounds);
  this._stopsLoaded = true;
  if (callBSuc != null)
    callBSuc();
}

RFPWMapHandler.prototype._errAddStops2Map = function(request,
    textStatus, errorThrown)
{
  console.log("error: " + errorThrown);
  console.log("error: " + textStatus);
  applicationContext.getLocalization().formatValue("errloadingallmapstops").then(
    errloadingallmapstops => applicationContext.showError(errloadingallmapstops)
  );
  this._stopsLoaded = false;
  if (callBErr != null)
    callBErr();
  
}

RFPWMapHandler.prototype._onMarkerClick = function(marker)
{
  if (this._createTripHandler !== null &&
    this._createTripHandler.isSelStop())
  {
    this._createTripHandler.selectStop(this._stops[marker.layer.stopIdx]);
  } else
    this._genStopContent(marker);
}

RFPWMapHandler.prototype._genStopContent = function(marker)
{
  this.gencpc = setInterval($.proxy(this.genStopContentImpl,
    this, marker), 300);
}

RFPWMapHandler.prototype.genStopContentImpl = function(markerFull)
{
  ++this.gencpcCount;
  if (this.gencpcCount === RFPWMapHandler.NUM_MAX_CALL_GENSTOPCONTENT)
  {
    clearInterval(this.gencpc);
    this.gencpcCount = 0;
    console.log(marker);
  }
  if (applicationContext.isRoutesLoaded())
  {
    var marker = markerFull.layer;
    // console.log("gen popup");
    // ev.layer.openPopup();
    var routes = "";
    var routesIds = marker.routesIds;
    for (var routesIdx in routesIds)
    {
      routes += RFPWMapHandler.prototype.genRouteIcon(
        marker.markerIdx, routesIdx,
        applicationContext.routesHandler.getRouteShortNmById(routesIds[routesIdx]),
        applicationContext.routesHandler.getRouteColorById(routesIds[routesIdx]),
        applicationContext.routesHandler.getRouteTypeStrById(routesIds[routesIdx]));
      routesIdx++;
      if (routesIdx % 4 === 0)
        routes += "<br />"
      --routesIdx;
    }
    routes += "";
    marker.bindPopup("<div class=\"scrollFix\"><b>" + marker.name + "</b><br>" +
      marker.getLatLng().lat.toFixed(4) + "&deg;" +
        (marker.getLatLng().lat.toFixed(4) < 0 ? 'S' : 'N') +
        "&nbsp&nbsp" +
        marker.getLatLng().lng.toFixed(4) + "&deg;" +
        (marker.getLatLng().lng.toFixed(4) < 0 ? 'W' : 'E') +
      "<br>" + routes + "<br></div>"
    );
    clearInterval(this.gencpc);
    $("[id^=a-trips-stop-route-]").on("click", $.proxy(this._onRouteIcon, this));
    this.gencpcCount = 0;
    delete this.gencpc;
    marker.openPopup();
  }
}

RFPWMapHandler.prototype.genRouteIcon = function(markerIdx, routesIdx,
  routeShortNm, routeColor, routeTypeNm)
{
  return "<a id=\"a-trips-stop-route-" + routesIdx + "-" + markerIdx +
    "\" class=\"spa-rfpw-route-icon\" href=\"#\" style=\"background-color:" +
    routeColor + "; color: " + applicationContext.getContrastYIQ(routeColor) +
    "\">" + routeTypeNm + routeShortNm + "</a>";
}

RFPWMapHandler.prototype._onRouteIcon = function(event)
{
  var idxArr = event.target.id.split('-');
  var markerIdx = parseInt(idxArr[idxArr.length - 1]);
  var routesIdx = parseInt(idxArr[idxArr.length - 2]);
  var marker = this._markers[markerIdx];
  var dialog = new RFPWBestTripsStopHandler(this._stops[marker.stopIdx],
    applicationContext.routesHandler.getRouteById(marker.routesIds[routesIdx]));
  dialog.show();
}

RFPWMapHandler.prototype.drawRoute = function(route)
{
  var p = route.getPaths();
  route.clearDrawnPaths();
  for (var idx=0; idx<p.length; ++idx)
  {
    console.log("idx is: " + idx);
    var path = L.geoJson(p[idx],
      {
        "color": route.getColor(),
        "weight": 5,
      });
    route.addDrawnPath(path);
  }
  // Group all the drawn paths together for easier management
  var drawnPathsGroup = L.layerGroup(route.getDrawnPaths());
  drawnPathsGroup.addTo(this._map);;
  route.setDrawnPathsGroup(drawnPathsGroup);
  var ml = this._mapLayerFactory.createMLRoutePaths(this._map,
      route);
  this.mapLayers[ml.getCount()] = ml;
}

RFPWMapHandler.prototype.drawBRTripRec = function(tripRec)
{
  var segs = tripRec.getSegmentRecs();
  for (var idx=0; idx<segs.length; ++idx)
  {
    console.log("new path");
    var dashArray = null;
    if (applicationContext.routesHandler.isRouteWalking(segs[idx].getType()))
      dashArray = "5, 15";
    var path = L.geoJson(segs[idx].getShape(),
      {
        "color": "#" + segs[idx].getRouteColor(),
        "weight": 5,
        "dashArray": dashArray
      });
    console.log("draw brtrip--------");
    tripRec.addDrawnPath(path);
    // console.log(segs[idx].getShape());
  }
  // Group all the drawn paths together for easier management
  var drawnPathsGroup = L.layerGroup(tripRec.getDrawnPaths());
  console.log(drawnPathsGroup);
  drawnPathsGroup.addTo(this._map);;
  tripRec.setDrawnPathsGroup(drawnPathsGroup);
  var ml = this._mapLayerFactory.createMLBRTripRecs(this._map,
      tripRec);
  this.mapLayers[ml.getCount()] = ml;
}

RFPWMapHandler.prototype.getLocation = function()
{
  if (navigator.geolocation) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition($.proxy(this._onLocationSucc, this),
      $.proxy(this._onLocationErr, this),
     options);
  } else {
    applicationContext.getLocalization().formatValue("geolocationnotsupp").then(
      geolocationnotsupp =>   applicationContext.showError(geolocationnotsupp)
    );
  }
}

RFPWMapHandler.prototype._onLocationErr = function(err)
{
  applicationContext.getLocalization().formatValue("geolocationerr", {err: err.message}).then(
    geolocationerr =>   applicationContext.showError(geolocationerr)
  );
}

RFPWMapHandler.prototype._onLocationSucc = function(position)
{
  this._myLocMarker = L.marker([position.coords.latitude,
    position.coords.longitude], {icon: this._myLocIcon}).addTo(this._map);
  // var infoWindow = new google.maps.InfoWindow({map: this._map});
  // infoWindow.setPosition(pos);
  // applicationContext.getLocalization().formatValue("geolocationsuccmsg",
  // {lat: position.coords.latitude,
  // lng: position.coords.longitude,
  // acc: position.coords.accuracy
  // }).then(
  // geolocationsuccmsg => infoWindow.setContent(geolocationsuccmsg)
  // );
  // this._map.setCenter(pos);
  this._map.setView(new L.LatLng(position.coords.latitude,
    position.coords.longitude), RFPWMapHandler.MY_LOC_DEFAULT_ZOOM);

}

RFPWMapHandler.prototype.changeRegion = function(callBSuc , callBErr)
{
  this.bounds = null;
  this.maxLat = RFPWMapHandler.MAX_LAT;
  this.minLat = RFPWMapHandler.MIN_LAT;
  this.maxLng = RFPWMapHandler.MAX_LNG;
  this.minLng = RFPWMapHandler.MIN_LNG;
  this._sentimentAnalysisLoaded = false;
  this._trafficJamLoaded = false;
  this._stopsLoaded = false;
  this._chgStateTripsMoreBtns(true);
  this.rmAllLayers();
  this._stops = []; 
  if (this._createTripHandler != null)
  {
    this._createTripHandler.destroy();
    this._createTripHandler = null;
  }
  //this._map.off('layeradd', $.proxy(this.onLayerAdd, this));
  //this._initMap();
  this.addStops2Map(callBSuc, callBErr);
}

RFPWMapHandler.prototype.reqSentimentAnalysis = function(callBSuc , callBErr)
{  
  if (!applicationContext.moreHandler.getCurrentCity().getHasSentimentAnalysis())
  {
    $.notify($("#notify-i-trips-sentiment-analysis-non").text(), 
        {
          className: "info",
          globalPosition: 'top left'
        }
      );
  } else
  { 
    $("#btn-trips-sentiment-analysis").prop("disabled", true);
    $("#btn-trips-traffic-jam").prop("disabled", true);
    this.rmLayerByType(RFPWMapLayer.TYPE_SENTIMENT_ANALYSIS);
    this.rmLayerByType(RFPWMapLayer.TYPE_TRAFFIC_JAM);
    this._sentimentAnalysisLoaded = false;
    $.ajax({
      url: applicationContext.moreHandler.getCurrentCity().getHostSentimentAnalysis(),
      headers: { 'Pragma': 'no-cache', 
        "Cache-Control":  "no-cache",
        "X-Auth-Token": "123456"
      },
      type: "GET",
      //dataType: 'jsonp',
      success: $.proxy(this._sucSentimentAnalysis, this, callBSuc, callBErr),
      error: $.proxy(this._errSentimentAnalysis, this, callBSuc, callBErr)
     });
  }
}

RFPWMapHandler.prototype._sucSentimentAnalysis = function(callBSuc, callBErr, responseJson)
{ 
  var valuesLst = responseJson["data"];
  var markersLst = []
  
  //for (var idxC=0; idxC< 100; ++idxC) {
  for (var  idx in valuesLst) {
    var value = new RFPWSAValue(valuesLst[idx]);
    const coordinates = [value.getLat(), value.getLng()];
    const properties = {
        a: value.getVal(),
        b: value.getVal()
    };

    const marker = L.circleMarker(coordinates, {radius: 1, fillColor: 'black'});
    markersLst.push( {
        marker: marker, 
        properties: properties
    });
  }
  //}
  const rules = {
      cells: {
          "fillColor": {
              "method": "mean",
              "attribute": "b",
              "scale": "continuous",
              "range": ["red", "yellow", "green"]
          },
          "color": "black",
          "fillOpacity": 0.2,
          "weight": 0
      },
      markers: {
          "color": "white",
          "weight": 2,
          "fillOpacity": 0.9,
          "fillColor": {
              "method": "mean",
              "attribute": "b",
              "scale": "continuous",
              "range": ["red", "yellow", "green"]
          },
          "radius": {
              "method": "count",
              "attribute": "",
              "scale": "continuous",
              "range": [1, 10]
          }
      },
      texts: {}
  }
  
  var markers = L.regularGridCluster(
      {
          rules: rules,
          gridMode: "hexagon",
          showCells: true,
          showMarkers: true,
          showTexts: false,
          showEmptyCells: true,
          zoomShowElements:20,
          zoomHideGrid:20
      }
  );
  markers.addLayers(markersLst);

  
  
  // Now iterate over data and add it to our structure
//  for (var idx in valuesLst)
//  {
//    var value = new RFPWSAValue(valuesLst[idx]);
//    delete valuesLst[idx];
//    var numPoint = Math.round(value.getVal() * 10);
//    for (var idx=0; idx<numPoint; ++idx)
//      markersLst.push([value.getLat(), value.getLng(), value.getVal()]);
//  }
  //markers.on('click', $.proxy(this._onMarkerClick, this));


  //var markers = L.heatLayer(markersLst, {radius: 25, gradient: {0.3: 'red', 0.5: 'yellow', 0.9: 'green'}});
  this._map.addLayer(markers);

  var ml = this._mapLayerFactory.createMLSentimentAnalysis(this._map,
      markers);
  this.mapLayers[ml.getCount()] = ml;
  //this._chgStateTripsMoreBtns(false);
  this._sentimentAnalysisLoaded = true;
  if (callBSuc != null)
    callBSuc();

  $("#btn-trips-sentiment-analysis").prop("disabled", false);
  $("#btn-trips-traffic-jam").prop("disabled", false);
}

RFPWMapHandler.prototype._errSentimentAnalysis = function(callBSuc , callBErr, request,
    textStatus, errorThrown)
{ 
  $.notify($("#notify-e-trips-sentiment-analysis-req-err").text(), 
      {
        className: "error",
        globalPosition: 'top left'
      }
    );
  console.error("Unable to load the sentiment analysis for the selected city: " + "\n" +  errorThrown + "\n" + request.responseText);
  if (callBErr != null)
    callBErr();
  $("#btn-trips-sentiment-analysis").prop("disabled", false);
  $("#btn-trips-traffic-jam").prop("disabled", false);
}

RFPWMapHandler.prototype.reqTrafficJam = function(callBSuc , callBErr)
{  
  if (!applicationContext.moreHandler.getCurrentCity().getHasTrafficJam())
  {
    $.notify($("#notify-i-trips-traffic-jam-non").text(), 
        {
          className: "info",
          globalPosition: 'top left'
        }
      );
  } else
  {
    $("#btn-trips-sentiment-analysis").prop("disabled", true);
    $("#btn-trips-traffic-jam").prop("disabled", true);
    this.rmLayerByType(RFPWMapLayer.TYPE_SENTIMENT_ANALYSIS);
    this.rmLayerByType(RFPWMapLayer.TYPE_TRAFFIC_JAM);
    this._trafficJamLoaded = false;
    $.ajax({
      url: applicationContext.moreHandler.getCurrentCity().getHostTrafficJam(),
      headers: { 'Pragma': 'no-cache', 
        "Cache-Control":  "no-cache",
        "X-Auth-Token": "123456"
      },
      type: "GET",
      //dataType: 'jsonp',
      success: $.proxy(this._sucTrafficJam, this, callBSuc, callBErr),
      error: $.proxy(this._errSentimentAnalysis, this, callBSuc, callBErr)
    });
  }
}

RFPWMapHandler.prototype._sucTrafficJam = function(callBSuc, callBErr, responseJson)
{ 
  var valuesLst = responseJson["data"]; 
  var markersLst = []
  // Now iterate over data and add it to our structure
  for (var idx in valuesLst)
  {
    var value = new RFPWTJValue(valuesLst[idx]);
    // /console.log(stopsLst[idx]);
    delete valuesLst[idx];
//    var marker = L.marker(new L.LatLng(value.getLat(), value.getLng()),
//      { value: value.getVal() });
//    marker.value = value.getVal();
//    marker.markerIdx = idx;
//    marker.valueIdx = idx;
//    markers.addLayer(marker);
    var numPoint = Math.round(value.getVal() * 10);
    for (var idx=0; idx<numPoint; ++idx)
      markersLst.push([value.getLat(), value.getLng(), value.getVal()]);


    // console.log(marker);
    // google.maps.event.addListener(marker, "click",
    // $.proxy(this.genStopContent, this, marker)
    // );
  }
  //markers.on('click', $.proxy(this._onMarkerClick, this));


  var markers = L.heatLayer(markersLst, {radius: 25, gradient: {0.3: 'green', 0.5: 'yellow', 0.9: 'red'}});
  this._map.addLayer(markers);

  var ml = this._mapLayerFactory.createMLTrafficJam(this._map,
      markers);
  this.mapLayers[ml.getCount()] = ml;
  //this._chgStateTripsMoreBtns(false);
  this._trafficJamLoaded = true;
  if (callBSuc != null)
    callBSuc();
  $("#btn-trips-sentiment-analysis").prop("disabled", false);
  $("#btn-trips-traffic-jam").prop("disabled", false);
}

RFPWMapHandler.prototype._errTrafficJam = function(callBSuc , callBErr, request,
    textStatus, errorThrown)
{ 
  $.notify($("#notify-e-trips-trips-traffic-jam-req-err").text(), 
      {
        className: "error",
        globalPosition: 'top left'
      }
    );
  console.error("Unable to load the traffic jam analysis for the selected city: " + "\n" +  errorThrown + "\n" + request.responseText);
  if (callBErr != null)
    callBErr();
  $("#btn-trips-sentiment-analysis").prop("disabled", false);
  $("#btn-trips-traffic-jam").prop("disabled", false);
}

RFPWMapHandler.prototype.isCitySupported = function()
{
  
}

RFPWMapHandler.prototype.focusSelectedCity = function()
{
  this.onResize();
}

RFPWMapHandler.prototype.isMapLoaded = function() {return this.mapLoaded;}
RFPWMapHandler.prototype.isStopsLoaded = function() {return this._stopsLoaded;}
RFPWMapHandler.prototype.isSentimentAnalysisLoaded = function() {return this._sentimentAnalysisLoaded;}
RFPWMapHandler.prototype.isTrafficJamLoaded = function() {return this._trafficJamLoaded;}

RFPWMapHandler.prototype.getStops = function()
{return this._stops;}

RFPWMapHandler.prototype.reloadImg = function() { // reload image by changing its src
  var src = $(this).attr("src");
  var i = src.lastIndexOf('?');
  if(i > 0) { // remove previous cache string
   src = src.substring(0, i);
  }
  $(this).attr("src", src + "?nocache=" + (Math.random() * 1000));
 }
