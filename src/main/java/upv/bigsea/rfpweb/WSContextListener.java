package upv.bigsea.rfpweb;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import upv.bigsea.rfpweb.model.Regions;
 
@WebListener("application context listener")
public class WSContextListener implements ServletContextListener {
  
  private Logger logger;
  

  protected static Regions regions;
  protected static Params params;
  protected static Gtfs gtfs;
  protected static BestRecommender bestRecommender;
  protected static OTPTrips otpTrips;
 
    /**
     * Initialize log4j when the application is being started,
     * along with params, regions gtfs web service, best recommender
     * web service, and OTP web service
     */
    @Override
    public void contextInitialized(ServletContextEvent event) {
        // initialize log4j here
        ServletContext context = event.getServletContext();
        String log4jConfigFile = context.getInitParameter("log4j-config-location");
        String fullPath = context.getRealPath("") + File.separator + log4jConfigFile;
         
        PropertyConfigurator.configure(fullPath);
        logger = Logger.getLogger(WSContextListener.class);
        String error = "";
        try {
          params = new Params(); 

          logger.info(params.toString());
          regions = new Regions(params);
          //ClassLoader classLoader = MainWS.class.getClassLoader();
         
          gtfs = new Gtfs(params);
          bestRecommender = new BestRecommender(params, regions);  
          otpTrips = new OTPTrips(params, regions);
          logger.info("Context init done");  
          
        } catch (JsonGenerationException e) {
          logger.error(Arrays.toString(e.getStackTrace()));
        } catch (JsonMappingException e) {
          logger.error(Arrays.toString(e.getStackTrace()));
        } catch (IOException e) {
          logger.error(Arrays.toString(e.getStackTrace()));
        } catch (NumberFormatException e)
        {
          logger.error(Arrays.toString(e.getStackTrace()));
        } catch (Exception e)
        {
          logger.error(Arrays.toString(e.getStackTrace()));
        }
    }
     
    @Override
    public void contextDestroyed(ServletContextEvent event) {
        // do nothing
    }  
    
    public static Regions getRegions()
    {
      return regions;
    }
    
    public static Params getParams()
    {
      return params;
    }
    
    public static Gtfs getGtfs()
    {
      return gtfs;
    }
    
    public static BestRecommender getBestRecommender()
    {
      return bestRecommender;
    }
    
    public static OTPTrips getOTPTrips()
    {
      return otpTrips;
    }
    
}