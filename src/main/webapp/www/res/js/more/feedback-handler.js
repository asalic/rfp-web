function RFPWFeedbackHandler()
{
  this._dlgJQ = $("#dlg-more-feedback");
  $("#btn-more-feedback").on("click",
      $.proxy(this._showDlgFeedback, this));
  
  $("#dlg-more-feedback-form").on("submit", 
      $.proxy(this._submitFeedback, this));
  // Is the feedback already set?
  this._hasFeedback = false;
//  
//  this._star1JQ = this._dlgJQ.find("dlg-more-feedback-stars-1-2");
//  this._star2JQ = this._dlgJQ.find("dlg-more-feedback-stars-2-2");
//  this._star3JQ = this._dlgJQ.find("dlg-more-feedback-stars-3-2");
//  this._star4JQ = this._dlgJQ.find("dlg-more-feedback-stars-4-2");
//  this._star5JQ = this._dlgJQ.find("dlg-more-feedback-stars-5-2");
}

RFPWFeedbackHandler.prototype.enableFeedback = function()
{
  console.log("enable feedback");
  $("#btn-more-feedback").removeClass("spa-rfpw-diplay-none");
}

RFPWFeedbackHandler.prototype._showDlgFeedback = function()
{
  this._dlgJQ.modal();
  this._reqGetFavFeedback();
}

RFPWFeedbackHandler.prototype._getFavFeedback = function()
{
  var questionsResponses = Array.apply(null, Array(RFPWFeedbackHandler.NUM_QUESTIONS)).map(function () {});
  var negativeAspects = Array.apply(null, Array(RFPWFeedbackHandler.NUM_NEG)).map(function () {});
  var positiveAspects = Array.apply(null, Array(RFPWFeedbackHandler.NUM_POS)).map(function () {});
  
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_QUESTIONS; ++idxQ)
  {
    var questionJQ = $("input:radio[name=\"" + RFPWFeedbackHandler.RADIO_Q_NAME_ID_TEMPL  + idxQ + "\"]:checked");
    if (questionJQ.length > 0)
      questionsResponses[idxQ] = parseInt(questionJQ.val());
    else
      questionsResponses[idxQ] = RFPWFeedbackHandler.ID_NA;
  }
  
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_POS; ++idxQ)
  {
    positiveAspects[idxQ] = $("input[id=" + RFPWFeedbackHandler.INP_POS_TEMPL  + idxQ + "]").val();
  }
  
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_NEG; ++idxQ)
  {
    negativeAspects[idxQ] =  $("input[id=" + RFPWFeedbackHandler.INP_NEG_TEMPL  + idxQ + "]").val();
  }

  var favFeedback = new RFPWFavFeedback(
      {
        "id": 0,
        "type": RFPWFav.TYPEFEEDBACK,
        "cityId": RFPWFav.ID_CITY_FEEDBACK,
        "countryId": RFPWFav.ID_COUNTRY_FEEDBACK,
        "favId": RFPWFav.ID_FAV_FEEDBACK,
        "questionsResponses": questionsResponses,
        "negativeAspects": negativeAspects,
        "positiveAspects": positiveAspects
      }
  );
  
  return favFeedback;
}

RFPWFeedbackHandler.prototype._setFavFeedback = function(favFeedback)
{
  var questionsAnswers = favFeedback.getQuestionsResponses();
  var negativeAspects = favFeedback.getNegativeAspects();
  var positiveAspects = favFeedback.getPositiveAspects();
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_QUESTIONS; ++idxQ)    
    $("input[id=" + RFPWFeedbackHandler.RADIO_Q_NAME_ID_TEMPL  + idxQ + "-" + questionsAnswers[idxQ] + "]").prop("checked", true);
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_POS; ++idxQ)
     $("input[id=" + RFPWFeedbackHandler.INP_POS_TEMPL  + idxQ + "]").val(positiveAspects[idxQ]);  
  for (var idxQ=0; idxQ<RFPWFeedbackHandler.NUM_NEG; ++idxQ)
    $("input[id=" + RFPWFeedbackHandler.INP_NEG_TEMPL  + idxQ + "]").val(negativeAspects[idxQ]);
}

RFPWFeedbackHandler.prototype._reqGetFavFeedback = function()
{
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
      city_id: RFPWFav.ID_CITY_FEEDBACK,
      country_id: RFPWFav.ID_CITY_FEEDBACK,
      token: applicationContext.moreHandler.getUserAuth().getUserToken()};

    $.ajax({
      url: applicationContext.conf.authBaseAddr + applicationContext.conf.authReadFavorite,
      data: data,
      type: "post",
      success: $.proxy(this._sucGetFavFeedback, this),
      error: $.proxy(this._errGetFavFeedback, this)
    });
}

RFPWFeedbackHandler.prototype._sucGetFavFeedback = function(data)
{
  $("#spn-more-feedback-err-req").addClass("spa-rfpw-diplay-none");
  if (data.hasOwnProperty("success"))
  {    
    var fb = new RFPWFavFeedback(JSON.parse(data["data"]));
    this._setFavFeedback(fb);
    this._hasFeedback = true;
  }
  $("#dlg-more-feedback-form").removeClass("spa-rfpw-diplay-none");
}

RFPWFeedbackHandler.prototype._errGetFavFeedback = function(request,
    textStatus, errorThrown)
{
  console.log("Error getting feedback: " + request.responseText);
  $("#spn-more-feedback-err-req").removeClass("spa-rfpw-diplay-none");
  $("#dlg-more-feedback-form").addClass("spa-rfpw-diplay-none");
}

RFPWFeedbackHandler.prototype._submitFeedback = function(event)
{
  event.preventDefault(); // cancel the actual submit
  // If the feedback is already there, we must eliminate it firstly
  if (this._hasFeedback)
    this._reqDelFeedback();
  else
  {
    var favFeedback = this._getFavFeedback();
    //console.log(favFeedback);
    this._reqSubmitFeedback(favFeedback);
  }
}


RFPWFeedbackHandler.prototype._reqDelFeedback = function()
{
  console.log("Req del feedback");
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
      token: applicationContext.moreHandler.getUserAuth().getUserToken(),
      item_id: RFPWFav.ID_FAV_FEEDBACK
      };
  console.log(data);
    $.ajax({
      url: applicationContext.conf.authBaseAddr + applicationContext.conf.authDeleteFavorite,
      data: data,
      type: "POST",
      success: $.proxy(this._sucDelFeedback, this),
      error: $.proxy(this._errDelFeedback, this)
    });
}

RFPWFeedbackHandler.prototype._sucDelFeedback = function(data)
{
  if (data.hasOwnProperty("success")) // Now call the submit
  {
    console.log("Success del feedback");
    var favFeedback = this._getFavFeedback();
    this._reqSubmitFeedback(favFeedback);  
  } else
  {
    this._dlgJQ.modal('hide');
    console.log("Error removing feedback, not submiting");
  }
}

RFPWFeedbackHandler.prototype._errDelFeedback = function(request,
    textStatus, errorThrown)
{
  this._dlgJQ.modal('hide');
  console.log("Unable to submit feedback: " + request.responseText);
}

RFPWFeedbackHandler.prototype._reqSubmitFeedback = function(favFeedback)
{
  console.log(applicationContext.moreHandler.getUserAuth().getUserToken());
  console.log("reqSubmitFeedback");
  var data = {username: applicationContext.moreHandler.getUserAuth().getUser().getUserName(),
      city_id: RFPWFav.ID_CITY_FEEDBACK ,
      country_id: RFPWFav.ID_COUNTRY_FEEDBACK,
      token: applicationContext.moreHandler.getUserAuth().getUserToken(),
      item_id: RFPWFav.ID_FAV_FEEDBACK,
      item_type: RFPWFav.TYPEFEEDBACK,
      favorite_id: RFPWFav.ID_FAV_FEEDBACK,
      data: JSON.stringify(favFeedback)};
  console.log(data);
    $.ajax({
      url: applicationContext.conf.authBaseAddr + applicationContext.conf.authCreateFavorite,
      data: data,
      type: "POST",
      success: $.proxy(this._sucSubmitFeedback, this),
      error: $.proxy(this._errSubmitFeedback, this)
    });
}

RFPWFeedbackHandler.prototype._sucSubmitFeedback = function()
{
  this._dlgJQ.modal('hide');
  console.log("Success submiting feedback");
  
}

RFPWFeedbackHandler.prototype._errSubmitFeedback = function(request,
    textStatus, errorThrown)
{
  this._dlgJQ.modal('hide');
  console.log("Unable to submit feedback: " + request.responseText);
}

RFPWFeedbackHandler.ID_NA = 0;
RFPWFeedbackHandler.NUM_QUESTIONS = 19;
RFPWFeedbackHandler.NUM_POS = 3;
RFPWFeedbackHandler.NUM_NEG = 3;
RFPWFeedbackHandler.RADIO_Q_NAME_ID_TEMPL = "inp-more-feedback-q";
RFPWFeedbackHandler.INP_NEG_TEMPL = "inp-more-feedback-neg";
RFPWFeedbackHandler.INP_POS_TEMPL = "inp-more-feedback-pos";
