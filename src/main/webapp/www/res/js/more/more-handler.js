RFPWMoreHandler.IS_MAP_LOADED_MAX_CNT = 10;
RFPWMoreHandler.COMMON_ROOT_ID = ""

function RFPWMoreHandler()
{

  this._userAuth = new RFPWUserAuth();
  this._feedbackHandler = new RFPWFeedbackHandler();
  this._contactHandler = new RFPWContactHandler();


  $("#btn-more-about").on("click tap", $.proxy(this.showAboutDlg, this));
  $("#dlg-more-about-content-v").attr("data-l10n-args",
    '{"v": "' + applicationContext.conf.appVer +
      '", "b": "' + applicationContext.conf.appBuild +  '"}');
  $("#btn-more-new").on("click tap", $.proxy(this.showWhatsNewDlg, this));
  this.isMapLoadedIntv = -1;
  this.isMapLoadedIntvCnt = 0;
  this.localization = new RFPWLocalization("sel-more-lang");

  this._dateTimeHandler = new RFPWDateTimeHandler();

  $("#btn-more-reset").on("click", $.proxy(this._onReset, this));

  this._loadedRegions = false;
  this._errRetrieveRegionsMsg = null;

  // $(window).on("resize",
  //   $.proxy(this._onResizeWait, this));
}

RFPWMoreHandler.prototype.initAfterAuth = function()
{
  this._contactHandler.init();
  this.reqRetrieveRegions();
  this.onResize();
}

RFPWMoreHandler.prototype.reqRetrieveRegions = function()
{
  applicationContext.asyncReq($.proxy(this._sucRetrieveRegions, this),
    $.proxy(this._errRetrieveRegions, this),
    "regions",
    []
  );
}

RFPWMoreHandler.prototype._sucRetrieveRegions = function(data)
{
  this.countriesCities = [];
  for (var idxC=0; idxC<data.length; ++idxC)
  {
    this.countriesCities.push(new RFPWCountry(data[idxC]));
  }
  this.currentCountryIdx = applicationContext.storage.getCountryIdx();//this.countriesCities[0];
  this.currentCityIdx = applicationContext.storage.getCityIdx();//this.countriesCities[0]["cities"][0];
  //this.setRegionDOM();
  this.genCountriesCitiesSec();
  this._loadedRegions = true;

}

RFPWMoreHandler.prototype._errRetrieveRegions = function(request,
    textStatus, errorThrown)
{
  this._errRetrieveRegionsMsg = "Unable to load regions. Error: " +
    request.responseText;
}

RFPWMoreHandler.prototype.handlePopupResult = function(answerData, action)
{
  this._userAuth.handlePopupResult(answerData, action);
}

RFPWMoreHandler.prototype.getDateTimeHandler = function() {return this._dateTimeHandler;}

//RFPWMoreHandler.prototype.changeLocation = function()
//{
//  this.isMapLoadedIntv = setInterval($.proxy(this.changeLocationImpl,
//    this), 1000);
//}
//
//RFPWMoreHandler.prototype.changeLocationImpl = function()
//{
//  this.isMapLoadedIntvCnt++;
//  if (this.isMapLoadedIntvCnt > RFPWMoreHandler.IS_MAP_LOADED_MAX_CNT)
//  {
//    this.isMapLoadedIntvCnt = 0;
//    clearInterval(this.isMapLoadedIntv);
//    console.log("Change location: Unable to load the map completely, cannot continue");
//  }
//  if (applicationContext.mapHandler.isMapLoaded())
//  {
//    //this.currentCityId = this.currentCountry["cities"][idx];
//    applicationContext.mapHandler.clearLocation();
//    applicationContext.routesHandler.rmAlRoutes();
//    applicationContext.mapHandler.addStops2Map();
//    applicationContext.routesHandler.reqAllRoutes();
//    this.isMapLoadedIntvCnt = 0;
//    clearInterval(this.isMapLoadedIntv);
//  }
//}

RFPWMoreHandler.prototype.toggleUI = function(disabled)
{
  $("#div-more-wrapper").children("button, a").prop("disabled", disabled);
  $("#div-more-region").prop("disabled", disabled);
}

RFPWMoreHandler.prototype.changeRegion = function()
{
  // In the case of favs we have to check if the user is authenticated; if (s)he's not
  // then we consider the favorites loaded
  var isFavsLoaded = this._userAuth.isUserAuth() ? applicationContext.favsHandler.isFavsLoaded() : true;
  console.log("favs loaded: " + isFavsLoaded);
  console.log("mapHandler.isMapLoaded(): " + applicationContext.mapHandler.isMapLoaded());
  console.log("mapHandler.isStopsLoaded(): " + applicationContext.mapHandler.isStopsLoaded());
  console.log("applicationContext.routesHandler: " + applicationContext.routesHandler.isRoutesLoaded());
  if (applicationContext.mapHandler.isMapLoaded()
      && applicationContext.mapHandler.isStopsLoaded()
      && applicationContext.routesHandler.isRoutesLoaded()
      && isFavsLoaded)
  {
    this.toggleUI(true);
    applicationContext.mapHandler.changeRegion(
        $.proxy(this._afterChangeRegionMapHandlerSuc, this), 
        $.proxy(this._afterChangeRegionMapHandlerErr, this));
  } else
  {
    $.notify($("#notify-i-more-change-region-not-avail").text(), 
        {
          className: "info",
          globalPosition: 'top left'
        }
      );
  }
}

RFPWMoreHandler.prototype._afterChangeRegionMapHandlerSuc = function() {
  console.log("_afterChangeRegionMapHandlerSuc");
  applicationContext.routesHandler.changeRegion($.proxy(this._afterChangeRegionRoutesHandlerSuc, this), null);
}

RFPWMoreHandler.prototype._afterChangeRegionMapHandlerErr = function() {
  console.error("Unable to change region on map");
}


RFPWMoreHandler.prototype._afterChangeRegionRoutesHandlerSuc = function() {
  console.log("_afterChangeRegionRoutesHandlerSuc");
  applicationContext.favsHandler.changeRegion($.proxy(this._changeRegionComplete, this), null);
}

RFPWMoreHandler.prototype._changeRegionComplete = function() {
  console.log("_changeRegionComplete");
  this.toggleUI(false);
  applicationContext.switchTab(RFPWApplicationContext.TAB_TRIPS);
}

RFPWMoreHandler.prototype.onCitySel = function(countryIdx, cityIdx)
{
  console.log(countryIdx + " " + cityIdx);
  this.toggleUI(true);
  if (countryIdx !== this.currentCountryIdx || this.currentCityIdx !== cityIdx)
  {
    //   Change the selection in the HTML representation
    if (countryIdx !== this.currentCountryIdx)
    {
      $("#collapse-more-country-row-" + countryIdx).addClass("in");
      $("#collapse-more-country-row-" + this.currentCountryIdx).removeClass("in");
    }
    $("#btn-more-city-row-"+ countryIdx + "-" + cityIdx).addClass("active");
    $("#btn-more-city-row-"+ this.currentCountryIdx + "-" +
      this.currentCityIdx).removeClass("active");
    this.currentCountryIdx = countryIdx;
    this.currentCityIdx = cityIdx;

    //   Save the current selection in storage
    applicationContext.storage.setCountryIdx(countryIdx);
    applicationContext.storage.setCityIdx(cityIdx);
    this.changeRegion();
  }
}

RFPWMoreHandler.prototype.genCities = function(countryPos)
{
  var cities = this.countriesCities[countryPos].cities;
  var result = "";
  for (var cityIdx=0; cityIdx<cities.length; ++cityIdx)
  {
    var actv = (this.currentCityIdx == cityIdx && this.currentCountryIdx === countryPos) ?
      "active" : "";
    result += '<button id="btn-more-city-row-'+ countryPos + "-" + cityIdx +
      '" class="list-group-item ' + actv + '">' + cities[cityIdx].getName() + '</button>';

    //   Add click/tap listener for cities
    $("#div-more-region-lst").on("click tap",
                  '#btn-more-city-row-'+ countryPos + "-" + cityIdx,
                  $.proxy(this.onCitySel, this, countryPos, cityIdx));
  }
  return result;
}

RFPWMoreHandler.prototype.genCountryRow = function(countryPos)
{
  var country = this.countriesCities[countryPos];
  var collapse = this.currentCountryIdx === countryPos ? "in" : "";
  return '<div id="div-more-country-row-'+ countryPos +
            '" class="panel panel-default list-group-item">'+
      '<div data-toggle="collapse" data-target="#collapse-more-country-row-' +
        countryPos + '" class="panel-heading">'+
        country.getName() +
      '</div>'+
      '<div id="collapse-more-country-row-' + countryPos +
        '" class="panel-collapse collapse ' + collapse + '">'+
        '<div class="panel-body list-group">'+
          this.genCities(countryPos) +
        '</div>'+
      '</div>' +
    '</div>';
}

RFPWMoreHandler.prototype.genCountriesCitiesSec = function()
{
  var result = "";
  for (var pos=0; pos<this.countriesCities.length; ++pos)
  {
    result += this.genCountryRow(pos);
  }
  $("#div-more-region-lst").empty();
  $("#div-more-region-lst").append(result);
}

RFPWMapHandler.prototype._onResizeWait = function()
{
  applicationContext.waitForFinalEvent(
    $.proxy(this._onResize, this), 500, "Resize from Maphandler");
}

RFPWMapHandler.prototype._onResize = function()
{
  var size = applicationContext.getTabContainerSize();
  $("#div-more-wrapper").css('width', size.width);
  $("#div-more-wrapper").css('height', size.height);
}



RFPWMoreHandler.prototype.getCurrentCountryNm = function()
{
  return this.countriesCities[this.currentCountryIdx]["name"];
}

RFPWMoreHandler.prototype.getCurrentCountryCode = function()
{
  return this.countriesCities[this.currentCountryIdx]["code"];
}

RFPWMoreHandler.prototype.getCurrentCity = function() {return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx];}

RFPWMoreHandler.prototype.getCurrentCityNm = function()
{
  return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx]["name"];
}

RFPWMoreHandler.prototype.getCurrentCityCode = function()
{
  return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx]["code"];
}

RFPWMoreHandler.prototype.getCurrentCityLat = function()
{
  return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx]["lat"];
}

RFPWMoreHandler.prototype.getCurrentCityLng = function()
{
  return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx]["lng"];
}

RFPWMoreHandler.prototype.showAboutDlg = function()
{
  $("#dlg-more-about").modal();
}

RFPWMoreHandler.prototype.showWhatsNewDlg = function()
{
  $("#dlg-more-new").modal();
}

RFPWMoreHandler.prototype._onReset = function()
{
  applicationContext.storage.reset();
  location.reload(true);
}

RFPWMoreHandler.prototype.onResize = function()
{
  $("#div-more-wrapper").css('height', $(window).height() - applicationContext.getMainTabSelectorHeight());
  console.log("height more: " + $("#btn-more-about").outerHeight())
  $("#div-more-region-lst").css('height', 
      $(window).height() - applicationContext.getMainTabSelectorHeight() - 3 * $("#btn-more-about").outerHeight());
}


RFPWMoreHandler.prototype.isLoadedRegions = function()
{return this._loadedRegions;}

RFPWMoreHandler.prototype.getErrRetrieveRegionsMsg = function()
{return this._errRetrieveRegionsMsg;}

RFPWMoreHandler.prototype.getUserAuth = function()
{return this._userAuth;}

RFPWMoreHandler.prototype.getFeedbackHandler = function()
{return this._feedbackHandler;}

RFPWMoreHandler.prototype.getCurrentCityId = function()
{return this.countriesCities[this.currentCountryIdx].cities[this.currentCityIdx].getId();}

RFPWMoreHandler.prototype.getCurrentCountryId = function()
{return this.countriesCities[this.currentCountryIdx].id;}
