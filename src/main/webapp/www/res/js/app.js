var applicationContext = null;

// Wait until HTML-Document is loaded and DOM is ready
$(document).ready(function()
{
  if (location.hash !== '') $('a[href="' + location.hash + '"]').tab('show');

  // remember the hash in the URL without jumping
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
     if(history.pushState) {
          history.pushState(null, null, '#'+$(e.target).attr('href').substr(1));
     } else {
          location.hash = '#' + $(e.target).attr('href').substr(1);
     }
  });
  RFPWMapHandler.prototype.setHeightMap();
  
});

// Wait until everything has been loaded
$(window).on('load', function() {
  //$.i18n().load( 'i18n/' + $.i18n().locale + '.json', $.i18n().locale );
  console.log("All resources and pages have been loaded");
  
  // Extend classes
  // TODO: check if they work well without this code
//  RFPWUtils.extend(RFPWFav, RFPWFavRoute);
//  RFPWUtils.extend(RFPWFav, RFPWFavTrip);
  
  //var linesObj = new Lines($("#lines-main-lst"));
  //  You have to first create the object and then to init it
  applicationContext = new RFPWApplicationContext();
  applicationContext.init();
  window.onmessage = function (e)
  {
    if (e.origin.indexOf(applicationContext.conf.authBaseAddr) !== -1)
    {
      console.log("return data");
      applicationContext.moreHandler.handlePopupResult(e.data, -1);
    }
    //console.log(e);
  };
});



RFPWApplicationContext.TAB_TRIPS = 1;
RFPWApplicationContext.MARKERCLUSTERER_IMG_REL_PATH = "vendors/markerclusterer/images/m";

function RFPWApplicationContext()
{
  // interval object to check if the regions have been loaded
  this._initHandlersWaitIntv = null;
  // Counter for checking how many times the moreHandler has been checked to
  // determine if the regions have been loaded
  this._initHandlersWaitIntvCnt = 0;
  $("#btn-accept-storage-usr").on("click tap", $.proxy(this._acceptStorageUsr,
    this));
}

RFPWApplicationContext.prototype.init = function()
{

  this._localization =  document.l10n;//.get('main');
  this.conf = new RFPWAppConf();
  this.storage = new RFPWStorage();
  this.mapHandler = new RFPWMapHandler($("#map-canvas").attr("id"));
  this.routesHandler = new RFPWRoutesHandler($("#routes-main-lst"));
  this.favsHandler = new RFPWFavsHandler();
  this.moreHandler = new RFPWMoreHandler();
  $(window).on("resize",
      $.proxy(this.onResizeWait, this));
  this._tokenAuthenticate();
  if (!this.storage.isAcceptStorageUsr())
  {// Show the information box
    $("#div-accept-storage-usr").removeClass("spa-rfpw-diplay-none");
  }
}

RFPWApplicationContext.prototype.onResizeWait = function()
{
  //console.log("Resize from Maphandler");
  this.waitForFinalEvent(
    $.proxy(this.mapHandler.onResize, this.mapHandler), 500, "Resize RFPWMapHandler");
  this.waitForFinalEvent(
      $.proxy(this.routesHandler.onResize, this.routesHandler), 500, "Resize RFPWRoutesHandler");
  this.waitForFinalEvent(
      $.proxy(this.moreHandler.onResize, this.moreHandler), 500, "Resize RFPWMoreHandler"); 
}

RFPWApplicationContext.prototype._tokenAuthenticate = function()
{
  this.moreHandler.getUserAuth().tokenAuthenticate($.proxy(this._tokenAuthenticateSucc, this), 
      $.proxy(this._tokenAuthenticateErr, this));
}

RFPWApplicationContext.prototype._tokenAuthenticateSucc = function(data)
{
  console.log("Token authenticated, get user data");
  console.log(data);
  this.moreHandler.getUserAuth().sucTokenAuthenticate(data,
        $.proxy(this._sucGetUserInfo, this),
        $.proxy(this._errGetUserInfo, this)
      );
}

RFPWApplicationContext.prototype._tokenAuthenticateErr = function(data)
{
  this._errAuth(data);
}

RFPWApplicationContext.prototype._sucGetUserInfo = function(data)
{
  console.log("user data retrieved, init handlers");
  console.log(data);
  this.moreHandler.getUserAuth().sucUserInfo(data);
  this.moreHandler.getFeedbackHandler().enableFeedback();
  this._initHandlers();
}

RFPWApplicationContext.prototype._errGetUserInfo = function(data)
{
  this._errAuth(data);
}

RFPWApplicationContext.prototype._errAuth = function(data)
{
  console.log("User not authenticated, init handlers");
  this.moreHandler.getUserAuth().errTokenAuthenticate(data);
  this._initHandlers();
}

RFPWApplicationContext.prototype._initHandlers = function()
{
  //this.moreHandler.reqRetrieveRegions();
  this.moreHandler.initAfterAuth();
  this._initHandlersWaitIntv = setInterval($.proxy(this._initHandlersImpl,
    this), 1000);
}

RFPWApplicationContext.prototype._initHandlersImpl = function()
{
  this._initHandlersWaitIntvCnt++;
  if (this._initHandlersWaitIntvCnt > RFPWApplicationContext.INIT_HANDLERS_WAIT_MAX_CNT)
  {
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    console.log("Unable to load regions! Cannot continue.");
  }
  if (this.moreHandler.isLoadedRegions())
  {
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    this.mapHandler.init();
    this.mapHandler.addStops2Map(null, null);
    //this.mapHandler.reqSentimentAnalysis(null, null);
    //this.mapHandler.reqTrafficJam(null, null);
    this.routesHandler.reqAllRoutes(null, null);
    this._initHandlersWaitIntv = setInterval($.proxy(this._afterMapRoutesHandlersLoaded,
        this), 500);
  }
}  

RFPWApplicationContext.prototype._afterMapRoutesHandlersLoaded = function()
{
  this._initHandlersWaitIntvCnt++;
  if (this._initHandlersWaitIntvCnt > RFPWApplicationContext.INIT_HANDLERS_WAIT_MAX_CNT)
  {
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    console.error("Unable to initialize the trips and routes tabs. Try again later or contact us.");
    $.notify($("#notify-e-app-unable-init-maps-routes").text(), 
        {
          className: "error",
          globalPosition: 'top left'
        }
      );
  }
  if (this.mapHandler.isMapLoaded() 
      && this.mapHandler.isStopsLoaded()
      && this.routesHandler.isRoutesLoaded())
  {
    console.log("maps/Routes init success");
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    this.favsHandler.init();
    this._initHandlersWaitIntv = this._initHandlersWaitIntv = setInterval($.proxy(this._afterFavsHandlerLoaded,
        this), 500);
  }
}

RFPWApplicationContext.prototype._afterFavsHandlerLoaded = function()
{
  this._initHandlersWaitIntvCnt++;
  if (this._initHandlersWaitIntvCnt > RFPWApplicationContext.INIT_HANDLERS_WAIT_MAX_CNT)
  {
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    console.error("Unable to initialize the favs tab. Try again later or contact us.");
    $.notify($("#notify-e-app-unable-init-favs").text(), 
        {
          className: "error",
          globalPosition: 'top left'
        }
      );
    
  }
  if (this.mapHandler.isMapLoaded() 
      && this.mapHandler.isStopsLoaded())
  {
    console.log("Favs init success");
    this._initHandlersWaitIntvCnt = 0;
    clearInterval(this._initHandlersWaitIntv);
    //this.moreHandler.changeRegion();
  }
}


RFPWApplicationContext.prototype.isRoutesLoaded = function()
{
  return this.routesHandler.hasRoutes();
}

RFPWApplicationContext.prototype.getContrastYIQ = function(hexcolor){
    var r = parseInt(hexcolor.substr(1,3),16);
    var g = parseInt(hexcolor.substr(3,3),16);
    var b = parseInt(hexcolor.substr(5,3),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 2000) ? 'black' : 'white';
}

RFPWApplicationContext.prototype.switchTab = function(tabId)
{
  if (tabId === RFPWApplicationContext.TAB_TRIPS)
  {
      $('#navbar a[href="#div-trips"]').tab('show');
      console.log(tabId);
  }
}

RFPWApplicationContext.prototype.showError = function(errStr)
{
  $("#dlg-error-content").text(errStr);
  $("#dlg-error").modal();
}

RFPWApplicationContext.prototype.strA2H = function(string)
{
  return RFPWUtils.strA2H(string);
  // var result = "";
  // for (var idx=0; idx<string.length; ++idx)
  // {
  //   result += Number(string.charCodeAt(idx)).toString(16);
  // }
  // return result;//this.fixedEncodeURIComponent(string);
}

RFPWApplicationContext.prototype.waitForFinalEvent = (function ()
{
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

RFPWApplicationContext.prototype.strH2A = function(string)
{
  var hex = string.toString();//force conversion
  var result = "";
  for (var i = 0; i < hex.length; i += 2)
     result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

  return result;//decodeURIComponent(string);
}

RFPWApplicationContext.prototype.fixedEncodeURIComponent = function(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

RFPWApplicationContext.prototype.asyncReq = function(callbSucces, callbErr,
  serviceName, params)
{
  var paramsS = "";
  for (var idx=0; idx<params.length; ++idx)
    paramsS += '/' + this.strA2H(params[idx]);
  $.ajax({
    url: this.conf.webserviceRoot + '/' + serviceName +
      // this.moreHandler.getCurrentCountryCode() + '/' +
      // this.moreHandler.getCurrentCityCode() +
      paramsS,
    data: "",
    type: "get",
    success: callbSucces,
    error: callbErr
  });
}

RFPWApplicationContext.prototype.getMainTabHeight = function()
{
  return {width: $(window).width(), height: $(window).height() - $("#navbar").height()};
}

RFPWApplicationContext.prototype.getMainTabSelectorHeight = function()
{return $("#navbar").height();}

RFPWApplicationContext.prototype.showLoading = function(uniqueId, jqParent)
{
  var loadingPnl =
    "<div id=\"" + uniqueId + "-loader-window\"class=\"spa-rfpw-loader-window\">\
      <div class=\"spa-rfpw-loader-spin\">\
      </div>\
      <br>\
      <div class=\"spa-rfpw-loader-msg\" data-l10n-id=\"div-loader-msg\">\
      </div>\
    </div>";
  jqParent.append(loadingPnl);
}

RFPWApplicationContext.prototype.showLoadingPnl = function(parentId)
{
  var loadingPnl = "<div id=\"" + parentId + "-loader-window\"class=\"spa-rfpw-loader-window\">" +
    "<div class=\"spa-rfpw-loader-spin\"></div>" +
    "<br>" +
    "<div class=\"spa-rfpw-loader-msg\" data-l10n-id=\"div-loader-msg\"></div>" +
  "</div>";
  $("#" + parentId).append(loadingPnl);
}

RFPWApplicationContext.prototype.hideLoadingPnl = function(parentId)
{
  $("#" + parentId + "-loader-window").remove();
}

RFPWApplicationContext.prototype.getLocalization = function() {return this._localization;}

RFPWApplicationContext.prototype._acceptStorageUsr = function()
{
  console.log("User accepted storage conditions");
  this.storage.setAcceptStorageUsr(true);
}

RFPWApplicationContext.prototype.reloadApp = function() {location.reload();}

/**
 * How many times should we check if the regions have been loaded
 * @type {Number}
 */
RFPWApplicationContext.INIT_HANDLERS_WAIT_MAX_CNT = 100;
