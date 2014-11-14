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
			baseDir: [dest, src],
			routes: {
				'/bower_components': '../app/bower_components'
			}
		},
		// ghostMode: {
		// 	clicks: true,
		// 	location: true,
		// 	forms: true,
		// 	scroll: false
		// },
		logFileChanges: false,
		open: false,
		minify: false,
		files: [
			dest + '/**',
			// Exclude Map files
			'!' + dest + '/**.map'
		]
	},
	sass: {
		includePaths: [src + '/bower_components'],
		src: src + '/styles/*.{sass,scss}',
		dest: destAssets
	},
	images: {
		src: srcAssets + '/images/**',
		dest: destAssets
	},
	markup: {
		src: src + '/htdocs/**/*.{html,jade,php}',
		dest: dest
	},
	copy: [{
		src: [
			src + '/.htaccess',
			src + '/favicon.ico'
		],
		dest: dest
	}, {
		src: [
			srcAssets + '/fonts/*',
			srcAssets + '/videos/*'
		],
		dest: destAssets
	}],
	browserify: [
		{
			entries: src + '/scripts/bfred.js',
			dest: destAssets,
			outputName: 'bfred.js'
		}/*, {
			entries: src + '/scripts/head.js',
			dest: dest,
			outputName: 'head.js'
		}*/
	]
};
