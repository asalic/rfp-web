function RFPWFav(favObj)
{
  if (favObj !== null && favObj !== undefined)
  {
    if (favObj.hasOwnProperty("id"))
      this.id = favObj.id;
    else 
      this.id = null;
    if (favObj.hasOwnProperty("type"))
      this.type = favObj.type;
    else 
      this.type = RFPWFav.TYPENONE;
    if (favObj.hasOwnProperty("cityId"))
      this.cityId = favObj.cityId;
    else 
      this.cityId = RFPWFav.ID_NO_CITY;
    if (favObj.hasOwnProperty("countryId"))
      this.countryId = favObj.countryId;
    else 
      this.countryId = RFPWFav.ID_NO_COUNTRY;
    if (favObj.hasOwnProperty("favId"))
      this.favId = favObj.favId;
    else 
      this.favId = null;
  } else
  {
    this.id = null;
    this.type = RFPWFav.TYPENONE;
    this.cityId = 0;
    this.countryId = 0;
    this.favId = 0;
  }
}

RFPWFav.prototype.getId = function() {return this.id;}
RFPWFav.prototype.setId = function(i) {this.id = i;}
RFPWFav.prototype.getType = function() {return this.type;}
RFPWFav.prototype.setType = function(i) {this.type = i;}
RFPWFav.prototype.getFavId = function() {return this.favId;}
RFPWFav.prototype.setFavId = function(i) {this.favId = i;}
RFPWFav.prototype.getCityId = function() {return this.cityId;}
RFPWFav.prototype.setCityId = function(i) {this.cityId = i;}
RFPWFav.prototype.getCountryId = function() {return this.countryId;}
RFPWFav.prototype.setCountryId = function(i) {this.countryId = i;}

RFPWFav.prototype.getHTMLRepresentation = function() {console.error("Superclass not implemented");return null;}
RFPWFav.prototype.getHTMLLstItmId = function() {console.error("Superclass not implemented");return null;}
RFPWFav.prototype.getHTMLRmBtnId = function() {console.error("Superclass not implemented");return null;}

RFPWFav.generateFavId = function(type, countryId, cityId, uniqueId)
{
  return "T" + type + "C" + countryId + "C" + cityId + "-" + uniqueId;
}

RFPWFav.prototype.generateId = function(){console.error("Superclass not implemented");return null;}

RFPWFav.ID_NO_CITY = -1000;
RFPWFav.ID_NO_COUNTRY = -10000;

RFPWFav.ID_CITY_FEEDBACK = -1;
RFPWFav.ID_COUNTRY_FEEDBACK = -1;
RFPWFav.ID_FAV_FEEDBACK = -1;

RFPWFav.TYPENONE = -1;
RFPWFav.TYPEROUTE = 0;
RFPWFav.TYPETRIP = 1;
RFPWFav.TYPEFEEDBACK = 2;
