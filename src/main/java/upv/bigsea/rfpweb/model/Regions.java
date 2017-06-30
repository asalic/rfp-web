package upv.bigsea.rfpweb.model;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import upv.bigsea.rfpweb.Params;

public class Regions {
  
  protected List<Country> regionsLst;
  protected String regionsJsonTxt;
  protected Map<String, Country> regionsByCode;
  
  
  public Regions(Params params) throws IOException
  {
    // Load regions
    regionsByCode = new HashMap<String, Country>();
    ObjectMapper mapper = new ObjectMapper();
    //classLoader.getResource("regions.json").getFile();
    regionsJsonTxt = new String(Files.readAllBytes(Paths.get(params.getRegionsPath())));
    
    regionsLst = Arrays.asList(mapper.readValue(new File(params.getRegionsPath()), Country[].class));
    // Let's improve the execution by grouping by code
    for (Country c : regionsLst)
    {
      regionsByCode.put(c.getCode(), c);
      c.genCitiesByCode();
    } 
  }
  
  public String getRegionsJsonTxt() {return regionsJsonTxt;}

}
