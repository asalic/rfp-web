function RFPWBRTripSegmentShape(instance)
{
  this.uid = instance.uid;
  this.type = "Feature";
  this.geometry = {type: "LineString",
    coordinates: instance.geometry.coordinates};
}

