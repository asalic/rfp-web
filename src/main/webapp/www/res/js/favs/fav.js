function RFPWFav()
{
  this._id = 0;
  this._type = 0;
  this._cityId = 0;
  this._countryId = 0;
}

RFPWFav.prototype.setid = function(id) {this._id = id;}
RFPWFav.prototype.getid = function() {return this._id;}

RFPWFav.prototype.setType = function(t) {this._type = t;}
RFPWFav.prototype.getType = function() {return this._type;}

RFPWFav.prototype.setCityId = function(i) {this._cityId = t;}
RFPWFav.prototype.getCityId = function() {return this._cityId;}

RFPWFav.prototype.setCountryId = function(i) {this._countryId = t;}
RFPWFav.prototype.getCountryId = function() {return this._countryId;}


RFPWFav.TYPE_ROUTE = 0;
RFPWFav.TYPE_TRIP = 1;
