package upv.bigsea.rfpweb.model;

public class Stop {
  
  protected int uid;
  protected String stopId;
  protected String stopLat;
  protected String stopLng;
  protected String stopName;
  protected String []routesIds;
  public int getUid() {
    return uid;
  }
  public void setUid(int uid) {
    this.uid = uid;
  }
  public String getStopId() {
    return stopId;
  }
  public void setStopId(String stopId) {
    this.stopId = stopId;
  }
  public String getStopLat() {
    return stopLat;
  }
  public void setStopLat(String stopLat) {
    this.stopLat = stopLat;
  }
  public String getStopLng() {
    return stopLng;
  }
  public void setStopLng(String stopLng) {
    this.stopLng = stopLng;
  }
  public String getStopName() {
    return stopName;
  }
  public void setStopName(String stopName) {
    this.stopName = stopName;
  }
  public String []getRoutesIds() {
    return routesIds;
  }
  public void setRoutesIds(String []routesIds) {
    this.routesIds = routesIds;
  }
  
  

}
