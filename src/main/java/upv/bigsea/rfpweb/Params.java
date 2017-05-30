package upv.bigsea.rfpweb;

public class Params {

//  protected String appPath;
  protected int unsecurePort;
  protected int securePort;
  protected String pfx;
  protected String psqlUser;
  protected String psqlPassw;
  protected int psqlPort;
  protected String psqlHost;
  
  public Params()
  {
	  this.unsecurePort = 10100;
	  this.securePort = 10101;
	  this.pfx = "";
	  this.psqlUser = "postgres";
	  this.psqlPassw = "bigsea";
	  this.psqlPort = 5432;
	  this.psqlHost = "localhost";
	  
  }
  
  public int getUnsecurePort() {
    return unsecurePort;
  }
  public void setUnsecurePort(int unsecurePort) {
    this.unsecurePort = unsecurePort;
  }
  public int getSecurePort() {
    return securePort;
  }
  public void setSecurePort(int securePort) {
    this.securePort = securePort;
  }
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
  
  

}
