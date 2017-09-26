/**
 * Holds the traffic jam response for a certain coord
 * @param serverInstance the instance received form the server
 */
function RFPWTJValue(serverInstance)
{
  this._val = serverInstance["value"];
  this._lat = serverInstance["latitude"];
  this._lng = serverInstance["longitude"];
}

RFPWTJValue.prototype.getVal = function(){ return this._val;}
RFPWTJValue.prototype.getLat = function(){ return this._lat;}
RFPWTJValue.prototype.getLng = function(){ return this._lng;}