package upv.bigsea.rfpweb.model;

import java.util.List;

public class City {
  
  protected int id;
  protected String timezone;
  protected String name;
  protected String code;
  protected double lat;
  protected double lng;
  protected String mesosDNSBRRoutes;
  protected String portBRRoutes;
  protected String hostBRRoutes;
  protected boolean hasBRRoutes;
  protected String mesosDNSBRTrips;
  protected String portBRTrips;
  protected String hostBRTrips;
  protected boolean hasBRTrips;
  protected String mesosDNSOTP;
  protected String portOTP;
  protected String hostOTP;
  protected boolean hasOTP;
  protected String portSentimentAnalysis;
  protected String hostSentimentAnalysis;
  protected boolean hasSentimentAnalysis;
  protected String portTrafficJam;
  protected String hostTrafficJam;
  protected boolean hasTrafficJam;
  protected boolean enabled;
  protected String gtfsVersion;
  protected String osmVersion;
  protected List<String> gtfsDlURL;
  protected double latMin;
  protected double lngMin;
  protected double latMax;
  protected double lngMax;
  
  
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
  
  public boolean hasBRRoutes()
  {
    return !hostBRRoutes.isEmpty();
  }
  public boolean isHasBRRoutes() {
    return hasBRRoutes;
  }
  public void setHasBRRoutes(boolean hasBRRoutes) {
    this.hasBRRoutes = hasBRRoutes;
  }
  public boolean isHasBRTrips() {
    return hasBRTrips;
  }
  public void setHasBRTrips(boolean hasBRTrips) {
    this.hasBRTrips = hasBRTrips;
  }
  public String getMesosDNSOTP() {
    return mesosDNSOTP;
  }
  public void setMesosDNSOTP(String mesosDNSOTP) {
    this.mesosDNSOTP = mesosDNSOTP;
  }
  public String getPortOTP() {
    return portOTP;
  }
  public void setPortOTP(String portOTP) {
    this.portOTP = portOTP;
  }
  public String getHostOTP() {
    return hostOTP;
  }
  public void setHostOTP(String hostOTP) {
    this.hostOTP = hostOTP;
  }
  public boolean isHasOTP() {
    return hasOTP;
  }
  public void setHasOTP(boolean hasOTP) {
    this.hasOTP = hasOTP;
  }
  public boolean isEnabled() {
    return enabled;
  }
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
  public String getGtfsVersion() {
    return gtfsVersion;
  }
  public void setGtfsVersion(String gtfsVersion) {
    this.gtfsVersion = gtfsVersion;
  }
  public String getOsmVersion() {
    return osmVersion;
  }
  public void setOsmVersion(String osmVersion) {
    this.osmVersion = osmVersion;
  }
  public void setPortBRRoutes(String portBRRoutes) {
    this.portBRRoutes = portBRRoutes;
  }
  public String getPortSentimentAnalysis() {
    return portSentimentAnalysis;
  }
  public void setPortSentimentAnalysis(String portSentimentAnalysis) {
    this.portSentimentAnalysis = portSentimentAnalysis;
  }
  public String getHostSentimentAnalysis() {
    return hostSentimentAnalysis;
  }
  public void setHostSentimentAnalysis(String hostSentimentAnalysis) {
    this.hostSentimentAnalysis = hostSentimentAnalysis;
  }
  public boolean isHasSentimentAnalysis() {
    return hasSentimentAnalysis;
  }
  public void setHasSentimentAnalysis(boolean hasSentimentAnalysis) {
    this.hasSentimentAnalysis = hasSentimentAnalysis;
  }
  public String getPortTrafficJam() {
    return portTrafficJam;
  }
  public void setPortTrafficJam(String portTrafficJam) {
    this.portTrafficJam = portTrafficJam;
  }
  public String getHostTrafficJam() {
    return hostTrafficJam;
  }
  public void setHostTrafficJam(String hostTrafficJam) {
    this.hostTrafficJam = hostTrafficJam;
  }
  public boolean isHasTrafficJam() {
    return hasTrafficJam;
  }
  public void setHasTrafficJam(boolean hasTrafficJam) {
    this.hasTrafficJam = hasTrafficJam;
  }
  public String getTimezone() {
    return timezone;
  }
  public void setTimezone(String timezone) {
    this.timezone = timezone;
  }
  

}
