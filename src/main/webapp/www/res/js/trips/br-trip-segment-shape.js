function RFPWBRTripSegmentShape(instance)
{
  this.uid = instance.uid;
  this.type = "Feature";
  this.geometry = {type: "LineString",
    coordinates: instance.geometry.coordinates};
}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    console.log("BR Trip Segment Shape nodeJs");
    module.exports = RFPWBRTripSegmentShape;
  }
}
