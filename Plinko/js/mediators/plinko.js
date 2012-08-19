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
        pQuery = pQuery.sub();
        pQuery.fn.extend({
            updateView: function(){

                return this.each(function(){

                    // update the player canvas image
                    var obj = pQuery('.player')
                        ,img = obj.data('view')
                        ,pos
                        ;

                    if (obj.attr('fixed') || !img) return;

                    pos = obj.position();

                    img.setX(pos.x);
                    img.setY(pos.y);
                });
            }
        });
       
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
                        pQuery.ticker.start();
                        self.world.unpause();

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

                        // update the player canvas image
                        pQuery('.player').updateView();
                        self.layer.draw();
                    })
                    // define some interactions
                    .interact( pQuery.interactions.SphereCollide( 0.3 ), '.collides' )
                    .interact('beforeAccel', '.gravity', function( dt, obj ){

                        // earth gravity
                        obj.accelerate(self.globalAccel.x, self.globalAccel.y);

                    })
                    .interact( pQuery.interactions.ConstrainWithin( world, 0.3 ), '.player' )
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
                    ,t = 0
                    ,minV = {
                        x: -0.5,
                        y: -0.5
                    }
                    ,maxV = {
                        x: 0.5,
                        y: 0.5
                    }
                    ,v = pQuery.Vector()
                    ,player = pQuery('<sphere>')
                    ,shape = new Kinetic.Circle({
                        x: x,
                        y: y,
                        radius: 10,
                        fill: 'grey',
                        stroke: 'black',
                        strokeWidth: 1,
                        draggable: true
                    })
                    ;

                // drag events
                shape.on('mousedown touchstart', function(e){
                    
                    player
                        .toggleClass('gravity collides')
                        .attr('fixed', true)
                        ;
                });

                shape.on('dragmove', function(e){

                    x = e.x;
                    y = e.y;
                    t = e.timeStamp;

                });

                shape.on('dragend', function(e){
                        
                    // set the velocity from flick
                    v.set((e.x - x)/(e.timeStamp - t), (e.y - y)/(e.timeStamp - t));
                    // restrict it between min and max
                    v.clamp(minV, maxV);

                    player
                        .attr('fixed', false)
                        .position(e.x, e.y)
                        .velocity(v)
                        .toggleClass('gravity collides')
                        ;
                    
                });

                // add to group

                self.groups.moving = new Kinetic.Group();
                self.groups.moving.add(shape);
                self.layer.add(self.groups.moving);
                
                // collisions
                player
                    .data( 'view', shape )
                    .dimensions( 10 )
                    .position( x, y )
                    .velocity( .01*Math.random(), 0 )
                    .addClass('gravity player collides')
                    .appendTo(self.world)
                    ;

            },

            addObstacles: function( nObstacles, cb ){

                var self = this
                    ,radius = 10
                    ;

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

                            self.world.append(
                                pQuery('<sphere>')
                                    .addClass('obstacle collides')
                                    .position(x, y)
                                    .dimensions( radius )
                                    .data('view', image)
                                    .attr('fixed', true)
                            );

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