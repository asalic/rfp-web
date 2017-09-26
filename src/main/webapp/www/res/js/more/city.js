function RFPWCity(cityInstance)
{
  this.id = cityInstance.id;
  this.name = cityInstance.name;
  this.code = cityInstance.code;
  this.lat = cityInstance.lat;
  this.lng = cityInstance.lng;
  this.portBRRoute = cityInstance.portBRRoute;
  this.hostBRRoute = cityInstance.hostBRRoute;
  this.hasBRRoute = cityInstance.hasBRRoute;
  this.portBRTrips = cityInstance.portBRTrips;
  this.hostBRTrips = cityInstance.hostBRTrips;
  this.hasBRTrips = cityInstance.hasBRTrips;
  this.portSentimentAnalysis = cityInstance.portSentimentAnalysis;
  this.hostSentimentAnalysis = cityInstance.hostSentimentAnalysis;
  this.hasSentimentAnalysis = cityInstance.hasSentimentAnalysis;
  this.portTrafficJam = cityInstance.portTrafficJam;
  this.hostTrafficJam = cityInstance.hostTrafficJam;
  this.hasTrafficJam = cityInstance.hasTrafficJam;
}

RFPWCity.prototype.getId = function() {return this.id;}
RFPWCity.prototype.getName = function() {return this.name;}
RFPWCity.prototype.getCode = function() {return this.code;}
RFPWCity.prototype.getLat = function() {return this.lat;}
RFPWCity.prototype.getLng = function() {return this.lng;}
RFPWCity.prototype.getPortBRRoute = function() {return this.portBRRoute;}
RFPWCity.prototype.getHostBRRoute = function() {return this.hostBRRoute;}
RFPWCity.prototype.getHasBRRoute = function() {return this.hasBRRoute;}
RFPWCity.prototype.getPortBRTrips = function() {return this.portBRTrips;}
RFPWCity.prototype.getHostBRTrips = function() {return this.hostBRTrips;}
RFPWCity.prototype.getHasBRTrips = function() {return this.hasBRTrips;}
RFPWCity.prototype.getPortSentimentAnalysis = function() {return this.portSentimentAnalysis;}
RFPWCity.prototype.getHostSentimentAnalysis = function() {return this.hostSentimentAnalysis;}
RFPWCity.prototype.getHasSentimentAnalysis = function() {return this.hasSentimentAnalysis;}
RFPWCity.prototype.getPortTrafficJam = function() {return this.portTrafficJam;}
RFPWCity.prototype.getHostTrafficJam = function() {return this.hostTrafficJam;}
RFPWCity.prototype.getHasTrafficJam = function() {return this.hasTrafficJam;}
