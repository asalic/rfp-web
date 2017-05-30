function RFPWUser(userJSON)
{
  this._lName = userJSON["lname"];
  this._userName = userJSON["username"];
  this._fName = userJSON["fname"];
  this._email = userJSON["email"];
}

RFPWUser.prototype.getLName = function() {return this._lName;}
RFPWUser.prototype.getUserName = function() {return this._userName;}
RFPWUser.prototype.getFName = function() {return this._fName;}
RFPWUser.prototype.getEmail = function() {return this._email;}
