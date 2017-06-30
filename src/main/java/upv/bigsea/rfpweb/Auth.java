package upv.bigsea.rfpweb;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import upv.bigsea.rfpweb.model.User;

public class Auth {
  
  protected Params params;
  
  public Auth(Params params)
  {
    this.params = params;
  }
  
  public User getUserByToken(String userToken) throws IOException
  {
    String urlParameters  = "token=" + userToken;
    byte[] postData       = urlParameters.getBytes(StandardCharsets.UTF_8);
    int    postDataLength = postData.length;
    URL    url            = new URL(params.getAuthServiceUrl());
    HttpURLConnection conn= (HttpURLConnection) url.openConnection();           
    conn.setDoOutput( true );
    conn.setInstanceFollowRedirects( false );
    conn.setRequestMethod( "POST" );
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
    conn.setRequestProperty("charset", "utf-8");
    conn.setRequestProperty("Content-Length", Integer.toString(postDataLength));
    conn.setUseCaches(false);
    DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
    wr.write( postData );
    User u = null;
    // Check if user has been found for this token
    if (!wr.toString().toLowerCase().contains(params.getAuthServiceInvalidTokenResp()))
    {
      u = new User();
      u.setEmail("unknown");
      u.setFName("Chewy");
      u.setLName("Bacca");
      u.setUserName(wr.toString().split(":")[1].replaceAll("\"$|\"}", ""));
    } 
    return u;
  }

}
