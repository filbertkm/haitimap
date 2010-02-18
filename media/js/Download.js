DownloadControl = OpenLayers.Class(OpenLayers.Control, {
	initialize: function() {
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.handler = new OpenLayers.Handler.Click(this,
			{ 'click': this.onClick, stopClicks: true, stopDown: true});
	},
	onClick: function(evt) {
		alert('click');
		var bbox = Haiti.map.getExtent().transform(
			new OpenLayers.Projection("EPSG:900913"),
			new OpenLayers.Projection("EPSG:4326")
		);
		alert(bbox.toString());
	}
});
