function RFPWRouteTrip(shapeId)
{
  this._shapeId = shapeId;
  this._stops = [];
}

RFPWRouteTrip.prototype.addStop = function(stop)
{
  this._stops.push(stop);
}

RFPWRouteTrip.prototype.getStops = function()
{
  return this._stops;
}

RFPWRouteTrip.prototype.getTripId = function()
{
  return this._shapeId;
}

RFPWRouteTrip.prototype.getStopByIdx = function(idx)
{
  return this._stops[idx];
}

RFPWRouteTrip.prototype.getNumStops = function()
{
  return this._stops.length;
}

RFPWRouteTrip.prototype.getFirstStop = function()
{
  return this._stops.length > 0 ? this._stops[0] : null;
}

RFPWRouteTrip.prototype.getLastStop = function()
{
  return this._stops.length > 0 ? this._stops[this._stops.length - 1] : null;
}
