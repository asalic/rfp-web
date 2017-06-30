package upv.bigsea.rfpweb;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import upv.bigsea.rfpweb.model.Route;
import upv.bigsea.rfpweb.model.StopRouteRec;

public class BestRecommender {
  
  protected Params params;
  
  public BestRecommender(Params params)
  {
    this.params = params;
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
  
  public List<StopRouteRec> getStopRouteRecs(String countryCode,
      String cityCode,
      String stopID,
      String routeShortName,
      String dateTime,
      String utc) {
    
    List<StopRouteRec> result = new ArrayList<>();
    
    return result;
  }

}
