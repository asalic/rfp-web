function RFPWLocalization(selId)
{
  this.lngs = [];
  this.genLngs();
  this.selLngJQuery = $("#" + selId);
  console.log(selId);
  this.selLngJQuery.on("change", $.proxy(this.onLocaleChange, this));
  this.populateLngSel();
  this.onLocaleChange();
}

RFPWLocalization.prototype.populateLngSel = function()
{
  for (var idx=0; idx<this.lngs.length; ++idx)
  {
    this.selLngJQuery.append("<option value=\"" + idx + "\" >" + this.lngs[idx].name +
      "</option>");
  }
  this.selLngJQuery.val(applicationContext.storage.getLngIdx());

}

RFPWLocalization.prototype.genLngs = function()
{
  this.lngs.push(new RFPWLang("English", "en", "US"));
  this.lngs.push(new RFPWLang("Español", "es", "ES"));
  this.lngs.push(new RFPWLang("Português", "pt", "BR"));
}

RFPWLocalization.prototype.onLocaleChange = function()
{
  console.log(this.selLngJQuery.val());
  this.currentLng = this.lngs[this.selLngJQuery.val()];
  applicationContext.storage.setLngIdx(this.selLngJQuery.val());
  document.l10n.requestLanguages([this.currentLng.getLocaleStr()]);
}
