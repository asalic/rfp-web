package upv.bigsea.rfpweb;

import java.util.List;

import upv.bigsea.rfpweb.model.Route;

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

}
