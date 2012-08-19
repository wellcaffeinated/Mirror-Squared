require.config({

	baseUrl: 'js/',

	shim: {
		'kinetic': {
			exports: 'Kinetic'
		}
	},

	paths: {
		'kinetic': 'libs/kinetic'
	},

	map: {
		'*': {
			'pquery': 'libs/pquery/pquery'
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