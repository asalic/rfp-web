package upv.bigsea.rfpweb.model.trips;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import upv.bigsea.rfpweb.model.Shape;

public class SegmentRec {
  
  public final static int TYPE_TRAM_STREETCAR_LIGHT_RAIL = 0;
  public final static int TYPE_SUBWAY_METRO = 1;
  public final static int TYPE_BUS = 3;
  
  public final static int TYPE_WALK = 8;
  public final static int TYPE_UNKNOWN = 1002;
  public final static Map<String, Integer> TYPES_NAME_TO_INT = new HashMap<String, Integer>()
      {{
        put("TRAM", TYPE_TRAM_STREETCAR_LIGHT_RAIL);
        put("WALK", TYPE_WALK);
        put("SUBWAY", TYPE_SUBWAY_METRO);
        put("BUS", TYPE_BUS);
      }};
  
  protected long id;
  protected int type;
  
  protected int duration;
  protected int distance;  
  protected String agencyId;
  protected String routeId;
  protected String routeColor;
  protected String tripId;
  protected String routeShortName;
  protected Shape shape;
  protected String stopFrom;
  protected String stopTo;
  public int getType() {
    return type;
  }
  public void setType(int type) {
    this.type = type;
  }
  public String getAgencyId() {
    return agencyId;
  }
  public void setAgencyId(String agencyId) {
    this.agencyId = agencyId;
  }
  public String getRouteId() {
    return routeId;
  }
  public void setRouteId(String routeId) {
    this.routeId = routeId;
  }
  public String getTripId() {
    return tripId;
  }
  public void setTripId(String tripId) {
    this.tripId = tripId;
  }
    
  public String getRouteShortName() {
    return routeShortName;
  }
  public void setRouteShortName(String routeShortName) {
    this.routeShortName = routeShortName;
  }
  public long getId() {
    return id;
  }
  public void setId(long id) {
    this.id = id;
  }
  public String getRouteColor() {
    return routeColor;
  }
  public void setRouteColor(String routeColor) {
    this.routeColor = routeColor;
  }
  public Shape getShape() {
    return shape;
  }
  public void setShape(Shape shape) {
    this.shape = shape;
  }  
  public int getDuration() {
    return duration;
  }
  public void setDuration(int duration) {
    this.duration = duration;
  }
  public int getDistance() {
    return distance;
  }
  public void setDistance(int distance) {
    this.distance = distance;
  }
  
  public String getStopFrom() {
    return stopFrom;
  }
  public void setStopFrom(String stopFrom) {
    this.stopFrom = stopFrom;
  }
  public String getStopTo() {
    return stopTo;
  }
  public void setStopTo(String stopTo) {
    this.stopTo = stopTo;
  }
  public static int getTypeIdByName(String name)
  {
    Integer r = TYPES_NAME_TO_INT.get(name);
    if (r != null)
    {
      return r;
    }
    else
      return TYPE_UNKNOWN;
    
  }

}
