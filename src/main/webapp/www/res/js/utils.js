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

RFPWUtils.toValidHTMLId = function(id)
{
  id = btoa(id);
  id = id.replace(/=/g, "-");
  id = id.replace(/\+/g, "_");
  id = id.replace(/\//g, ".");
  return id;
}

RFPWUtils.fromValidHTMLId = function(idHTML)
{
  idHTML = idHTML.replace(/-/g, "=");
  idHTML = idHTML.replace(/_/g, "+");
  idHTML = idHTML.replace(/\./g, "/");
  return atob(idHTML);
}


RFPWUtils.extend = function(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // The constructor property was set wrong, let's fix it
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    console.log("Utils nodeJs");
    module.exports = RFPWUtils;
  }
}
