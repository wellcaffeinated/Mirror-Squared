define(
    [
        'pquery',
        'kinetic',
        'util/domready'
    ],
    function(
        pQuery,
        Kinetic,
        domready
    ){
       
        return {

            bounds: {
                width: 600,
                height: 600
            },

            groups: {},

            globalAccel: {
                x: 0,
                y: 0.0005
            },

            init: function(){

                var self = this;

                domready(function(){

                    self.stage = new Kinetic.Stage({
                        container: 'canvas-wrap',
                        width: self.bounds.width,
                        height: self.bounds.height
                    });

                    self.layer = new Kinetic.Layer();
                    self.groups.obstacles = new Kinetic.Group();
                    self.layer.add(self.groups.obstacles);
                    self.stage.add(self.layer);

                    self.initPhysics();

                    self.addObstacles( 96, function(){

                        self.addPlayer();
                    });

                });
            },

            initPhysics: function(){

                var self = this
                    ,world
                    ;

                world = self.world = pQuery('world');

                world
                    .dimensions( this.bounds.width, this.bounds.height )
                    .on('step', function(){

                        self.updateViews();
                        self.layer.draw();

                    })
                    // define some interactions
                    .interact('beforeAccel', '.gravity', function( dt, obj ){

                        // earth gravity
                        obj.accelerate(self.globalAccel.x, self.globalAccel.y);

                    })
                    .interact( pQuery.interactions.ConstrainWithin( world, 0.3 ), '*' )
                    ;

                world.pause();

                // subscribe to the timer
                pQuery.ticker.subscribe(function(time, dt){

                    world.step(time);

                });

                // set timestep size
                world.timeStep( 16 );
            },

            addPlayer: function(){

                var self = this
                    ,x = self.bounds.width/2
                    ,y = 10
                    ,player = pQuery('<sphere>')
                    ,obstacles = self.obstacles
                    ,shape = new Kinetic.Circle({
                        x: x,
                        y: y,
                        radius: 10,
                        fill: 'grey',
                        stroke: 'black',
                        strokeWidth: 1
                    })
                    ;

                
                // collisions
                player
                    .data( 'view', shape )
                    .dimensions( 10 )
                    .position( x, y )
                    .velocity( 0, 0 )
                    .addClass('gravity player')
                    .interact( 'afterInertia', function(){

                        var obs
                            ,pos1 = player.position()
                            ,pos2 = pQuery.Vector()
                            ,diff = pQuery.Vector()
                            ,factor
                            ,len
                            ,r = player.dimensions().radius;
                            ;

                        for ( var i = 0, l = obstacles.length; i < l; ++i ){
                            
                            obs = obstacles[i];

                            pos2.clone( obs.position() );
                            
                            diff.clone( pos2 );
                            diff.vsub( pos1 );
                            
                            // sum of radii
                            target = r + other.dimensions().radius;
                            
                            if ( diff.x < target && diff.y < target && (len = diff.norm()) < target ){ 

                                factor = (len-target)/len;

                                // move the spheres away from obstacle
                                // by the conflicting length
                                pos1.vadd(diff.mult(factor));
                            }
                        }

                        player.position( pos1 );
                    })
                    .appendTo(self.world)
                    ;

            },

            addObstacles: function( nObstacles, cb ){

                var self = this
                    ,radius = 10
                    ;

                self.obstacles = [];

                // create obstacle shapes
                var shape = new Kinetic.Circle({
                    x: radius,
                    y: radius,
                    radius: radius-1,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 2
                });

                self.groups.obstacles.add(shape);

                // cache them as images
                shape.toImage({
                    // define the size of the new image object
                    width: 2*radius,
                    height: 2*radius,
                    callback: function(img) {

                        var image
                            ,x
                            ,y
                            ,row
                            ,dx = 50
                            ,dy = 50
                            ;

                        for ( var i = 0, l = nObstacles; i < l; ++i ){

                            row = ~~( i * dx / self.bounds.width );
                            x = ((row % 2) * dx/2 + (i * dx)) % self.bounds.width + dx/2;
                            y = row * dy + 100;
                            
                            image = new Kinetic.Image({
                                image: img,
                                x: x,
                                y: y,
                                offset: radius
                            });

                            self.obstacles.push({
                                x: x,
                                y: y,
                                img: image
                            });

                            self.groups.obstacles.add(image);
                        }                       

                        self.layer.draw();
                        cb && cb();
                    }
                });

                shape.hide();
            }
        };
    }
);