if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    console.log("City nodeJs");
    module.exports = RFPWCity;
  }
}

function RFPWCity(cityInstance)
{
  this._id = cityInstance.id;
  this._name = cityInstance.name;
  this._code = cityInstance.code;
  this._lat = cityInstance.lat;
  this._lng = cityInstance.lng;
  this._portBRRoute = cityInstance.portBRRoute;
  this._hostBRRoute = cityInstance.hostBRRoute;
  this._portBRTrips = cityInstance.portBRTrips;
  this._hostBRTrips = cityInstance.hostBRTrips;
}

RFPWCity.prototype.getId = function() {return this._id;}
RFPWCity.prototype.getName = function() {return this._name;}
RFPWCity.prototype.getCode = function() {return this._code;}
RFPWCity.prototype.getLat = function() {return this._lat;}
RFPWCity.prototype.getLng = function() {return this._lng;}
RFPWCity.prototype.getPortBRRoute = function() {return this._portBRRoute;}
RFPWCity.prototype.getHostBRRoute = function() {return this._hostBRRoute;}
RFPWCity.prototype.getPortBRTrips = function() {return this._portBRTrips;}
RFPWCity.prototype.getHostBRTrips = function() {return this._hostBRTrips;}
