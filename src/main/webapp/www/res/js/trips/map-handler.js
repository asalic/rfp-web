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
 * Represents the handler of the tab containing the map. It is the uniwue and general handler of this tab
 * @constructor
 * @param {string} mapContainerId - The html id of the container in which the map will be appended
*/
function RFPWMapHandler(mapContainerId)
{
    this.routeLayer = null;
    this.mapContainerId = mapContainerId;
    this.mapLoaded = false;
    this.infowindow = undefined;
    this.mapLayers = [];
    this._markers = [];
    //  Interval to check if routes are loaded
    this.gencpc = null;
    this.gencpcCount = 0;
    this._stops = [];
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

  $(window).on("resize",
    $.proxy(this.onResizeWait, this));
  //console.log(document.l10n.get('btntripsmyloctp'));

  //   Add tooltips buttons on map
  applicationContext.getLocalization().formatValue('btntripsmyloctp').then(
    btntripsmyloctp => $("#btn-trips-my-loc").attr("title", btntripsmyloctp)
  );

  applicationContext.getLocalization().formatValue('btntripscreatetriptp').then(
    btntripscreatetriptp => $("#btn-trips-create-trip").attr("title", btntripscreatetriptp)
  );

  applicationContext.getLocalization().formatValue('btntripslayerstp').then(
    btntripslayerstp => $("#btn-trips-layers").attr("title", btntripslayerstp)
  );

  applicationContext.getLocalization().formatValue('btntripsbackcitytp').then(
    btntripsbackcitytp => $("#btn-trips-back-city").attr("title", btntripsbackcitytp)
  );

  applicationContext.getLocalization().formatValue('inptripsbrtripsfrom').then(
    inptripsbrtripsfrom => $("#inp-trips-br-trips-from").attr("placeholder", inptripsbrtripsfrom)
  );

  applicationContext.getLocalization().formatValue('inptripsbrtripsto').then(
    inptripsbrtripsto => $("#inp-trips-br-trips-to").attr("placeholder", inptripsbrtripsto)
  );
  //$("#btn-trips-my-loc").attr("title", "boom");//document.l10n.get("btn-trips-my-loc-tp"));
}

RFPWMapHandler.prototype._initMap = function()
{
  this._map = L.map('map-canvas', {zoomControl:false}).setView(
    [applicationContext.moreHandler.getCurrentCityLat(),
    applicationContext.moreHandler.getCurrentCityLng()], 11);
  L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
  }).addTo( this._map );
  this.mapLoaded = true;
}

RFPWMapHandler.prototype._chgStateTripsMoreBtns = function(disabled)
{
  $("#btn-trips-my-loc").prop("disabled", disabled);
  $("#btn-trips-create-trip").prop("disabled", disabled);
  $("#btn-trips-layers").prop("disabled", disabled);
  $("#btn-trips-back-city").prop("disabled", disabled);
}

RFPWMapHandler.prototype._onCreateTrip = function()
{
  this._createTripHandler = new RFPWBRCreateTripHandler(this);
  this._createTripHandler.showCreateTripDlg();
}

RFPWMapHandler.prototype.showLayersDlg = function()
{
  //   Clear the list of layers
  $("#dlg-trips-layers-content").empty();
  //   Regenerate the list of layers
  var layersCnt = "";
  for (var idx in this.mapLayers)
  {
    var rmBtnHTML = (this.mapLayers[idx].isRemovable() ?
      ('<button id="' + RFPWMapHandler.BTN_RM_LAYER_ROOT_ID + idx +
      '" class="btn btn-default pull-right glyphicon glyphicon-trash spa-rfpw-btn-rm-layer" ></button>') : '');

    $("#dlg-trips-layers-content").append(
      '<li id="' + RFPWMapHandler.LI_LAYER_ROOT_ID + idx +
          '" class="list-group-item"><div class="checkbox">' +
          '<label><input id="' + RFPWMapHandler.CHK_LAYER_ROOT_ID + idx +
          '" type="checkbox" value="' + idx +
          '" ' + (this.mapLayers[idx].isShown() ? 'checked' : '') + '>' +
          this.mapLayers[idx].getNm() + '</label>' + rmBtnHTML + '</div></li>');
    $("#" + RFPWMapHandler.BTN_RM_LAYER_ROOT_ID + idx).on('click tap',
      $.proxy(this.rmLayer, this, idx));
    $("#" + RFPWMapHandler.CHK_LAYER_ROOT_ID + idx).on('change',
      $.proxy(this.toggleVisibilityLayer, this, idx));
  }
  $("#dlg-trips-layers").modal();
}

RFPWMapHandler.prototype.toggleVisibilityLayer = function(idx)
{
  //console.log("ckh is checked " + $("#" + MapHandler.CHK_LAYER_ROOT_ID + idx).is(':checked'));
  this.mapLayers[idx].toggleLayerVisibility();
}

RFPWMapHandler.prototype.clearLocation = function(idx)
{
  this.rmAllLayers();
  this._stops = [];
}

RFPWMapHandler.prototype.rmAllLayers = function(idx)
{
  for (var idx=0; idx<this.mapLayers.length; ++idx)
    this.rmLayer(idx);
}

RFPWMapHandler.prototype.rmLayer = function(idx)
{
  console.log("Rm layer " + idx);
  this.mapLayers[idx].remove();
  delete this.mapLayers[idx];
  this.mapLayers.splice(idx, 1);
  $("#" + RFPWMapHandler.LI_LAYER_ROOT_ID + idx).remove();
}

RFPWMapHandler.prototype.setHeightMap = function()
{
  //console.log("heightRows: " + $("#navbar").height());
  $("#map-container").css('height', $(window).height() - $("#navbar").height() -
    $("#div-trips-more-container").height());
}

RFPWMapHandler.prototype.onResizeWait = function()
{
  applicationContext.waitForFinalEvent(
    $.proxy(this.onResize, this), 500, "Resize from Maphandler");
}

RFPWMapHandler.prototype.onResize = function()
{
  this.setHeightMap();
  //this._markers = [];
  //google.maps.event.trigger(this._map, "resize");
  //this._map.setCenter(this._map.getCenter());
  this._map.fitBounds(new L.LatLngBounds([[this.minLat, this.minLng],
    [this.maxLat, this.maxLng]]));
  //this._map.setCenter(this.bounds.getCenter());
  //console.log("on resize");
}

RFPWMapHandler.prototype.addStops2Map = function()
{
  // $.ajax({
  //   url: applicationContext.conf.webserviceRoot + "/stops/" +
  //     applicationContext.moreHandler.getCurrentCountryCode() + "/" +
  //     applicationContext.moreHandler.getCurrentCityCode(),
  //   data: "",
  //   type: "get",
  //   success: $.proxy(this.addStops2MapImpl, this),
  //   error:
  //     function(XMLHttpRequest, textStatus, errorThrown)
  //     {
  //       console.log(errorThrown );
  //     }
  // });// end get( "res/data/bus-lines.json"
  applicationContext.asyncReq($.proxy(this._sucAddStops2Map, this),
   $.proxy(this._errAddStops2Map, this),
   "stops",
   [applicationContext.moreHandler.getCurrentCountryCode(),
     applicationContext.moreHandler.getCurrentCityCode()]
  );
}

RFPWMapHandler.prototype._sucAddStops2Map = function(stopsLst)
{
  var stopsLst = stopsLst.data;//JSON.parse(stopsLst);
  // var options = {
  //     imagePath: RFPWApplicationContext.MARKERCLUSTERER_IMG_REL_PATH,
  // };
  // this.infowindow = new google.maps.InfoWindow();
  // google.maps.event.addListener(this._map, 'click', function() {
  //   if (this.infowindow !== undefined)
  //     this.infowindow.close();
  // });
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

    // var marker = new google.maps.Marker({
    //     markerIdx: idx,
    //     stopIdx: idx,
    //     fid: stop.getId(),
    //     position: new google.maps.LatLng(stop.getLat(), stop.getLng()),
    //     title: stop.getTitle(),
    //     routesIds: stop.getRoutesIds(),
    //   });
    // this._markers.push(marker);
    this._stops.push(stop);

    //console.log(marker);
    // google.maps.event.addListener(marker, "click",
    //   $.proxy(this.genStopContent, this, marker)
    // );
  }
  markers.on('click', $.proxy(this._onMarkerClick, this));

  this._map.addLayer(markers);
  this._map.fitBounds(new L.LatLngBounds([[this.minLat, this.minLng],
    [this.maxLat, this.maxLng]]));

  this.mapLayers.push(RFPWMapLayerFactory.prototype.createMLAllStops(this._map,
    markers));
  this._chgStateTripsMoreBtns(false);
  // var extent = ol.extent.createEmpty();
  // ol.extent.extend(extent, clusters.getSource().getExtent());
  // this._map.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), this._map.getSize());
  // this.bounds = new google.maps.LatLngBounds(
  //   {lat: this.minLat, lng: this.minLng},
  //   {lat: this.maxLat, lng: this.maxLng});
  // this._map.fitBounds(this.bounds);
}

RFPWMapHandler.prototype._errAddStops2Map = function(request,
    textStatus, errorThrown)
{
  console.log("error: " + errorThrown);
  console.log("error: " + textStatus);
  applicationContext.getLocalization().formatValue("errloadingallmapstops").then(
    errloadingallmapstops => applicationContext.showError(errloadingallmapstops)
  );
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
    //console.log("gen popup");
    //ev.layer.openPopup();
    var routes = "";
    var routesIds = marker.routesIds;
    for (var routesIdx in routesIds)
    {
      routes += RFPWMapHandler.prototype._genRouteIcon(
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

RFPWMapHandler.prototype._genRouteIcon = function(markerIdx, routesIdx,
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
      });//.addTo(this._map);
    // var path = new google.maps.Polyline({
    //       path: route.paths[idx],
    //       geodesic: true,
    //       strokeColor: route.color,
    //       strokeWeight: 2,
    //       strokeOpacity: 0,
    //       icons:
    //         [{
    //           icon: {
    //                   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //                   strokeColor: route.color,
    //                   fillColor: route.color,
    //                   fillOpacity:1,
    //                   strokeWeight: 4,
    //                   strokeOpacity: 1,
    //                 },
    //           repeat:'100px',
    //        },
    //        {
    //           icon: RFPWMapHandler.LN_SM,
    //           offset: '0',
    //           repeat: '50px'
    //         }]
    //     });
    //
    //     path.setMap(this._map);
    route.addDrawnPath(path);
  }
  // Group all the drawn paths together for easier management
  var drawnPathsGroup = L.layerGroup(route.getDrawnPaths());
  drawnPathsGroup.addTo(this._map);;
  route.setDrawnPathsGroup(drawnPathsGroup);
  this.mapLayers.push(RFPWMapLayerFactory.prototype.createMLRoutePaths(this._map,
    route));
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
  //   {lat: position.coords.latitude,
  //     lng: position.coords.longitude,
  //     acc: position.coords.accuracy
  //   }).then(
  //   geolocationsuccmsg =>  infoWindow.setContent(geolocationsuccmsg)
  // );
  //this._map.setCenter(pos);
  this._map.setView(new L.LatLng(position.coords.latitude,
    position.coords.longitude), RFPWMapHandler.MY_LOC_DEFAULT_ZOOM);

}

RFPWMapHandler.prototype.focusSelectedCity = function()
{
  this.onResize();
}

RFPWMapHandler.prototype.isMapLoaded = function()
{return this.mapLoaded;}

RFPWMapHandler.prototype.getStops = function()
{return this._stops;}
