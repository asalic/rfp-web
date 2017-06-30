package upv.bigsea.rfpweb;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
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
import upv.bigsea.rfpweb.model.StopRouteRec;
import upv.bigsea.rfpweb.model.User;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/")
public class MainWS {
  
  protected static final String MSG_SRV_500_ERROR = "We are sorry. There has been an error, that's all we know, please contact the admin";
  protected static final String URL_DECODER_ENC = "UTF-8";
  


  protected static Params params = WSContextListener.getParams();
  protected static Gtfs gtfs = WSContextListener.getGtfs();
  protected static BestRecommender bestRecommender = WSContextListener.getBestRecommender();
  protected static Auth auth = WSContextListener.getAuth();
  
  static final Logger LOGGER = Logger.getLogger(MainWS.class);


  public MainWS() {
    // System.out.println(varValue);
  }

  @Path("/regions")
  @GET
  @Produces("application/json")
  public Response getStops() throws JSONException {
    return Response.status(200).entity(WSContextListener.getRegions().getRegionsJsonTxt()).build();
  }
  
  @Path("/auth/userdetails/{userToken}")
  @GET
  @Produces("application/json")
  public Response getUserDetails(@PathParam("userToken") String userToken) {
    try
    {
      User r = auth.getUserByToken(userToken);
      Msg<User> m = new Msg<User>(200, "", r);
      return this.respond(m);
    } catch (JSONException e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    } catch (IOException e) {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
  }
  
  @Path("/routes/{countryCode}/{cityCode}")
  @GET
  @Produces("application/json")
  public Response getRoutes(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode) {
    try
    {
      List<Route> r = gtfs.getRoutes(URLDecoder.decode(countryCode, URL_DECODER_ENC), 
          URLDecoder.decode(cityCode, URL_DECODER_ENC));
      bestRecommender.fillRoutesEvaluation(r);
      Msg<List<Route> > m = new Msg<List<Route> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
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
      List<Stop> r = gtfs.getStops(URLDecoder.decode(countryCode, URL_DECODER_ENC), 
          URLDecoder.decode(cityCode, URL_DECODER_ENC));
      Msg<List<Stop> > m = new Msg<List<Stop> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(Arrays.toString(e.getStackTrace())
          //MSG_SRV_500_ERROR
          ).build();
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
      List<Shape> r = gtfs.getShapes(URLDecoder.decode(countryCode, URL_DECODER_ENC), 
          URLDecoder.decode(cityCode, URL_DECODER_ENC), 
              URLDecoder.decode(routeId, URL_DECODER_ENC));
      Msg<List<Shape> > m = new Msg<List<Shape> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
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
      List<SchedRouteStop> r = gtfs.getSchedRouteStop(URLDecoder.decode(countryCode, URL_DECODER_ENC), 
          URLDecoder.decode(cityCode, URL_DECODER_ENC), 
          URLDecoder.decode(routeId, URL_DECODER_ENC), 
          URLDecoder.decode(dateTime, URL_DECODER_ENC), 
          URLDecoder.decode(utc, URL_DECODER_ENC));
      Msg<List<SchedRouteStop> > m = new Msg<List<SchedRouteStop> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(Arrays.toString(e.getStackTrace())
          //MSG_SRV_500_ERROR
          ).build();
    }   
  }
  
  @Path("/stoprouterecs/{countryCode}/{cityCode}/{stopID}/{routeShortName}/{dateTime}/{utc}")
  @GET
  @Produces("application/json")
  public Response getStopRouteRecs(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode,
      @PathParam("stopID") String stopID,
      @PathParam("routeShortName") String routeShortName,
      @PathParam("dateTime") String dateTime,
      @PathParam("utc") String utc) {
    try
    {
      List<StopRouteRec> r = bestRecommender.getStopRouteRecs(
          URLDecoder.decode(countryCode, URL_DECODER_ENC), 
          URLDecoder.decode(cityCode, URL_DECODER_ENC), 
          URLDecoder.decode(stopID, URL_DECODER_ENC), 
          URLDecoder.decode(routeShortName, URL_DECODER_ENC), 
          URLDecoder.decode(dateTime, URL_DECODER_ENC),
          URLDecoder.decode(utc, URL_DECODER_ENC));
      Msg<List<StopRouteRec> > m = new Msg<List<StopRouteRec> >(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(Arrays.toString(e.getStackTrace())
          //MSG_SRV_500_ERROR
          ).build();
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
      LOGGER.error(Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
  }

}
