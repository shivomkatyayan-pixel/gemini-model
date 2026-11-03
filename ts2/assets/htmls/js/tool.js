"use strict";

var int2text = function int2text(num) {
  var unicode = '%u' + num.toString(16);
  return unescape(unicode);
};

var px2int = function px2int(pxSize) {
  var px = pxSize.split('px');
  return parseInt(px[0]);
};
/*
function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:80%;min-width: 2.4rem;padding:0.3rem 0.3rem;max-height:2rem;min-height:0.7rem;color: rgb(255, 255, 255);text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 0.42rem;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 0.5;
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}
*/


var loadImage = function loadImage(url, callback) {
  //创建一个Image对象，
  var img = new Image();
  img.src = url; // 如果图片已经存在于浏览器缓存，直接调用回调函数

  if (img.complete) {
    callback.call(img);
    return;
  } //图片下载完毕时异步调用callback函数。


  img.onload = function () {
    //将回调函数的this替换为Image对象
    callback.call(img);
  };
}; //设计图设计的原始宽度尺寸


var pick = 1080; //获取屏幕（视口）宽度

var cW = document.documentElement.clientWidth || window.innerWidth;
var cH = document.documentElement.clientHeight || window.innerHeight;
var g_rem = 0; //font-size单位值

var rH = 0;
var contentH = 0; //重新计算页面尺寸

var resize = function resize() {
  //计算新的font-size单位值
  g_rem = cW / pick * 100;
  var htmlEl = document.getElementsByTagName("html")[0];
  htmlEl.style.fontSize = g_rem + "px";
  var actualSize = parseFloat(window.getComputedStyle(document.documentElement)['font-size']);

  if (actualSize != g_rem) {
    var remScaled = g_rem / (actualSize / g_rem);
    htmlEl.style.fontSize = remScaled + "px";
  } //计算客户定制div高度


  rH = cH / g_rem - 0.96;
  contentH = rH - 9.96;
}; // 动态加载css文件


var loadStyles = function loadStyles(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}; //是否为暗色模式


var CHAR_COLOR = parseInt('#FF000000'.slice(1, 9), 16); //argb格式
//刷新样式  色系变化

var refreshStyle = function refreshStyle(style) {
  if (style) {
    document.getElementsByTagName("body")[0].style.background = '#000';
    document.getElementById("loading").style.background = '#000';
    document.getElementById("my-app").setAttribute('class', 'app-container dark single-bg-color'); //loadStyles('css/dark.css');

    CHAR_COLOR = parseInt('#FFFFFFFF'.slice(1, 9), 16);
  } else {
    document.getElementsByTagName("body")[0].style.background = '#fff';
    document.getElementById("loading").style.background = '#fff';
    document.getElementById("my-app").setAttribute('class', 'app-container light single-bg-color'); //loadStyles('css/light.css');

    CHAR_COLOR = parseInt('#FF000000'.slice(1, 9), 16);
  }
}; //测试 色系


var initStyle = function initStyle() {
  NIGHT_MODE = JSON.parse(window.sessionStorage.getItem("NIGHT_MODE")); //设置页面的色系

  if (null !== $scope) {
    $scope.NIGHT_MODE = NIGHT_MODE;
  }

  refreshStyle(NIGHT_MODE);
}; //节流


var MOVE_THROTTLE_FLAG = true;

var throttle = function throttle() {
  setTimeout(function () {
    MOVE_THROTTLE_FLAG = true;
  }, 12.6);
}; //阻止冒泡


var stopPropaga = function stopPropaga(event) {
  event = event || window.event;

  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }
}; //关闭loading


var closeLoading = function closeLoading() {
  Set_Loading('false');
  document.getElementsByTagName('body')[0].style.visibility = 'visible';
  document.getElementById('loading').style.display = 'none';
}; //颜色增加透明度


var colorAddOpcity = function colorAddOpcity(color, opcity) {
  if (undefined !== color) {
    var bgR = parseInt(color.substr(1, 2), 16);
    var bgG = parseInt(color.substr(3, 2), 16);
    var bgB = parseInt(color.substr(5, 2), 16);
    return 'rgba(' + bgR + ',' + bgG + ',' + bgB + ',' + opcity + ')';
  }
}; //测试字符串是否为颜色值


var inspectColor = function inspectColor(colorStr) {
  var oSpan = document.createElement("SPAN");
  oSpan.style.color = colorStr;

  if (oSpan.style.color !== '') {
    oSpan = null;
    return true;
  }

  oSpan = null;
  return false;
};