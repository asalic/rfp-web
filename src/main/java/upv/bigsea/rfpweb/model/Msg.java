package upv.bigsea.rfpweb.model;

public class Msg<DATA_TYPE> {
  
  //protected UUID id;
  protected int code;
  protected String errorMsg;
  protected DATA_TYPE data;
  
  public Msg()
  {
    this(-1, null, null);
    
  }
  
  public Msg(int code, String errorMsg, DATA_TYPE data)
  {
    this.code = code;
    this.errorMsg = errorMsg;
    this.data = data;
  }

  public int getCode() {
    return code;
  }

  public void setCode(int code) {
    this.code = code;
  }

  public String getErrorMsg() {
    return errorMsg;
  }

  public void setErrorMsg(String errorMsg) {
    this.errorMsg = errorMsg;
  }

  public DATA_TYPE getData() {
    return data;
  }

  public void setData(DATA_TYPE data) {
    this.data = data;
  }

  
  
}
