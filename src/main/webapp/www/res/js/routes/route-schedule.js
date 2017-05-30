function RFPWRouteSchedule(data)
{
  this._trips = [];
  var servData = JSON.parse(data);
  for (var idx=0; idx<servData.length; ++idx)
  {
    var t = new RFPWRouteTrip(servData[idx]["shape_id"]);
    var sin = servData[idx]["stops_ids_nms"];
    for (var idxSt=0; idxSt<sin.length; ++idxSt)
    {
      t.addStop(new RFPWRouteStop(sin[idxSt]["id"], sin[idxSt]["name"],
        sin[idxSt]["arrival_times"]))
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
