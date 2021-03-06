var cheerio = require("cheerio");
var fs = require("fs-extra");
var validator = require('html-validator');
var compressor = require('node-minify');
var babel = require("babel-core");
var htmlMin = require("html-minifier").minify;

var argv = require('yargs')
    .usage( "Usage: $0 [-p/--path \"<full path>\"]" )
    //.command( "url", "URL to request", { alias: "url" } )
    //.required( 1, "URL is required" )
    .option( "p", { alias: "path", demand: true, describe:
        "project's root directory", type: "string" } )
    .option( "v", { alias: "appver", demand: true, describe:
        "Application version", type: "string" } )
    .option( "w", { alias: "webserviceroot", demand: true, describe:
        "The root URL of the webservice, i.e. the path that follows the ip/name+port. e.g. if the address is http://localhost:10100/webservice/stops/es/valencia then the root is /webservice", type: "string" } )
    //.help( "?" )
    //.alias( "?", "help" )
    //.example( "$0 https://example.com/api/posts", "Get a list of posts" )
    //.example( "$0 https://example.com/api/posts --post --data \"{ 'title': 'Avast ye!', 'body': 'Thar be a post hyar!'}\"", "Create a new post" )
    .epilog( "Developed by Andy S Alic; Copyright 2016-2017 Universitat Politecnica de Valencia" )
    .argv;


var webserviceRoot = argv.w;
var appVer = argv.v;
var today = new Date();

var appBuild = today.getFullYear() + "." + ("0" + (today.getMonth() + 1)).slice(-2) + "." + ("0" + today.getDate()).slice(-2)  + "." + ("0" + today.getHours()).slice(-2) + "." + ("0" + today.getMinutes()).slice(-2);

var baseDir = argv.p;
// Replace script tags
var indexHTML = cheerio.load(fs.readFileSync(baseDir + "/www/index.html"));
// var tripsHTML = cheerio.load(fs.readFileSync("www/"))
// var linesHTML = cheerio.load(fs.readFileSync("www/"))
// var favsHTML = cheerio.load(fs.readFileSync("www/"))
// var moreHTML = cheerio.load(fs.readFileSync("www/"))
//console.log(indexHTML.text())
//cheerio.each(function(index, el) {

//});//console.log(
var lstMergeScripts = [];

console.log("Analyze the dev index.html");
indexHTML('script, link').filter(function(i, el) {
//console.log("here");
  // this === el
  return cheerio(this).attr("devmoderfp") !== undefined;
}).each(
  function()
  {
    var el = indexHTML(this);
    //console.log(el);
    el.removeAttr("devmoderfp");

    if (el.attr("appendhtml") !== undefined)
    {// Process the html dev marked items
      //console.log(el);
      var fName = el.attr("appendhtml");
      //console.log(fName);
      var parent = indexHTML(this).parent();
      indexHTML(this).remove();
      //parent.text("boom");
      var inHTML = cheerio.load(fs.readFileSync(baseDir + "/" + fName));
      parent.append(inHTML.html());
    } else
    if (el.attr("removetag") !== undefined)
    {// Remove all those scripts tagged for removal ending in "-remove.js"
      //var parent = indexHTML(this).parent();
      indexHTML(this).remove();
    } else
    if (el.attr("cssreplhref") !== undefined)
    {
      el.attr("href", el.attr("cssreplhref"));
      indexHTML(this).removeAttr("cssreplhref");
    } else
    if (el.attr("jsreplsrc") !== undefined)
    {
      el.attr("src", el.attr("jsreplsrc"));
      el.removeAttr("jsreplsrc");
    } else
    if (el.attr("rfpmerge") !== undefined)
    {
      //el.removeAttr("rfpmerge");
      lstMergeScripts.push(indexHTML(this).attr("src"));
      indexHTML(this).remove();
    }
  }
)

console.log("Add link to the final version of the compressed app");
indexHTML("head").append("<script src='res/app.min.js'></script>");

console.log("Create the release structure");
fs.removeSync(baseDir + "/release");
fs.mkdirsSync(baseDir + "/release");
fs.mkdirsSync(baseDir + "/release/res/");

fs.copy(baseDir + "/www/vendors/leaflet/leaflet.css",
  baseDir + "/release/vendors/leaflet/leaflet.css", function(err) {console.log("leaflet.css copied successfully")});
fs.copy(baseDir + "/www/vendors/leaflet/leaflet.js",
  baseDir + "/release/vendors/leaflet/leaflet.js", function(err) {console.log("leaflet.js copied successfully")});
fs.copy(baseDir + "/www/vendors/leaflet/images",
  baseDir + "/release/vendors/leaflet/images", function(err) {console.log("leaflet.css copied successfully")});
fs.copy(baseDir + "/www/vendors/leaflet/marker_cluster/leaflet.markercluster.js",
  baseDir + "/release/vendors/leaflet/marker_cluster/leaflet.markercluster.js", function(err) {console.log("leaflet.markercluster.js copied successfully")});
fs.copy(baseDir + "/www/vendors/leaflet/marker_cluster/MarkerCluster.css",
  baseDir + "/release/vendors/leaflet/marker_cluster/MarkerCluster.css", function(err) {console.log("MarkerCluster.css copied successfully")});
fs.copy(baseDir + "/www/vendors/leaflet/marker_cluster/MarkerCluster.Default.css",
  baseDir + "/release/vendors/leaflet/marker_cluster/MarkerCluster.Default.css", function(err) {console.log("MarkerCluster.Default.css copied successfully")});

fs.copy(baseDir + "/www/vendors/bootstrap3-typeahead.min.js",
  baseDir + "/release/vendors/bootstrap3-typeahead.min.js", function(err) {console.log("bootstrap3-typeahead.min.js copied successfully")});

fs.copy(baseDir + "/www/vendors/leaflet-heat.js",
  baseDir + "/release/vendors/leaflet-heat.js", function(err) {console.log("leaflet-heat.js copied successfully")});

fs.copy(baseDir + "/www/vendors/leaflet-regulargridcluster.js",
    baseDir + "/release/vendors/leaflet-regulargridcluster.js", function(err) {console.log("leaflet-regulargridcluster.js copied successfully")});

fs.copy(baseDir + "/www/vendors/leaflet-regulargridcluster.css",
    baseDir + "/release/vendors/leaflet-regulargridcluster.css", function(err) {console.log("leaflet-regulargridcluster.css copied successfully")});

fs.copy(baseDir + "/www/vendors/jsrender.min.js",
    baseDir + "/release/vendors/jsrender.min.js", function(err) {console.log("jsrender.min.js copied successfully")});

fs.copy(baseDir + "/www/vendors/fonts",
    baseDir + "/release/vendors/fonts", function(err) {console.log("fonts copied successfully")});


fs.copy(baseDir + "/www/vendors/l20n.js",
  baseDir + "/release/vendors/l20n.js", function(err) {console.log("l20n.js copied successfully")});

fs.copy(baseDir + "/www/vendors/bootstrap-datetimepicker",
  baseDir + "/release/vendors/bootstrap-datetimepicker", function(err) {console.log("bootstrap-datetimepicker copied successfully")});

console.log("Copy the languages");
fs.copy(baseDir + "/www/res/l20n", baseDir + "/release/res/l20n",
  function(err) {console.log("Languages copied successfully")});

console.log("Minify the index");
var indexHTMLTxt = htmlMin(indexHTML.html(),
  {
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: false,
    removeComments: true
  }
);

console.log("Write the final version of the app HTML");
fs.writeFile(baseDir + "/release/index.html", indexHTMLTxt);

console.log("Minify the css");
compressor.minify({
  compressor: 'csso',
  input: baseDir + "/www/res/css/app.css",
  output: baseDir + "/release/res/app.min.css",
  sync: true,
  options: {
    restructureOff: true // turns structure minimization off
  },
  callback: function (err, min)
    {
      console.log("Css file minified");
    }
});

console.log("Merge all js files into one big release &Convert to ECMAScript 5");
for (var idx=lstMergeScripts.length-1; idx>=0; --idx)
{
  fs.appendFileSync(baseDir + "/release/res/app.js.tmp",
    babel.transformFileSync(baseDir + "/www/" + lstMergeScripts[idx], {"presets": ["es2015"], "babelrc": "false"}).code);
}

var appConfTxt = fs.readFileSync(baseDir + "/release/res/app.js.tmp").toString();
appConfTxt = appConfTxt.replace(/this\.appVer\s*=\s*".*";/, "this.appVer = \"" + appVer + "\";");
appConfTxt = appConfTxt.replace(/this\.appBuild\s*=\s*".*";/, "this.appBuild = \"" + appBuild + "\";");
appConfTxt = appConfTxt.replace(/this\.webserviceRoot\s*=\s*".*";/, "this.webserviceRoot = \"" + webserviceRoot + "\";");
//appConfTxt = "var gl = 1;" + appConfTxt;
fs.writeFileSync(baseDir + "/release/res/app.js.tmp", appConfTxt);
//fs.writeFileSync(baseDir + "/release/res/app.min.js", appConfTxt);

console.log("Compress");
compressor.minify({
  compressor: 'uglifyjs',
  input: baseDir + "/release/res/app.js.tmp",
  output: baseDir + "/release/res/app.min.js",
  sync: true,
  callback: function (err, min)
    {
      fs.removeSync(baseDir + "/release/res/app.js.tmp");
      console.log("app.js minified");
    }
});

//console.log(indexHTML.html());

//   Before anything else, validate the HTML
// var options = {
//   format: 'text',
//   data: indexHTML.html()
// }
//
// validator(options, function (error, data) {
//   if (error) {
//     throw error;
//   }
//
//     console.log(data)
//   })
