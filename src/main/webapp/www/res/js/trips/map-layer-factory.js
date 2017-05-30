function RFPWMapLayerFactory()
{}

RFPWMapLayerFactory.prototype.createMLAllStops = function(map, layerObj)
{
  var ml = new RFPWMapLayer(RFPWMapLayer.TYPE_ALL_STOPS, map, layerObj);
  ml.setNm("All Stops");
  ml.setRemovable(false);
  ml.toggleLayerVisibility = function()
    {
      var m = ml.getLayerObject();
      ml.setShown(!ml.isShown());
      if (ml.isShown())
        map.addLayer(m);
      else
        map.removeLayer(m);
    }
  ml.remove = function()
    {
    }
  return ml;
}

RFPWMapLayerFactory.prototype.createMLRoutePaths = function(map, layerObj)
{
  var ml = new RFPWMapLayer(RFPWMapLayer.TYPE_ROUTE_PATHS, map, layerObj);
  ml.setNm("Route " + layerObj.getShortNm());
  ml.setRemovable(true);
  ml.toggleLayerVisibility = function()
    {
      ml.setShown(!ml.isShown());
      var dp = ml.getLayerObject().getDrawnPaths();
      for (var idx in dp)
      {
        if (ml.isShown())
          map.addLayer(dp[idx]);
        else
          map.removeLayer(dp[idx]);
      }
    }
  ml.remove = function()
    {
      var dp = ml.getLayerObject().getDrawnPaths();
      for (var idx in dp)
      {
        map.removeLayer(dp[idx]);
        delete dp[idx];
      }
      ml.getLayerObject().clearDrawnPaths();
    }
  return ml;
}
