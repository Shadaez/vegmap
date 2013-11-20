
var path = require("path"),
    express = require("express"),
    _ = require("underscore");

var app = express()
            .set("views", path.join(__dirname, "views"))
            .set("view engine", "hbs")
            .use(express.static(path.join(__dirname, "public")))  
            .use(express.bodyParser());

app.get("/", function(req, res) {

});

app.get("/places", function(req, res) {
  //send api stuff after formatting it the way backbone wants it
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("The server is now listening on port %s", port);