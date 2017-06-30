package upv.bigsea.rfpweb;

public class Params {

//  protected String appPath;
  //protected int unsecurePort;
  //protected int securePort;
  protected String pfx;
  protected String psqlUser;
  protected String psqlPassw;
  protected int psqlPort;
  protected String psqlHost;

  protected String authServiceInvalidTokenResp;
  protected String authServiceUrl;
  
  protected String regionsPath;
  
  public Params() throws NumberFormatException
  {
	  //this.unsecurePort = Integer.parseInt(System.getenv("SECURE_PORT"));
	  //this.securePort = Integer.parseInt(System.getenv("UNSECURE_PORT"));
	  this.pfx = System.getenv("PFX");
	  this.psqlUser = System.getenv("PSQL_USER");
	  this.psqlPassw = System.getenv("PSQL_PASSW");
	  this.psqlPort = Integer.parseInt(System.getenv("PSQL_PORT"));
	  this.psqlHost = System.getenv("PSQL_HOST");
	  this.authServiceUrl = System.getenv("AUTH_SERVICE_URL");
    this.authServiceInvalidTokenResp = System.getenv("AUTH_SERVICE_INVALID_TOKEN_RESP").toLowerCase();
    this.regionsPath = System.getenv("REGIONS_LOCAL_PATH");
	  
  }
  
//  public int getUnsecurePort() {
//    return unsecurePort;
//  }
//  public void setUnsecurePort(int unsecurePort) {
//    this.unsecurePort = unsecurePort;
//  }
//  public int getSecurePort() {
//    return securePort;
//  }
//  public void setSecurePort(int securePort) {
//    this.securePort = securePort;
//  }
  public String getPfx() {
    return pfx;
  }
  public void setPfx(String pfx) {
    this.pfx = pfx;
  }
  public String getPsqlUser() {
    return psqlUser;
  }
  public void setPsqlUser(String psqlUser) {
    this.psqlUser = psqlUser;
  }
  public String getPsqlPassw() {
    return psqlPassw;
  }
  public void setPsqlPassw(String psqlPassw) {
    this.psqlPassw = psqlPassw;
  }
  public int getPsqlPort() {
    return psqlPort;
  }
  public void setPsqlPort(int psqlPort) {
    this.psqlPort = psqlPort;
  }
  public String getPsqlHost() {
    return psqlHost;
  }
  public void setPsqlHost(String psqlHost) {
    this.psqlHost = psqlHost;
  }
  
  public String getAuthServiceInvalidTokenResp() {
    return authServiceInvalidTokenResp;
  }

  public void setAuthServiceInvalidTokenResp(String authServiceInvalidTokenResp) {
    this.authServiceInvalidTokenResp = authServiceInvalidTokenResp;
  }

  public String getAuthServiceUrl() {
    return authServiceUrl;
  }

  public void setAuthServiceUrl(String authServiceUrl) {
    this.authServiceUrl = authServiceUrl;
  }

  public String getRegionsPath() {
    return regionsPath;
  }

  public void setRegionsPath(String regionsPath) {
    this.regionsPath = regionsPath;
  }

  public String toString()
  {
    
    return "{\"psqlUser\":\"" + psqlUser + "\"," +
        "\"psqlPassw\":\"" + psqlPassw + "\"," +
        "\"psqlHost\":\"" + psqlHost + "\"," +
        "\"psqlPort\":\"" + psqlPort + "\"}";
    
  }
  

}
