package upv.bigsea.rfpweb.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class SchedRouteStop {
  
  public static class StopsIdsNms
  {
    protected int uid;
    protected String stopId;
    protected String stopName;
    protected int stopSequence;
    protected List<String> arrivalTimes;
    
    public StopsIdsNms(int uid, String stopId, String stopName, int stopSequence) 
    {
      this.uid = uid;
      this.stopId = stopId;
      this.stopName = stopName; 
      this.arrivalTimes = new ArrayList<>();
      this.stopSequence = stopSequence;
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
    public List<String> getArrivalTimes() {
      return arrivalTimes;
    }
    public void setArrivalTimes(List<String> arrivalTimes) {
      this.arrivalTimes = arrivalTimes;
    }

    public int getStopSequence() {
      return stopSequence;
    }

    public void setStopSequence(int stopSequence) {
      this.stopSequence = stopSequence;
    }   
    
    public void addArrivalTime(String at)
    {
      this.arrivalTimes.add(at);
    }
    
    
  }
  

  
  protected int uid;
  protected String shapeId;
  protected List<StopsIdsNms> stopsIdsNms;
  @JsonIgnore
  protected Map<String, StopsIdsNms> stopsIdsNmsById;
  protected String firstStopName;
  protected String lastStopName;
  
  public SchedRouteStop(int uid, String shapeId)
  {
    this.uid = uid;
    this.shapeId = shapeId;
    this.stopsIdsNms = new ArrayList<>();
    this.stopsIdsNmsById = new HashMap<>();
  }
  
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
  
  public void addStopsIdsNms(int sUid, String sId, String sName, int sSequence, String sArrivalTime) {
    StopsIdsNms sin = this.stopsIdsNmsById.get(sId);
    if (sin == null)
    {
      sin = new StopsIdsNms(sUid, sId, sName, sSequence);
      this.stopsIdsNms.add(sin);
      this.stopsIdsNmsById.put(sId, sin);
    }
    sin.addArrivalTime(sArrivalTime);
  }
  
  /**
   * Prepare the object to be sent across the connection to the web client
   * We expect the web client to use the data as we send it, without further
   * processing
   */
  public void freeze()
  {
    Collections.sort(stopsIdsNms, Comparator.comparing(StopsIdsNms::getStopSequence));
    for (StopsIdsNms sin: stopsIdsNms)
      Collections.sort(sin.getArrivalTimes());
  }

}
