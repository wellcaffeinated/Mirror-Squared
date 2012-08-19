require.config({

    baseUrl: 'js/',

    shim: {
        'libs/kinetic': {
            exports: 'Kinetic'
        }
    },

    map: {
        '*': {
            'pquery': 'libs/pquery/pquery',
            'kinetic': 'libs/kinetic'
        }
    }
});

require(
    [
        'mediators/plinko'
    ],
    function(
        plinko
    ){

        plinko.init();
    }
);