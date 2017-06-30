function RFPWStop(stopServer)
{
  this._uid = stopServer["stopUid"];
  this._id = stopServer["stopId"];
  this._lat = stopServer["stopLat"];
  this._lng = stopServer["stopLng"];
  this._title = stopServer["stopName"];
  this._routesIds = stopServer["routesIds"];
}

RFPWStop.prototype.getId = function() {return this._id;}
RFPWStop.prototype.getLat = function() {return this._lat;}
RFPWStop.prototype.getLng = function() {return this._lng;}
RFPWStop.prototype.getTitle = function() {return this._title;}
RFPWStop.prototype.getRoutesIds = function() {return this._routesIds;}
