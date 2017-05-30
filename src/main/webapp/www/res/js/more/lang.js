function RFPWLang(name, code, country)
{
  this.name = name;
  this.code = code;
  this.countryCode = country;
}

RFPWLang.prototype.getLocaleStr = function()
{
  return this.code + "-" + this.countryCode;
}
