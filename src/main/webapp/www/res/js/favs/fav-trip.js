function RFPWFavTrip(favTripObj)
{
  //console.log("RFPWFavTrip");
  //console.log(favTripObj);
  // Init the parent
  RFPWFav.call(this, favTripObj);
  if (favTripObj !== null && favTripObj !== undefined)
  {
    RFPWTripRec.clearDrawnPathsS(favTripObj);
    //RFPWTripRec.clearSegmentRecsS(favTripObj);
    this.trip = favTripObj.trip;
  } else
  {
    this.trip = null;
  }
}

RFPWFavTrip.prototype = Object.create(RFPWFav.prototype);
RFPWFavTrip.prototype.constructor = RFPWFavTrip;

RFPWFavTrip.prototype.setTrip = function(trip) {this.trip = trip;}

RFPWFavTrip.prototype.getHTMLRepresentation = function() 
{
  var brtrip = new RFPWTripRec(this.trip);
  return RFPWFavTrip.LST_ITM_FAV.render(
      {
        "id": this.getId(),
        "renderedTrip": brtrip.getHTMLShortRepresentation()
      });  
}

RFPWFavTrip.prototype.getHTMLLstItmId = function() {
  return "li-rfpw-favs-trip-" + this.id;  
}

RFPWFavTrip.prototype.getHTMLRmBtnId = function() {
  return "btn-rfpw-favs-rm-trip-" + this.id;
}

RFPWFavTrip.LST_ITM_FAV = $.templates("<li id=\"li-rfpw-favs-trip-{{:id}}\" class=\"list-group-item\">\
    <span class=\"glyphicon glyphicon-heart\" style=\"color: {{:color}}\"></span>\
    <span>{{:renderedTrip}}</span>\
    <div class=\"pull-right\">\
    <button disabled=\"disabled\" id=\"btn-rfpw-favs-rm-trip-{{:id}}\"\
    class=\"btn btn-default pull-right glyphicon glyphicon-trash spa-rfpw-btn-rm-layer\"></button>\
    </div>\
    </li>");