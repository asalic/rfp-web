package upv.bigsea.rfpweb.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Shape {
  
  public static class Geometry
  {
    @JsonProperty
    protected String type;
    @JsonProperty
    protected String [][]coords;
    
    public Geometry() 
    {
      this(null, null);
    }
    
    public Geometry(String type, String [][]coords) 
    {
      this.type = type;
      this.coords = coords;
    }    
    
    public String getType() {
      return type;
    }
    public void setType(String type) {
      this.type = type;
    }
    public String [][]getCoords() {
      return coords;
    }
    public void setCoords(String [][]coords) {
      this.coords = coords;
    }    
  }
  
  public static class Properties
  {
    @JsonProperty
    protected String id;
    @JsonProperty
    protected int uid;
    
    public Properties()
    {
      this(null, 0);
    }
    
    public Properties(String id, int uid)
    {
      this.id = id;
      this.uid = uid;
    }
    
    public String getId() {
      return id;
    }
    public void setId(String id) {
      this.id = id;
    }
    public int getUid() {
      return uid;
    }
    public void setUid(int uid) {
      this.uid = uid;
    }    
  }
  

  @JsonProperty
  protected String type;
  @JsonProperty
  protected Geometry geometry;
  @JsonProperty
  protected Properties properties;
  
  public Shape()
  {
    this(null, null, null);
  }
  
  public Shape(String type, Geometry geometry, Properties properties)
  {
    this.type = type;
    this.geometry = geometry;
    this.properties = properties;
  }
  
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public Geometry getGeometry() {
    return geometry;
  }
  public void setGeometry(Geometry geometry) {
    this.geometry = geometry;
  }
  public Properties getProperties() {
    return properties;
  }
  public void setProperties(Properties properties) {
    this.properties = properties;
  }
  
  

}
