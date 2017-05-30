function RFPWDateTimeHandler()
{
  //applicationContext.storage.setDtSel(0);
  this._dtSel = applicationContext.storage.getDtSel();
  this._dtCust = applicationContext.storage.getDtCust();
  this._dtCustUTC = applicationContext.storage.getDtCustUTC();
  this._selTimeVal = 0;
  this._dtCustEl = $('#div-more-custom-dt').datetimepicker({
        format: "dd MM yyyy - hh:ii",
        todayBtn: true,
        autoclose: true,
        startDate: "2000-01-01 00:00",
        minuteStep: 1,
        timezone: 'GMT'
    });//$("#div-more-custom-dt").datetimepicker({showClose: true});
  this._dtCustUTCEl = $("#sel-more-custom-dt-utc");
  this._dt = 0;
  /// Fill the UTC box
  var optsUtc = "";
  var utcVal = "";
  for (var val=-12; val<=12; ++val)
  {
    if (val >= 0)
      utcVal = "+" + val;
    else
      utcVal = val;
    optsUtc += RFPWDateTimeHandler.OPT_TIME_UTC.render({val: val, utcVal: utcVal});
  }
  this._dtCustUTCEl.append(optsUtc);
  this._dtCustUTCEl.change($.proxy(this._onDtCustUTCElChg, this));


  this._dtCustEl.on("changeDate", $.proxy(this._onDtCustElChg, this));

  $("input[name=\"rbtn-more-date-time-apps-dt\"]").change($.proxy(this._onDtSelChg, this));
  console.log($("input[name=\"rbtn-more-date-time-apps-dt\"]")[this._dtSel]);
  $($("input[name=\"rbtn-more-date-time-apps-dt\"]")[this._dtSel]).attr("checked", true);
  this._onDtSelChg();
}

/**
 * Returns the number of minutes since 1970-01-01 until the date set in the More
 * section
 * @return {[int]} [description]
 */
RFPWDateTimeHandler.prototype.getDateTimeMinutesUTC = function()
{
  var calcTime = 0;
  var utc = 0;
  if (RFPWDateTimeHandler.OPT_TIME_REG_POS == this._dtSel)
  {

  } else if (RFPWDateTimeHandler.OPT_TIME_DEV_POS == this._dtSel)
  {
    var d = new Date();
    calcTime = Date.now() / 60000;
    utc = -(d.getTimezoneOffset() / 60);
  } else if (RFPWDateTimeHandler.OPT_TIME_CUST_POS == this._dtSel)
  {
    calcTime = this._dtCust / 60000;
    utc = this._dtCustUTC;
  } else {
    console.log("RFPWDateTimeHandler:getDateTimeMinutes: Unable to determine selected ");
  }
  //console.log(this._dtCustEl.data("DateTimePicker").date());
  /// Divided by 60*1000 to transform to minutes
  return {dt: calcTime, utc: utc};
}

RFPWDateTimeHandler.prototype._onDtSelChg = function()
{
  this._dtSel = $('input[name=\"rbtn-more-date-time-apps-dt\"]:checked').index('input[name=\"rbtn-more-date-time-apps-dt\"]')
  applicationContext.storage.setDtSel(this._dtSel);
  //console.log(this._dtSel);
  this._dtSelUpd();
}

RFPWDateTimeHandler.prototype._dtSelUpd = function()
{
  if (RFPWDateTimeHandler.OPT_TIME_CUST_POS == this._dtSel)
  {
    $("#div-more-custom-dt").find('*').attr('disabled', false);
    $("#div-more-custom-dt").find('span').removeClass("spa-rfpw-blocked-dt");
    this._dtCustUTCEl.prop("disabled", false);
    $("#sel-more-custom-dt-utc option[value=" + this._dtCustUTC + "]").prop("selected", true);
    $("#div-more-custom-dt").datetimepicker("update", new Date(this._dtCust));
    //this._dtCustEl.data("datetimepicker").date(new Date(this._dtCust));
  } else {
    $("#div-more-custom-dt").find('*').attr('disabled', true);
    $("#div-more-custom-dt").find('span').addClass("spa-rfpw-blocked-dt");
    this._dtCustUTCEl.prop("disabled", true);
    //this._dtCustEl.data("datetimepicker").clear();

  }

}

RFPWDateTimeHandler.prototype._onDtCustElChg = function()
{
  //console.log(this._dtCustEl.data("DateTimePicker").date());
  this._dtCust = this._dtCustEl.data("datetimepicker").getDate().getTime();
  applicationContext.storage.setDtCust(this._dtCust);
  //console.log(this._dtCust);
}

RFPWDateTimeHandler.prototype._onDtCustUTCElChg = function()
{
  this._dtCustUTC = this._dtCustUTCEl.find("option:selected").val();
  applicationContext.storage.setDtCustUTC(this._dtCustUTC);
  //console.log(this._dtCustUTC);
}


RFPWDateTimeHandler.OPT_TIME_UTC = $.templates("<option value={{:val}}>UTC{{:utcVal}}</option>");

RFPWDateTimeHandler.OPT_TIME_REG_POS = 0;
RFPWDateTimeHandler.OPT_TIME_DEV_POS = 1;
RFPWDateTimeHandler.OPT_TIME_CUST_POS = 2;
