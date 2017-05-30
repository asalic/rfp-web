function RFPWRouteStop(stopId, stopName, arrivalTimes)
{
  this._stopId = stopId;
  this._stopName = stopName;
  this._arrivalTimes = arrivalTimes;
}

RFPWRouteStop.prototype.getStopId = function()
{
  return this._stopId;
}

RFPWRouteStop.prototype.getStopName = function()
{
  return this._stopName;
}

RFPWRouteStop.prototype.getArrivalTimes = function()
{
  return this._arrivalTimes;
}
