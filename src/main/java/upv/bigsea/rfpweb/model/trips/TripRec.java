package upv.bigsea.rfpweb.model.trips;

import java.util.List;

public class TripRec {
  
  protected long id;
  protected int duration;
  protected List<SegmentRec> segmentRecs;

  public List<SegmentRec> getSegmentRecs() {
    return segmentRecs;
  }

  public void setSegmentRecs(List<SegmentRec> segmentRecs) {
    this.segmentRecs = segmentRecs;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

	public int getDuration() {
		return duration;
	}
	
	public void setDuration(int duration) {
		this.duration = duration;
	}
  
  

}
