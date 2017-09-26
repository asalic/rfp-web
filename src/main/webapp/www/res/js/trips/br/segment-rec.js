function RFPWSegmentRec(obj)
{
	this.id = obj["id"];
	this.type = obj["type"];
	this.duration = obj["duration"];
	this.distance = obj["distance"];
	this.agencyId = obj["agencyId"];
	this.routeId = obj["routeId"];
	this.routeColor = obj["routeColor"];
  this.routeShortName = obj["routeShortName"];
	this.tripId = obj["tripId"];
  this.stopTo = obj["stopTo"];
  this.stopFrom = obj["stopFrom"];
	this.shape = obj["shape"];
}


RFPWSegmentRec.prototype.getId = function() {return this.id;}
RFPWSegmentRec.prototype.getType = function() {return this.type;}
RFPWSegmentRec.prototype.getDuration = function() {return this.duration;}
RFPWSegmentRec.prototype.getDistance = function() {return this.distance;}
RFPWSegmentRec.prototype.getAgencyId = function() {return this.agencyId;}
RFPWSegmentRec.prototype.getRouteId = function() {return this.routeId;}
RFPWSegmentRec.prototype.getRouteColor = function() {return this.routeColor;}
RFPWSegmentRec.prototype.getRouteShortName = function() {return this.routeShortName;}
RFPWSegmentRec.prototype.getTripId = function() {return this.tripId;}
RFPWSegmentRec.prototype.getStopTo = function() {return this.stopTo;}
RFPWSegmentRec.prototype.getStopFrom = function() {return this.stopFrom;}
RFPWSegmentRec.prototype.getShape = function() {return this.shape;}