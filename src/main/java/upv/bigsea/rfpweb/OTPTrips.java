package upv.bigsea.rfpweb;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import org.apache.http.client.utils.URIBuilder;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.maps.internal.PolylineEncoding;
import com.google.maps.model.LatLng;

import upv.bigsea.rfpweb.model.City;
import upv.bigsea.rfpweb.model.Regions;
import upv.bigsea.rfpweb.model.Shape;
import upv.bigsea.rfpweb.model.trips.SegmentRec;
import upv.bigsea.rfpweb.model.trips.TripRec;

public class OTPTrips {

  private static final Logger LOGGER = Logger.getLogger(OTPTrips.class);
  protected static final TimeZone GMT_TMZ = TimeZone.getTimeZone("GMT");
  protected static final String ROUTE_DEF_COLOR = "000000";

  public static class OTPTripsResp<T_RESPONSE> {
    protected String msg = null;
    protected T_RESPONSE response = null;

    public OTPTripsResp(String msg, T_RESPONSE response) {
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

  public OTPTrips(Params params, Regions regions) {
    this.params = params;
    this.regions = regions;
  }

  public OTPTripsResp<List<TripRec>> getTrips(String countryCode, String cityCode, String fromLat, String fromLng,
      String toLat, String toLng, long dateTime, int utc)
      throws URISyntaxException, MalformedURLException, IOException, JSONException, InterruptedException {
    City city = regions.getCity(countryCode, cityCode);

    Calendar cal = Calendar.getInstance(GMT_TMZ);
    long idStart = cal.getTimeInMillis();
    //List<TripRec> result = new ArrayList<>();
    URIBuilder builder = new URIBuilder();
    builder.setScheme("http").setHost(city.getHostOTP() + ":" + city.getPortOTP()).setPath("otp/routers/default/plan");
    // for (Map.Entry<String, String> entry: params.entrySet())
    builder.setParameter("fromPlace", fromLat + "," + fromLng);
    builder.setParameter("toPlace", toLat + "," + toLng);
    Date dt = Calendar.getInstance(TimeZone.getTimeZone(city.getTimezone())).getTime();//// zonedDateTime.now();
    final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("YYYY-MM-dd");
    final SimpleDateFormat TIME_FORMAT = new SimpleDateFormat("HH:mm");
    LOGGER.info(dt);
    builder.setParameter("time", TIME_FORMAT.format(dt));// "09:00");
    builder.setParameter("date", DATE_FORMAT.format(dt));// "2017-09-12");
    URI requestURL = builder.build();
    LOGGER.info("Request is " + requestURL.toString());
    HttpURLConnection connection = (HttpURLConnection) requestURL.toURL().openConnection();
    connection.setRequestMethod("GET");
    connection.setRequestProperty("Content-Language", "en-US");

    connection.setUseCaches(false);
    connection.setDoOutput(true);
    // //Send request
    // DataOutputStream wr = new DataOutputStream (
    // connection.getOutputStream());
    // wr.close();
    int responseCode = connection.getResponseCode();
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
    // LOGGER.debug(response.toString());
    List<TripRec> tr = createTripsRecs(response.toString(), idStart);

    return new OTPTripsResp<List<TripRec>>("", tr);

  }

  protected List<TripRec> createTripsRecs(String jsonTripDesc, long idStart)
      throws JSONException, InterruptedException {
    DecimalFormat formatter = new DecimalFormat("#0.00000");
    long idCounter = idStart;
    List<TripRec> result = new ArrayList<>();
    JSONObject json = new JSONObject(jsonTripDesc);
    JSONObject plan = (JSONObject) json.get("plan");
    JSONArray itineraries = plan.getJSONArray("itineraries");
    // Generate unique ID across calls for each trip
    for (int iitineraries = 0; iitineraries < itineraries.length(); ++iitineraries) {
      LOGGER.debug("Trip ID: " + idCounter);
      JSONObject itinerary = itineraries.getJSONObject(iitineraries);
      TripRec tr = new TripRec();
      result.add(tr);
      List<SegmentRec> srLst = new ArrayList<>();
      tr.setSegmentRecs(srLst);
      tr.setId(idCounter);
      ++idCounter;
      // JSONObject fromStop = itinerary.getJSONObject("from");
      // String fromStopName = fromStop.getString("name");
      // tr.setFromStopName(fromStopName);
      // JSONObject fromStop = itinerary.getJSONObject("to");
      // String fromStopName = fromStop.getString("name");
      // tr.setFromStopName(fromStopName);

      tr.setDuration((int) itinerary.getDouble("duration"));
      JSONArray legs = itinerary.getJSONArray("legs");
      for (int ilegs = 0; ilegs < legs.length(); ++ilegs) {
        JSONObject leg = legs.getJSONObject(ilegs);
        SegmentRec rs = new SegmentRec();
        rs.setId(idCounter);
        ++idCounter;
        rs.setDistance((int) leg.getDouble("distance"));
        rs.setDuration((int) leg.getDouble("duration"));
        rs.setStopFrom(leg.getJSONObject("from").getString("name"));
        rs.setStopTo(leg.getJSONObject("to").getString("name"));
        // LOGGER.debug(leg.toString());
        // if (leg.has("routeId") && !leg.isNull("routeId"))
        // {
        // JSONObject routeId = leg.getJSONObject("routeId");
        // LOGGER.debug(routeId.toString());
        // }
        String mode = leg.getString("mode");
        rs.setType(SegmentRec.getTypeIdByName(mode));
        ;
        LOGGER.debug(mode);
        if (leg.has("routeId") && !leg.isNull("routeId")) {
          String routeId = leg.getString("routeId");
          rs.setRouteId(routeId);
          LOGGER.debug(routeId);
        } else {
          rs.setRouteId(mode);
        }
        if (leg.has("routeColor")) {
          String routeColor = leg.getString("routeColor");

          if (routeColor.isEmpty())
            rs.setRouteColor(ROUTE_DEF_COLOR);
          else
            rs.setRouteColor(routeColor);
        } else
          rs.setRouteColor(ROUTE_DEF_COLOR);

        if (leg.has("route") && !leg.isNull("route")) {
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
        // LOGGER.debug(String.join("],[", path.toString()));
        // List<List<Double> > pathM = new ArrayList<>(path.size());
        String[][] pathM = new String[path.size()][];
        for (int idxPath = 0; idxPath < path.size(); ++idxPath)
          pathM[idxPath] = new String[] { formatter.format(path.get(idxPath).lng),
              formatter.format(path.get(idxPath).lat) };
        rs.setShape(new Shape("Feature", new Shape.Geometry("LineString", pathM),
            new Shape.Properties(Integer.toString(ilegs), ilegs)));
        srLst.add(rs);
      }

      tr.setSegmentRecs(srLst);
    }

    // Just to be sure that we won't generate the same id next time we call the
    // method
    // We wait a bit; This part shouldn't be called unless we return many trips
    // the the execution is done extremely fast
    Calendar cal = Calendar.getInstance(GMT_TMZ);
    long idEnd = cal.getTimeInMillis();
    long dif = idEnd - idStart;
    // LOGGER.info("Execution end (ms): " + idEnd);
    // LOGGER.info("Execution start (ms): " + (idStart - itineraries.length()));
    LOGGER.debug("Execution of OTP and extraction (ms): " + dif);
    if (idEnd <= idCounter)
      TimeUnit.MILLISECONDS.sleep(idCounter - idEnd + 1);
    // List<LatLng> path = PolylineEncoding.decode();
    // path.get(0).
    return result;
  }

}
