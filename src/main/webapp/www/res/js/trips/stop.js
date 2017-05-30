"use strict";
function RFPWStop(stopServer)
{
  this._id = stopServer["stop_id"];
  this._lat = stopServer.coords[1];
  this._lng = stopServer.coords[0];
  this._title = stopServer["title"];
  this._routesIds = stopServer["routes-ids"];
}

RFPWStop.prototype.getId = function() {return this._id;}
RFPWStop.prototype.getLat = function() {return this._lat;}
RFPWStop.prototype.getLng = function() {return this._lng;}
RFPWStop.prototype.getTitle = function() {return this._title;}
RFPWStop.prototype.getRoutesIds = function() {return this._routesIds;}
