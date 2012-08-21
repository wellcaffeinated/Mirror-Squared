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
                width: 900,
                height: 500
            },

            groups: {},

            globalAccel: {
                x: 0.0002,
                y: 0
            },

            resources: {
                'player-img': null,
                'wall': null,
                'tree-1': null,
                'tree-2': null,
                'tree-3': null,
                'tree-4': null
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

                    self.initResources(function(){

                        self.initPhysics();

                        self.addWall();

                        self.addObstacles();
                        self.addPlayer( self.resources['player-img'] );
                        pQuery('.player')
                            .attr('fixed', true)
                            .data('view').hide()
                            ;
                        pQuery.ticker.start();
                        self.world.unpause();

                    });

                });
            },

            initResources: function( cb ){

                var self = this
                    ,toLoad = 1
                    ;

                pQuery.each( self.resources, function( id ){

                    var img = new Image();
                    toLoad++;
                    img.onload = function(){

                        toLoad--;
                        self.resources[ id ] = this;

                        if ( toLoad <= 0 && cb ){
                            cb();
                        }
                    };

                    img.src = document.getElementById( id ).src;
                    
                });

                toLoad--;
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
                // orientation().init().on('change:orientation', function( data ){

                //     self.globalAccel.y = data.fb * 0.000005;
                // });
            },

            addWall: function(){

                var self = this
                    ,insideWall = {
                        min: pQuery.Vector(0, 0),
                        max: pQuery.Vector(60, self.bounds.height)
                    }
                    ,wall = new Kinetic.Image({
                        x: insideWall.max.x,
                        y: 0,
                        image: self.resources['wall'],
                        offset: 80
                    })
                    ;

                self.layer.add(wall);

                wall.on('click.wall tap.wall', function(e){

                    var pos = self.stage.getUserPosition(e);
                    
                    wall.off('click.wall tap.wall');

                    self.breakWallAnim(pos.x, pos.y, function( hole ){

                        var player = pQuery('.player')
                            ;

                        player
                            .position(pos.x, pos.y)
                            .attr('fixed', false)
                            .velocity(0, Math.random() * 0.001)
                            .updateView()
                            .data('view').show()
                            ;
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
                        width: 40,
                        height: 40,
                        offset: 20,
                        image: image
                    })
                    ;

                // drag events
                // shape.on('mousedown touchstart', function(e){
                    
                //     player
                //         .toggleClass('gravity collides')
                //         .attr('fixed', true)
                //         ;
                // });

                // shape.on('dragmove', function(e){

                //     x = e.x;
                //     y = e.y;
                //     t = e.timeStamp;

                // });

                // shape.on('dragend', function(e){
                        
                //     // set the velocity from flick
                //     v.set((e.x - x)/(e.timeStamp - t), (e.y - y)/(e.timeStamp - t));
                //     // restrict it between min and max
                //     v.clamp(minV, maxV);

                //     player
                //         .attr('fixed', false)
                //         .position(e.x, e.y)
                //         .velocity(v)
                //         .toggleClass('gravity collides')
                //         ;
                    
                // });

                // add to group

                self.groups.moving = new Kinetic.Group();
                self.groups.moving.add(shape);
                self.layer.add(self.groups.moving);
                self.groups.moving.moveToBottom();

                // collisions
                player
                    .data( 'view', shape )
                    .dimensions( 10 )
                    .position( x, y )
                    .velocity( 0, .01*Math.random() )
                    .addClass('gravity player collides')
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

            addObstacles: function(){

                var self = this
                    ,radius = 20
                    ,nrows = 5
                    ,startForest = 300
                    ,image
                    ,x
                    ,y
                    ,row = 0
                    ,dx = 70
                    ,dy = 80
                    ;

                for ( var i = 0; (row = ~~( i * dx / self.bounds.height )) < nrows; ++i ){

                    y = ((row % 2) * dx/2 + (i * dx)) % self.bounds.height + dx/2;
                    x = row * dy + startForest;

                    y += 15 * (Math.random()-0.5);
                    x += 24 * (Math.random()-0.5);

                    if ( y + 2 * radius > self.bounds.height ) continue;

                    image = new Kinetic.Image({
                        image: self.resources['tree-' + Math.ceil(4 * Math.random())],
                        x: x,
                        y: y,
                        offset: 45
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