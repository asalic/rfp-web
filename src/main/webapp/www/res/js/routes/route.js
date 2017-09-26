function RFPWRoute(routeServer)
{
  this.uid = routeServer["uid"];
  this.id = routeServer["routeId"];
  this.shortNm = routeServer["routeShortName"];
  this.longNm = routeServer["routeLongName"];
  this.color = routeServer["routeColor"];
  this.stars = routeServer["stars"];
  this.endStop = routeServer["endStop"];
  this.startStop = routeServer["startStop"];
  this.type = routeServer["routeType"];
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
RFPWRoute.prototype.getLongNm = function() {return this.longNm;}
RFPWRoute.prototype.getPaths = function() {return this.paths;}
RFPWRoute.prototype.getColor = function() {return this.color;}
RFPWRoute.prototype.getDrawnPaths = function() {return this.drawnPaths;}
RFPWRoute.prototype.addDrawnPath = function(path) {this.drawnPaths.push(path);}
RFPWRoute.prototype.clearDrawnPaths = function() {this.drawnPaths = [];}
RFPWRoute.prototype.getType = function() {return this.type;}

RFPWRoute.prototype.getPaths = function() {return this.paths;}
RFPWRoute.prototype.setDrawnPathsGroup = function(dpg)
{this.drawnPathsGroup = dpg;}
RFPWRoute.prototype.getDrawnPathsGroup = function()
{return this.drawnPathsGroup;}
