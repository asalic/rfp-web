if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    console.log("BR Trip Segment nodeJs");
    module.exports = RFPWBRTripSegment;
    var RFPWBRTripSegmentShape = require("./br-trip-segment-shape");
    var RFPWBRTripSegmentPoint = require("./br-trip-segment-point");
  }
}

function RFPWBRTripSegment(instance)
{
  this.uid = instance.uid;
  this.type = instance.type;
  if (instance.startPoint !== null && instance.startPoint !== undefined)
    this.startPoint = new RFPWBRTripSegmentPoint(instance.startPoint);
  else
    this.startPoint = null;
  if (instance.endPoint !== null && instance.endPoint !== undefined)
    this.endPoint = new RFPWBRTripSegmentPoint(instance.endPoint);
  else
    this.endPoint = null;
  if (instance.shape !== null && instance.shape !== undefined)
    this.shape = new RFPWBRTripSegmentShape(instance.shape);
  else
    this.shape = null;
}

RFPWBRTripSegment.prototype.getUid = function() {return this.uid;}
RFPWBRTripSegment.prototype.getType = function() {return this.type;}
RFPWBRTripSegment.prototype.setStartPoint = function(startPoint) {this.startPoint = startPoint;}
RFPWBRTripSegment.prototype.getStartPoint = function() {return this.startPoint;}
RFPWBRTripSegment.prototype.setEndPoint = function(endPoint) {this.endPoint = endPoint;}
RFPWBRTripSegment.prototype.getEndPoint = function() {return this.endPoint;}

RFPWBRTripSegment.TYPE_NONE = 0;
RFPWBRTripSegment.TYPE_BUS = 21;
RFPWBRTripSegment.TYPE_WALK = 22;
RFPWBRTripSegment.TYPE_TRAM = 23;
RFPWBRTripSegment.TYPE_METRO = 24;
