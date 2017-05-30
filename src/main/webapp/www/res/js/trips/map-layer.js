RFPWMapLayer.TYPE_ALL_STOPS = 10;
RFPWMapLayer.TYPE_ROUTE_PATHS = 11;
RFPWMapLayer.TYPE_TRIP = 12;

function RFPWMapLayer(mltype, map, layerObj)
{
  this.nm = "";
  this.removable = false;
  this.map = map;
  this.shown = true;
  this.layerObj = layerObj;
  this.mltype = mltype;
  this.toggleLayerVisibility =
    function(){console.log("MapLayer::toggleLayerVisibility: Not implemented");};
  this.remove =
    function()
    {
      if (this.removable)
        console.log("MapLayer::remove: Not implemented");
      else
        console.log("MapLayer::remove: Non-removable map layer");
    };
  // if (layerObj instanceof MarkerClusterer)
  //   this.mltype = MapLayer.TYPE_ALL_STOPS;
  // else if (layerObj instanceof google.maps.Polyline)
  //   this.mltype = MapLayer.TYPE_ROUTE;
  // else
  //   console.log("Unable to identify object type in MapLayer");
}

RFPWMapLayer.prototype.isShown = function() {return this.shown;}
RFPWMapLayer.prototype.setShown = function(shown) {this.shown = shown;}

RFPWMapLayer.prototype.getNm = function() {return this.nm;}
RFPWMapLayer.prototype.setNm = function(nm) {this.nm = nm;}

RFPWMapLayer.prototype.isRemovable = function() {return this.removable;}
RFPWMapLayer.prototype.setRemovable = function(r) {this.removable = r;}

RFPWMapLayer.prototype.getLayerObject = function() {return this.layerObj;}
