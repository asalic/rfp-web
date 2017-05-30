function RFPWFavRoute()
{
  this.fav_id = "";
}

RFPWFavRoute.prototype = Object.create(RFPWFav.prototype);

RFPWFavRoute.prototype.setFavId = function(i) {this.fav_id = i;}
RFPWFavRoute.prototype.getFavId = function() {return this.fav_id;}
