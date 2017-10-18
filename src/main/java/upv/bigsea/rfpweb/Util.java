package upv.bigsea.rfpweb;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.client.utils.URIBuilder;
import org.json.JSONArray;
import org.json.JSONObject;


public class Util {
  
  public static TaskInfo getHostPortTaskMesosDNS(String mesosDNSIPPort, String mesosDNSServiceCall, String taskId) 
      throws URISyntaxException, MalformedURLException, IOException
  {
    URIBuilder builder = new URIBuilder();
    builder.setScheme("http").setHost(mesosDNSIPPort).setPath(mesosDNSServiceCall + "/" + taskId);
    URI requestURL = builder.build();
    HttpURLConnection connection = (HttpURLConnection) requestURL.toURL().openConnection();
    connection.setRequestMethod("GET");
    connection.setRequestProperty("Content-Language", "en-US");

    connection.setUseCaches(false);
    connection.setDoOutput(true);
    // //Send request
    // DataOutputStream wr = new DataOutputStream (
    // connection.getOutputStream());
    // wr.close();
    TaskInfo result = new TaskInfo();
    int responseCode = connection.getResponseCode();
    // If we have a positive response, carry on and get the data
    if (responseCode == 200)
    {
      String msg = connection.getResponseMessage();
      // LOGGER.debug("Calling: " + builder.toString());
      // LOGGER.debug("Response code: " + responseCode);
      // LOGGER.debug("Response msg: " + msg);
      // Get Response
      InputStream is = connection.getInputStream();
      BufferedReader rd = new BufferedReader(new InputStreamReader(is));
      StringBuffer response = new StringBuffer();
      String line;
      while ((line = rd.readLine()) != null) {
        response.append(line);
        response.append('\r');
      }
      rd.close();
      
      JSONArray arr = new JSONArray(response.toString());
      if (arr.length() > 0)
      {
        // Get first element that contains the ip and the port
        JSONObject entry = (JSONObject) arr.get(0);
        result.setIp(entry.getString("ip"));
        result.setPort(entry.getString("port"));
        result.setProtocol("http");
      }
    }
    return result;
  }
  
  public static class TaskInfo
  {
    protected String protocol;
    protected String ip;
    protected String port;
    
    public TaskInfo() {}
    
    public TaskInfo(String protocol, String ip, String port)
    {
      this.protocol = protocol;
      this.ip = ip;
      this.port = port;
    }

    public String getProtocol() {
      return protocol;
    }

    public void setProtocol(String protocol) {
      this.protocol = protocol;
    }

    public String getIp() {
      return ip;
    }

    public void setIp(String ip) {
      this.ip = ip;
    }

    public String getPort() {
      return port;
    }

    public void setPort(String port) {
      this.port = port;
    }
    
    
    
  }

}
