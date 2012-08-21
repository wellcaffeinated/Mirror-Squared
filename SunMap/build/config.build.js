/* 
 * build profile
 * All config options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
 * node r.js -o ./pquery.build.js 
 */
({
	baseUrl: '../js',
    name: 'main',
    //include: ['require'],
    out: '../main.min.js',
    mainConfigFile: '../js/main.js',

    wrap: {
        startFile: '../js/libs/require.js',
        endFile: 'empty.txt'
    },
    //optimize: 'none',

    paths: {
        require: 'libs/require'
    }
})