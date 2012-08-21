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

                'ion': null,
                
                'tree-1': null,
                'tree-2': null,
                'tree-3': null,
                'tree-4': null,

                'wall-1': null,
                'wall-2': null,
                'wall-3': null,
                'wall-4': null,
                'wall-5': null,
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
                    self.artifactLayer = new Kinetic.Layer();

                    self.groups.obstacles = new Kinetic.Group();
                    self.layer.add(self.groups.obstacles);
                    
                    self.groups.wall = new Kinetic.Group();
                    self.artifactLayer.add(self.groups.wall);

                    self.groups.moving = new Kinetic.Group();
                    self.layer.add(self.groups.moving);
                    self.groups.moving.moveToBottom();

                    self.stage.add(self.artifactLayer);
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

                        self.stage.draw();

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
                    ,v = pQuery.Vector()
                    ,lensq
                    ,g
                    ,strength = 100
                    ,magneticExits = [
                        {
                            pos: pQuery.Vector(self.bounds.width, 95)
                        },
                        {
                            pos: pQuery.Vector(self.bounds.width, 250)
                        },
                        {
                            pos: pQuery.Vector(self.bounds.width, 410)
                        }
                    ]
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

                        var pos = obj.position()
                            ,closest
                            ;

                        // earth gravity
                        obj.accelerate(self.globalAccel.x, self.globalAccel.y);

                        if ( pos.x < 700 ) return;

                        // magnetic field exits
                        for ( var i = 0, l = magneticExits.length; i < l; ++i ){
                            
                            v.clone(magneticExits[i].pos);
                            v.vsub(pos);

                            lensq = v.normSq();

                            if (!closest || closest.lensq > lensq){
                                closest = {
                                    lensq: lensq,
                                    v: v.clone()
                                };
                            }
                        }

                        obj.accelerate( 0, closest.v.normalize().mult( 0.01 ).y );
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
                    ,wallPositions = [
                        {
                            pos: pQuery.Vector(19, 353),
                            offset: 80,
                            ion: {
                                pos: pQuery.Vector(62, 388),
                                offset: 0
                            }
                        },{
                            pos: pQuery.Vector(10, 259),
                            offset: 80,
                            ion: {
                                pos: pQuery.Vector(68, 290),
                                offset: 0
                            }
                        },{
                            pos: pQuery.Vector(2, 192),
                            offset: 60,
                            ion: {
                                pos: pQuery.Vector(70, 212),
                                offset: 0
                            }
                        },{
                            pos: pQuery.Vector(2, 92),
                            offset: 95,
                            ion: {
                                pos: pQuery.Vector(70, 132),
                                offset: 0
                            }
                        },{
                            pos: pQuery.Vector(0, -95),
                            offset: 150,
                            ion: {
                                pos: pQuery.Vector(65, 30),
                                offset: 0
                            }
                        }
                    ]
                    ,pos
                    ,offset
                    ,part
                    ;

                function tapWall(e){

                    self.groups.wall.setListening(false);

                    var view = pQuery('.player').data('view');
                    var start = pQuery('.player').dimensions().radius;

                    view.setX(start);
                    view.setY(e.shape.getY());
                    view.show();
                    view.setAlpha(0);
                    view.transitionTo({
                        alpha: 1,
                        duration: 0.6
                    });

                    pQuery.each(self.groups.wall.get('.' + e.shape.getName()), function( i, obj ){
                        obj.transitionTo({
                            alpha: 0,
                            duration: 0.6,
                            callback: function(){

                                pQuery('.player')
                                    .position(start, e.shape.getY())
                                    .attr('fixed', false)
                                    .velocity(0.02, Math.random() * 0.001)
                                    .updateView()
                                    ;
                            }
                        });
                    });
                }

                for ( var i = 5; i > 0; --i ){

                    pos = wallPositions[ i - 1 ].pos;
                    offset = wallPositions[ i - 1 ].offset;
                    part = new Kinetic.Image({
                        x: offset + pos.x,
                        y: offset + pos.y,
                        image: self.resources[ 'wall-' + i ],
                        offset: offset,
                        name: 'wall-'+i,
                        detectionType: 'pixel'
                    });

                    self.groups.wall.add( part );
                    part.saveImageData();
                    part.on('click.wall tap.wall', tapWall);

                    // ion
                    pos = wallPositions[ i - 1 ].ion.pos;
                    offset = wallPositions[ i - 1 ].ion.offset;
                    part = new Kinetic.Image({
                        x: offset + pos.x,
                        y: offset + pos.y,
                        image: self.resources[ 'ion' ],
                        offset: offset,
                        name: 'wall-'+i,
                        listening: false
                    });

                    self.groups.wall.add( part );
                    part.on('click.wall tap.wall', tapWall);
                }                    
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

                self.groups.moving.add(shape);

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
                        offset: 45,
                        name: 'tree'
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

                // flicker
                pQuery('world').on('step', function(){

                    var trees = self.groups.obstacles.get('.tree');

                    for ( var i = 0, l = trees.length; i < l; ++i ){
                        
                        trees[i].setAlpha( 0.2 * Math.random() + 0.8 );
                    }
                });        
            },

            endGame: function(){

                var self = this;

                self.world.pause();
            }
        };
    }
);