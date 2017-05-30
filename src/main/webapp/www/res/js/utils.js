function RFPWUtils()
{

}

RFPWUtils.fixedEncodeURIComponent = function(str)
{
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

RFPWUtils.strA2H = function(string)
{
  return RFPWUtils.fixedEncodeURIComponent(string);
}

RFPWUtils.strH2A = function(string)
{
  return decodeURIComponent(string);
}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    console.log("Utils nodeJs");
    module.exports = RFPWUtils;
  }
}
