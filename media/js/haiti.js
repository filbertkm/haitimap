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

	var haitiStore = new GeoExt.data.LayerStore({
		map: Haiti.map,
		layers: Haiti.map.layers
	});

	var legend = new GeoExt.LegendPanel({
		renderTo: 'sidebar',
		bodyStyle: 'padding:.5em;background:#eee;',
		layerStore: haitiStore
	});
	this.sidebar.add(legend);

/*
	var layerRoot = new Ext.tree.TreeNode({
		text: "All Layers",
		expanded: true
	});
	var layer_groups = [];

	layerRoot.appendChild(new GeoExt.tree.BaseLayerContainer({
		text: 'Base Layers',
		map: map,
		draggable: false,
		expanded: true
	}));

	var layerTree = new Ext.tree.TreePanel({
		title: '',
		id: 'map_lt',
		enableDD: true,
		root: layerRoot,
		rootVisible: true,
		autoScroll: true
	});

	this.sidebar.add(layerTree);
*/
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
        html: '<a href="/about/">About</a> | <a href="/contact/">Contact</a>'
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
    OpenLayers.ProxyHost = "proxy.cgi?url=";

    var options = {
        units: 'm',
        maxResolution: 156543.0339,
        numZoomLevels: 18,
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
    	controls: [
		new OpenLayers.Control.Scale(),
		new OpenLayers.Control.PanZoomBar(),
		new OpenLayers.Control.LayerSwitcher(),
		new OpenLayers.Control.Attribution()
	]
    };

    var map = new OpenLayers.Map('main', options);
    
    Haiti.map = map;

    var osm = new OpenLayers.Layer.OSM()
    var haiti_best = new OpenLayers.Layer.XYZ("Satellite/Aerial Imagery",
        "http://hypercube.telascience.org/tiles/1.0.0/haiti-best-900913/${z}/${x}/${y}.jpg",
        {
            buffer:0,
            visibility: true, 
	    linkId:'haitibest'
        }
    );

    var wfsLayer = new OpenLayers.Layer.WFS( 
	"Roads",
	"http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi",
	{ typename: "cw:PLACES" }
    );

    var states = new OpenLayers.Layer.WFS( 
	"States",
	"http://sigma.openplans.org/geoserver/ows",
	{ typename: 'topp:states' } 
    );

    map.addLayers([osm, haiti_best, states]);

    Layout.setup();
});
