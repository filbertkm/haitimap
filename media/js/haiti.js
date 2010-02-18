var Haiti = { };
var Layout = { };

function setMapCenter() {
    if (!Haiti.map.getCenter() || Haiti.map.getCenter().lon == 0) {
        Haiti.map.setCenter(new OpenLayers.LonLat(-72.2, 19.0).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")),9);
    }                  
}

Layout = {
    dir: 'ltr',
    lang: 'en', 
    setup: function() {
        Ext.get("sidebar").update('');
        Ext.get("header").update("");
        Ext.get("footer").update("");

	var mapPanel = new GeoExt.MapPanel({
	        renderTo: 'main',
	        title: "Map",
	        map: Haiti.map,
		center: new OpenLayers.LonLat(-72.2, 19.0).transform(
			new OpenLayers.Projection("EPSG:4326"),
			new OpenLayers.Projection("EPSG:900913")
		),
		zoom: 9,	
		border: false
	});
	this.main.add(mapPanel);

	var download = new DownloadControl();
	var layerToolbar = new Ext.Toolbar({
		items: [
			new GeoExt.Action({
				text: 'Download',
				control: download,
				map: Haiti.map,
				toggleGroup: "draw",
				allowDepress: true,
				tooltip: "Download data",
				group: "draw"
			})
		]
	});

	var shpData = [
		[ 'buildings', 'shp' ],
		[ 'natural', 'shp' ],
		[ 'places', 'shp' ],
		[ 'points', 'shp' ],
		[ 'roads', 'shp' ],
		[ 'waterways', 'shp' ]
	];

	var shpStore = new Ext.data.ArrayStore({
		fields: [
			{ name: 'layer' },
			{ name: 'format' }
		]
	});
	shpStore.loadData(shpData);

	var downloadHtml = '<ul>';

	shpStore.each(function(record) {
		downloadHtml += "<li><a href='data/" 
			+ Ext.util.Format.capitalize(record.data['layer']) + ".shp'>" 
			+ Ext.util.Format.capitalize(record.data['layer']) + "</a></li>";
	});
	
	downloadHtml += '</ul>';
	
	var downloadPanel = new Ext.form.FormPanel({
		title: 'Downloads',
		id: 'downloadpanel',
		bodyStyle: 'padding: .5em;',
	});

	var downloadForm = [{
		id: 'downloadform',
		bodyStyle: 'padding:.3em .6em .3em .3em;',
		border: false,
		items: [{
			xtype: 'fieldset',
			title: '',
			id: 'downloadfield',
			labelWidth: 20,
			border: false,
			items: 
			[{
				xtype: 'radiogroup',
				id: 'downloadgroup',
				columns: 1,
				width: 150,
				title: '',
				border: false,
				bodyStyle: 'padding-top: .2m;',
				items: [{
					boxLabel: 'Buildings',
					name: 'datalayer',
					inputValue: 'buildings'
				}, {
					boxLabel: 'Natural',
					name: 'datalayer',
					inputValue: 'natural'
				}, {
					boxLabel: 'Places',
					name: 'datalayer',
					inputValue: 'places'
				}, {
					boxLabel: 'Roads',
					name: 'datalayer',
					inputValue: 'roads'
				}, {
					boxLabel: 'Waterways',
					name: 'datalayer',
					inputValue: 'waterways'
				}]
			}]
		}],
		buttons: [{
			text: 'Select',
			handler: function() {
				var bounds = Haiti.map.getExtent().transform(
					new OpenLayers.Projection("EPSG:900913"),					
					new OpenLayers.Projection("EPSG:4326")
				).toBBOX();
				var layerName = Ext.getCmp('downloadgroup').getValue().inputValue;
				var request = OpenLayers.Request.GET({
					url: "http://www.haitimapguide.org/cgi-bin/download.cgi?layer=",
					params: { bbox: bounds, layer: layerName },
					success: function(request) {
						resultPanel = new Ext.Panel({
							id: 'requestResults',
							html : request.responseText,
							title : ''
						});
						Layout.sidebar.add(resultPanel);
					},
					failure: function(request) {
					}
				});
				var xmlhttp = OpenLayers.Request.issue(request);	
			}
		}]
	}];

	var layerRoot = new Ext.tree.TreeNode({
	    text: 'All Layers',
	    expanded: true
	});
	layerRoot.appendChild(new GeoExt.tree.BaseLayerContainer({
	    text: 'Base Layers',
	    map: this.map,
	    draggable: false,
	    expanded: true
	}));

        var layerTree = new Ext.tree.TreePanel({
            title: '',
            id: 'map_lt',
            enableDD: true,
            root: layerRoot,
            rootVisible: false,
            autoScroll: false,
            border: false,
	    bodyStyle: 'margin-bottom: 1em;'
//	    tbar: layerToolbar
        });
	this.sidebar.add(layerTree);
	downloadPanel.add(downloadForm);
	this.sidebar.add(downloadPanel);

        this.viewport = new Ext.Viewport({
            layout: 'border',
            items: [
                this.header,
                this.main,
                this.sidebar,
                this.footer
            ]
       })                                          
    },
    footer: new Ext.Panel({
        region: 'south',
        el: 'footer',
        bodyStyle: 'background: #3D3D53;border:none;',
        html: '<a href="about.html">About</a> | <a href="contact.html">Contact</a>'
    }),
    header: new Ext.Panel({
        region: 'north',
        el: 'header',
        border: false,
        html: '<h1>Haiti Map Data Dashboard</h1>'
    }),
    main: new Ext.Panel({
	region: 'center',
	title: "",
	layout: 'fit',
	bodyStyle: 'background: #eee;'
    }),
    sidebar: new Ext.Panel({
	region: 'west',
	el: 'sidebar',
	title: 'Map Layers',
        width: 300,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        margins: '0 0 0 5'
    })
};

Ext.onReady(function() {

    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
    OpenLayers.ProxyHost = "http://haitimapguide.org/cgi-bin/proxy.cgi?url=";

    var options = {
        units: 'm',
        maxResolution: 156543.0339,
        numZoomLevels: 20,
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
    	controls: [
		new OpenLayers.Control.Navigation(),
		new OpenLayers.Control.Scale(),
		new OpenLayers.Control.PanZoomBar(),
		new OpenLayers.Control.Attribution()
	]
    };

    var map = new OpenLayers.Map('main', options);
    
    Haiti.map = map;

    var osm = new OpenLayers.Layer.OSM()

    map.addLayers([osm]);

    Layout.setup();
});
