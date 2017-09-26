function RFPWFavRoute(favRouteObj)
{
  // Init the parent
  RFPWFav.call(this, favRouteObj);
  if (favRouteObj !== null)
  {
    // the GTFS ID
    this.routeId = favRouteObj.id;
    this.shortNm = favRouteObj.shortNm;
    this.longNm = favRouteObj.longNm;
    this.startStop = favRouteObj.startStop;
    this.endStop = favRouteObj.endStop;
    this.color = favRouteObj.color;
  } else
  {
    this.routeId = null;
    this.shortNm = null;
    this.longNm = null;
    this.startStop = null;
    this.endStop = null;
    this.color = null;
  }
}

RFPWFavRoute.prototype = Object.create(RFPWFav.prototype);
RFPWFavRoute.prototype.constructor = RFPWFavRoute;

RFPWFavRoute.prototype.getRouteId = function() {return this.routeId;}

RFPWFavRoute.prototype.getHTMLRepresentation = function() {
  return RFPWFavRoute.LST_ITM_FAV.render(this);  
}

RFPWFavRoute.prototype.getHTMLLstItmId = function() {
  return "li-rfpw-favs-route-" + this.id;  
}

RFPWFavRoute.prototype.getHTMLRmBtnId = function() {
  return "btn-rfpw-favs-rm-route-" + this.id;
}

RFPWFavRoute.LST_ITM_FAV = $.templates("<li id=\"li-rfpw-favs-route-{{:id}}\" class=\"list-group-item\">\
		<span class=\"glyphicon glyphicon-heart\" style=\"color: {{:color}}\"></span>\
    <span class=\"spa-rfpw-margin-br-info\">{{:shortNm}}</span>\
    <span class=\"spa-rfpw-margin-br-info\">{{:longNm}}</span>\
    <div class=\"pull-right\">\
    <button disabled=\"disabled\" id=\"btn-rfpw-favs-rm-route-{{:id}}\"\
    class=\"btn btn-default pull-right glyphicon glyphicon-trash spa-rfpw-btn-rm-layer\"></button>\
    </div>\
    </li>");