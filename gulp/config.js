var dest = './dist';
var destAssets = './dist/assets';
var src = './app';
var srcAssets = './app/assets';

module.exports = {
	paths: {
	},
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
    },
		logFileChanges: false,
		open: false,
		files: [
			dest + '/**',
			// Exclude Map files
			'!' + destAssets + '/**.map',
			'!' + dest + '/**/*.html'
		]
	},
	sass: {
		includePaths: ['node_modules'],
		src: src + '/css/**/*.{sass,scss}',
		dest: destAssets
	},
	images: {
		src: srcAssets + '/images/**',
		dest: destAssets
	},
	svg: {
		src: srcAssets + '/symbols/**/*.svg',
		dest: destAssets
	},
	markup: {
		src: src + '/html/**/*.{html,jade,php}',
		dest: dest
	},
	copy: [{
		src: [
			src + '/.htaccess',
			src + '/favicon.ico'
		],
		dest: dest // root
	}, {
		src: [
			srcAssets + '/fonts/**',
			srcAssets + '/videos/**',
			// srcAssets + '/videos/**', // add more assets
		],
		dest: destAssets // assets folder
	}/*, {
		src: [
			srcAssets + '/something/**',
		],
		dest: dest + '/anywhere-else'
	}*/],
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
	]
};
