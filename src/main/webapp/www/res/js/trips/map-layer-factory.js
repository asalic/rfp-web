function RFPWMapLayerFactory()
{
  this._mlCount = 0;
}

RFPWMapLayerFactory.prototype.createMLAllStops = function(map, layerObj)
{
  var ml = new RFPWMapLayer(this._mlCount, RFPWMapLayer.TYPE_ALL_STOPS, map, layerObj);
  this._mlCount += 1;
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
    map.removeLayer(ml.getLayerObject());
    }
  return ml;
}

RFPWMapLayerFactory.prototype.createMLSentimentAnalysis = function(map, layerObj)
{
  var ml = new RFPWMapLayer(this._mlCount, RFPWMapLayer.TYPE_SENTIMENT_ANALYSIS, map, layerObj);
  this._mlCount += 1;
  ml.setNm("Sentiment Analysis");
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
    map.removeLayer(ml.getLayerObject());
    }
  return ml;
}

RFPWMapLayerFactory.prototype.createMLTrafficJam = function(map, layerObj)
{
  var ml = new RFPWMapLayer(this._mlCount, RFPWMapLayer.TYPE_TRAFFIC_JAM, map, layerObj);
  this._mlCount += 1;
  ml.setNm("Traffic jam");
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
    map.removeLayer(ml.getLayerObject());
    }
  return ml;
}

RFPWMapLayerFactory.prototype.createMLRoutePaths = function(map, layerObj)
{
  var ml = new RFPWMapLayer(this._mlCount, RFPWMapLayer.TYPE_ROUTE_PATHS, map, layerObj);
  this._mlCount += 1;
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

RFPWMapLayerFactory.prototype.createMLBRTripRecs = function(map, layerObj)
{
  var ml = new RFPWMapLayer(this._mlCount, RFPWMapLayer.TYPE_ROUTE_PATHS, map, layerObj);
  this._mlCount += 1;
  ml.setNm("Trip "+ layerObj.getFromStopName() + " - " + layerObj.getToStopName());
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
