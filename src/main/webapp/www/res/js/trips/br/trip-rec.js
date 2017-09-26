function RFPWTripRec(obj)
{
	this.id = obj["id"];
	this.duration = obj["duration"];
  //this._fromStopName = obj["fromStopName"];
  //this._toStopName = obj["toStopName"];
	this.segmentRecs = [];
	this.drawnPaths = [];
  this.drawnPathsGroup = [];
	var tmp = obj["segmentRecs"];
	for (var idx=0; idx<tmp.length; ++idx)
	{
		this.segmentRecs.push(new RFPWSegmentRec(tmp[idx]));
	}
	
	if (this.segmentRecs.length == 0)
	{
	  this.fromStopName = null;
    this.toStopName = null;
	  
	} else if (this.segmentRecs.length == 1)
	{
	  this.fromStopName = this.segmentRecs[0].getStopFrom();
    this.toStopName = this.segmentRecs[0].getStopTo();
	} else
	{
	  this.fromStopName = this.segmentRecs[0].getStopFrom();
    this.toStopName = this.segmentRecs[this.segmentRecs.length-1].getStopTo();
	}
}

RFPWTripRec.prototype.getId = function() {return this.id;}
RFPWTripRec.prototype.getDuration = function() {return this.duration;}
RFPWTripRec.prototype.setFromStopName = function(s) {this.fromStopName = s;}
RFPWTripRec.prototype.setToStopName = function(s) {this.toStopName = s;}
RFPWTripRec.prototype.getFromStopName = function() {return this.fromStopName;}
RFPWTripRec.prototype.getToStopName = function() {return this.toStopName;}
RFPWTripRec.prototype.getSegmentRecs = function() {return this.segmentRecs;}
RFPWTripRec.prototype.addDrawnPath = function(p) {this.drawnPaths.push(p);}
RFPWTripRec.prototype.getDrawnPaths = function() {return this.drawnPaths;}
RFPWTripRec.prototype.setDrawnPathsGroup = function(d) {this.drawnPathsGroup = d;}
RFPWTripRec.prototype.getDrawnPathsGroup = function() {return this.drawnPathsGroup;}
RFPWTripRec.prototype.clearDrawnPaths = function() {this.drawnPaths = [];}

RFPWTripRec.clearDrawnPathsS = function(o) {o.drawnPaths = [];}
RFPWTripRec.clearSegmentRecsS = function(o) {o.segmentRecs = [];}

RFPWTripRec.prototype.getHTMLRepresentation = function() {
  
  var HTMLShortRepresentation = this.getHTMLShortRepresentation();
  var displayFav = "";
  if (!applicationContext.moreHandler.getUserAuth().isUserAuth())
    displayFav = "spa-rfpw-diplay-none";
  return RFPWTripRec.LST_ITM_TRIP_REC.render(
    {
      "id": this.id,
      "segments": HTMLShortRepresentation,
      "detailedTrip": this._genDetailedTripView(),
      "durationWhole": Math.round(this.duration / 60),
      "displayFav": displayFav
    }
  );  
}

RFPWTripRec.prototype.getHTMLShortRepresentation = function()
{
  var segments = "";
  for (var idx=0; idx<this.segmentRecs.length - 1; ++idx)
  {
    
    segments += "<span>" + this._getIconHTMLSegment(this.segmentRecs[idx]) + "</span><i class=\"glyphicon glyphicon-menu-right\"></i>";
    
  }
  segments += "<span>" + this._getIconHTMLSegment(this.segmentRecs[this.segmentRecs.length - 1]) + "</span>";
  return segments;
}

//RFPWTripRec.prototype._showOnMap

RFPWTripRec.prototype._getIconHTMLSegment = function(segment)
{
  var routeIcon;
  if (segment.getType() != 8)
    routeIcon = applicationContext.mapHandler.genRouteIcon(
        0, segment.getId(),
        segment.getRouteShortName(),
        "#" + segment.getRouteColor(),
        applicationContext.routesHandler.getRouteTypeStrByType(segment.getType()));
  else
    routeIcon = segment.getRouteShortName();
  return routeIcon;
}

RFPWTripRec.prototype._genDetailedTripView = function()
{
	var detailedView = "<span>";
	for (var idx=0; idx<this.segmentRecs.length; ++idx)
	{
	  var borderStyle = "";
	  if (applicationContext.routesHandler.isRouteWalking(this.segmentRecs[idx].getType()))
	    borderStyle = " border-left-style: dotted; "
		detailedView += RFPWTripRec.LST_ITM_TRIP_REC_DETAILS.render(
		    {
		      "id": this.id,
		      "renderedStop": RFPWTripRec.LST_ITM_TRIP_REC_DETAILS_STOP.render(
  		          {
  		            "stopName": this.segmentRecs[idx].getStopFrom()
  		          }
  		      ),
		      "renderedBusIco": this._getIconHTMLSegment(this.segmentRecs[idx]),
		      "durationSeg": Math.round(this.segmentRecs[idx].getDuration()/60) + " mins",
          "distanceSeg": this.segmentRecs[idx].getDistance() + " m",
          "routeColor": "#" + this.segmentRecs[idx].getRouteColor(),
          "borderStyle": borderStyle
		    }
		  );
		//console.log("Stop from: "  + this.segmentRecs[idx].getStopFrom());
	}
	detailedView += RFPWTripRec.LST_ITM_TRIP_REC_DETAILS_STOP.render(
      {
        "stopName": this.getToStopName()
      }
    ) + "</span>";
	//console.log(detailedView);
	return detailedView;
}

RFPWTripRec.LST_ITM_TRIP_REC_DETAILS =
  $.templates(
      "{{:renderedStop}}<br>\
        <div style=\"border-left: 1em solid; {{:borderStyle}} border-left-color: {{:routeColor}}; padding: 1em;\">\
          {{:renderedBusIco}}<br>\
          <span>{{:durationSeg}}</span><br>\
          <span>{{:distanceSeg}}</span><br>\
        </div>\
        <i class=\"glyphicon glyphicon-chevron-down\" style=\"color: {{:routeColor}}\"></i><br>"
  );

RFPWTripRec.LST_ITM_TRIP_REC_DETAILS_STOP =
  $.templates(
      "<span>\
        <i class=\"glyphicon glyphicon-record\"></i><span style=\"padding-left: 1em;\">{{:stopName}}</span>\
      </span>"
  );

RFPWTripRec.LST_ITM_TRIP_REC = 
	$.templates("<li id=\"li-trips-br-trips-rec-{{:id}}\" class=\"list-group-item\">\
	<div class=\"panel panel-default\">\
		<div data-toggle=\"collapse\"\
			data-target=\"#collapse-trips-br-trips-rec-{{:id}}\" class=\"panel-heading\">\
			<span class=\"spa-rfpw-margin-br-info\">{{:segments}}</span>\
			<div class=\"pull-right\">\
				<span class=\"glyphicon glyphicon-time spa-rfpw-margin-br-info\"></span><span style=\"padding-left: 0.5em;\">{{:durationWhole}} mins</span>\
			</div>\
		</div>\
		<div id=\"collapse-trips-br-trips-rec-{{:id}}\" class=\"panel-collapse collapse\">\
			<div class=\"panel-body\">\
					<span>{{:detailedTrip}}</span><br>\
			    <div class=\"pull-left\">\
				    <button id=\"btn-br-rfpw-trip-rec-fav-{{:id}}\" \
				      class=\"btn btn-default pull-right spa-rfpw-hover {{:displayFav}} glyphicon glyphicon-heart-empty\">\
				      		<div class=\"spa-rfpw-tooltip\" data-l10n-id=\"btn-br-rfpw-trip-rec-fav\">\
				    </button> \
      	    <button id=\"btn-br-rfpw-trip-rec-{{:id}}\" \
              class=\"btn btn-default  spa-rfpw-hover glyphicon glyphicon-picture\">\
              <div class=\"spa-rfpw-tooltip\" data-l10n-id=\"btn-br-rfpw-trip-rec\">\
	          </button> \
			    </div>\
			</div><!--body-->\
		</div><!--collapse-->\
	</div><!--panel-->\
    </li>");
//	$.templates("<li id=\"li-br-rfpw-trip-rec-{{:id}}\" class=\"list-group-item\">\
//    <span class=\"spa-rfpw-margin-br-info\">{{:segments}}</span>\
//    <div class=\"pull-right\">\
//	    <button id=\"btn-br-rfpw-trip-rec-{{:id}}\" \
//	    	data-l10n-id=\"dlgtripsbrtripsshowmap\" \
//	      class=\"btn btn-default pull-right\"></button> \
//    </div>\
//    </li>");