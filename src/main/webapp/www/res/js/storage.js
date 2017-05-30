function RFPWStorage()
{
  if (Storage !== void(0))
  {
    this.init();
  } else {
    console.log("Not-implemented: Use cookies to store data");
  }
}

RFPWStorage.prototype.getLngIdx = function() {return parseInt(localStorage.getItem("lngIdx"));}
RFPWStorage.prototype.setLngIdx = function(idx) {localStorage.setItem("lngIdx", idx.toString());}

RFPWStorage.prototype.getCityIdx = function() {return parseInt(localStorage.getItem("cityIdx"));}
RFPWStorage.prototype.setCityIdx = function(idx) {localStorage.setItem("cityIdx", idx.toString());}

RFPWStorage.prototype.getCountryIdx = function() {return parseInt(localStorage.getItem("countryIdx"));}
RFPWStorage.prototype.setCountryIdx = function(idx) {localStorage.setItem("countryIdx", idx.toString());}

RFPWStorage.prototype.getDtSel = function() {return parseInt(localStorage.getItem("dtSel"));}
RFPWStorage.prototype.setDtSel = function(dtSel) {localStorage.setItem("dtSel", dtSel.toString());}

RFPWStorage.prototype.getDtCust = function() {return parseInt(localStorage.getItem("dtCust"));}
RFPWStorage.prototype.setDtCust = function(dtCust) {localStorage.setItem("dtCust", dtCust.toString());}

RFPWStorage.prototype.getDtCustUTC = function() {return parseInt(localStorage.getItem("dtCustUTC"));}
RFPWStorage.prototype.setDtCustUTC = function(dtCustUTC) {localStorage.setItem("dtCustUTC", dtCustUTC.toString());}

RFPWStorage.prototype.isAcceptStorageUsr = function() {return localStorage.getItem("acceptStorageUsr") === "true";}
RFPWStorage.prototype.setAcceptStorageUsr = function(acceptStorageUsr) {localStorage.setItem("acceptStorageUsr", acceptStorageUsr.toString());}


RFPWStorage.prototype.reset = function() {localStorage.clear();}
RFPWStorage.prototype.init = function()
{
  //console.log("Use local storage to store data" + localStorage.getItem("lngIdx"));
  if (localStorage.getItem("lngIdx") === null)
    localStorage.setItem("lngIdx", RFPWStorage.DEFAULT_LANGUAGE_IDX);
  if (localStorage.getItem("countryIdx") === null)
    localStorage.setItem("countryIdx", RFPWStorage.DEFAULT_COUNTRY_IDX);
  if (localStorage.getItem("cityIdx") === null)
    localStorage.setItem("cityIdx", RFPWStorage.DEFAULT_CITY_IDX);
  if (localStorage.getItem("dtSel") === null)
    localStorage.setItem("dtSel", RFPWStorage.DEFAULT_DT_SEL);
  if (localStorage.getItem("dtCust") === null)
    localStorage.setItem("dtCust", RFPWStorage.DEFAULT_DT_CUST);
  if (localStorage.getItem("dtCustUTC") === null)
    localStorage.setItem("dtCustUTC", RFPWStorage.DEFAULT_DT_CUST_UTC);
  if (localStorage.getItem("acceptStorageUsr") === null)
    localStorage.setItem("acceptStorageUsr", RFPWStorage.DEFAULT_ACCEPT_STORAGE_USR);
}

RFPWStorage.DEFAULT_LANGUAGE_IDX = "0";
RFPWStorage.DEFAULT_COUNTRY_IDX = "0";
RFPWStorage.DEFAULT_CITY_IDX = "0";
/**
 * Default selection of Application's date time in the More screen;
 * The first radiobuton is selected
 * @type {String}
 */
RFPWStorage.DEFAULT_DT_SEL = "0";
/**
 * Default value of the custom date time picker in miliseconds since 01.01.1970;
 * It is set as 01.01.1970
 * @type {String}
 */
RFPWStorage.DEFAULT_DT_CUST = Date.now().toString();
/**
 * Default value of the UTC time valid when the custom radio button is active;
 * It is set to GMT
 * @type {String}
 */
RFPWStorage.DEFAULT_DT_CUST_UTC = "0";

/**
 * Default value for the user acceptance of the fact that we store data on the
 * local computer and that we transfer information that might be considered
 * personal
 * @type {String}
 */
RFPWStorage.DEFAULT_ACCEPT_STORAGE_USR = "false";
