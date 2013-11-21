var http = require('http');
var path = require("path"),
    _ = require("underscore"),
    $ = require("jquery-cli");


var app = express()
            .set("views", path.join(__dirname, "views"))
            .set("view engine", "hbs")
            .use(express.static(path.join(__dirname, "public")))  
            .use(express.bodyParser());

app.get("/");

app.post("/places", function(req, res) {
  //send api stuff after formatting it the way backbone wants it
  var position = req.body.latitude + ',' + req.body.longitude;
  var URI = "http://www.vegguide.org/search/by-lat-long/" + position;
  $.get(URI, function(response){
    console.log(response);
    var entries = [];
    _.each(response.entries, function(entry){
      var address = '';
      var entry_stripped = {
        name: entry.name,
        long_description: entry.long_description.text/html,
        short_description: entry.short_description,
        price_range: entry.price_range,
        veg_level_description: entry.veg_level_description,
        phone: phone,
        website: website,
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

      entry.images = [];
      _.each(entry.images.files, function(image){
        entry_stripped.images.append(image.uri);
      });
      console.log(entries);
      entries.push(entry_stripped);
    });
    res.send(JSON.stringify(entries));
  });
  
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("The server is now listening on port %s", port);

/*model
name
images
long_description
short_description
price_range
veg_level_description
address
    {{address1}}<br>
    {{address2}}<br>
    {{city}}, {{region}} {{postal_code}}<br>
    {{country}}
hours
  {{if hours}}
    {{each hours}}
      {{each hours}}
        <p>{{hours}}</p>
      {{/each}}
      {{each days}}
        <p>{{day}}</p>
      {{/each}}
    {{/each}}
  {{/if}}ls
  

phone
website */