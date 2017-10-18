package upv.bigsea.rfpweb;

import java.util.Arrays;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Params {
  
  static final Logger LOGGER = Logger.getLogger(Params.class);

//  protected String appPath;
  //protected int unsecurePort;
  //protected int securePort;
  //protected String ntpServer;
  protected String pfx;
  protected String psqlUser;
  protected String psqlPassw;
  protected int psqlPort;
  protected String psqlHost;
  
  //protected String regionsPath;
  protected String contactMailAddr;
  protected String mesosDNSIPPort;
  protected String mesosDNSLBInternalId;
  protected String mesosDNSRFPDBId;
  protected String regionsURL;
//  protected String contactMailPassw;
//  protected String contactMailSMTPHost;
//  protected String contactMailSMTPPort;
  
  public Params() throws NumberFormatException
  {
	  //this.unsecurePort = Integer.parseInt(System.getenv("SECURE_PORT"));
	  //this.securePort = Integer.parseInt(System.getenv("UNSECURE_PORT"));
    //this.ntpServer = System.getenv("NTP_SERVER");
	  this.pfx = System.getenv("PFX");
	  this.psqlUser = System.getenv("PSQL_USER");
	  this.psqlPassw = System.getenv("PSQL_PASSW");
	  this.psqlPort = Integer.parseInt(System.getenv("LB_RFP_DB_PORT"));
	  this.psqlHost = System.getenv("LB_RFP_DB_HOST");
    //this.regionsPath = System.getenv("REGIONS_LOCAL_PATH");
	  this.contactMailAddr = System.getenv("CONTACT_MAIL_ADDR");
	  this.mesosDNSIPPort = System.getenv("MESOS_DNS_IP_PORT");
	  this.mesosDNSLBInternalId = System.getenv("MESOS_DNS_LB_INTERNAL_ID");
	  this.mesosDNSRFPDBId = System.getenv("MESOS_DNS_RFP_DB_ID");
	  this.regionsURL = System.getenv("REGIONS_URL");
//    this.contactMailPassw = System.getenv("CONTACT_MAIL_PASSW");
//    this.contactMailSMTPHost = System.getenv("CONTACT_MAIL_SMTP_HOST");
//    this.contactMailSMTPPort = System.getenv("CONTACT_MAIL_SMTP_PORT");
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

  public String getContactMailAddr() {
    return contactMailAddr;
  }

  public void setContactMailAddr(String contactMailAddr) {
    this.contactMailAddr = contactMailAddr;
  }
  
  
  
  public String getRegionsURL() {
    return regionsURL;
  }

  public void setRegionsURL(String regionsURL) {
    this.regionsURL = regionsURL;
  }

  public String getMesosDNSIPPort() {
    return mesosDNSIPPort;
  }

  public void setMesosDNSIPPort(String mesosDNSIPPort) {
    this.mesosDNSIPPort = mesosDNSIPPort;
  }

  public String toString()
  {
    String res = null;
    ObjectMapper mapper = new ObjectMapper();
    try
    {
      res = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(this);
    } catch (JsonGenerationException e) {
      res = Arrays.toString(e.getStackTrace());
      LOGGER.error(res);
    } catch (JsonMappingException e) {
      res = Arrays.toString(e.getStackTrace());
      LOGGER.error(res);
    } catch (JsonProcessingException e) {
      res = Arrays.toString(e.getStackTrace());
      LOGGER.error(res);
    }
    return res;
    
  }
  

}
