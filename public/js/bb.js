geocoder = new google.maps.Geocoder();

/*
google.maps.event.addListener(map, 'bounds_changed', function(){
	//do stuff
}); */

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
	model: VEGMAP.Place,
	url: "/places"
});

VEGMAP.mapWindowView = Backbone.View.extend({
	tagName: "",
	className: "",
	template: "", //fix
	render: function(){
		var attributes = this.model.toJSON();
		var address = attributes.address1 + attributes.address2 + ", " + attributes.city+ ", " + attributes.region + attributes.zip;
		var infowindow = new google.maps.InfoWindow({

		});

		var marker = new google.maps.Marker({
			position: codeAddress(address) //update for callback
		});
	},
});

VEGMAP.Router = Backbone.Router.extend({
	routes: {
		"fart":""
	}

})

var map;

function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(0, 0)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
};

function codeAddress(address, callback) { //address = address1 address2, city, region zip
	geocoder.geocode( { 'address': address}, callback);
}

function pan(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
  	var LatLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
  	map.panTo(LatLng);
  }
}

function get(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
  	LatLng = {latitude: results[0].geometry.location.lat(),
  	longitude: results[0].geometry.location.lng()}
  	$.post("/places", LatLng, function(data){
  		console.log(data);
  	});
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

$(ready);

function ready(){
	$('#form').submit(function(e){
		e.preventDefault();
		var loc = $("#loc").val();
		codeAddress(loc, pan);
		$("article").fadeToggle();
		//loading spin
		codeAddress(loc, get);
		//load API
		//fade out/in
		$("#start").fadeToggle();
		$("#map-canvas").css("visibility", "visible");
	});
}