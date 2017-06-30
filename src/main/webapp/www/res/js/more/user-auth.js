function RFPWUserAuth()
{
  this._user = null;
  this._authenticated = false;
  this._userToken = "";

  this._actionTriggered = RFPWUserAuth.ACTION_UNK;
  $("#btn-more-signin").on("click tap", $.proxy(this._onSignIn, this));
  $("#btn-more-signout").on("click tap", $.proxy(this._onSignOut, this));
  $("#btn-more-signrevoke").on("click tap", $.proxy(this._onSignRevoke, this));
 
}

RFPWUserAuth.prototype.tokenAuthenticate = function(callbSucc, callbErr)
{
  this._userToken = applicationContext.storage.getUsrAuthToken();
  if (this._userToken.length > 0)
  {
    // We don't store user details on the device, get the details if the token exists
    
    this._reqTokenAuthenticate(this._userToken, callbSucc, callbErr);
  } else
  {
    // User not authenticated (or token expired)
    this._user = null; // The Sign-In object.
    this._authenticated = false;
    this._updUI();
    callbErr();
  }
}

RFPWUserAuth.prototype._reqTokenAuthenticate = function(userToken, callbSucc, callbErr)
{
  applicationContext.asyncReq($.proxy(this._sucTokenAuthenticate, this, callbSucc),
      $.proxy(this._errRetrieveRegions, this, callbErr),
      "auth/userdetails/",
      [applicationContext.storage.getUsrAuthToken()]
    );
}

RFPWUserAuth.prototype._sucTokenAuthenticate = function(data, callbSucc)
{
  this._user = new RFPWUser(
      {
        "lName": applicationContext.storage.getUsrLName(),
        "fName": applicationContext.storage.getUsrLName(),
        "userName": data["userName"],
        "email": "none"
      }
    );

  this._authenticated = true;
}

RFPWUserAuth.prototype._onSignRevoke = function()
{
  this._actionTriggered = RFPWUserAuth.ACTION_REVOKE;

}

RFPWUserAuth.prototype._onSignIn = function() {
  var win = window.open(applicationContext.conf.authBaseAddr, "_blank",
    'height=600,width=400');
  this._actionTriggered = RFPWUserAuth.ACTION_SIGN_IN;
}

RFPWUserAuth.prototype._onSignInReturn = function(answerData)
{
  console.log(answerData);
  if (answerData["success"] === true && answerData["cancelled"] === false)
  {
    this._user = new RFPWUser(answerData["user_info"]["user"]);
    this._userToken = answerData["user_info"]["user_token"];
    this._authenticated = true;
    applicationContext.storage.setUsrAuthToken(answerData["user_info"]["user_token"]);
    applicationContext.storage.setUsrLName(answerData["user_info"]["user"]["lname"]);
    applicationContext.storage.setUsrFName(answerData["user_info"]["user"]["fname"]);
    applicationContext.reloadApp();
    //applicationContext.favsHandler.onUserSignIn();
  }
  //this._updUI();
}

RFPWUserAuth.prototype._onSignOut = function()
{
  this._actionTriggered = RFPWUserAuth.ACTION_SIGN_OUT;
  this._user = null;
  this._userToken = null;
  this._authenticated = false;
  applicationContext.storage.setUsrAuthToken("");
  applicationContext.storage.setUsrLName("");
  applicationContext.storage.setUsrFName("");
  applicationContext.reloadApp();
  //this._updUI();
  
}

RFPWUserAuth.prototype._updUI = function()
{
  if (!this._authenticated)
  {
    $("#btn-more-signrevoke").addClass("spa-rfpw-diplay-none");
    $("#btn-more-signout").addClass("spa-rfpw-diplay-none");
    $("#btn-more-signin").removeClass("spa-rfpw-diplay-none");
    $("#spn-more-login-anon").removeClass("spa-rfpw-diplay-none");
    $("#spn-more-login-usr").addClass("spa-rfpw-diplay-none");
  } else
  {
    //$("#btn-more-signrevoke").removeClass("spa-rfpw-diplay-none");
    $("#btn-more-signout").removeClass("spa-rfpw-diplay-none");
    $("#btn-more-signin").addClass("spa-rfpw-diplay-none");
    $("#spn-more-login-anon").addClass("spa-rfpw-diplay-none");
    $("#spn-more-login-usr").removeClass("spa-rfpw-diplay-none");
    $("#spn-more-login-usr").text("");
    $("#spn-more-login-usr").append(this._user.getFName() + "&nbsp;" +
      this._user.getLName() + "&nbsp;(" + this._user.getUserName() + ")");
  }
}

RFPWUserAuth.prototype.handlePopupResult = function(answerData, action)
{
  //console.log(action);
  action = this._actionTriggered;
  switch (action)
  {
    case RFPWUserAuth.ACTION_SIGN_IN:
      this._onSignInReturn(answerData);
      break;
    case RFPWUserAuth.ACTION_SIGN_OUT:
    break;
    case RFPWUserAuth.ACTION_REVOKE:
    break;
    default:
    console.log("Unknwon action for " + answerData);
  }

}

RFPWUserAuth.prototype.isUserAuth = function() {return this._authenticated;}
RFPWUserAuth.prototype.getUserToken = function() {return this._userToken;}

RFPWUserAuth.ACTION_UNK = 104;
RFPWUserAuth.ACTION_SIGN_IN = 105;
RFPWUserAuth.ACTION_SIGN_OUT = 106;
RFPWUserAuth.ACTION_REVOKE = 107;
