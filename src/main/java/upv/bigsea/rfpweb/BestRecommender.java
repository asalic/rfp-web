package upv.bigsea.rfpweb;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.SocketException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import javax.ws.rs.PathParam;

import org.apache.commons.net.ntp.NTPUDPClient;
import org.apache.commons.net.ntp.TimeInfo;
import org.apache.http.client.utils.URIBuilder;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.JsonArray;
import com.google.maps.internal.PolylineEncoding;
import com.google.maps.model.LatLng;

import upv.bigsea.rfpweb.OTPTrips.OTPTripsResp;
import upv.bigsea.rfpweb.model.City;
import upv.bigsea.rfpweb.model.Regions;
import upv.bigsea.rfpweb.model.Route;
import upv.bigsea.rfpweb.model.Shape;
import upv.bigsea.rfpweb.model.StopRouteRec;
import upv.bigsea.rfpweb.model.trips.SegmentRec;
import upv.bigsea.rfpweb.model.trips.TripRec;

public class BestRecommender {

  static final Logger LOGGER = Logger.getLogger(BestRecommender.class);
  protected static final String MSG_CITY_NOT_FOUND = "City not found";
  protected static final String MSG_BR_ROUTE_NOT_SUP = "Best Recommender Routes not supported for this city/country";

  protected static final String BTR_COUNTRY_CODE_FIELD = "btrCountryCode";
  protected static final String BTR_CITY_CODE_FIELD = "btrCityCode";
  protected static final String BTR_PATH_FIELD = "btrPath";
  protected static final String BTR_PATH_URL = "/get_best_trips";
  protected static final String BTR_ROUTE_SHORT_NAME = "route";
  protected static final String BTR_STOP_ID = "bus_stop_id";
  protected static final String BTR_TIME = "time";
  protected static final String BTR_DATE = "date";
  protected static final String ROUTE_DEF_COLOR = "000000";
  //protected static final DateTimeFormatter TIME_CALL_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
  //protected static final DateTimeFormatter DATE_CALL_FORMATTER = DateTimeFormatter.ofPattern("MM/dd/YYYY");

  protected static final TimeZone GMT_TMZ = TimeZone.getTimeZone("GMT");

  public static class BestRecommenderResp<T_RESPONSE>
  {
    protected String msg = null;
    protected T_RESPONSE response = null;

    public BestRecommenderResp(String msg, T_RESPONSE response)
    {
      this.msg = msg;
      this.response = response;
    }

    public String getMsg() {
      return msg;
    }

    public T_RESPONSE getResponse() {
      return response;
    }

  }

  protected Params params;
  protected Regions regions;

  public BestRecommender(Params params, Regions regions)
  {
    this.params = params;
    this.regions = regions;
  }



  public void fillRoutesEvaluation(List<Route> routes)
  {
    for (Route r : routes)
    {
      r.setRouteTextColor('#' + r.getRouteTextColor());
      r.setCrowdedness(Math.floor(Math.random() * 101));
      r.setResponsivness(Math.floor(Math.random() * 101));
      r.setConservation(Math.floor(Math.random() * 101));
      r.setStars(Math.floor(Math.random() * 6));

    }
  }

  public BestRecommenderResp<List<TripRec> > getTripsRecs(String countryCode,
      String cityCode,
      String fromLat,
      String fromLng,
      String toLat,
      String toLng,
      long dateTime,
      int utc) throws URISyntaxException, MalformedURLException, IOException, JSONException, InterruptedException
    {
      City city = regions.getCity(
          countryCode,
          cityCode);

          Calendar cal = Calendar.getInstance(GMT_TMZ);
          long idStart = cal.getTimeInMillis();
          List<TripRec> result = new ArrayList<>();
          URIBuilder builder = new URIBuilder();
          builder.setScheme("http").setHost(city.getHostBRTrips() + ":" +
              city.getPortBRTrips()).setPath("btr_routes_plans");

          URI requestURL = builder.build();
          LOGGER.info("Request is " + requestURL.toString() + " for city " + city.getName());
          HttpURLConnection connection = (HttpURLConnection) requestURL.toURL().openConnection();
          connection.setRequestMethod("POST");
          connection.setRequestProperty("cache-control", "no-cache");
          connection.setRequestProperty("content-type", "application/json");
          connection.setUseCaches(false);
          connection.setDoOutput(true);
          connection.setDoInput(true);

          //Date dt = Calendar.getInstance(TimeZone.getTimeZone(city.getTimezone())).getTime();
          Calendar dt = Calendar.getInstance(TimeZone.getTimeZone(city.getTimezone()));
          LOGGER.info(city.getName());
          LOGGER.info(dt);
          SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/YYYY");
          DATE_FORMAT.setCalendar(dt);
          SimpleDateFormat TIME_FORMAT = new SimpleDateFormat("HH:mm:ss");
          TIME_FORMAT.setCalendar(dt);

          //builder.setParameter("time", TIME_FORMAT.format(dt));// "09:00");
          //builder.setParameter("date", DATE_FORMAT.format(dt));// "2017-09-12");
          JSONObject data = new JSONObject();
          data.put("fromPlace", fromLat + "," + fromLng);
          data.put("toPlace", toLat + "," + toLng);
          data.put("mode", "TRANSIT,WALK");
          data.put("date", DATE_FORMAT.format(dt.getTime()));
          data.put("time", TIME_FORMAT.format(dt.getTime()));
          LOGGER.info(data);
          OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
          wr.write(data.toString());
          wr.flush();
          int responseCode = connection.getResponseCode();
          String msg = connection.getResponseMessage();
//          LOGGER.debug("Calling: " + builder.toString());
//          LOGGER.debug("Response code: " + responseCode);
//          LOGGER.debug("Response msg: " + msg);
          //Get Response
          InputStream is = connection.getInputStream();
          BufferedReader rd = new BufferedReader(new InputStreamReader(is));
          StringBuffer response = new StringBuffer();
          String line;
          while ((line = rd.readLine()) != null) {
            response.append(line);
            response.append('\r');
          }
          rd.close();
          //LOGGER.debug(response.toString());
          List<TripRec> tr = createTripsRecs(response.toString(), idStart);

          return new BestRecommenderResp<List<TripRec> >("", tr);

    }

    protected List<TripRec> createTripsRecs(String jsonTripDesc,
        long idStart) throws JSONException, InterruptedException
    {
      DecimalFormat formatter = new DecimalFormat("#0.00000");
      long idCounter = idStart;
      List<TripRec> result = new ArrayList<>();
      JSONObject json = new JSONObject(jsonTripDesc);
      JSONObject plan = (JSONObject)json.get("plan");
      JSONArray itineraries  = plan.getJSONArray("itineraries");
      // Generate unique ID across calls for each trip
      for (int iitineraries = 0; iitineraries<itineraries.length(); ++iitineraries)
      {
        LOGGER.debug("Trip ID: " + idCounter);
        JSONObject itinerary = itineraries.getJSONObject(iitineraries);
        TripRec tr = new TripRec();
        result.add(tr);
        List<SegmentRec> srLst = new ArrayList<>();
        tr.setSegmentRecs(srLst);
        tr.setId(idCounter);
        ++idCounter;
//        JSONObject fromStop = itinerary.getJSONObject("from");
//        String fromStopName = fromStop.getString("name");
//        tr.setFromStopName(fromStopName);
//        JSONObject fromStop = itinerary.getJSONObject("to");
//        String fromStopName = fromStop.getString("name");
//        tr.setFromStopName(fromStopName);

        tr.setDuration((int)itinerary.getDouble("duration"));
        JSONArray legs  = itinerary.getJSONArray("legs");
        for (int ilegs = 0; ilegs<legs.length(); ++ilegs)
        {
          JSONObject leg = legs.getJSONObject(ilegs);
          SegmentRec rs = new SegmentRec();
          rs.setId(idCounter);
          ++idCounter;
          rs.setDistance((int)leg.getDouble("distance"));
          rs.setDuration((int)leg.getDouble("duration"));
          rs.setStopFrom(leg.getJSONObject("from").getString("name"));
          rs.setStopTo(leg.getJSONObject("to").getString("name"));
          //LOGGER.debug(leg.toString());
//          if (leg.has("routeId") && !leg.isNull("routeId"))
//          {
//            JSONObject routeId = leg.getJSONObject("routeId");
//            LOGGER.debug(routeId.toString());
//          }
          String mode = leg.getString("mode");
          rs.setType(SegmentRec.getTypeIdByName(mode));;
          LOGGER.debug(mode);
          if (leg.has("routeId") && !leg.isNull("routeId"))
          {
            String routeId = leg.getString("routeId");
            rs.setRouteId(routeId);
            LOGGER.debug(routeId);
          } else
          {
            rs.setRouteId(mode);
          }
          if (leg.has("routeColor"))
          {
            String routeColor = leg.getString("routeColor");

            if (routeColor.isEmpty())
              rs.setRouteColor(ROUTE_DEF_COLOR);
            else
              rs.setRouteColor(routeColor);
          } else
            rs.setRouteColor(ROUTE_DEF_COLOR);

          if (leg.has("route") && !leg.isNull("route"))
          {
            String route = leg.getString("route");
            if (route.isEmpty())
              rs.setRouteShortName("Walk");
            else
              rs.setRouteShortName(route);
          } else
            rs.setRouteShortName("Walk");
          JSONObject legGeometry = leg.getJSONObject("legGeometry");
          String points = legGeometry.getString("points");
          List<LatLng> path = PolylineEncoding.decode(points);
          //LOGGER.debug(String.join("],[", path.toString()));
          //List<List<Double> > pathM = new ArrayList<>(path.size());
          String[][] pathM = new String[path.size()][];
          for (int idxPath=0; idxPath<path.size(); ++idxPath)
            pathM[idxPath] = new String[] {formatter.format(path.get(idxPath).lng),
                formatter.format(path.get(idxPath).lat)};
          rs.setShape(new Shape("Feature", new Shape.Geometry("LineString", pathM),
              new Shape.Properties(Integer.toString(ilegs), ilegs)));
          srLst.add(rs);
        }

        tr.setSegmentRecs(srLst);
      }

      // Just to be sure that we won't generate the same id next time we call the method
      // We wait a bit; This part shouldn't be called unless we return many trips
      // the the execution is done extremely fast
      Calendar cal = Calendar.getInstance(GMT_TMZ);
      long idEnd =  cal.getTimeInMillis();
      long dif = idEnd - idStart;
//      LOGGER.info("Execution end (ms): " + idEnd);
//      LOGGER.info("Execution start (ms): " + (idStart - itineraries.length()));
      LOGGER.debug("Execution of OTP and extraction (ms): " + dif);
      if (idEnd <= idCounter)
        TimeUnit.MILLISECONDS.sleep(idCounter - idEnd + 1);
      //List<LatLng> path = PolylineEncoding.decode();
      //path.get(0).
      return result;
    }
}
