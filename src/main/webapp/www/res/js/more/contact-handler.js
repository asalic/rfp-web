function RFPWContactHandler()
{
}

RFPWContactHandler.prototype.init = function()
{
  if (applicationContext.moreHandler.getUserAuth().isUserAuth())
  {
    this._reqContactDetails();
  }
}

RFPWContactHandler.prototype._reqContactDetails = function()
{
  applicationContext.asyncReq($.proxy(this._sucContactDetails, this),
      $.proxy(this._errContactDetails, this),
      "contact_details",
      [applicationContext.moreHandler.getUserAuth().getUserToken()]
    );
}

RFPWContactHandler.prototype._sucContactDetails = function(contactDetails)
{
  console.log(contactDetails);
  
  $("#btn-more-contact-us").removeClass("spa-rfpw-diplay-none");
  $("#btn-more-contact-us").on("click", $.proxy(this._onSendEmail, this, contactDetails));
}

RFPWContactHandler.prototype._errContactDetails = function(request,
    textStatus, errorThrown)
{
  console.log("Unable to load contact details: " + request.responseText);
}

RFPWContactHandler.prototype._onSendEmail = function(contactDetails)
{
  var u = applicationContext.moreHandler.getUserAuth().getUser();
  var eb = contactDetails["data"]["emailBody"];
  eb = eb.replace(contactDetails["data"]["USERNAME_FIELD"], u.getUserName());
  eb = eb.replace(contactDetails["data"]["EMAIL_FIELD"], u.getEmail());
  eb = eb.replace(contactDetails["data"]["FNAME_FIELD"], u.getFName());
  eb = eb.replace(contactDetails["data"]["LNAME_FIELD"], u.getLName());
  var emailFormat = contactDetails["data"]["emailAddr"] 
    + "?reply-to=" + applicationContext.strA2H(contactDetails["data"]["emailReplyTo"])
    + "&subject=" + applicationContext.strA2H(contactDetails["data"]["emailSubject"])
    + "&body=" + applicationContext.strA2H(eb);
  $("#btn-more-contact-us").attr("href", "mailto:" + emailFormat);
}

//function RFPWContactHandler()
//{
//  console.log("Show contact");
//  this._dlgJQ = $("#dlg-more-contact");
//  this._inpTtl = $("#dlg-more-contact").find("input");
//  this._txtBody = $("#dlg-more-contact").find("textarea");
//  $("#btn-more-contact-us").on("click",
//      $.proxy(this._showDlgContact, this));
//  $("#btn-more-contact-us-submit").on("click",
//      $.proxy(this._reqContact, this));
//}
//
//RFPWContactHandler.prototype._showDlgContact = function()
//{
//  console.log("Show contact");
//  this._dlgJQ.modal();
//}
//
//RFPWContactHandler.prototype._reqContact = function()
//{
//  $.ajax({
//    url: applicationContext.conf.webserviceRoot + '/contact',
//    beforeSend: function(xhrObj){
//      xhrObj.setRequestHeader("Content-Type","application/json");
//      xhrObj.setRequestHeader("Accept","application/json");
//  },
//    data:JSON.stringify(
//      {
//        userToken: applicationContext.moreHandler.getUserAuth().getUserToken(),
//        title: this._inpTtl.val(),
//        body: this._txtBody.val()
//      }),
//    type: "post",
//    dataType: "json",
//    contentType: "application/json;charset=utf-8",
//    success: $.proxy(this._sucContact, this),
//    error: $.proxy(this._errContact, this)
//  });
//}
//
//RFPWContactHandler.prototype._sucContact = function(data)
//{
//  console.log(data);
//}
//
//RFPWContactHandler.prototype._errContact = function(request,
//    textStatus, errorThrown)
//{
//  console.log("Unable to post contact. Error: " +
//  request.responseText);
//}