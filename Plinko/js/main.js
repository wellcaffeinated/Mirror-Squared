require.config({

	baseUrl: 'js/',

	shim: {
		'kinetic': {
			exports: 'Kinetic'
		}
	},

	paths: {
		'pquery': 'libs/pquery',
		'kinetic': 'libs/kinetic'
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