var dest = './dist';
var destAssets = './dist/assets';
var src = './app';

module.exports = {
	src: [
		src+'/**/*.*',
		'!**/README.md',
		'!**/*.js',
	],
	dest: dest,
	sass: {
		includePaths: ['node_modules'],
	},
	browserify: [
		{
			entries: src + '/js/main.js',
			dest: destAssets,
			outputName: 'main.js'
		}/*, {
			entries: src + '/scripts/head.js',
			dest: destAssets,
			outputName: 'head.js'
		}*/
	],
	browserSync: {
		//http://www.browsersync.io/docs/options/
		server: {
			// We're serving the src folder as well
			// for sass sourcemap linking
			baseDir: [dest, src]
		},
		// proxy: 'http://kiacopy.tumblr.com/',//can be used *instead* of server
		minify: false,
		ghostMode: false,
		logFileChanges: false,
		open: false,
		files: [
			dest + '/**',
		],
		notify: {
        styles: [
					'display: none',
					'padding: 15px',
					'font-family: sans-serif',
					'position: fixed',
					'font-size: 0.9em',
					'z-index: 9999999',
					'right: 0px',
					'left: 0px',
					'bottom: 0',
					'background-color: #1B2032',
					'margin: 0',
					'color: white',
					'text-align: center',
					'-webkit-pointer-events: none',
					'-moz-pointer-events: none',
					'-ms-pointer-events: none',
					'pointer-events: none'
    	]
    }
	}
};
