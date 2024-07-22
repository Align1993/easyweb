// IE10以下浏览器提示
function hiUpgrade() {
  window.AESKey = '';
  // 判断浏览器是否支持placeholder属性
  function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
  }
  //判断是否是IE浏览器，包括Edge浏览器
  function IEVersion() {
    //取得浏览器的userAgent字符串
    var userAgent = navigator.userAgent;
    //判断是否IE浏览器
    var isIE =
      userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    if (isIE) {
      // ie10及以下
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp['$1']);
      if (fIEVersion < 10 || !isSupportPlaceholder()) {
        return true;
      }
    } else {
      return false;
    }
  }
  var tpl =
    '<div id="hi-upgrade"><div class="hi-wrap"><p class="hi-title">无法正常浏览本网站！</p><div class="hi-close">继续浏览</div><div class="hi-text1"><p>1、您的浏览器版本过低，请升级您的浏览器。</p><p>2、如果您的浏览器是最新版本，请<span>切换到极速模式</span>访问。</p><p>3、您使用的是IE10以下的浏览器，建议您<span>使用主流浏览器</span>访问。</p></div><p class="hi-text2"><span>主流浏览器下载</span></p><ul class="hi-list"><li><a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank"><div class="hi-ico1"></div><p>谷歌浏览器</p></a></li><li><a href="http://www.firefox.com.cn/download/" target="_blank"><div class="hi-ico2"></div><p>火狐浏览器</p></a></li><li><a href="http://browser.360.cn" target="_blank"><div class="hi-ico3"></div><p>UC浏览器</p></a></li><li><a href="https://www.uc.cn" target="_blank"><div class="hi-ico4"></div><p>360浏览器</p></a></li><li><a href="https://browser.qq.com" target="_blank"><div class="hi-ico5"></div><p>QQ浏览器</p></a></li><li><a href="https://ie.sogou.com" target="_blank"><div class="hi-ico6"></div><p>搜狗浏览器</p></a></li></ul></div></div>';
  if (IEVersion()) {
    document.write(tpl);
  }
}
hiUpgrade();

// 导航
function headHandler() {
  var currenHref = window.location.pathname;

  var menus = [
    { title: '首页', pathname: ['/', '/index.html'], index: 0 },
    {
      title: '产品介绍',
      pathname: [
        '/jstx/jstx.html',
        '/jstx/yymh.html',
        '/jstx/sjaq.html',
        '/jstx/gnlb.html',
      ],
      index: 1,
    },
    { title: '信创国产化', pathname: ['/xc/xcgch.html'], index: 2 },
    { title: '客户案例', pathname: ['/bigant/case.html'], index: 3 },
    {
      title: '关于九麒',
      pathname: [
        '/aboutus/aboutUs.html',
        '/aboutus/qualifications.html',
        '/aboutus/contactUs.html',
        '/aboutus/joinUs.html',
      ],
      index: 4,
    },
    { title: '客户案例', pathname: ['/doc.html'], index: 5 },
    {
      title: '下载中心',
      pathname: [
        '/bigant/server.html',
        '/bigant/client.html',
        '/bigant/download-center.html',
      ],
      index: 7,
    },
  ];
  for (var i = 0; i < menus.length; i++) {
    console.log(menus[i].pathname);
    // 获取当前元素的 href 属性
    if (menus[i].pathname.indexOf(currenHref) !== -1) {
      $('.header .box .right .right-box .menu > ul > li').eq(i).addClass('on');
      break;
    }
  }
}

function headNav() {
  var oBody = $('body');
  var oHead = $('.header');
  var oNav = $('#c-header .c-nav');
  var oBtn = $('#c-header .c-switch');
  var oL = $('#c-header .c-nav>li');
  var oTitle = $('#c-header .c-nav2 li .c-title-box');
  var num = 0;
  var i = 0;
  var oP = $('#c-placeholder');
  var b = true;
  var t = null;

  // 窗口重置隐藏手机端导航
  $(window).resize(function () {
    if ($(window).width() > 991) {
      oBody.removeClass('c-open');
    }
  });

  // 手机端导航栏目下拉
  oTitle.click(function () {
    $(this).next().stop().slideToggle();
  });

  // 鼠标移入导航样式
  oHead.hover(
    function () {
      $(this).addClass('fh');
    },
    function () {
      if (
        $(window).scrollTop() <= oHead.outerHeight() &&
        oP.length == 0 &&
        !oBody.hasClass('c-open')
      ) {
        oHead.removeClass('fh');
      } else if ($(window).scrollTop() > oHead.outerHeight()) {
        oHead.addClass('fh');
      } else if (
        $(window).scrollTop() <= oHead.outerHeight() &&
        oP.length != 0
      ) {
        oHead.addClass('fh');
      }
    }
  );

  // 手机端导航显示
  oBtn.click(function () {
    if (b) {
      b = false;
      // t = $(window).scrollTop();
      oBody.addClass('c-open');
      // oBody.css("top", -t);
    } else {
      b = true;
      oBody.removeClass('c-open');
      // oBody.css("top", "0");
      // $(window).scrollTop(t);
    }
  });

  // 导航显示及样式
  function fn1() {
    if (
      $(window).scrollTop() - i > 0 &&
      $(window).scrollTop() > oHead.outerHeight() &&
      !oBody.hasClass('c-open')
    ) {
      i = $(window).scrollTop();
      oHead.addClass('fhs');
      oHead.addClass('fh');
    } else if ($(window).scrollTop() - i <= 0) {
      i = $(window).scrollTop();
      oHead.removeClass('fhs');
      if (
        $(window).scrollTop() <= oHead.outerHeight() &&
        oP.length == 0 &&
        !oBody.hasClass('c-open')
      ) {
        oHead.removeClass('fh');
      } else if ($(window).scrollTop() > oHead.outerHeight()) {
        oHead.addClass('fh');
      } else if (
        $(window).scrollTop() <= oHead.outerHeight() &&
        oP.length != 0
      ) {
        oHead.addClass('fh');
      }
    }
  }
  fn1();
  $(window).scroll(function () {
    fn1();
  });

  // pc导航动画
  oL.each(function () {
    if ($(this).hasClass('on')) {
      num = $(this).index();
    }
    $(this).hover(
      function () {
        oL.eq(num).removeClass('on');
        $(this).children('ul').stop().slideDown();
      },
      function () {
        oL.eq(num).addClass('on');
        $(this).children('ul').stop().slideUp();
      }
    );
  });
}
headNav();
headHandler();

// 顶部搜索

// 首页轮播
function homeBanner() {
  var swiper = new Swiper('.c-home-banner', {
    // effect : 'fade',
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // breakpoints: {
    //     767: {
    //         slidesPerView: 3,
    //         spaceBetween: 20,
    //     }
    // }
  });
  // 设置全屏
  // HiSetClientHeight($(".c-home-banner .swiper-slide img"));
}
// homeBanner();

// 可视化数据滚动
function visualData(obj) {
  $(window).load(function () {
    obj.each(function () {
      var h = Number($(this).html());
      var t = '';
      var n = Math.ceil(h / 20);
      var a = true;
      var This = $(this);
      if ($(this).length != 0) {
        t = $(this).offset().top;
      }
      This.html(0);
      fn1();
      $(window).scroll(function () {
        fn1();
      });

      function fn1() {
        var wT = $(window).scrollTop();
        if (wT > t - $(window).height() + 50 && wT < t - 50 && a == true) {
          a = false;
          var y = 0;
          var timer2 = setInterval(function () {
            if (y >= h) {
              y = h;
              clearInterval(timer2);
            }
            This.html(y);
            y += n;
          }, 100);
        }
      }
    });
  });
}
// visualData($('.c-num-move'));

// 侧边栏回到顶部
function goTop() {
  var obj = $('.flex-right');
  var oBtn = $('#c-go-top');
  oBtn.click(function () {
    $('html,body').animate({ scrollTop: 0 }, 500);
  });

  function fn1() {
    if (
      window.location.pathname != '/sem/' &&
      window.location.pathname != '/sem' &&
      window.location.pathname != '/'
    ) {
      obj.fadeIn();
      return;
    }
    if ($(window).scrollTop() > $(window).height() * 0.3) {
      obj.fadeIn();
    } else {
      obj.fadeOut();
    }
  }
  fn1();
  $(window).scroll(function () {
    fn1();
  });
}
// goTop();

// 底部导航
function footerNav() {
  var aList = $('#c-footer .c-list-box');
  aList.each(function () {
    var This = $(this);
    $(this)
      .find('.c-title-box')
      .click(function () {
        if ($(window).width() < 768) {
          This.toggleClass('on');
          This.find('.c-list').stop().slideToggle();
        }
      });
  });
}
// footerNav();

// 二维码弹窗
function codePop() {
  var b = $('#c-footer .c-code-btn');
  var w = $('#c-code-pop');
  var c = w.find('.c-close');
  var d = w.find('.c-img-box');
  var oImg = w.find('.c-img-box>img');
  b.click(function () {
    oImg.attr('src', $(this).data('img-src'));
    w.stop().fadeToggle();
  });
  d.click(function () {
    return false;
  });
  w.click(function () {
    w.stop().fadeToggle();
  });
  c.click(function () {
    w.stop().fadeToggle();
  });
}
// codePop();

// banner设置全屏高度
// HiSetClientHeight($(".banner"));

// 通过滚动方向控制head状态
$(document).on('mousewheel DOMMouseScroll', onMouseScroll);
function onMouseScroll(e) {
  var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
  if (wheel < 1) {
    //向下滚动
    $('.header').addClass('fhs');
  } else {
    //向上滚动
    $('.header').removeClass('fhs');
  }
  // $('.header .right .menu ul li .s-menu').hide();
}

// 通过滚动判断head状态
function fn1() {
  if ($(window).scrollTop() > 1) {
    $('.header').addClass('fh');
  } else {
    $('.header').removeClass('fh');
  }
}
fn1();
$(window).scroll(function () {
  fn1();
});

$('.header .box .right .close').on('click', function () {
  $('html').toggleClass('on');
  $(this).toggleClass('on');
  $('.header .box .right .right-box').stop().slideToggle();
});

if ($(window).width() > 1024) {
  $('.header .box .right .right-box .menu > ul  li .m-link').on(
    'mouseover',
    function () {
      $('.header .box .right .right-box .menu > ul > li .m-link .s-menu')
        .stop()
        .slideUp();
      $(this).children('.s-menu').show();
    }
  );
  $('.header .box .right .right-box .menu > ul > li .m-link').on(
    'mouseout',
    function () {
      $(this).children('.s-menu').hide();
    }
  );
  // 产品二级
  $(
    '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-left .li'
  ).on('mouseover', function () {
    $(this).addClass('on').siblings().removeClass('on');
    $(
      '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-right .li'
    )
      .eq($(this).index())
      .addClass('on')
      .siblings()
      .removeClass('on');
  });
} else {
  $('.header .box .right .right-box .menu > ul > li .m-link .icon').on(
    'click',
    function () {
      $(this).next('.s-menu').stop().slideToggle();
    }
  );
  $(
    '.header .box .right .right-box .menu > ul > li .s-menu .rmenu .rs .rsa'
  ).on('click', function () {
    $('.header .box .right .right-box').hide();
  });

  if ($(window).width() > 767) {
    // 产品二级
    $(
      '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-left .li .a'
    ).on('click', function () {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $(
        '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-right .li'
      )
        .eq($(this).parent().index())
        .addClass('on')
        .siblings()
        .removeClass('on');
    });
  }

  if ($(window).width() < 767) {
    // 产品二级
    $(
      '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-left .li .a'
    ).on('click', function () {
      if ($(this).parent().hasClass('on')) {
        $(this).parent().removeClass('on');
        $(this).next().stop().slideUp();
      } else {
        $(this).parent().addClass('on').siblings().removeClass('on');
        $(
          '.header .box .right .right-box .menu > ul > li .s-menu.product-menu .p-box .p-left .li .p-list'
        )
          .stop()
          .slideUp();
        $(this).next().stop().slideDown();
      }
    });
  }
}

// 底部菜单切换
$('.footer .container .box1 .f-menu ul li').on('mouseover', function () {
  $(this).addClass('on').siblings().removeClass('on');
});

$('.flex-zxzx').on('click', function (e) {
  e.preventDefault();
  alert('暂未开放');
});
