var http = require('http');
var path = require("path"),
    _ = require("underscore"),
    $ = require("jquery"),
    express = require("express");


var app = express()
            .set("views", path.join(__dirname, "views"))
            .set("view engine", "hbs")
            .use(express.static(path.join(__dirname, "public")))  
            .use(express.bodyParser());

app.get("/");

app.get("/places/:addr", function(req, res) {
  //send api stuff after formatting it the way backbone wants it
  var addr = req.param("addr")
  var URI = "http://www.vegguide.org/search/by-address/" + addr;
  $.get(URI, function(response){
    var entries = [];
    _.each(response.entries, function(entry){
      var address = '';
      var entry_stripped = {
        name: entry.name,
        short_description: entry.short_description,
        price_range: entry.price_range,
        veg_level_description: entry.veg_level_description,
        website: entry.website,
        phone: entry.phone,
      };
      if(entry.address1){
        address += entry.address1;
      }
      if(entry.address2){
        address += " " + entry.address2;
      }
      if(entry.city){
        address += ", " + entry.city;
      }
      if(entry.region){
        address += ", " + entry.region;
      }
      if(entry.postal_code){
        address += " " + entry.postal_code;
      }

      entry_stripped.address = address;

      entry_stripped.images = [];
      if(entry.images){
        var images = entry.images;
        _.each(images, function(image_list){
          _.each(image_list.files, function(image){
            entry_stripped.images.push(image.uri);
          });
        });
      }
      entries.push(entry_stripped);
    });
    res.send(JSON.stringify(entries));
  });
  
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("The server is now listening on port %s", port);