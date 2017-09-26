/**
 * Holds the Sentiment analysis responses for a certain coord
 * @param serverInstance the instance received form the server
 * @returns
 */
function RFPWSAValue(serverInstance)
{
  this._val = serverInstance["value"];
  this._lat = serverInstance["latitude"];
  this._lng = serverInstance["longitude"];
}

RFPWSAValue.prototype.getVal = function(){ return this._val;}
RFPWSAValue.prototype.getLat = function(){ return this._lat;}
RFPWSAValue.prototype.getLng = function(){ return this._lng;}