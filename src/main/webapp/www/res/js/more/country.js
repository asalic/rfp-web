
function RFPWCountry(countryInstance)
{
  this.id = countryInstance.id;
  this.name = countryInstance.name;
  this.code = countryInstance.code;
  this.cities = [];
  this.citiesByCode = Object.create(null);
  for (var idxC=0; idxC<countryInstance.cities.length; ++idxC)
  {
    this.cities.push(new RFPWCity(countryInstance.cities[idxC]));
    this.citiesByCode[this.cities[idxC].getCode()] = this.cities[idxC];
  }
}

RFPWCountry.prototype.getId = function() {return this.id;}
RFPWCountry.prototype.getName = function() {return this.name;}
RFPWCountry.prototype.getCode = function() {return this.code;}
RFPWCountry.prototype.getCities = function() {return this.cities;}
RFPWCountry.prototype.getCityByCode = function(c)
{
  if (this.citiesByCode.hasOwnProperty(c))
    return this.citiesByCode[c];
  else
    return null;
}
