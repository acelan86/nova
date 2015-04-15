var gutil = require("gulp-util");
var gulp = require("gulp");

var paths = {
    src: "src",
    dist: "dist",
    dev: "dev",
    tmp: "tmp",
    revmanifest: "rev-manifest.json"
};

var revallConfig = {
    ignore: [".html"],
    silent: true
    //,prefix: "http://localhost:8888/dist"
};

var port = 8888;

/**
 * tools
 */


gulp.task(function connect() {
    var connect = require("gulp-connect");
    
    connect.server({
        port: port
    });
});

gulp.task(function bowerinstall() {
    var bower = require("gulp-bower");

    return bower();
});
/**
 * some clean
 */
gulp.task(function clean_dev() {
    var clean = require("gulp-rimraf");

    return gulp.src(paths.dev, {read: false})
        .pipe(clean({
            force: true 
        }));
});
gulp.task(function clean_tmp() {
    var clean = require("gulp-rimraf");

    return gulp.src(paths.tmp, {read: false})
        .pipe(clean({
            force: true 
        }));
});
gulp.task(function clean_dist() {
    var clean = require("gulp-rimraf");

    return gulp.src(paths.dist, {read: false})
        .pipe(clean({
            force: true 
        }));
});

gulp.task(function clean_routers() {
    var clean = require("gulp-rimraf");
    return gulp.src(paths.tmp + "/" + paths.routers, {read: false})
        .pipe(clean({
            force: true
        }));
});

gulp.task("clean", gulp.parallel("clean_dev", "clean_dist", "clean_tmp"));



/**
 * dev
 */
//1. src -> dev
gulp.task(function src2dev() {
    return gulp.src(paths.src + "/**/*")
        .pipe(gulp.dest(paths.dev));
});

//1.1 include html tpl src.html -> dev .html
gulp.task(function includeTpl() {
    var contentIncluder = require('gulp-content-includer');
    return gulp.src(paths.src + "/**/*.html")
        .pipe(contentIncluder({
            includerReg: /<!\-\-\s*include\s+"([^"]+)"\s*\-\->/g
        }))
        .pipe(gulp.dest(paths.dev));
});

//2. bower/files -> dev/lib
gulp.task(function buildBowerFile() {
    var mainBowerFiles = require("main-bower-files");
    var bowerNormalizer = require('gulp-bower-normalize');

    return gulp.src(mainBowerFiles({
            includeDev: true
        }), {
            base: "./bower_components"  //don't remove
        })
        .pipe(bowerNormalizer({
            // flat: true,
            // useExtnameFolder: true   //是否将文件按照扩展名存放到对应文件夹下，默认为false
            //bowerJson: "./bower.json"
        }))
        .pipe(gulp.dest(paths.dev + "/lib"));
});

//3. compile  [styles]  dev -> dev
gulp.task(function compile() {
    var sass = require("gulp-sass");

    return gulp.src(paths.dev + "/**/*.css")
        .pipe(sass())
        .pipe(gulp.dest(paths.dev));
});

//4、server & watch
gulp.task("dev", gulp.series("bowerinstall", "clean_dev", "src2dev", "includeTpl", "buildBowerFile", "compile"));


/**
 * package
 * first exec gulp dev
 */

//1. dev -> tmp
gulp.task(function dev2tmp() {
    return gulp.src([paths.dev + "/**/*"])
        .pipe(gulp.dest(paths.tmp));
});

//2. usemin concat files  tmp -> tmp
gulp.task(function usemin() {
    var usemin = require("gulp-usemin");

    return gulp.src(paths.tmp + "/**/*.html")
        .pipe(usemin())
        .pipe(gulp.dest(paths.tmp));
});

//3. optimizes tmp -> tmp
gulp.task(function optimize_image() {
    var imagemin = require("gulp-imagemin");

    return gulp.src(paths.tmp + "/**/*.{jpg,gif,jpeg,png}")
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.tmp));
});
gulp.task(function optimize_js() {
    var uglify = require("gulp-uglify");

    return gulp.src(paths.tmp + "/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(paths.tmp));
});

//3. reval md5 files  tmp -> dist
gulp.task(function rev() {
    var revall = require("gulp-rev-all");

    return gulp.src([paths.tmp + "/**", "!" + paths.tmp + "/" + paths.routers])
        .pipe(revall(revallConfig))
        .pipe(gulp.dest(paths.dist))
        .pipe(revall.manifest({
            fileName: paths.revmanifest
        }))
        .pipe(gulp.dest(paths.dist));
});

//4. clean tmp
gulp.task("deploy", gulp.series("clean_tmp", "clean_dist", "dev2tmp", "usemin", "optimize_js", "optimize_image", "rev", "clean_tmp"));

/**
 * alias
 */
gulp.task("default", gulp.parallel("dev", "connect"));
gulp.task("connect", gulp.series("connect"));
gulp.task("tpl", gulp.series("includeTpl"));

