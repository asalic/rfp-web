package upv.bigsea.rfpweb;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import upv.bigsea.rfpweb.model.Route;
import upv.bigsea.rfpweb.model.SchedRouteStop;
import upv.bigsea.rfpweb.model.Shape;
import upv.bigsea.rfpweb.model.Stop;

public class Gtfs {

  protected static final String GET_ROUTES_QUERY = "SELECT route_id, route_short_name, route_long_name, route_type, route_color, route_text_color FROM gtfs_routes ORDER BY (case when route_short_name ~ '^[0-9]+$' THEN lpad(route_short_name, 10, '0') else route_short_name end)";
  protected static final String GET_STOPS_QUERY = "SELECT * FROM view_stops_routes_ids;";
  protected static final String GET_SHAPES_QUERY = "SELECT gtfs_shapes.shape_id, ARRAY_TO_STRING(array_agg(gtfs_shapes.shape_pt_lon || '%1$s' || gtfs_shapes.shape_pt_lat ORDER BY gtfs_shapes.shape_pt_sequence), '%2$s') AS coords FROM gtfs_routes LEFT JOIN gtfs_trips ON gtfs_routes.route_id=gtfs_trips.route_id AND gtfs_routes.route_id=$$%3$s$$ INNER JOIN gtfs_shapes ON gtfs_trips.shape_id=gtfs_shapes.shape_id GROUP BY gtfs_shapes.shape_id";
  protected static final String GET_SCHED_ROUTE_STOP_QUERY = "SELECT DISTINCT trips.shape_id AS shape_id, trips.trip_id AS trip_id, stop_times.arrival_time AS arrival_time, stop_times.stop_sequence AS stop_sequence, stop.stop_id AS stop_id, stop.stop_name AS stop_name FROM gtfs_trips AS trips INNER JOIN gtfs_calendar AS calendar ON calendar.service_id=trips.service_id INNER JOIN gtfs_stop_times AS stop_times ON trips.trip_id=stop_times.trip_id INNER JOIN gtfs_stops AS stop ON stop_times.stop_id=stop.stop_id WHERE trips.route_id=$$%1$s$$ AND calendar.%2$s=1 ORDER BY trips.shape_id,trips.trip_id,stop_times.arrival_time,stop_times.stop_sequence,stop.stop_id;";
  protected static final String GET_SHAPES_QUERY_COORDS_SEP = "#";
  protected static final String QUERY_ARR_SEP = ",";
  protected Params params;

  public Gtfs(Params params) {
    this.params = params;
  }

  public List<Route> getRoutes(String countryCode, String cityCode) throws SQLException, ClassNotFoundException {
    List<Route> routes = new ArrayList<Route>();
    Connection getGtfsDBConn = this.getGtfsDBConn(getDBName(countryCode, cityCode));
    Statement stmt = getGtfsDBConn.createStatement();
    ResultSet rs = stmt.executeQuery(GET_ROUTES_QUERY);
    int uid = 0;
    while (rs.next()) {
      Route r = new Route();
      ++uid;
      String[] startEndStop = { null, null };
      if (rs.getString("route_long_name") != null && rs.getString("route_long_name").length() > 3)
        startEndStop = rs.getString("route_long_name").split("\\s+-\\s+", 2);
      r.setUid(uid);
      r.setRouteId(rs.getString("route_id"));
      r.setRouteShortName(rs.getString("route_short_name"));
      r.setRouteLongName(rs.getString("route_long_name"));
      r.setRouteType(rs.getString("route_type"));
      r.setStartStop(startEndStop[0]);
      if (startEndStop.length == 2)
        r.setEndStop(startEndStop[1]);
      else
        r.setEndStop(null);

      // delete row["route_long_name"];
      if (rs.getString("route_color") == null)
        r.setRouteColor("000000");
      else
        r.setRouteColor(rs.getString("route_color"));
      r.setRouteColor('#' + r.getRouteColor());
      if (rs.getString("route_text_color") == null)
        r.setRouteTextColor("000000");
      else
        r.setRouteTextColor(rs.getString("route_text_color"));
      routes.add(r);
    }
    rs.close();
    stmt.close();
    getGtfsDBConn.close();
    return routes;
  }

  public List<Stop> getStops(String countryCode, String cityCode) throws SQLException, ClassNotFoundException, FileNotFoundException, UnsupportedEncodingException {
    PrintWriter writer1 = new PrintWriter("/tmp/stops.err", "UTF-8");
    writer1.println(countryCode);
    writer1.println(cityCode);
    writer1.close();
    List<Stop> stops = new ArrayList<Stop>();
    Connection getGtfsDBConn = this.getGtfsDBConn(getDBName(countryCode, cityCode));
    Statement stmt = getGtfsDBConn.createStatement();
    ResultSet rs = stmt.executeQuery(GET_STOPS_QUERY);
    int uid = 0;
    while (rs.next()) {
      Stop stop = new Stop();
      ++uid;
      stop.setUid(uid);
      stop.setStopLng(rs.getString("stop_lon"));
      stop.setStopLat(rs.getString("stop_lat"));
      stop.setStopId(rs.getString("stop_id"));
      stop.setStopName(rs.getString("stop_name"));
      String rIds = rs.getString("array_agg");
      
      String []a = rIds.split(QUERY_ARR_SEP);
      for (int idx=0; idx<a.length; ++idx)
      {
        if (a[idx].startsWith("{"))
          a[idx] = a[idx].substring(1, a[idx].length());
        if (a[idx].startsWith("\""))
          a[idx] = a[idx].substring(1, a[idx].length());
        if (a[idx].endsWith("}"))
          a[idx] = a[idx].substring(0, a[idx].length() - 1);
        if (a[idx].endsWith("\""))
          a[idx] = a[idx].substring(0, a[idx].length() - 1);
      }
      stop.setRoutesIds(a);
      stops.add(stop);
    }
    rs.close();
    stmt.close();
    getGtfsDBConn.close();
    return stops;
  }

  public List<Shape> getShapes(String countryCode, String cityCode, String routeId)
      throws SQLException, ClassNotFoundException {
    List<Shape> shapes = new ArrayList<Shape>();
    Connection getGtfsDBConn = this.getGtfsDBConn(getDBName(countryCode, cityCode));
    Statement stmt = getGtfsDBConn.createStatement();
    ResultSet rs = stmt
        .executeQuery(String.format(GET_SHAPES_QUERY, GET_SHAPES_QUERY_COORDS_SEP, QUERY_ARR_SEP, routeId));
    int uid = 0;
    while (rs.next()) {
      ++uid;
      String[] coordsTmp = rs.getString("coords").split(QUERY_ARR_SEP);
      String[][] coords = new String[coordsTmp.length][];
      for (int idxC = 0; idxC < coordsTmp.length; ++idxC) {
        coords[idxC] = coordsTmp[idxC].split(GET_SHAPES_QUERY_COORDS_SEP);
      }
      shapes.add(new Shape("Feature", new Shape.Geometry("LineString", coords),
          new Shape.Properties(rs.getString("shape_id"), uid)));
    }
    rs.close();
    stmt.close();
    getGtfsDBConn.close();
    return shapes;
  }

  public List<SchedRouteStop> getSchedRouteStop(String countryCode, String cityCode, String routeId, String dt,
      String utc) throws SQLException, ClassNotFoundException {
    //List<SchedRouteStop> schedRouteStop = new ArrayList<SchedRouteStop>();
    Connection getGtfsDBConn = this.getGtfsDBConn(getDBName(countryCode, cityCode));
    Statement stmt = getGtfsDBConn.createStatement();
    final Calendar calendar = Calendar.getInstance();
    calendar.setTimeInMillis(Long.parseLong(dt) * 60000);
    // System.out.println(calendar.getDisplayName(Calendar.DAY_OF_WEEK,
    // Calendar.LONG, Locale.US));
    ResultSet rs = stmt.executeQuery(String.format(GET_SCHED_ROUTE_STOP_QUERY, routeId,
        calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.US).toLowerCase()));
    
    
    // Stops should be unique when grouped by by trip ID
    // We also need to group them by shape ID because on the client side
    // we display the results by shape (and for each stop of a shape we list all encountered
    // arrival times from all trips included in that shape)
    // In here, we merge all trips' arrival times for a shape into one array =>
    // each stop for a shape has the arrival times of all trips for that shape
    Map<String, SchedRouteStop> schedShapesByShape = new HashMap<>();    
    while (rs.next()) {
      String shapeId = rs.getString("shape_id");
      //String tripId = rs.getString("trip_id");
      
      SchedRouteStop schedShape = schedShapesByShape.get(shapeId);
      if (schedShape == null)
      {
        schedShape = new SchedRouteStop(0, shapeId);
        schedShapesByShape.put(shapeId, schedShape);
      }      
      
      String aTime = rs.getString("arrival_time");
      aTime = aTime.substring(0, aTime.lastIndexOf(':'));
      schedShape.addStopsIdsNms(0, rs.getString("stop_id"), rs.getString("stop_name"),
          rs.getInt("stop_sequence"), aTime);
    }
    
    // Once everything is added, finalize all scheduled shapes
    List<SchedRouteStop> schedRouteStop = new ArrayList<>(schedShapesByShape.values());
    for (SchedRouteStop schedShape: schedRouteStop)
      schedShape.freeze();
    
    rs.close();
    stmt.close();
    getGtfsDBConn.close();
    return schedRouteStop;
  }

  protected Connection getGtfsDBConn(String dbName) throws SQLException, ClassNotFoundException {
    Class.forName("org.postgresql.Driver");
    
    String url = String.format("jdbc:postgresql://%s:%d/%s", params.getPsqlHost(), params.getPsqlPort(), dbName);
    Properties parameters = new Properties();
    parameters.put("user", params.getPsqlUser());
    parameters.put("password", params.getPsqlPassw());
    return DriverManager.getConnection(url, parameters);
  }

  protected String getDBName(String countryCode, String cityCode) {
    return countryCode + "_" + cityCode;
  }

}
