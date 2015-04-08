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

//4、server & watch
gulp.task("dev", gulp.series("bowerinstall", "clean_dev", "src2dev", "buildBowerFile"));


/**
 * package
 * first exec gulp dev
 */

//1. dev -> tmp
gulp.task(function dev2tmp() {
    return gulp.src(paths.dev + "/**/*")
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

// //rev-manifest.json -> routers.js (给应用使用)
// gulp.task(function build_routers() {
//     var through = require('through2');
//     var patho = require('path');
//     var revall = require("gulp-rev-all");

//     function build(options) {
//         var options = options || {};
//         var fileName = options.fileName || "routers.js";
//         var prefix = options.prefix || "scripts/module/";


//         return through.obj(
//             //filter routers -> routers.js
//             function (file, encoding, callback) {
//                 var filePath = file.path;
//                 var cwd = file.cwd;

//                 var revmap = JSON.parse(file.contents.toString()),
//                     result = {},
//                     replaceRegx = new RegExp('^' + prefix.replace(/\//g, '\\/'));
//                 for (var path in revmap) {
//                     //以scripts/module开头的约定为路由规则
//                     if (0 === path.indexOf(prefix)) {
//                         result[path.replace(replaceRegx, '').replace(/\.js$/, '')] = revmap[path].slice(1).replace(/\.js/, '');
//                     }
//                 }
//                 this.push(new gutil.File({
//                     cwd: file.cwd,
//                     base: file.base,
//                     path: patho.join(file.base, fileName),
//                     contents: new Buffer('window._APP_ROUTER_MAP = ' + JSON.stringify(result) + ";")
//                 }));
//                 callback();
//             }
//         );
//     }

//     return gulp.src(paths.dist + "/" + paths.revmanifest)
//         .pipe(build())
//         .pipe(gulp.dest(paths.tmp));
// });

//rev agains, so dirty~
// gulp.task(function rev_routers() {
//     var revall = require("gulp-rev-all");

//     return gulp.src([paths.tmp + "/" + paths.routers, paths.tmp + "/**/*.html"])
//         .pipe(revall(revallConfig))
//         .pipe(gulp.dest(paths.dist));
// });

// gulp.task(function watch() {
//     var watch = require('gulp-watch');
//     watch('src/**/*')
//         .pipe(gulp.parallel("dev"));
// });
//4. clean tmp
gulp.task("deploy", gulp.series("clean_tmp", "clean_dist", "dev2tmp", "usemin", "optimize_js", "optimize_image", "rev", "clean_tmp"));

/**
 * alias
 */
gulp.task("default", gulp.parallel("dev", "connect"));
gulp.task("connect", gulp.series("connect"));

