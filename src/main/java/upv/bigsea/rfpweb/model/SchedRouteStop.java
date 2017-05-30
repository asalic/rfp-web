package upv.bigsea.rfpweb.model;

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
  protected StopsIdsNms stopsIdsNames;

}
