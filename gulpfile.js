// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var cssmin = require('gulp-cssmin');
var inject = require('gulp-inject');

// var stripDebug = require('gulp-strip-debug');


//简单图片压缩 (暂时省时间，default要添加)
var imagemin = require('gulp-imagemin');


//var imageminGifsicle = require('imagemin-gifsicle');
//var imageminJpegtran = require('imagemin-jpegtran');
//var imageminOptipng = require('imagemin-optipng');

//垃圾鹅厂的智图
//var imageisux = require('gulp-imageisux');

//gulp-webp压缩图片
//var webp = require('gulp-webp');

//合并html模板命令--gulp template
gulp.task('html', function () {
    return gulp.src('./modules/**/*.html')
        .pipe(templateCache('templates.js',{root:'modules/',module: 'app'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

//检查脚本
gulp.task('lint', function() {
   gulp.src('./modules/**/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('default'));
});

// 编译Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

//合并压缩css命令--gulp deployCSS
gulp.task('base_css', function() {
    return gulp.src(['./css/reset.css','./libs/**/**/*.css'])
        .pipe(concat('base.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('main_css', function() {
    return gulp.src('./css/app.css')
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

//合并压缩文件
gulp.task('libs_scripts', function() {
   gulp.src(['./libs/security/*.js','./libs/jquery/js/jquery.js','./libs/angular/angular/angular.js','./libs/angular/**/*.js','./libs/swiper/js/swiper.js','./libs/wechat/jweixin-1.2.0.js','./app/app.js'])
       .pipe(concat('libs.js'))
       .pipe(gulp.dest('./dist'))
       .pipe(rename('libs.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest('./dist/js'));
});

gulp.task('base_scripts', function() {
    gulp.src(['./app/app.js','./app/app.main.js','./app/app.router.js','./app/app.constants.js','./app/app.authentication.js','./app/app.network.js','.app/reset.js','./app/network/API/*.js','./app/**/*.js'])
        .pipe(concat('base.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('base.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('main_scripts', function() {
   gulp.src('./modules/**/*.js')
       .pipe(concat('main.js'))
       .pipe(gulp.dest('./dist'))
       .pipe(rename('main.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest('./dist/js'));
});

//压缩图片
gulp.task('img', function () {
    return gulp.src(['./image/*','./image/**/*'])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/image'));
});

//智图webp压缩图片
// gulp.task('imageisux', function() {
// 	return gulp.src(['./image/*','./image/**/*'])
//                .pipe(imageisux('./dist/image',true));
// });

//webp压缩图片
// gulp.task('gulpwebp', function () {
//    return gulp.src(['./image-old/*','./image-old/**/*'])
//        .pipe(webp())
//        .pipe(gulp.dest('./image'));
//}); 

//去除console.log()暂未配置
// gulp.task('debug', function () {
//     return gulp.src('src/app.js')
//         .pipe(stripDebug())
//         .pipe(gulp.dest('dist'));
// });

// inject 注入  
gulp.task('index', function() {  
    gulp.src('./index_gulp.html') // 获取该文件的数据
    .pipe(inject(gulp.src('./dist/js/*.js', {read: false}), {relative: true}))
    .pipe(inject(gulp.src('./dist/css/*.css', {read: false}), {relative: true}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist')) // 把被操作过的这个文件流放到 dist 文件夹下   
});  

// 默认任务
gulp.task('default', function(){
    gulp.run('lint','html','sass','base_css','main_css', 'libs_scripts','base_scripts','main_scripts','img','index');

    // 监听文件变化
    gulp.watch('./modules/**/*.js', function(){
        gulp.run('lint','html','sass','base_css','main_css', 'libs_scripts','base_scripts','main_scripts','img','index');
    });
});
