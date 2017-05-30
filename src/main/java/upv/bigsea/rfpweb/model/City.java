package upv.bigsea.rfpweb.model;

public class City {
  
  protected int id;
  protected String name;
  protected String code;
  protected double lat;
  protected double lng;
  protected String portBRRoute;
  protected String hostBRRoute;
  protected String portBRTrips;
  protected String hostBRTrips;
  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public double getLat() {
    return lat;
  }
  public void setLat(double lat) {
    this.lat = lat;
  }
  public double getLng() {
    return lng;
  }
  public void setLng(double lng) {
    this.lng = lng;
  }
  public String getPortBRRoute() {
    return portBRRoute;
  }
  public void setPortBRRoute(String portBRRoute) {
    this.portBRRoute = portBRRoute;
  }
  public String getHostBRRoute() {
    return hostBRRoute;
  }
  public void setHostBRRoute(String hostBRRoute) {
    this.hostBRRoute = hostBRRoute;
  }
  public String getPortBRTrips() {
    return portBRTrips;
  }
  public void setPortBRTrips(String portBRTrips) {
    this.portBRTrips = portBRTrips;
  }
  public String getHostBRTrips() {
    return hostBRTrips;
  }
  public void setHostBRTrips(String hostBRTrips) {
    this.hostBRTrips = hostBRTrips;
  }
  

}
