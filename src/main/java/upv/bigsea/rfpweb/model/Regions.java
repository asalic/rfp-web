package upv.bigsea.rfpweb.model;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import upv.bigsea.rfpweb.MainWS;
import upv.bigsea.rfpweb.Params;

public class Regions {
  
  protected List<Country> regionsLst;
  protected String regionsJsonTxt;
  protected Map<String, Country> regionsByCode;
  
  static final Logger LOGGER = Logger.getLogger(Regions.class);
  
  
  public Regions(Params params) throws IOException
  {
    // Load regions
    regionsByCode = new HashMap<String, Country>();
    ObjectMapper mapper = new ObjectMapper();
    //classLoader.getResource("regions.json").getFile();
    //regionsJsonTxt = new String(Files.readAllBytes(Paths.get(params.getRegionsPath())));
    
    regionsLst = Arrays.asList(mapper.readValue(new File(params.getRegionsPath()), Country[].class));
    List<Country> rTemp = Arrays.asList(mapper.readValue(new File(params.getRegionsPath()), Country[].class));
    // Let's improve the execution by grouping by code
    for (Country c : regionsLst)
    {
      regionsByCode.put(c.getCode(), c);
      c.genCitiesByCode();
    } 
    
    // Protect the information to be sent to the user
    for (Country c: rTemp)
    {
      for (City city: c.getCities())
      {
        city.setHostBRRoutes(null);
        city.setPortBRRoutes(null);
        city.setHostBRTrips(null);
        city.setPortBRTrips(null);
        city.setHostOTP(null);
        city.setPortOTP(null);
        city.setMesosDNSBRRoutes(null);
        city.setMesosDNSBRTrips(null);
        city.setMesosDNSOTP(null);
      }
    }
    regionsJsonTxt = mapper.writeValueAsString(rTemp);
//    LOGGER.info("JSON received by the user: " + regionsJsonTxt);
  }
  
  public String getRegionsJsonTxt() {return regionsJsonTxt;}
  
  public City getCity(String countryCode, String cityCode)
  {
    Country c = regionsByCode.get(countryCode);
    if (c != null)
    {
      return c.getCity(cityCode);
    } else
      return null;
  }

}
