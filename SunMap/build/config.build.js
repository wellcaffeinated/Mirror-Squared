/* 
 * build profile
 * All config options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
 * node r.js -o ./pquery.build.js 
 */
({
	baseUrl: '../js',
    name: 'almond',
    include: ['main'],
    out: '../main.min.js',
    mainConfigFile: '../js/main.js',
    //optimize: 'none',

    paths: {
        almond: 'libs/almond'
    }
    
})