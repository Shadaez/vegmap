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

VEGMAP.Places = Backbone.Collection.extend({
  model: VEGMAP.Place
});

VEGMAP.markers = [];

VEGMAP.PlaceCollectionView = Backbone.View.extend({
  tagName: "",
  render: function(){
    this.collection.forEach(function(model){
      var view = new VEGMAP.MapWindowView({
        model: model
      });
      view.render();
    });
  }
});

VEGMAP.placesView = VEGMAP.PlaceCollectionView

function populate(location){
  $.post("/places", location).done(function(data){

  });
}

$(ready);

function ready(){
  $('#form').submit(function(e){
    e.preventDefault();
    var loc = $("#loc").val();
    populate(loc);
    $("#search").fadeToggle(200, "swing", function(){$("#loading").fadeToggle();});
  });
}