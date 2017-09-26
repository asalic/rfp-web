function RFPWFavFeedback(favFeedbackObj)
{
  //Init the parent
  RFPWFav.call(this, favFeedbackObj);
  if (favFeedbackObj != null && favFeedbackObj != undefined)
  {
    this.questionsResponses = favFeedbackObj.questionsResponses;
    this.negativeAspects = favFeedbackObj.negativeAspects;
    this.positiveAspects = favFeedbackObj.positiveAspects;
  } else
  {
    this.questionsResponses = null;
    this.negativeAspects = null;
    this.positiveAspects = null;
  }
}


RFPWFavFeedback.prototype.getId = function() {return this.id;}
RFPWFavFeedback.prototype.getType = function() {return this.type;}
RFPWFavFeedback.prototype.getFavId = function() {return this.favId;}
RFPWFavFeedback.prototype.getQuestionsResponses = function() {return this.questionsResponses;}
RFPWFavFeedback.prototype.getNegativeAspects = function() {return this.negativeAspects;}
RFPWFavFeedback.prototype.getPositiveAspects = function() {return this.positiveAspects;}