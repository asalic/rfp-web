
function RFPWCountry(countryInstance)
{
  this._id = countryInstance.id;
  this._name = countryInstance.name;
  this._code = countryInstance.code;
  this._cities = [];
  this._citiesByCode = Object.create(null);
  for (var idxC=0; idxC<countryInstance.cities.length; ++idxC)
  {
    this._cities.push(new RFPWCity(countryInstance.cities[idxC]));
    this._citiesByCode[this._cities[idxC].getCode()] = this._cities[idxC];
  }
}

RFPWCountry.prototype.getId = function() {return this._id;}
RFPWCountry.prototype.getName = function() {return this._name;}
RFPWCountry.prototype.getCode = function() {return this._code;}
RFPWCountry.prototype.getCities = function() {return this._cities;}
RFPWCountry.prototype.getCityByCode = function(c)
{
  if (this._citiesByCode.hasOwnProperty(c))
    return this._citiesByCode[c];
  else
    return null;
}
