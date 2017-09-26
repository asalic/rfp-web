function RFPWFavsHandler()
{
  this._favsLoaded = false;
  this._favsRoutes = Object.create(null);
  this._favsRouteIds = [];
  this._numFavsRoutes = 0;
  this._favsBRTrips = Object.create(null);
  this._favsBRTripIds = [];
  this._numFavsBRTrips = 0;
  this._waitForRoutesInit = null;
  this._waitForTripsInit = null;
}

RFPWFavsHandler.prototype.init = function()
{
  this.onUserSignIn(applicationContext.moreHandler.getUserAuth());
}

RFPWFavsHandler.prototype.onUserSignIn = function(userAuth)
{
  $("#div-favs-routes-lst").empty();
  $("#div-favs-trips-lst").empty();
  $("#spn-favs-err-req-msg").addClass("spa-rfpw-diplay-none");
  if (userAuth.isUserAuth())
  {
    $("#spn-favs-login-msg").addClass("spa-rfpw-diplay-none");
    $("#div-favs-all").removeClass("spa-rfpw-diplay-none");
    this._reqFavs(null, null);
    //console.log(applicationContext.moreHandler.getUserAuth().getUserToken());
  } else {
    $("#spn-favs-login-msg").removeClass("spa-rfpw-diplay-none");
    $("#div-favs-all").addClass("spa-rfpw-diplay-none");
    this._favsLoaded = true;
  }
}

RFPWFavsHandler.prototype._reqFavs = function(callBSuc, callBErr)
{
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
    city_id: applicationContext.moreHandler.getCurrentCityId(),
    country_id: applicationContext.moreHandler.getCurrentCountryId(),
    token: applicationContext.moreHandler.getUserAuth().getUserToken()};

  $.ajax({
    url: applicationContext.conf.authBaseAddr + applicationContext.conf.authReadFavorites,
    data: data,
    type: "post",
    success: $.proxy(this._sucFavs, this, callBSuc),
    error: $.proxy(this._errFavs, this, callBErr)
  });
}

RFPWFavsHandler.prototype._sucFavs = function(callBSuc, dataJson)
{
  $("#spn-favs-err-req-msg").addClass("spa-rfpw-diplay-none");
  if (dataJson.hasOwnProperty("success"))
  {
    var favsAllUsers = dataJson["data"];
    var favs = [];
    for (var idx=0; idx<favsAllUsers.length; ++idx)
    {
      if (favsAllUsers[idx]["username"] === applicationContext.moreHandler.getUserAuth().getUser().getUserName())
        favs = favsAllUsers[idx]["favorites"];
    }
//    console.log("Cityid: " + applicationContext.moreHandler.getCurrentCityId());
//    console.log("Countryid: " + applicationContext.moreHandler.getCurrentCountryId());
    
    //if (favs[])
    for (var idxF=0; idxF<favs.length; ++idxF)
    {
      var favServ = JSON.parse(favs[idxF]["data"]);
      if (favServ["cityId"] === applicationContext.moreHandler.getCurrentCityId()
          && favServ["countryId"] === applicationContext.moreHandler.getCurrentCountryId())
      {
        var fav = null;
        if (favServ["type"] == RFPWFav.TYPEROUTE)
        {
          //console.log(favServ);
          fav = new RFPWFavRoute(favServ);
        } else if (favServ["type"] == RFPWFav.TYPETRIP)
        {
          //console.log(favServ);
          var tmpTrip = new RFPWTripRec(favServ.trip);
          favServ.trip = tmpTrip;
          fav = new RFPWFavTrip(favServ);      
        } else
        {
          console.warn("Unable to determine fav type " + favs[idxF]["type"] + " for object\n " + JSON.stringify(favs[idxF]));
        }
        if (fav != null)
          this._addFavHTML(fav);
      }
    }
  } else
    console.log("no favorites for user in this city region");

  this._favsLoaded = true;
  this._waitForRoutesInit = setInterval($.proxy(this._favsRoutesSet,
      this), 500);
  this._waitForTripsInit = setInterval($.proxy(this._enableOpsFavsBRTrips,
      this), 500);
  if (callBSuc != null)
    callBSuc();
}

RFPWFavsHandler.prototype._favsRoutesSet = function()
{
  var done = applicationContext.routesHandler.favRoutesSet(this._favsRouteIds);
  if (done)
  {
    clearInterval(this._waitForRoutesInit);
    this._waitForRoutesInit = null;
    
    // Now enable the remove button for each fav
    var keys = Object.keys(this._favsRoutes);
    for (var idx=0; idx<keys.length; ++idx)      
      $("#" + this._favsRoutes[keys[idx]].getHTMLRmBtnId()).prop("disabled", false);
    
  }
}

RFPWFavsHandler.prototype._enableOpsFavsBRTrips = function()
{
  var done = applicationContext.mapHandler.isMapLoaded();
  if (done)
  {
    clearInterval(this._waitForTripsInit);
    this._waitForTripsInit = null;
    var keys = Object.keys(this._favsBRTrips);
    for (var idx=0; idx<keys.length; ++idx)   
    {
      //console.log(this._favsBRTrips[keys[idx]].getHTMLRmBtnId());
      $("#" + this._favsBRTrips[keys[idx]].getHTMLRmBtnId()).prop("disabled", false);
    }
  }
}

RFPWFavsHandler.prototype._errFavs = function(callBErr, request,
    textStatus, errorThrown)
{
  this._errFavsImpl(request.responseText);

  this._favsLoaded = true;
  if (callBErr != null)
    callBErr();
}

RFPWFavsHandler.prototype._errFavsImpl = function(errTxt)
{
  $("#spn-favs-err-req-msg").removeClass("spa-rfpw-diplay-none");
  $("#spn-favs-login-msg").addClass("spa-rfpw-diplay-none");
  $("#div-favs-all").addClass("spa-rfpw-diplay-none");
  console.error("RFPWFavsHandler::_errFavs - Unable to load favs. Error: " +
    errTxt);
}

RFPWFavsHandler.prototype.addFavTrip = function(tripObj, callbSuc, callbErr)
{
  //console.log(routeObj.getId());
  //console.log(RFPWUtils.toValidHTMLId(routeObj.getId()));
  var genId = RFPWFav.generateFavId(
      applicationContext.moreHandler.getCurrentCountryId(),
      applicationContext.moreHandler.getCurrentCityId(),
      RFPWFav.TYPEROUTE, tripObj.getId())
  // Create a new fav route object using the fields of the existing route object
  var tripObjTmp = JSON.parse(JSON.stringify(tripObj));
  var favObj = new RFPWFavTrip(null);
  favObj.setId(genId);
  favObj.setType(RFPWFav.TYPETRIP);
  favObj.setFavId(tripObj.getId());
  favObj.setCityId(applicationContext.moreHandler.getCurrentCityId());
  favObj.setCountryId(applicationContext.moreHandler.getCurrentCountryId());
  favObj.setTrip(tripObjTmp);
  //console.log("Route is: " + JSON.stringify(favObj));
  //this.addFavRoute(routeObj, callbSuc, callbErr);
  this._reqAddFav(favObj, callbSuc, callbErr);
}

RFPWFavsHandler.prototype.addRmFavRoute = function(routeObj, callbSuc, callbErr)
{
  var genId = RFPWFav.generateFavId(
      applicationContext.moreHandler.getCurrentCountryId(),
      applicationContext.moreHandler.getCurrentCityId(),
      RFPWFav.TYPEROUTE,
      RFPWUtils.toValidHTMLId(routeObj.getId()));
  
  if (Object.prototype.hasOwnProperty.call(this._favsRoutes, genId))
    this.rmFavRoute(genId, callbSuc, callbErr);
  else
  {
    //console.log(routeObj.getId());
    //console.log(RFPWUtils.toValidHTMLId(routeObj.getId()));
//    var genId = RFPWFav.generateFavId(
//        applicationContext.moreHandler.getCurrentCountryId(),
//        applicationContext.moreHandler.getCurrentCityId(),
//        RFPWFav.TYPEROUTE,
//        RFPWUtils.toValidHTMLId(routeObj.getId()))
    // Create a new fav route object using the fields of the existing route object
    var favObj = new RFPWFavRoute(routeObj);
    favObj.setId(genId);
    favObj.setType(RFPWFav.TYPEROUTE);
    favObj.setFavId(RFPWUtils.strA2H(routeObj.getId()));
    favObj.setCityId(applicationContext.moreHandler.getCurrentCityId());
    favObj.setCountryId(applicationContext.moreHandler.getCurrentCountryId());
    //console.log("Route is: " + JSON.stringify(favObj));
    //this.addFavRoute(routeObj, callbSuc, callbErr);
    this._reqAddFav(favObj, callbSuc, callbErr);
  }
}

RFPWFavsHandler.prototype.rmFavRoute = function(genId, callbSuc, callbErr)
{
  this._reqRmFav(this._favsRoutes[genId], callbSuc, callbErr);
  
}

//RFPWFavsHandler.prototype.addFav = function(favType, favObj, callbSuc, callbErr)
//{
//  this._reqAddFav(favObj, callbSuc, callbErr);
//}

RFPWFavsHandler.prototype._reqAddFav = function(favObj, callbSuc, callbErr)
{
  //console.log(JSON.stringify(favObj));
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
      item_id: favObj.getId(),
      item_type: favObj.getType(),
      city_id: applicationContext.moreHandler.getCurrentCityId(),
      country_id: applicationContext.moreHandler.getCurrentCountryId(),
      favorite_id: favObj.getFavId(),
      data: JSON.stringify(favObj),
      token: applicationContext.moreHandler.getUserAuth().getUserToken()};
  $.ajax({
    url: applicationContext.conf.authBaseAddr + applicationContext.conf.authCreateFavorite,
    data: data,
    type: "post",
    success: $.proxy(this._sucAddFavs, this, favObj, callbSuc, callbErr),
    error: $.proxy(this._errAddFavs, this, callbErr)
  });
}

RFPWFavsHandler.prototype._sucAddFavs = function(favObj, callbSuc, callbErr, dataJson)
{
  if (Object.prototype.hasOwnProperty.call(dataJson, "success"))
  {
    this._addFavHTML(favObj);
    if (callbSuc != null)
      callbSuc(true);
  } else
  {
    if (callbErr != null)
      callbErr();
  }
}

RFPWFavsHandler.prototype._addFavHTML = function(favObj)
{
  //console.log("RFPWFav.TYPE_ROUTE " + RFPWFav.TYPEROUTE);
  var favsLstJQ = null;
  if (favObj.getType() == RFPWFav.TYPEROUTE)
  {
    $("#spn-favs-routes-empty-msg").addClass("spa-rfpw-diplay-none");
    $("#div-favs-routes-lst").append(favObj.getHTMLRepresentation());
    this._favsRoutes[favObj.getId()] = favObj;
    this._numFavsRoutes += 1;
    this._favsRouteIds.push(favObj.getFavId());
    // Enable the rm btn if more handler is loaded
    // We need this for the two cases: when the route is added by the user and when the route is added at the startup
    if (applicationContext.routesHandler.hasRoutes())
      $("#" + favObj.getHTMLRmBtnId()).prop("disabled", false);
    //this.addFavRoute();
  } else if (favObj.getType() == RFPWFav.TYPETRIP)
  {
    $("#spn-favs-trips-empty-msg").addClass("spa-rfpw-diplay-none");
    this._favsBRTrips[favObj.getId()] = favObj;
    this._numFavsBRTrips += 1;
    $("#div-favs-trips-lst").append(favObj.getHTMLRepresentation());
    this._favsBRTripIds.push(favObj.getFavId());
    // Enable the rm btn if trips tab is loaded
    // We need this for the case when 
    if (applicationContext.mapHandler.isMapLoaded())
      $("#" + favObj.getHTMLRmBtnId()).prop("disabled", false);
  } else
  {
    console.warn("Unknown fav type " + favObj.getType() + " for fav object\n " + JSON.stringify(favObj));
    return;
  }

  $("#" + favObj.getHTMLRmBtnId()).on("click", $.proxy(this._reqRmFav, this, favObj, null, null))
}

RFPWFavsHandler.prototype._rmFavHTML = function(favObj)
{
//console.log("RFPWFav.TYPE_ROUTE " + RFPWFav.TYPEROUTE);
  var favsLstJQ = null;
  if (favObj.getType() == RFPWFav.TYPEROUTE)
  {
    favsLstJQ = $("#div-favs-routes-lst");
    //favsLstJQ.empty();
    //this._favsRoutes[favObj.getId()] = favObj;
    delete this._favsRoutes[favObj.getId()];
    this._numFavsRoutes -= 1;
    if (this._numFavsRoutes == 0)
      $("#spn-favs-routes-empty-msg").removeClass("spa-rfpw-diplay-none");
    this._favsRouteIds.splice(this._favsRouteIds.indexOf(favObj.getFavId()), 1);
    // Call the update method for moreHandler
    // Note that moreHandler should be now inited, because we waited for it before enabling the rm btn
    applicationContext.routesHandler.favRouteRm(favObj.getFavId());
    //this.addFavRoute();
  } else if (favObj.getType() == RFPWFav.TYPETRIP)
  {
    favsLstJQ = $("#div-favs-trips-lst");
    
    delete this._favsBRTrips[favObj.getId()];
    this._numFavsBRTrips -= 1;
    if (this._numFavsBRTrips == 0)
      $("#spn-favs-trips-empty-msg").removeClass("spa-rfpw-diplay-none");
    this._favsBRTripIds.splice(this._favsBRTripIds.indexOf(favObj.getFavId()), 1);
  } else
  {
    console.warn("Unknown fav type " + favObj.getType() + " for fav object\n " + JSON.stringify(favObj));
    return;
  }
  favsLstJQ.children("#" + favObj.getHTMLLstItmId()).remove();
}

RFPWFavsHandler.prototype._errAddFavs = function(callbErr, request,
    textStatus, errorThrown)
{
  //console.log(dataJson);
  // TODO: add notify
  $.notify($("#notify-e-favs-add-fav-err").text(), 
      {
        className: "error",
        globalPosition: 'top left'
      }
    );
  console.error("Unable to add favorite: " + request.responseText);
  if (callbErr != null)
    callbErr();
}

RFPWFavsHandler.prototype._reqRmFav = function(favObj, callbSuc, callbErr)
{
  //console.log("Rm fav");
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
      item_id: favObj.getId(),
      token: applicationContext.moreHandler.getUserAuth().getUserToken()};
  $.ajax({
    url: applicationContext.conf.authBaseAddr + applicationContext.conf.authDeleteFavorite,
    data: data,
    type: "post",
    success: $.proxy(this._sucRmFav, this, favObj, callbSuc, callbErr),
    error: $.proxy(this._errRmFav, this, callbErr)
  });
}

RFPWFavsHandler.prototype._sucRmFav = function(favObj, callbSuc, callbErr, dataJson)
{
  //console.log(dataJson);
  if (Object.prototype.hasOwnProperty.call(dataJson, "success"))
  {
    // TODO: Add notification
    //console.log("succes rm fav");
    this._rmFavHTML(favObj);
    if (callbSuc != null)
      callbSuc(false);
  } else
  {
    if (callbErr != null)
      callbErr();
  }
}

RFPWFavsHandler.prototype._errRmFav = function(dataJson, callbErr, request,
    textStatus, errorThrown)
{
  // TODO: Add notification
  console.error("Unable to remove favorite: " + request.responseText);
  $.notify($("#notify-e-favs-rm-fav-err").text(), 
      {
        className: "error",
        globalPosition: 'top left'
      }
    );
  if (callbErr != null)
    callbErr();
}

RFPWFavsHandler.prototype.changeRegion = function(callBSuc, callBErr)
{
  // We only load the favs if it is necessary
  if (applicationContext.moreHandler.getUserAuth().isUserAuth())
  {
    //console.log("Reload region favs");
    this._favsLoaded = false;
    this._favsRoutes = Object.create(null);
    this._favsRouteIds = [];
    this._numFavsRoutes = 0;
    this._favsBRTrips = Object.create(null);
    this._favsBRTripIds = [];
    this._numFavsBRTrips = 0;
    this._waitForRoutesInit = null;
    this._waitForTripsInit = null;
    $("#spn-favs-routes-empty-msg").removeClass("spa-rfpw-diplay-none");
    $("#spn-favs-trips-empty-msg").removeClass("spa-rfpw-diplay-none");
    $("#div-favs-routes-lst").empty();
    $("#div-favs-trips-lst").empty();
    this._reqFavs(callBSuc, callBErr);
  }
  else
  {
    if (callBSuc != null)
      callBSuc();
  }
  //this.init();
}

RFPWFavsHandler.prototype.onResizeWait = function()
{
  applicationContext.waitForFinalEvent(
    $.proxy(this._onResize, this), 500, "Resize from Favs Handler");
}

RFPWFavsHandler.prototype._onResize = function()
{

}

RFPWFavsHandler.prototype.isFavsLoaded = function() {return this._favsLoaded;}

RFPWFavsHandler.prototype.isRouteFav = function(routeId)
{return Object.prototype.hasOwnProperty.call(this._favsRoutes, routeId);}
