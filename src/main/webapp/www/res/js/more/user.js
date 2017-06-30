function RFPWUser(userJSON)
{
  this._lName = userJSON["lName"];
  this._userName = userJSON["userName"];
  this._fName = userJSON["fName"];
  this._email = userJSON["email"];
}

RFPWUser.prototype.getLName = function() {return this._lName;}
RFPWUser.prototype.getUserName = function() {return this._userName;}
RFPWUser.prototype.getFName = function() {return this._fName;}
RFPWUser.prototype.getEmail = function() {return this._email;}
