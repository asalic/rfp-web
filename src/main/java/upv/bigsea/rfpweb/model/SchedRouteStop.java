package upv.bigsea.rfpweb.model;

import java.util.List;

public class SchedRouteStop {
  
  public static class StopsIdsNms
  {
    protected int uid;
    protected String stopId;
    protected String stopName;
    protected String []arrivalTimes;
    
    public StopsIdsNms() 
    {
      this(0, null, null, null);
    }
    
    public StopsIdsNms(int uid, String stopId, String stopName, String []arrivalTimes) 
    {
      this.uid = uid;
      this.stopId = stopId;
      this.stopName = stopName; 
      this.arrivalTimes = arrivalTimes;
    }
    
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
    public String getStopName() {
      return stopName;
    }
    public void setStopName(String stopName) {
      this.stopName = stopName;
    }
    public String[] getArrivalTimes() {
      return arrivalTimes;
    }
    public void setArrivalTimes(String[] arrivalTimes) {
      this.arrivalTimes = arrivalTimes;
    }   
  }
  
  protected int uid;
  protected String shapeId;
  protected List<StopsIdsNms> stopsIdsNms;
  
  public int getUid() {
    return uid;
  }
  public void setUid(int uid) {
    this.uid = uid;
  }
  public String getShapeId() {
    return shapeId;
  }
  public void setShapeId(String shapeId) {
    this.shapeId = shapeId;
  }
  public List<StopsIdsNms> getStopsIdsNms() {
    return stopsIdsNms;
  }
  public void setStopsIdsNms(List<StopsIdsNms> stopsIdsNms) {
    this.stopsIdsNms = stopsIdsNms;
  }

}
