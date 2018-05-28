/*
    BChekuri
*/

var _ = require('lodash'),
    fs = require('fs'),
    defaultAssets = require('./config/default'),
    glob = require('glob'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    wiredep = require('wiredep').stream,
    path = require('path'),
    endOfLine = require('os').EOL,
    del = require('del'),
    inject = require('gulp-inject'),
    plugins = gulpLoadPlugins({
        rename: {
          'gulp-angular-templatecache': 'templateCache'
        }
    });

var env = "development";


var assets = _.union(defaultAssets.thirdpartylibs.js,
    defaultAssets.thirdpartylibs.css,
    defaultAssets.src.backgroundjs.files,
    defaultAssets.src.options.js,
    defaultAssets.src.commonjs.files,
    defaultAssets.src.options.css,
    defaultAssets.src.options.view,
    defaultAssets.images,
    defaultAssets.fonts,
    defaultAssets.src.backgroundview.files
);

gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
    env = "development";
});

gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
    env = "production";
});


gulp.task('watch', function () {
    plugins.refresh.listen();
    gulp.watch(assets, ['default']).on('change', plugins.refresh.changed);
});




gulp.task('copy', function () {
    return gulp.src(assets, { base: './' })
        .pipe(gulp.dest('bundle/'));
});

gulp.task('uglify', function () {
    var assets = _.union(
      defaultAssets.client.js,
      defaultAssets.client.templates
    );
    del(['public/dist/*']);
  
    return gulp.src(assets)
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.uglify({
        mangle: true
      }).on('error', function (err) {
        console.log('Uglify error : ', err.toString());
      }))
      .pipe(plugins.concat('application.min.js'))
      .pipe(plugins.rev())
      .pipe(gulp.dest('public/dist'));
});


gulp.task('cssmin', function () {
    return gulp.src(defaultAssets.client.css)
      .pipe(plugins.csso())
      .pipe(plugins.concat('application.min.css'))
      .pipe(plugins.rev())
      .pipe(gulp.dest('dist'));
});


gulp.task('inject-js-css', function () {
    var assets = _.union(defaultAssets.thirdpartylibs.css,
        defaultAssets.src.options.css,
        defaultAssets.thirdpartylibs.js,
        defaultAssets.src.commonjs.files,
        defaultAssets.src.options.js
    );

    var assetsWithPath = [];
    assets.forEach(function(asset) {
        assetsWithPath.push(defaultAssets.thirdpartylibs.thirdpartylibsbundlefromview.concat(asset));
    });

    var target = gulp.src('./bundle/src/client/views/index.html');
    var sources = gulp.src(assets, { read: false });
    return target.pipe(inject(sources, {relative: false, addPrefix : "./../../..", addRootSlash : false}))
        .pipe(gulp.dest('./bundle/src/client/views/'));
});

gulp.task('copyExtensionConfig', function () {
    return gulp.src(defaultAssets.extension_config, { base: './' })
        .pipe(gulp.dest('bundle/'));
});


gulp.task('clean', function () {
    return del("bundle");
});

gulp.task('default', function (done) {
    runSequence('env:dev', 'clean', ['copy', 'copyExtensionConfig'], 'inject-js-css', 'watch', done);
});

gulp.task('prod', function (done) {
    runSequence('env:dev', 'clean', ['copy', 'copyExtensionConfig'], 'inject-js-css', done);
});
