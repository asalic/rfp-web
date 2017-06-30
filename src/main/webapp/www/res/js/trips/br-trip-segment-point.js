/**
 * Constructor for a point in a trip's segments
 * @param {int} uid       unique identifier
 * @param {int} seqPos        the position in the sequence of points that make
 *                            a segment
 * @param {string} stopId    the id of the bus/tram/metro/etc. stop that
 *                           represents this point. This value is taken from the
 *                           GTFS used for the region
 * @param {string} stopTitle the title of the bus/tram/metro/etc. stop that
 *                           represents this point. This value is taken from the
 *                           GTFS used for the region
 * @param {double} lat       the latitude of the point from GTFS
 * @param {double} lng       the longitude of the point from GTFS
 */
function RFPWBRTripSegmentPoint(instance)
{
  this.uid = instance.uid;
  this.seqPos = instance.seqPos;
  this.stopId = instance.stopId;
  this.stopTitle = instance.stopTitle;
  this.lat = instance.lat;
  this.lng = instance.lng;
}

