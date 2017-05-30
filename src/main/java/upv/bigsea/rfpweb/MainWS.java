package upv.bigsea.rfpweb;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import upv.bigsea.rfpweb.model.Country;
import upv.bigsea.rfpweb.model.Msg;
import upv.bigsea.rfpweb.model.Route;
import upv.bigsea.rfpweb.model.SchedRouteStop;
import upv.bigsea.rfpweb.model.Shape;
import upv.bigsea.rfpweb.model.Stop;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/")
public class MainWS {
  
  protected static final String MSG_SRV_500_ERROR = "We are sorry. There has been an error, that's all we know, please contact the admin";
  
  protected static List<Country> regions;
  protected static String regionsJsonTxt;
  protected static Map<String, Country> regionsByCode;

  protected Params params;
  protected Gtfs gtfs;
  protected BestRecommender bestRecommender;

  static {
    // Load regions
    regionsByCode = new HashMap<String, Country>();
    System.out.println("Loading regions");
    ObjectMapper mapper = new ObjectMapper();
    try {
      ClassLoader classLoader = MainWS.class.getClassLoader();
      String regionsPath = classLoader.getResource("regions.json").getFile();
      regionsJsonTxt = new String(Files.readAllBytes(Paths.get(regionsPath)));
      regions = Arrays.asList(mapper.readValue(new File(regionsPath), Country[].class));
      // Let's improve the execution by grouping by code
      for (Country c : regions)
      {
        regionsByCode.put(c.getCode(), c);
        c.genCitiesByCode();
      }
    } catch (JsonGenerationException e) {
      e.printStackTrace();
    } catch (JsonMappingException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }

  }

  public MainWS() {
    // String varValue = System.getenv("PATH");
    params = new Params();
    gtfs = new Gtfs(params);
    bestRecommender = new BestRecommender(params);
    System.out.println("mainWs constructor");
    // System.out.println(varValue);
  }

  @Path("/regions")
  @GET
  @Produces("application/json")
  public Response getStops() throws JSONException {
    return Response.status(200).entity(regionsJsonTxt).build();
  }
  
  @Path("/routes/{countryCode}/{cityCode}")
  @GET
  @Produces("application/json")
  public Response getRoutes(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode) {
    try
    {
      List<Route> r = gtfs.getRoutes(countryCode, cityCode);
      bestRecommender.fillRoutesEvaluation(r);
      Msg<List<Route> > m = new Msg<List<Route> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      e.printStackTrace();
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
   
  }
  
  @Path("/stops/{countryCode}/{cityCode}")
  @GET
  @Produces("application/json")
  public Response getStops(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode) {
    try
    {
      List<Stop> r = gtfs.getStops(countryCode, cityCode);
      Msg<List<Stop> > m = new Msg<List<Stop> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      e.printStackTrace();
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }   
  }
  
  @Path("/shapes/{countryCode}/{cityCode}/{routeId}")
  @GET
  @Produces("application/json")
  public Response getShapes(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode,
      @PathParam("routeId") String routeId) {
    try
    {
      List<Shape> r = gtfs.getShapes(countryCode, cityCode, routeId);
      Msg<List<Shape> > m = new Msg<List<Shape> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      e.printStackTrace();
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }   
  }
  
  @Path("/schedroutestop/{countryCode}/{cityCode}/{routeId}/{dateTime}/{utc}")
  @GET
  @Produces("application/json")
  public Response getSchedRouteStop(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode,
      @PathParam("routeId") String routeId,
      @PathParam("dateTime") String dateTime,
      @PathParam("utc") String utc) {
    try
    {
      List<SchedRouteStop> r = gtfs.getSchedRouteStop(countryCode, cityCode, routeId, dateTime, utc);
      Msg<List<SchedRouteStop> > m = new Msg<List<SchedRouteStop> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      e.printStackTrace();
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }   
  }
  
  protected <MSG_TYPE> Response respond(MSG_TYPE m)
  {
    ObjectMapper mapper = new ObjectMapper();
    try
    {
      return Response.status(200).entity(mapper.writeValueAsString(m)).build();
    } catch(Exception e)
    {
      e.printStackTrace();
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
  }

}
