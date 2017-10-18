package upv.bigsea.rfpweb;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import upv.bigsea.rfpweb.model.City;
import upv.bigsea.rfpweb.model.ContactDetails;
import upv.bigsea.rfpweb.model.ContactUs;
import upv.bigsea.rfpweb.model.Country;
import upv.bigsea.rfpweb.model.Msg;
import upv.bigsea.rfpweb.model.Regions;
import upv.bigsea.rfpweb.model.Route;
import upv.bigsea.rfpweb.model.SchedRouteStop;
import upv.bigsea.rfpweb.model.Shape;
import upv.bigsea.rfpweb.model.Stop;
import upv.bigsea.rfpweb.model.StopRouteRec;
import upv.bigsea.rfpweb.model.User;
import upv.bigsea.rfpweb.model.trips.TripRec;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.net.URLEncoder;
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
  
  protected static final String CONTACT_EMAIL_TITLE = "[RFPW] ";
  protected static final String CONTACT_EMAIL_BODY = "Please do not remove the following lines. Continue with your message after the dashed separator\r\n" +
      "User: %1$s\r\n"+
      "Email: %2$s\r\n" +
      "First Name: %3$s\r\n" +
      "Last Name: %4$s\r\n" +
      "----------------------\r\n\r\n";
  protected static final String MSG_CITY_NOT_FOUND = "City not found";
  protected static final String MSG_OTP_TRIPS_NOT_SUP = "This city/country does not have support for trip creation.";
  protected static final String MSG_BR_ROUTE_NOT_SUP = "Best Recommender Routes not supported for this city/country";

  protected static Params params = WSContextListener.getParams();
  protected static Regions regions = WSContextListener.getRegions();
  protected static Gtfs gtfs = WSContextListener.getGtfs();
  protected static BestRecommender bestRecommender = WSContextListener.getBestRecommender();
  protected static OTPTrips otpTrips = WSContextListener.getOTPTrips();
  
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
  
//  @Path("/contact")
//  @POST 
//  @Consumes(MediaType.WILDCARD)// MediaType.APPLICATION_JSON)
//  @Produces(MediaType.APPLICATION_JSON)
//  public Response getContact(String input) 
//  {
//    ObjectMapper mapper = new ObjectMapper();
//    try {
//      ContactUs inp = mapper.readValue(input, ContactUs.class);
//
//      LOGGER.debug("Contact us title: " + inp.getTitle());
//      LOGGER.debug("Contact us body: " + inp.getBody());
//      LOGGER.debug("Contact us user token: " + inp.getUserToken());
//    } catch (IOException e) {
//      LOGGER.error(Arrays.toString(e.getStackTrace()));
//    }
//    return this.respond(new Msg<String>(200, "", "success"));
//  }
  
//  @Path("/auth/userdetails/{userToken}")
//  @GET
//  @Produces("application/json")
//  public Response getUserDetails(@PathParam("userToken") String userToken) {
//    try
//    {
//      User r = auth.getUserByToken(userToken);
//      Msg<User> m = new Msg<User>(200, "", r);
//      return this.respond(m);
//    } catch (JSONException e)
//    {
//      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
//      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
//    } catch (IOException e) {
//      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
//      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
//    }
//  }
//  
//  @Path("/br/create_trip/{userToken}")
//  @GET
//  @Produces("application/json")
//  public Response getUserDetails(@PathParam("userToken") String userToken) {
//    try
//    {
//      
//    }catch (IOException e) {
//      LOGGER.error(Arrays.toString(e.getStackTrace()));
//      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
//    }
//  }
  
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
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
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
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
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
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
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
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(Arrays.toString(e.getStackTrace())
          //MSG_SRV_500_ERROR
          ).build();
    }   
  }
  
  @Path("/br/create_trip/{countryCode}/{cityCode}/{fromLat}/{fromLng}/{toLat}/{toLng}/{dateTime}/{utc}")
  @GET
  @Produces("application/json")
  public Response getStopRouteRecs(@PathParam("countryCode") String countryCode,
      @PathParam("cityCode") String cityCode,
      @PathParam("fromLat") String fromLat,
      @PathParam("fromLng") String fromLng,
      @PathParam("toLat") String toLat,
      @PathParam("toLng") String toLng,
      @PathParam("dateTime") String dateTime,
      @PathParam("utc") String utc) {
    try
    {
      City city = regions.getCity(
          countryCode, 
          cityCode);
      if (city != null)
      {
        if (city.isHasBRTrips())
        {
          LOGGER.info("Create a BR OTP trip");
          BestRecommender.BestRecommenderResp<List<TripRec> > r = 
              bestRecommender.getTripsRecs(
              URLDecoder.decode(countryCode, URL_DECODER_ENC), 
              URLDecoder.decode(cityCode, URL_DECODER_ENC), 
              URLDecoder.decode(fromLat, URL_DECODER_ENC), 
              URLDecoder.decode(fromLng, URL_DECODER_ENC), 
              URLDecoder.decode(toLat, URL_DECODER_ENC), 
              URLDecoder.decode(toLng, URL_DECODER_ENC), 
              Long.parseLong(URLDecoder.decode(dateTime, URL_DECODER_ENC)),
              Integer.parseInt(URLDecoder.decode(utc, URL_DECODER_ENC)));
          Msg<List<TripRec> > m = new Msg<List<TripRec> >(200, "", r.getResponse());
          return this.respond(m);
        } else if (city.isHasOTP())
        {
          LOGGER.info("Create a vanilla OTP trip");
          OTPTrips.OTPTripsResp<List<TripRec> > r = 
              otpTrips.getTrips(
              URLDecoder.decode(countryCode, URL_DECODER_ENC), 
              URLDecoder.decode(cityCode, URL_DECODER_ENC), 
              URLDecoder.decode(fromLat, URL_DECODER_ENC), 
              URLDecoder.decode(fromLng, URL_DECODER_ENC), 
              URLDecoder.decode(toLat, URL_DECODER_ENC), 
              URLDecoder.decode(toLng, URL_DECODER_ENC), 
              Long.parseLong(URLDecoder.decode(dateTime, URL_DECODER_ENC)),
              Integer.parseInt(URLDecoder.decode(utc, URL_DECODER_ENC)));
          Msg<List<TripRec> > m = new Msg<List<TripRec> >(200, "", r.getResponse());
          return this.respond(m);
        } else
        {
          Msg<String> m = new Msg<String>(200, MSG_OTP_TRIPS_NOT_SUP, null);
          return this.respond(m);
        }
      } else        
      {
        Msg<String> m = new Msg<String>(200, MSG_CITY_NOT_FOUND, null);
        return this.respond(m);
      }
    } catch (Exception e)
    {
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
  }
  
  @Path("/contact_details/{userToken}")
  @GET
  @Produces("application/json")
  public Response getStopRouteRecs(@PathParam("userToken") String userToken) {
    try
    {
      ContactDetails r = new ContactDetails();
      r.setEmailAddr(params.getContactMailAddr());
      r.setEmailBody(
          String.format(CONTACT_EMAIL_BODY, r.USERNAME_FIELD, r.EMAIL_FIELD,
              r.FNAME_FIELD, r.LNAME_FIELD)
          );
      r.setEmailSubject(CONTACT_EMAIL_TITLE);
      r.setEmailReplyTo(params.getContactMailAddr());
      Msg<ContactDetails> m = new Msg<ContactDetails>(200, "", r);
      return this.respond(m);
    } catch (Exception e)
    {
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(//Arrays.toString(e.getStackTrace())
          MSG_SRV_500_ERROR
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
      LOGGER.error(e.getMessage() + " - " + Arrays.toString(e.getStackTrace()));
      return Response.status(500).entity(MSG_SRV_500_ERROR).build();
    }
  }

}
