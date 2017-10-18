function RFPWRouteSchedule(data)
{
  this._trips = [];
  //console.log(JSON.stringify(data));
  //console.log("boom");
  for (var idx=0; idx<data.length; ++idx)
  {
    var t = new RFPWRouteTrip(data[idx]["shapeId"]);
    var sin = data[idx]["stopsIdsNms"];
    for (var idxSt=0; idxSt<sin.length; ++idxSt)
    {
      t.addStop(new RFPWRouteStop(sin[idxSt]["id"], sin[idxSt]["stopName"],
        sin[idxSt]["arrivalTimes"]))
    }
    this._trips.push(t);
  }
}


RFPWRouteSchedule.prototype.getTripsIdxNames = function()
{
  var result = [];
  for (var idx=0; idx<this._trips.length; ++idx)
    result.push([idx,
        this._trips[idx].getFirstStop().getStopName(),
        this._trips[idx].getLastStop().getStopName()
      ]);
  return result;
}

RFPWRouteSchedule.prototype.getStopsByTripIdx = function(idx)
{
  return this._trips[idx].getStops();
}

RFPWRouteSchedule.prototype.getFirstStopNameByTripIdx = function(idx)
{
  return this._trips[idx].getFirstStop().getStopName();
}

RFPWRouteSchedule.prototype.getLastStopNameByTripIdx = function(idx)
{
  return this._trips[idx].getLastStop().getStopName();
}

RFPWRouteSchedule.prototype.getNumTrips = function()
{
  return this._trips.length;
}
