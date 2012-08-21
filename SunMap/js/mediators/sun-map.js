define(
    [
        'stapes',
        'google/maps',
        'util/gm-label-marker',
        'util/domready'
    ],
    function(
        Stapes,
        gm,
        MarkerWithLabel,
        domready
    ){
        'use strict';

        var icons = {
            
        };

        var SunMap = Stapes.create().extend({

            init: function(){

                var self = this
                    ,mapId = 'map-wrap'
                    ,mapOptions = {
                        center: new gm.LatLng(0, 0),
                        zoom: 0,
                        minZoom: 0,
                        maxZoom: 4,
                        mapTypeControl: false,
                        streetViewControl: false
                    }
                    ;

                self.initEventHandlers();

                // wait for dom ready
                domready(function(){

                    var el = document.getElementById( mapId );
                    
                    // create map
                    self.set('mapOptions', mapOptions);
                    self.set('map', new gm.Map(el, mapOptions));
                    
                });
            },

            pointToLatLng: function( point ){

                var proj = this.get('projection')
                    ,factor = 1 << (this.get('mapOptions').minZoom - 2)
                    ,ll = proj.fromPointToLatLng(new gm.Point(point.x/factor, point.y/factor))
                    ;

                return ll;
            },

            latLngToPoint: function( latLng ){

                var proj = this.get('projection')
                    ,factor = 1 << (this.get('mapOptions').minZoom - 2)
                    ,wc = proj.fromLatLngToPoint(latLng)
                    ;

                return new gm.Point( wc.x*factor, wc.y*factor );
            },

            initEventHandlers: function(){

                var self = this
                    ;

                // get projection, or wait until we can get it. Then remember it.
                function setProj( map ){

                    var proj = map.getProjection();

                    if (!proj){

                        gm.event.addListenerOnce(map, 'projection_changed', function(){
                            
                            setProj( map );
                        });

                    } else {

                        self.set('projection', proj);
                    }
                }

                this.on({
                    
                    'create:map': function( map ){

                        self.initMapTypes();

                        setProj( map );
                    },

                    'create:projection': function(){

                        self.initMarkers();
                    }

                });
            },

            initMapTypes: function(){

                var self = this
                    ,map = self.get('map')
                    ,mapOpts = self.get('mapOptions')
                    ;

                // Normalizes the coords that tiles repeat across the x axis (horizontally)
                // like the standard Google map tiles.
                function getNormalizedCoord(coord, zoom) {

                    var y = coord.y;
                    var x = coord.x;

                    // tile range in one direction range is dependent on zoom level
                    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
                    var tileRange = 1 << zoom;

                    // don't repeat across y-axis (vertically) ()
                    if (y < 0 || y >= tileRange) {
                        return null;
                    }

                    // don't repeat across x-axis
                    if (x < 0 || x >= tileRange) {
                        return null; //x = (x % tileRange + tileRange) % tileRange;
                    }

                    return {
                        x: x,
                        y: tileRange - y - 1
                    };
                }

                map.mapTypes.set( 'sun', new gm.ImageMapType({

                    getTileUrl: function(coord, zoom) {

                        var normalizedCoord = getNormalizedCoord(coord, zoom)
                            ,pfx = zoom > 1 ? 'detailed/' : 'plain/'
                            ;
                        
                        if (!normalizedCoord) {

                            return null;
                        }
                        
                        return 'tiles/'+ pfx + zoom + '/' + normalizedCoord.x + '/' + normalizedCoord.y + '.jpg';
                    },
                    tileSize: new gm.Size(256, 256),
                    maxZoom: mapOpts.maxZoom,
                    minZoom: mapOpts.minZoom,
                    //radius: 1738000,
                    name: 'sun'
                }));

                // first map first...
                map.setMapTypeId( 'sun' );

                self.emit( 'types_ready' );

            },

            initMarkers: function(){

                var self = this
                    ,map = this.get('map')
                    ,markers
                    ;

                function addMarker( opts ){
                    // create the marker
                    var m = new MarkerWithLabel({
                        position: opts.position,
                        title: opts.title,
                        labelContent: opts.labelContent,

                        //icon: icons.messier,
                        //shape: {coords:[0,0,0], type:'circle'}, // so icons don't disturb map drag
                        draggable: false,
                        raiseOnDrag: false,
                        labelAnchor: new gm.Point(50, 0),
                        labelClass: 'sun-label'
                    });

                    // put marker on map
                    m.setMap( map );

                    gm.event.addListener(m, 'click', function( event ) {

                        var infowindow = new gm.InfoWindow({

                            content: '<p>Hello world</p>'
                        });
                        
                        infowindow.open( map, m );

                    });

                    // so labels don't disturb map drag... this is a bit sketchy because
                    // it's accessing something "private"... but meh.
                    // gm.event.clearListeners(m.label.eventDiv_);

                    // store marker
                    self.set( 'marker.'+opts.title, m );
                }

                addMarker({

                    position: new gm.LatLng(0, 0),
                    title: 'test',
                    labelContent: 'Just a Test'
                });
                
            }
        });

        return SunMap;
    }
);