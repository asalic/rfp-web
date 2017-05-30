/**
 * Hold all data for the trips available at a certain time at a selected stop
 */
function RFPWBestRecTripStop(jsonBR)
{
  this._tripInitialTime = jsonBR["trip.initial.time"];
  this._tripFinalTime = jsonBR["trip.final.time"];
  this._passengersNumber = jsonBR["passengers.number"];
  this._tripDuration = jsonBR["trip.duration"];
}

RFPWBestRecTripStop.prototype.getTripInitialTime = function()
{return this._tripInitialTime;}

RFPWBestRecTripStop.prototype.getTripFinalTime = function()
{return this._tripFinalTime;}

RFPWBestRecTripStop.prototype.getPassengersNumber = function()
{return this._passengersNumber;}

RFPWBestRecTripStop.prototype.getTripDuration = function()
{return this._tripDuration;}
