geocoder = new google.maps.Geocoder();

google.maps.event.addListener(map, 'bounds_changed', function(){

});

function codeAddress(address) { //address = address1 address2, city, region zip
	geocoder.geocode( { 'address': address}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
		    return results[0].geometry.location;
		  }
	});
}

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
			position: codeAddress(address);

		});
	},
});

VEGMAP.Router = Backbone.Router.extend({
	routes: {
		"":""
	}

})