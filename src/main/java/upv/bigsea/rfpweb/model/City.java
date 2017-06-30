package upv.bigsea.rfpweb.model;

public class City {
  
  protected int id;
  protected String name;
  protected String code;
  protected double lat;
  protected double lng;
  protected String mesosDNSBRRoutes;
  protected String portBRRoutes;
  protected String hostBRRoutes;
  protected String mesosDNSBRTrips;
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
  public String getMesosDNSBRRoutes() {
    return mesosDNSBRRoutes;
  }
  public void setMesosDNSBRRoutes(String mesosDNSBRRoutes) {
    this.mesosDNSBRRoutes = mesosDNSBRRoutes;
  }
  public String getPortBRRoutes() {
    return portBRRoutes;
  }
  public void setPortBRRoute(String portBRRoutes) {
    this.portBRRoutes = portBRRoutes;
  }
  public String getHostBRRoutes() {
    return hostBRRoutes;
  }
  public void setHostBRRoutes(String hostBRRoutes) {
    this.hostBRRoutes = hostBRRoutes;
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
  public String getMesosDNSBRTrips() {
    return mesosDNSBRTrips;
  }
  public void setMesosDNSBRTrips(String mesosDNSBRTrips) {
    this.mesosDNSBRTrips = mesosDNSBRTrips;
  }
  

}
