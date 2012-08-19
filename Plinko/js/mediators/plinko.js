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

                    self.addObstacles( 96 );

                });
            },

            addObstacles: function( nObstacles ){

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
                    }
                });

                shape.hide();
            }
        };
    }
);