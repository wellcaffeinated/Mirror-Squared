require.config({

    baseUrl: 'js/',

    map: {
        '*': {
            'pquery': 'libs/pquery/pquery',
            'stapes': 'libs/stapes',
            'google/maps': 'modules/adapters/google-maps'
        }
    }
});

require(
    [
        'mediators/sun-map'
    ],
    function(
        sunMap
    ){

        sunMap.init();
    }
);