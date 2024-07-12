'use strict';
//是否需要压缩
const compress = false;
// 引入 path 模块
const path = require('path');
const webpack = require('webpack');
const webpackconfig = require('./webpack.config');
const { parallel, series, src, dest, watch } = require('gulp');
const fileinclude = require('gulp-file-include');
const revAppend = require('./plugins/rev-append');
const uglify = require('gulp-uglify'); //js压缩
const minifycss = require('gulp-minify-css'); //css压缩
const spritesmith = require('gulp.spritesmith'); //合并雪碧图
const javascriptObfuscator = require('gulp-javascript-obfuscator'); //混淆js

const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const sass = require('gulp-sass');
const parseArgs = require('minimist');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
sass.compiler = require('node-sass');
var argv = parseArgs(process.argv);
var webserver = require('gulp-webserver');
const preprocess = require('gulp-preprocess');
const babel = require('gulp-babel');

function webapp(cb) {
  return src('dist').pipe(
    webserver({
      port: 8084,
      host: 'localhost',
      livereload: true,
      open: true,
      directoryListing: {
        path: 'index.html', //你web资源的起始页，在dist目录下
        enable: true,
      },
      proxies: [
        {
          source: '/api',
          target: 'http://jiuqitech.cn/api',
        },
        {
          source: '/portal',
          target: 'http://jiuqitech.cn/portal',
        },
      ],
      // {
      //   source:'/usual-api',target:'http://175.24.154.162/'
      // }
      // ]
    })
  );
  cb();
}

/**
 * @function html处理
 */
function moveHtml(cb) {
  return src('src/**/*.html')
    .pipe(revAppend())
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        // basepath: path.join(__dirname, 'src'), // 绝对路径到src目录
      })
    )
    .pipe(dest('dist/'));
  cb();
}

/**
 * @function css 压缩处理
 */
function moveCss(cb) {
  //   return src(["src/**/*.css","!src/**/*.min.css","!src/**/videocss.css"]).pipe(minifycss()).pipe(dest("dist/"));
  return src('src/**/*.css').pipe(minifycss()).pipe(dest('dist/'));
  cb();
}
//生成filename文件，存入string内容
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true });
  src._read = function () {
    this.push(
      new gutil.File({
        cwd: '',
        base: '',
        path: filename,
        contents: new Buffer(string),
      })
    );
    this.push(null);
  };
  return src;
}

/**
 * @function 配置文件
 */
function createConfig(cb) {
  var myConfig = require('./config');
  var envConfig = myConfig[argv.env];
  var conConfig = 'var APPCONFIG = ' + JSON.stringify(envConfig);
  return string_src('config.js', conConfig).pipe(dest('dist/js/'));
  cb();
}

/**
 * @function js处理
 */
function moveJs(cb) {
  // 处理 src/libs 目录下的 js 文件，仅进行输出
  src('src/libs/*.js').pipe(dest('dist/libs/'));
  return src('src/js/*.js')
    .pipe(
      preprocess({
        context: {
          // 此处可接受来自调用命令的 NODE_ENV 参数，默认为 development 开发测试环境
          NODE_ENV: argv.env || 'development',
        },
      })
    )
    .pipe(javascriptObfuscator())
    .pipe(babel())
    .pipe(
      uglify({
        compress: {
          // drop_console: argv.env != 'development'?true:false,  // 过滤 console
          // drop_debugger: argv.env != 'development'?true:false // 过滤 debugger
          drop_console: false, // 过滤 console
          drop_debugger: true, // 过滤 debugger
        },
      })
    )
    .pipe(dest('dist/js/'));
  cb();
}
function moveJsOfLibs(cb) {
  // 处理 src/libs 目录下的 js 文件，仅进行输出
  return src('src/libs/*.js').pipe(dest('dist/libs/'));
  cb();
}

/**
 * @function scss 处理
 */
function translateSass(cb) {
  const plugins = [
    autoprefixer,
    pxtorem({
      rootValue: 192,
      unitPrecision: 2,
      propList: [
        'width',
        'min-width',
        'height',
        'min-height',
        'font',
        'top',
        'bottom',
        'left',
        'right',
        'font-size',
        'line-height',
        'letter-spacing',
        'margin',
        'margin-top',
        'margin-left',
        'margin-bottom',
        'margin-right',
        'padding',
        'padding-top',
        'padding-left',
        'padding-bottom',
        'padding-right',
        'background-size',
        'background',
        'text-indent',
        'border',
        'flex-basis',
        'border-top',
        'border-bottom',
        'border-right',
        'border-left',
      ],
    }),
  ];
  return src('src/scss/*.scss')
    .pipe(sass())
    .pipe(postCss(plugins))
    .pipe(dest('src/css/'));
  cb();
}

function webpackcall(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackconfig, function (err, stats) {
      console.log('webpack called');
    });
  });
  cb();
}

/**
 * @function 压缩图片
 */
function imageCache(cb) {
  return src('src/resources/**/*.{png,jpg,jpeg,gif,ico}')
    .pipe(
      imagemin({
        optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      })
    )
    .pipe(dest('dist/resources/'));
  cb();
}

/**
 * @function 生成资源文件
 */
function moveResources(cb) {
  return src('src/resources/**/*.*').pipe(dest('dist/resources/'));
  cb();
}

/**
 * @function 合并小图标生成雪碧图
 */
function spriteImg(cb) {
  let spriteArr = [
    {
      src: 'src/resources/images/navIcon/*.*',
      imgName: 'resources/images/icons/navIconSprite.png',
      cssName: 'css/navIconSprite.css',
    },
    {
      src: 'src/resources/images/culture/partner_logo/*.*',
      imgName: 'resources/images/icons/partner_logo.png',
      cssName: 'css/partner_logo.css',
    },
  ];

  for (let i = 0; i < spriteArr.length; i++) {
    src(spriteArr[i].src)
      .pipe(
        spritesmith({
          imgName: spriteArr[i].imgName, //保存合并后的名称
          cssName: spriteArr[i].cssName, //保存合并后css样式的地址
          padding: 20, //合并时两个图片的间距
          algorithm: 'binary-tree', //注释1
          cssTemplate: function (data) {
            //如果是函数的话，这可以这样写
            var arr = [];
            data.sprites.forEach(function (sprite) {
              var x = (sprite.px.offset_x.replace('px', '') * 100) / 1920;
              var y = (sprite.px.offset_y.replace('px', '') * 100) / 1920;

              arr.push(
                '.' +
                  sprite.name +
                  '{' +
                  "background-image: url('" +
                  sprite.escaped_image +
                  "');" +
                  'background-repeat: no-repeat;' +
                  'background-position: ' +
                  x +
                  'vw' +
                  ' ' +
                  y +
                  'vw' +
                  ';' +
                  'background-size: ' +
                  ((sprite.total_width / 1920) * 100).toFixed(2) +
                  'vw auto;' +
                  // "width:"+sprite.px.width+";"+
                  // "height:"+sprite.px.height+";"+
                  '}\n'
              );
            });
            return arr.join('');
          },
        })
      )
      .pipe(dest('dist/'));
  }
  cb();
}

function node(cb) {
  // cry
  src('node_modules/crypto-js/crypto-js.js').pipe(dest('dist/js'));
  cb();
  // cry
  src('node_modules/jsencrypt/bin/jsencrypt.min.js').pipe(dest('dist/js'));
  cb();
}

const watcher = watch([
  'src/scss/*.scss',
  'src/js/*.js',
  'src/resources/**/*.*',
  'src/**/*.html',
]);

/**
 * @function ico处理
 */
function translateIco() {
  return src('src/resources/favicon.ico').pipe(dest('dist/resources/'));
}

watcher.on(
  'change',
  series(
    // translateSass,
    // parallel(moveCss, moveJs, spriteImg, moveResources, moveHtml),
    parallel(moveCss, moveJs, moveResources, moveHtml)
  )
);

exports.build = series(
  // translateSass,
  node,
  parallel(moveCss, moveJs, moveResources, moveHtml),
  // parallel(moveCss, moveJs, spriteImg, moveResources, moveHtml),
  webapp //webpackcall
);
