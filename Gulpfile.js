/* jshint -W015 */
var gulp = require('gulp');
var util = require('gulp-util');
var clean = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var requirejs = require('gulp-requirejs');
var bowerRequirejs = require('bower-requirejs');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var bump = require('gulp-bump');
var childProcess = require('child_process');
var runSequence = require('run-sequence');
var fs = require('fs');
var conf = require('./config.js');

/** __________________________________________
 * constants.js
 */
function getVersion() {
	var packageJson = JSON.parse(fs.readFileSync(__dirname + '/package.json', {
		encoding: 'utf8'
	}));
	return packageJson.version;
}

gulp.task('constants', function () {
	return gulp.src('./public/res/constants.js')
		.pipe(replace(/constants\.VERSION = .*/, 'constants.VERSION = "' + getVersion() + '";'))
		.pipe(gulp.dest('./public/res/'));
});

/** __________________________________________
 * JSHint
 */

gulp.task('jshint', function () {
	return gulp.src([
		'./*.js',
		'./app/**/*.js',
		'./public/res/classes/**/*.js',
		'./public/res/extensions/**/*.js',
		'./public/res/helpers/**/*.js',
		'./public/res/providers/**/*.js',
		'./public/res/*.js'
	])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/** __________________________________________
 * RequireJS
 */

gulp.task('clean-requirejs', function () {
	return gulp.src([
		'./public/res-min/main.js',
		'./public/res-min/require.js'
	])
		.pipe(clean());
});

gulp.task('copy-requirejs', ['clean-requirejs'], function () {
	return gulp.src('./public/res/bower-libs/requirejs/require.js')
		.pipe(gulp.dest('./public/res-min/'));
});

gulp.task('requirejs', [
	'copy-requirejs',
	'constants'
], function () {

	var production = conf.production;

	return requirejs({
		//see: https://github.com/jrburke/r.js/blob/master/build/example.build.js

		baseUrl: 'public/res',
		name: 'main',
		out: 'main.js',
		mainConfigFile: 'public/res/main.js',
		optimize: production ? 'uglify2' : 'none',
		//findNestedDependencies: true,
		preserveLicenseComments: false,
		//optimizeAllPluginResources: true,
		//removeCombined: true,
		inlineText: true,
		logLevel: 3 /* error */,
		excludeShallow: [
			'css/css-builder',
			'less/lessc-server',
			'less/lessc'
		]
	})
		.pipe(uglify({
			output: {
				beautify: false,
				indent_level: 1,
				ascii_only: false
				//mangle: production
			}
		}))
		.pipe(gulp.dest('./public/res-min/'));
});

gulp.task('bower-requirejs', function (cb) {
	bowerRequirejs({
		config: './public/res/main.js'
	}, function () {
		cb();
	});
});

/** __________________________________________
 * Less
 */

gulp.task('clean-less', function () {
	return gulp.src('./public/res-min/themes')
		.pipe(clean());
});

gulp.task('less', ['clean-less'], function () {
	return gulp.src([
		'./public/res/styles/base.less',
		'./public/res/themes/*.less'
	])
		//https://www.npmjs.com/package/grunt-contrib-less
		.pipe(less({
			compress: conf.production,
			ieCompat: false
		}))
		.pipe(gulp.dest('./public/res-min/themes/'));
});

/** __________________________________________
 * Fonts
 */
/*
 gulp.task('clean-font', function() {
 return gulp.src('./public/res-min/font')
 .pipe(clean());
 });

 gulp.task('copy-font', ['clean-font'], function() {
 return gulp.src('./public/res/font/*')
 .pipe(gulp.dest('./public/res-min/font/'));
 });
 */

/** __________________________________________
 * Images
 */
/*
 gulp.task('clean-img', function() {
 return gulp.src('./public/res-min/img')
 .pipe(clean());
 });

 gulp.task('copy-img', ['clean-img'], function() {
 return gulp.src('./public/res/img/*')
 .pipe(gulp.dest('./public/res-min/img/'));
 });*/

/** __________________________________________
 * cache.manifest
 */

gulp.task('cache-manifest', function () {
	return gulp.src('./public/cache.manifest')
		.pipe(replace(/(#Date ).*/, '$1' + Date()))
		.pipe(inject(gulp.src([
				'./res-min/**/*.*'
			], {
				read: false,
				cwd: './public'
			}),
			{
				starttag: '# start_inject_resources',
				endtag: '# end_inject_resources',
				ignoreExtensions: true,
				transform: function (filepath) {
					return filepath.substring(1);
				}
			}))

		.pipe(gulp.dest('./public/'));
});

gulp.task('clean', [
	'clean-requirejs',
	'clean-less'
]);
gulp.task('default', function (cb) {
	runSequence([
			'jshint',
			'requirejs',
			'less'
		],
		'cache-manifest',
		cb);
});

function bumpTask(importance) {
	return function () {
		return gulp.src([
			'./package.json',
			'./bower.json'
		])
			.pipe(bump({type: importance}))
			.pipe(gulp.dest('./'));
	};
}

gulp.task('bump-patch', bumpTask('patch'));
gulp.task('bump-minor', bumpTask('minor'));
gulp.task('bump-major', bumpTask('major'));

function exec(cmd, cb) {
	childProcess.exec(cmd, {cwd: process.cwd()}, function (err, stdout, stderr) {
		if (!err) {
			util.log(stdout, stderr);
		}
		cb(err);
	});
}

gulp.task('git-tag', function (cb) {
	var tag = 'v' + getVersion();
	util.log('Tagging as: ' + util.colors.cyan(tag));
	exec('git add ./public/res-min', function (err) {
		if (err) {
			return cb(err);
		}
		exec('git commit -a -m "Prepare release"', function (err) {
			if (err) {
				return cb(err);
			}
			exec('git tag -a ' + tag + ' -m "Version ' + getVersion() + '"', function (err) {
				if (err) {
					return cb(err);
				}
				exec('git push origin master --tags', cb);
			});
		});
	});
});

function releaseTask(importance) {
	return function (cb) {
		runSequence(
			'bump-' + importance,
			'default',
			'git-tag',
			cb);
	};
}

gulp.task('patch', releaseTask('patch'));
gulp.task('minor', releaseTask('minor'));
gulp.task('major', releaseTask('major'));
