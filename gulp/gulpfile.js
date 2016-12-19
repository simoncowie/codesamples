/// <binding AfterBuild='build' Clean='clean-fonts, clean-images, clean-styles, clean-build' />
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var del = require('del');
var wiredep = require('wiredep').stream;
var config = require('./gulp/gulp.config')();

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

////--------------------------- Main tasks ---------------------------//

gulp.task('build', ['build-inject-assets'], function () {
    return gulp
        .src('./.tmp/index.html')
        .pipe($.debug())
        .pipe($.plumber())
        .pipe($.useref({ searchPath: './' }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(gulp.dest('./build'));
});

gulp.task('test-protractor', function () {

    return gulp
        .src(config.src.tests)
        .pipe($.angularProtractor({
            'configFile': './protractor/conf.js',
            'args': ['--baseUrl', 'https://localhost:44300/'],
            'autoStartStopServer': true,
            'debug': true
        })).on('error', function (e) { throw e });
});

//---------------------------  Sub tasks ---------------------------//

gulp.task('build-inject-assets', ['build-inject-lib', 'dev-inject-assets'], function () {
    return gulp
        .src('./.tmp/index.html')
        .pipe($.debug())
        .pipe($.plumber())
        .pipe($.inject(gulp.src([
            './app/**/*.js',
            '!./app/shared/config-module.js'
        ]).pipe($.angularFilesort())))
        .pipe($.inject(gulp.src('./.tmp/*.css')))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('dev-inject-assets', ['dev-inject-lib','compile-styles'], function() {
    return gulp
        .src('./app/index.cshtml')
        .pipe($.debug())
        .pipe($.plumber())
        .pipe($.inject(gulp.src([
            './app/**/*.js',
            '!./app/shared/config-module.replacement-tokens.js'
        ]).pipe($.angularFilesort())))
        .pipe($.inject(gulp.src('./.tmp/*.css')))
        .pipe(gulp.dest('app'));
});

gulp.task('build-inject-lib', ['build-index-html', 'copy-configs', 'build-htmltemplates', 'build-fonts', 'build-images'], function () {
    var wiredep = require('wiredep').stream;

    return gulp
    .src('./.tmp/index.html')
    .pipe($.debug())
    .pipe($.plumber())
    .pipe(wiredep({
        ignorePath: '..'
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('dev-inject-lib', function() {
    var wiredep = require('wiredep').stream;

    return gulp
    .src('./app/index.cshtml')
    .pipe($.debug())
    .pipe($.plumber())
    .pipe(wiredep({
        ignorePath: '..'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build-index-html', ['clean-build'], function() {
    return gulp
        .src('./app/index.cshtml')
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('./.tmp/'));
});

gulp.task('compile-styles', ['clean-styles'], function () {
    return gulp
        .src(config.src.sass)
        .pipe($.debug())
        .pipe($.plumber())        
        .pipe($.sass())
        //.pipe($.autoprefixer())
        .pipe(gulp.dest(config.dest.styles));
});

gulp.task('copy-configs', ['clean-configs'], function () {
    return gulp
     .src(config.src.configs)
     .pipe($.debug())
     .pipe(gulp.dest(config.dest.configs));
});

gulp.task('build-htmltemplates', ['clean-htmltemplates'], function () {
    return gulp
        .src(config.src.htmltemplatess)
        .pipe(gulp.dest(config.dest.html));
});

gulp.task('build-fonts', ['clean-fonts'], function () {
    return gulp
        .src(config.src.fonts)
        .pipe($.debug())
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('build-images', ['clean-images'], function() {
    return gulp
        .src(config.src.images)
        .pipe($.imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.dest.images));
});

//--------------------------- helper tasks ---------------------------//

gulp.task('clean-build', function() {
    var files = [].concat(
        config.dest.templates + '**/*.html',
        config.dest.build + '*.html',
        config.dest.build + 'js/**/*.js'
    );
    del(files);
});

gulp.task('clean-configs', function () {
    del(config.dest.build + 'configs/**/*.*');
});

gulp.task('clean-htmltemplates', function() {
    del(config.dest.build + 'app/**/*.html');
});

gulp.task('clean-styles', function() {
    del(config.dest.styles + '**/*.css');
});

gulp.task('clean-fonts', function() {
    del(config.dest.fonts + '**/*.*');
})

gulp.task('clean-images', function() {
    del(config.dest.images + '**/*.*');
});
