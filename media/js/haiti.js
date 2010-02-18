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

	var layerRoot = new Ext.tree.TreeNode({
	    text: "All Layers",
	    expanded: true
	});
	layerRoot.appendChild(new GeoExt.tree.BaseLayerContainer({
	    text: "Base Layers",
	    map: this.map,
	    draggable: false,
	    expanded: true
	}));

	var layer_groups = Haiti.layer_groups;

	for (var i=0; i<layer_groups.length; i+=1) {
		var myStore = new GeoExt.data.LayerStore({
			map: Haiti.map,
			initDir: GeoExt.data.LayerStore.MAP_TO_STORE|GeoExt.data.LayerStore.STORE_TO_MAP,
			layers: layer_groups[i]["layers"]
		});
 		layerRoot.appendChild(new GeoExt.tree.LayerContainer({
		    text: layer_groups[i]["name"],
		    layerStore: myStore,
	            draggable: false,
		    expanded: true,
	            loader: new GeoExt.tree.LayerLoader({
			layers: layer_groups[i]["layers"],
			filter: function(record) {
				var layer = record.get("layer");
				var layers = this.layers;
				return (!layer.isBaseLayer);
			}
		    })
		}));
	}

        var layerTree = new Ext.tree.TreePanel({
            title: '',
            id: 'map_lt',
            enableDD: true,
            root: layerRoot,
            rootVisible: false,
            autoScroll: true,
            border: false,
	    tbar: layerToolbar
        });
	this.sidebar.add(layerTree);

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
    var haiti_best = new OpenLayers.Layer.XYZ("Satellite/Aerial Imagery",
        "http://hypercube.telascience.org/tiles/1.0.0/haiti-best-900913/${z}/${x}/${y}.jpg",
        {
            buffer:0,
            visibility: true, 
	    linkId:'haitibest'
        }
    );

    var vector_layers = [];

    var places = new OpenLayers.Layer.WFS(
	"Places",
	"http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi?CONFIG=haiti_vgi&DATASTORE=vgi&",
	{ typename: 'cw:PLACES' },
	{
		typename: 'PLACES',
		projection: new OpenLayers.Projection("EPSG:4326"),
		styleMap: new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
			{
				fillOpacity: 1,
				fillColor: "blue",
				pointRadius: 4 
			},
			OpenLayers.Feature.Vector.style["default"])
		)	
	}
    );
    vector_layers.push(places);

    var roads = new OpenLayers.Layer.WFS(
        "Roads",
        "http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi?CONFIG=haiti_vgi&DATASTORE=vgi&",
        { typename: 'cw:ROADS' },
        {
                typename: 'ROADS',
                projection: new OpenLayers.Projection("EPSG:4326"),
        }
    );
    vector_layers.push(roads);

    var hospitals = new OpenLayers.Layer.WFS(
        "Hospitals",
        "http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi?CONFIG=haiti_vgi&DATASTORE=vgi&",
        { typename: 'cw:EmergencyMedicalCenter' },
        {
                typename: 'EmergencyMedicalCenter',
                projection: new OpenLayers.Projection("EPSG:4326"),
                styleMap: new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
                        {
                                fillOpacity: 1,
                                fillColor: "red",
                                pointRadius: 4
                        },
                        OpenLayers.Feature.Vector.style["default"])
                )
        }
    );
    vector_layers.push(hospitals);
    
    var layer_groups = [];
    layer_groups.push({ name: 'Vector', layers: vector_layers, expanded: true });
    Haiti.layer_groups = layer_groups;

    map.addLayers([osm, haiti_best]);

    Layout.setup();
});
