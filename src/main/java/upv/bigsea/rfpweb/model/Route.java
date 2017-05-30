package upv.bigsea.rfpweb.model;

public class Route {
  
  protected int uid;
  protected String routeId;
  protected String startStop;
  protected String endStop;
  protected String routeColor;
  protected String routeTextColor;
  protected double crowdedness;
  protected double responsivness;
  protected double conservation;
  protected double stars;
  public int getUid() {
    return uid;
  }
  public void setUid(int uid) {
    this.uid = uid;
  }
  public String getRouteId() {
    return routeId;
  }
  public void setRouteId(String routeId) {
    this.routeId = routeId;
  }
  public String getStartStop() {
    return startStop;
  }
  public void setStartStop(String startStop) {
    this.startStop = startStop;
  }
  public String getEndStop() {
    return endStop;
  }
  public void setEndStop(String endStop) {
    this.endStop = endStop;
  }
  public String getRouteColor() {
    return routeColor;
  }
  public void setRouteColor(String routeColor) {
    this.routeColor = routeColor;
  }
  public String getRouteTextColor() {
    return routeTextColor;
  }
  public void setRouteTextColor(String routeTextColor) {
    this.routeTextColor = routeTextColor;
  }
  public double getCrowdedness() {
    return crowdedness;
  }
  public void setCrowdedness(double crowdedness) {
    this.crowdedness = crowdedness;
  }
  public double getResponsivness() {
    return responsivness;
  }
  public void setResponsivness(double responsivness) {
    this.responsivness = responsivness;
  }
  public double getConservation() {
    return conservation;
  }
  public void setConservation(double conservation) {
    this.conservation = conservation;
  }
  public double getStars() {
    return stars;
  }
  public void setStars(double stars) {
    this.stars = stars;
  }
  
  

}
