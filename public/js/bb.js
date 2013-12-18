var map;

function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(0, 0)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
};

google.maps.event.addDomListener(window, 'load', initialize);

geocoder = new google.maps.Geocoder();


var VEGMAP = window.VEGMAP = {}; 

VEGMAP.Place = Backbone.Model.extend({
  defaults: {
    name: "",
    images: "",
    short_description: "",
    long_description: "",
    price_range: "",
    veg_level_description: "",
    address: "",
    hours: "",
    phone: "",
    website: ""
  }
});

VEGMAP.markers = [];


VEGMAP.MapWindowView = Backbone.View.extend({
  template:
    "<h3>{{name}}</h3>"+
    "{{#if image}}"+
    "  <img src='{{image}}'></img>"+
    "{{/if}}"+
    "<p>{{veg_level_description}}</p>"+/*
    "{{if long_description}}"+
    "  {{long_description}}"+
    "{{/if}}"+
    "  <p>{{short_description}}</p>"+
    "{{/unless}}"+*/
    "{{#if price_range}}"+
    "  <p>{{price_range}}</p>"+
    "{{/if}}"+
    "{{#if address}}"+
    "  <p>"+
    "    {{address}}"+
    "  </p>"+
    "{{/if}}"+
    "{{#if phone}}"+
    "  <p>{{phone}}<p>"+
    "{{/if}}"+
    "{{#if website}}"+
    "  <a href='{{website}}'>{{website}}</a>"+
    "{{/if}}",
  render: function(){
  var template = Handlebars.compile(this.template);
  images = this.model.get("images");
  if(images[0]){
  	this.model.set({image: images[0]});
	}
  var html = template(this.model.toJSON());
  this.marker(html);

  },
  marker: function(html){
    var that = this;
    //html goes to infobox
    //make marker
    this.marker = new google.maps.Marker({
      title: this.name,
      map: map
    });
    //make infobox
    this.infowindow = new google.maps.InfoWindow({
      content: html
    });
    //tie the two together via click event
    google.maps.event.addListener(this.marker, 'click', function(){
      that.infowindow.open(map,that.marker);
    });
    //set marker position to geocode (this.model.address)
    function geocode(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          var LatLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          that.marker.setPosition(LatLng);
        }
    };
    geocoder.geocode( { 'address': this.model.get('address')}, geocode);
  }
});


VEGMAP.PlaceCollectionView = Backbone.View.extend({
  render: function(){
    this.collection.forEach(function(marker){
      view = new VEGMAP.MapWindowView({
        model: marker
      });
      view.render();
    });
  }
});

VEGMAP.Router = Backbone.Router.extend({
  routes:{
    "place/:query":"place",
    //"place-bylatlng/:query":"place2"
  },
  place: function(query){
    //pan to query
    geocoder.geocode( { 'address': query}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          var LatLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          map.panTo(LatLng);
        } else {
          console.log(status);
        }
    });
    //hide search
    $(ready);
    function ready(){
    $("#search").fadeOut(function(){
    	$("#loading").fadeIn();
    });
    //show start 
    $("#start").fadeIn();
    //show loading
    
    }

    VEGMAP.Places = Backbone.Collection.extend({
      model: VEGMAP.Place,
      url: "places/" + query
    });
    VEGMAP.places = new VEGMAP.Places();
    //hide search
    VEGMAP.places.fetch({
      success: function(){
        VEGMAP.collectionView = new VEGMAP.PlaceCollectionView({collection: VEGMAP.places});
        VEGMAP.collectionView.render();
        //hide loading screen
        $("#loading").fadeOut();
        //hide start
        $("#start").fadeOut();
      }
    });
  }/*,
  place2: function(query){
    //hide search
    $(ready);
    function ready(){
    $("#search").fadeOut(function(){
    	$("#loading").fadeIn();
    });
    //show start 
    $("#start").fadeIn();
    //show loading
    
    }

    VEGMAP.Places = Backbone.Collection.extend({
      model: VEGMAP.Place,
      url: "places/" + query
    });
    VEGMAP.places = new VEGMAP.Places();
    //hide search
    VEGMAP.places.fetch({
      success: function(){
        VEGMAP.collectionView = new VEGMAP.PlaceCollectionView({collection: VEGMAP.places});
        VEGMAP.collectionView.render();
        //hide loading screen
        $("#loading").fadeOut();
        //hide start
        $("#start").fadeOut();
      }
    });
  }*/
})

VEGMAP.router = new VEGMAP.Router();
Backbone.history.start({root: ""});

/*function populate(location){
  var loc = {address: location};
  console.log(loc);
  $.post("/places", loc).done(function(data){
    VEGMAP.places = new VEGMAP.Places(JSON.parse(data));});
}*/

$(ready);

function ready(){
  $('#form').submit(function(e){
    e.preventDefault();
    var loc = $("#loc").val();
    VEGMAP.router.navigate("place/" + loc, {trigger: true, replace: true});
  });
}
/*
google.maps.event.addListener(map, "bounds_changed", function(){
	var loc = map.getCenter();
	VEGMAP.router.navigate("place-bylatlng/" + loc, {trigger: true}
});*/