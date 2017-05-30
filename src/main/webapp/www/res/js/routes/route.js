"use strict";
function RFPWRoute(routeServer)
{
  this.uid = routeServer["uid"];
  this.id = routeServer["route_id"];
  this.shortNm = routeServer["route_short_name"];
  this.longNm = routeServer["route_long_name"];
  this.color = routeServer["route_color"];
  this.stars = routeServer["stars"];
  this.endStop = routeServer["end_stop"];
  this.startStop = routeServer["start_stop"];
  this.type = routeServer["route_type"];
  this.crowdedness = routeServer["crowdedness"];
  this.responsivness = routeServer["responsivness"];
  this.conservation = routeServer["conservation"];
  this.paths = [];
  this.schedule = null;
  this.drawnPaths = [];
  this.drawnPathsGroup = null;
}

RFPWRoute.prototype.setPaths = function(data)
{
  for (var idxD=0; idxD<data.length; ++idxD)
  {
    //console.log(data[idxD]);
    this.paths.push(data[idxD]);
  }
}

RFPWRoute.prototype.getUId = function() {return this.uid;}
RFPWRoute.prototype.getId = function() {return this.id;}
RFPWRoute.prototype.getShortNm = function() {return this.shortNm;}
RFPWRoute.prototype.getPaths = function() {return this.paths;}
RFPWRoute.prototype.getColor = function() {return this.color;}
RFPWRoute.prototype.getDrawnPaths = function() {return this.drawnPaths;}
RFPWRoute.prototype.addDrawnPath = function(path) {this.drawnPaths.push(path);}
RFPWRoute.prototype.clearDrawnPaths = function() {this.drawnPaths = [];}

RFPWRoute.prototype.setDrawnPathsGroup = function(dpg)
{this.drawnPathsGroup = dpg;}
RFPWRoute.prototype.getDrawnPathsGroup = function()
{return this.drawnPathsGroup;}
