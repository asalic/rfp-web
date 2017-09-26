package upv.bigsea.rfpweb.model;


public class ContactDetails {
  
  public final String USERNAME_FIELD = "%%USERNAME%%";
  public final String EMAIL_FIELD = "%%EMAIL%%";
  public final String FNAME_FIELD = "%%FNAME%%";
  public final String LNAME_FIELD = "%%LNAME%%";
  
  protected String emailAddr;
  protected String emailSubject;
  protected String emailBody;
  protected String emailReplyTo;
  public String getEmailAddr() {
    return emailAddr;
  }
  public void setEmailAddr(String emailAddr) {
    this.emailAddr = emailAddr;
  }
  public String getEmailSubject() {
    return emailSubject;
  }
  public void setEmailSubject(String emailSubject) {
    this.emailSubject = emailSubject;
  }
  public String getEmailBody() {
    return emailBody;
  }
  public void setEmailBody(String emailBody) {
    this.emailBody = emailBody;
  }
  
  public String getEmailReplyTo() {
    return emailReplyTo;
  }
  public void setEmailReplyTo(String emailReplyTo) {
    this.emailReplyTo = emailReplyTo;
  }
  public String getUSERNAME_FIELD() {
    return USERNAME_FIELD;
  }
  public String getEMAIL_FIELD() {
    return EMAIL_FIELD;
  }
  public String getFNAME_FIELD() {
    return FNAME_FIELD;
  }
  public String getLNAME_FIELD() {
    return LNAME_FIELD;
  } 

}
