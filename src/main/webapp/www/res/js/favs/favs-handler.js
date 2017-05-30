function RFPWFavsHandler()
{
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
    this._reqFavs();
  } else {
    $("#spn-favs-login-msg").removeClass("spa-rfpw-diplay-none");
    $("#div-favs-all").addClass("spa-rfpw-diplay-none");
  }
}

RFPWFavsHandler.prototype._reqFavs = function()
{
  var data = {user_id: applicationContext.moreHandler.getUserAuth().getUserToken(),
    city_id: applicationContext.moreHandler.getCurrentCityId(),
    country_id: applicationContext.moreHandler.getCurrentCountryId()};

  $.ajax({
    url: applicationContext.conf.authBaseAddr + '/',
    data: data,
    type: "post",
    success: $.proxy(this._sucFavs, this),
    error: $.proxy(this._errFavs, this)
  });
}

RFPWFavsHandler.prototype._sucFavs = function(dataJson)
{
  try {
    var data = JSON.parse(dataJson);
    $("#spn-favs-err-req-msg").addClass("spa-rfpw-diplay-none");
  } catch (e) {
    this._errFavsImpl(e.message + " / " + dataJson);
  }
}

RFPWFavsHandler.prototype._errFavs = function(request,
    textStatus, errorThrown)
{
  this._errFavsImpl(request.responseText);
}

RFPWFavsHandler.prototype._errFavsImpl = function(errTxt)
{
  $("#spn-favs-err-req-msg").removeClass("spa-rfpw-diplay-none");
  $("#spn-favs-login-msg").addClass("spa-rfpw-diplay-none");
  $("#div-favs-all").addClass("spa-rfpw-diplay-none");
  console.log("RFPWFavsHandler::_errFavs - Unable to load favs. Error: " +
    errTxt);
}

RFPWFavsHandler.prototype.onResizeWait = function()
{
  applicationContext.waitForFinalEvent(
    $.proxy(this._onResize, this), 500, "Resize from Favs Handler");
}

RFPWFavsHandler.prototype._onResize = function()
{

}

RFPWFavsHandler.TEMPLATE_LST_ITEM = $.templates("<li class=\"list-group-item\">\
<i data-l10n-id=\"dlgtripsbrstoproutetm\" class=\"spa-rfpw-margin-br-info\"></i>\
<span class=\"spa-rfpw-margin-br-info\">{{:time}}</span>\
<div class=\"pull-right\">\
<span class=\"glyphicon glyphicon-user spa-rfpw-margin-br-info\">{{:pas}}</span>\
<span class=\"glyphicon glyphicon-time spa-rfpw-margin-br-info\">{{:dur}}</span>\
</div>\
</li>");

//RFPWFavsHandler.TEMPLATE_LST_ITEM = $.templates("<span>"
