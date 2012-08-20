define(
    [
        'pquery',
        'kinetic',
        'util/device-orientation',
        'util/domready'
    ],
    function(
        pQuery,
        Kinetic,
        orientation,
        domready
    ){
        pQuery = pQuery.sub();
        pQuery.fn.extend({
            updateView: function(){

                var vel = pQuery.Vector()
                    ,ref = pQuery.Vector(1, 0)
                    ;

                return this.each(function(){

                    // update the player canvas image
                    var obj = pQuery('.player')
                        ,img = obj.data('view')
                        ,pos
                        ,ang
                        ;

                    if (obj.attr('fixed') || !img) return;

                    pos = obj.position();
                    vel.clone( obj.velocity() ).normalize();
                    ang = ( vel.y > 0 ? 1 : -1 ) * Math.acos( vel.dot(ref) );
                    //console.log(ang, vel.toString())

                    img.setX(pos.x);
                    img.setY(pos.y);
                    img.setRotation( ang );
                });
            }
        });
       
        return {

            bounds: {
                width: 700,
                height: 700
            },

            groups: {},

            globalAccel: {
                x: 0.0002,
                y: 0
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

                    self.addWall();

                    self.addObstacles(function(){

                        var playerImg = new Image();

                        playerImg.onload = function(){

                            self.addPlayer( playerImg );
                            pQuery.ticker.start();
                            self.world.unpause();
                        };

                        playerImg.src = document.getElementById('player-img').src;

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
                    self.layer.draw();

                });

                // set timestep size
                world.timeStep( 16 );

                // modify global gravity based on orientation
                orientation().init().on('change:orientation', function( data ){

                    self.globalAccel.y = data.fb * 0.000005;
                });
            },

            addWall: function(){

                var self = this
                    ,insideWall = {
                        min: pQuery.Vector(0, 0),
                        max: pQuery.Vector(60, self.bounds.height)
                    }
                    ,wall = new Kinetic.Rect({
                        x: insideWall.max.x,
                        y: 0,
                        width: 60,
                        height: self.bounds.height,
                        alpha: 0
                    })
                    ;

                self.layer.add(wall);

                // keep player inside wall until class is removed
                self.world.interact( pQuery.interactions.ConstrainWithin( insideWall, 0.3), '.in-wall' );

                wall.on('mouseup.wall touchend.wall', function(e){
                    
                    wall.off('mouseup.wall touchend.wall');

                    self.breakWallAnim(e.x, e.y, function( hole ){

                        var player = pQuery('.player')
                            ,pos
                            ,min = hole.getY() + 10
                            ,max = min + hole.getRadius() - 20
                            ;

                        function monitorHole(){

                            pos = player.position();

                            if ( pos.y > min && pos.y < max ){

                                self.world.off('step', monitorHole);
                                player
                                    .removeClass('in-wall')
                                    .velocity(player.velocity().x, 0)
                                    ;
                            }
                        }

                        self.world.on('step', monitorHole);
                    });
                });
                    
            },

            addPlayer: function( image ){

                var self = this
                    ,x = 10
                    ,y = self.bounds.height/2
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
                    ,shape = new Kinetic.Image({
                        x: x,
                        y: y,
                        width: 30,
                        height: 30,
                        offset: 15,
                        image: image,
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
                    .velocity( 0, .01*Math.random() )
                    .addClass('gravity player collides in-wall')
                    .appendTo(self.world)
                    ;

                player.on('collide', function( other ){

                    var v = this.velocity();

                    if ( other === self.world[0] && v.x && this.position().x >= (self.bounds.width - this.dimensions().radius - 10) ){

                        // stop the player
                        this.velocity(0, 0);
                        self.endGame();
                    }
                });
            },

            addObstacles: function( cb ){

                var self = this
                    ,radius = 15
                    ,nrows = 5
                    ,startForest = 300
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
                            ,row = 0
                            ,dx = 60
                            ,dy = 70
                            ;

                        for ( var i = 0; (row = ~~( i * dx / self.bounds.height )) < nrows; ++i ){

                            
                            y = ((row % 2) * dx/2 + (i * dx)) % self.bounds.height + dx/2;
                            x = row * dy + startForest;

                            y += 15 * (Math.random()-0.5);
                            x += 24 * (Math.random()-0.5);

                            if ( y + 2 * radius > self.bounds.height ) continue;

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
            },

            breakWallAnim: function( x, y, cb ){

                var self = this
                    ,startT
                    ,period = 2000 // ms
                    ;

                var blueHex = new Kinetic.RegularPolygon({
                    x: x,
                    y: y,
                    sides: 6,
                    radius: 30,
                    fill: "#00D2FF",
                    stroke: "black",
                    strokeWidth: 1
                });

                self.layer.add(blueHex);

                function anim( dt, time ){
                    
                    startT = startT || time;
                
                    var diff = (time - startT)
                        ,scale = Math.sin(diff * 2 * Math.PI / period) + 0.001
                        ;

                    blueHex.setScale(scale);

                    if (diff > period/4){

                        self.world.off('step', anim);
                        cb && cb( blueHex );
                    }
                }

                self.world.on('step', anim);

            },

            endGame: function(){

                var self = this;

                self.world.pause();
            }
        };
    }
);