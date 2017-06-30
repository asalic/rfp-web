RFPWMoreHandler.IS_MAP_LOADED_MAX_CNT = 10;
RFPWMoreHandler.COMMON_ROOT_ID = ""

function RFPWMoreHandler()
{

  this._userAuth = new RFPWUserAuth();


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

RFPWMoreHandler.prototype.changeLocation = function()
{
  this.isMapLoadedIntv = setInterval($.proxy(this.changeLocationImpl,
    this), 1000);
}

RFPWMoreHandler.prototype.changeLocationImpl = function()
{
  this.isMapLoadedIntvCnt++;
  if (this.isMapLoadedIntvCnt > RFPWMoreHandler.IS_MAP_LOADED_MAX_CNT)
  {
    this.isMapLoadedIntvCnt = 0;
    clearInterval(this.isMapLoadedIntv);
    console.log("Change location: Unable to load the map completely, cannot continue");
  }
  if (applicationContext.mapHandler.isMapLoaded())
  {
    //this.currentCityId = this.currentCountry["cities"][idx];
    applicationContext.mapHandler.clearLocation();
    applicationContext.routesHandler.rmAlRoutes();
    applicationContext.mapHandler.addStops2Map();
    applicationContext.routesHandler.reqAllRoutes();
    this.isMapLoadedIntvCnt = 0;
    clearInterval(this.isMapLoadedIntv);
  }
}

RFPWMoreHandler.prototype.onCitySel = function(countryIdx, cityIdx)
{
  console.log(countryIdx + " " + cityIdx);
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
    this.changeLocation();
    applicationContext.switchTab(RFPWApplicationContext.TAB_TRIPS);
  }
}

RFPWMoreHandler.prototype.genCities = function(countryPos)
{
  var cities = this.countriesCities[countryPos]._cities;
  var result = "";
  for (var cityIdx=0; cityIdx<cities.length; ++cityIdx)
  {
    var actv = (this.currentCityIdx == cityIdx && this.currentCountryIdx === countryPos) ?
      "active" : "";
    result += '<button id="btn-more-city-row-'+ countryPos + "-" + cityIdx +
      '" class="list-group-item ' + actv + '">' + cities[cityIdx]._name + '</button>';

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
        country._name +
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
  return this.countriesCities[this.currentCountryIdx]["_name"];
}

RFPWMoreHandler.prototype.getCurrentCountryCode = function()
{
  return this.countriesCities[this.currentCountryIdx]["_code"];
}

RFPWMoreHandler.prototype.getCurrentCityNm = function()
{
  return this.countriesCities[this.currentCountryIdx]._cities[this.currentCityIdx]["_name"];
}

RFPWMoreHandler.prototype.getCurrentCityCode = function()
{
  return this.countriesCities[this.currentCountryIdx]._cities[this.currentCityIdx]["_code"];
}

RFPWMoreHandler.prototype.getCurrentCityLat = function()
{
  return this.countriesCities[this.currentCountryIdx]._cities[this.currentCityIdx]["_lat"];
}

RFPWMoreHandler.prototype.getCurrentCityLng = function()
{
  return this.countriesCities[this.currentCountryIdx]._cities[this.currentCityIdx]["_lng"];
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

RFPWMoreHandler.prototype.isLoadedRegions = function()
{return this._loadedRegions;}

RFPWMoreHandler.prototype.getErrRetrieveRegionsMsg = function()
{return this._errRetrieveRegionsMsg;}

RFPWMoreHandler.prototype.getUserAuth = function()
{return this._userAuth;}

RFPWMoreHandler.prototype.getCurrentCityId = function()
{return this.countriesCities[this.currentCountryIdx]._cities[this.currentCityIdx]["_id"];}

RFPWMoreHandler.prototype.getCurrentCountryId = function()
{return this.countriesCities[this.currentCountryIdx]._id;}
