"use strict";

//初始化数据
var g_json_res_config = null;
var g_json_config = null;
var g_init_json_config = null;
var fontId = '1000';
var historyId = '-1';
var g_preview_image = null;
var g_accessory_list = null; //通过controller来获取Angular应用

var appElement = null;
var $dialog_scope = null;
var $main_scope = null;
var $single_scope = null;
var comp_canvas = null;
var back2main = false;
var page = 'main'; // CSS 像素的大小与一个物理像素的大小的比值

var g_ratio = window.devicePixelRatio; //重置页面尺寸

resize();
var app = angular.module('myApp', []);
app.controller('dialogCtrl', function ($scope) {
  $scope.colorAddOpcity = function (color, opcity) {
    return colorAddOpcity(color, opcity);
  };
});
app.controller('mainCtrl', function ($scope) {
  $scope.remH = rH;
  $scope.diyContentH = contentH;

  $scope.colorAddOpcity = function (color, opcity) {
    return colorAddOpcity(color, opcity);
  };
}); //设置页面初始值

app.controller('singleCtrl', function ($scope) {
  $scope.remH = rH;
  var canvas_w = 4.8 * g_rem; //计算4.8rem的实际px值。

  var canvas_left = 3 * g_rem;
  var canvas_top = 0.69 * g_rem; //(canvas_w-preview_w)/2

  var canvas_bgW = 5.2 * g_rem;
  var canvas_bgLeft = 2.8 * g_rem;
  var canvas_bgTop = 0.49 * g_rem;
  var preview_top = 3.18 * g_rem;
  $scope.mcanvas = {
    bg_w: canvas_bgW,
    bg_h: canvas_bgW,
    bg_left: canvas_bgLeft,
    bg_top: canvas_bgTop,
    w: canvas_w,
    h: canvas_w,
    left: canvas_left,
    _top: canvas_top,
    previewW: canvas_w * g_ratio,
    previewH: canvas_w * g_ratio,
    previewT: preview_top,
    previewL: 0
  };

  $scope.colorAddOpcity = function (color, opcity) {
    return colorAddOpcity(color, opcity);
  };
}); //监听背景图片加载完成

app.directive('imageonload', function () {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      element.bind('load', function () {
        scope.$apply(attrs.imageonload);
      });
    }
  };
});

var loadData = function loadData() {
  $dialog_scope = Dialog_Scope.create();
  $main_scope = Main_Scope.create();
  $single_scope = Single_Scope.create();
  changePage('main'); //打开主页面
  //获取手机色系，是深色还是浅色

  Is_NightMode(); //初始化获取键盘高度

  Get_Keyboard_Height(); //初始打开mainTab

  tellAndroidChangeTab('0'); //初次打开页面

  if (null === g_json_res_config) {
    g_json_res_config = new ET_ResConfig();
  }

  g_json_config = null;
  ET_Get_FontId();
}; //再次返回主页面运行


var openMainPage = function openMainPage() {
  changePage('main');
  initTab('main-tab-2');
  $main_scope.initChars(g_json_config); //打开添加字体tab页，获取所有char的图片

  if (back2main) {
    $main_scope.openAddTextTab();
  }

  getPreviewImage();
}; //获取fontid后准备工作


var initPageData = function initPageData() {
  //填充前端数据
  $main_scope.init(g_json_config, g_json_res_config);
  $single_scope.init(g_json_config, g_json_res_config);

  if (back2main) {
    $main_scope.openAddTextTab();
  } //获取预览图


  getPreview();
}; //获取配饰列表


var getPendantList = function getPendantList() {
  if (g_json_res_config.pendants === null) {
    ET_Get_AccessoryList();
  }
}; //获取全局预览图


var getPreview = function getPreview() {
  //获取预览背景图
  if (undefined === $main_scope.previewBg || $main_scope.previewBg === null) {
    ET_Get_Preview_BG_PNG();
  } //获取预览文字


  g_preview_image = {};
  initPreviewTextInfo();
}; //全局预览图文字排版


var initPreviewTextInfo = function initPreviewTextInfo() {
  var defaultUnicode = new Array(35746, 21046, 23383, 20307, 25928, 26524, 39044, 35272, 26174, 31034);
  var previewDivWidth = document.getElementById('previewborder').clientWidth; // 默认支持字数4-10个，每行最多5个字

  g_preview_image.str = g_json_res_config.previewText;
  var strLen = g_preview_image.str.length;
  if (strLen < 4 || strLen > 10) return; //获取预览显示字符的Unicode编码

  var strUnicode = new Array(strLen);
  var str = g_preview_image.str.split('');

  if ('undefined' != typeof str) {
    for (var i = 0; i < strLen; i++) {
      if ('undefined' != typeof str[i]) strUnicode[i] = parseInt(str[i].charCodeAt(0), 10);else strUnicode[i] = parseInt(' ', 10);
    }
  } else {
    for (var _i = 0; _i < strLen; _i++) {
      strUnicode[_i] = defaultUnicode[_i];
    }
  } // 根据视觉图效果得出字号


  var pixelSize = previewDivWidth * g_ratio * 38 / 272;
  var charGap = previewDivWidth * g_ratio * 10 / 272;
  var lineGap = previewDivWidth * g_ratio * 8 / 272; // g_json_config.upem表示当前字体的设计尺寸
  // g_json_config.height是当前字体在upem下的最大高度

  var lineHeight = g_json_config.height * pixelSize / g_json_config.upem;
  var width = pixelSize * strLen;
  var height = lineHeight;
  var xPos = new Array(strLen);
  var yPos = new Array(strLen);

  if (strLen < 6) {
    for (var _i2 = 0; _i2 < strLen; _i2++) {
      xPos[_i2] = _i2 * (pixelSize + charGap);
      yPos[_i2] = 0;
    }

    width += charGap * (strLen - 1);
  } else {
    var half = strLen + 1 >> 1;
    var remainder = strLen - half; // 第一行文字坐标

    for (var _i3 = 0; _i3 < half; _i3++) {
      xPos[_i3] = _i3 * (pixelSize + charGap);
      yPos[_i3] = 0;
    } // 第二行文字坐标


    var xOff = 0;
    if (remainder != half) xOff = pixelSize >> 1;

    for (var _i4 = half; _i4 < strLen; _i4++) {
      xPos[_i4] = (_i4 - half) * (pixelSize + charGap) + xOff;
      yPos[_i4] = lineHeight + lineGap;
    }

    width = pixelSize * half + charGap * (half - 1);
    height = lineHeight * 2 + lineGap;
  }

  var textColor = parseInt(g_json_res_config.textColor.slice(1, 7), 16);
  g_preview_image.pixelSize = pixelSize;
  g_preview_image.textColor = textColor;
  g_preview_image.width = width;
  g_preview_image.height = height;
  g_preview_image.str = strUnicode;
  g_preview_image.xPos = xPos;
  g_preview_image.yPos = yPos;
  g_preview_image.pre_height = height;
  g_preview_image.pre_width = width;
  g_preview_image.pre_xoff = 100;
  g_preview_image.pre_yoff = 100;
  g_preview_image.bubble_height = height + 90 * g_ratio;
  g_preview_image.bubble_width = width + 80 * g_ratio;
  g_preview_image.bubble_xoff = g_preview_image.pre_xoff - 40 * g_ratio;
  g_preview_image.bubble_yoff = g_preview_image.pre_yoff - 45 * g_ratio; //设置预览图片实际大小

  var preview_img_ele = document.getElementById('preview-img');
  preview_img_ele.style.width = width / g_ratio + 'px';
  preview_img_ele.style.height = height / g_ratio + 'px';
  getPreviewImage();
}; //ET_Get_Char_Index回调函数，获取字符图片


var getMainCharPng = function getMainCharPng(obj) {
  var cur_char = {};

  for (var index = 0; index < g_json_config.chars.length; index++) {
    var _char = g_json_config.chars[index];
    var text = $main_scope.chars[index];

    if (_char.unicode === obj.unicode) {
      _char.primary = obj.glyphIndex;
    }

    if (text.unicode === obj.unicode) {
      text.primary = obj.glyphIndex;
      cur_char = text;
    }
  }

  getCharPreviewImage(cur_char);
}; //获取预览图


var getPreviewImage = function getPreviewImage() {
  if (null !== g_preview_image) {
    ET_Get_Preview_PNG(parseInt(g_preview_image.pixelSize), g_preview_image.textColor, g_preview_image.width, g_preview_image.height, g_preview_image.str, g_preview_image.str.length, g_preview_image.xPos, g_preview_image.yPos);
  }
}; //获取单个字的预览图


var getCharPreviewImage = function getCharPreviewImage(_char2) {
  var height = parseInt(1.08 * g_rem * g_ratio);
  var imgWidth = height * g_json_config.upem / g_json_config.height;
  var imgPxSize = parseInt(imgWidth) * g_json_config.upem / g_json_config.advance;
  ET_Get_Char_PNG(_char2.unicode, _char2.primary, imgPxSize, CHAR_COLOR, 0, 0, imgWidth, height);
}; //改变页面


var isFirstLoadPage = true;

var changePage = function changePage(page_name) {
  //告诉android，进入single页面
  SET_BOTTOM_BUTTON(page_name);
  page = page_name;
  $main_scope.change_main = false;
  $single_scope.change_single = false;
  $dialog_scope.initText();

  if (!isFirstLoadPage) {
    var page1 = document.getElementById('main-page');
    var page2 = document.getElementById('single-page');

    if (page_name === 'single') {
      page2.setAttribute('class', 'app-single show');
      page1.setAttribute('class', 'app-container out');
    } else {
      page2.setAttribute('class', 'app-single show_');
      page1.setAttribute('class', 'app-container out_');
    }
  }
}; //更换文字


var changeFont = function changeFont() {
  ET_Select_Font();
}; //通知android切换tab


var tellAndroidChangeTab = function tellAndroidChangeTab(tabId) {
  DO_STAT_V2('select_tab', tabId);
}; //通知android添加单字


var tellAndroidAddChar = function tellAndroidAddChar() {
  DO_STAT_V2('add_char', null);
}; //通知android开始定制


var tellAndroidstartDiySingle = function tellAndroidstartDiySingle() {
  DO_STAT_V2('start_diy_char', null);
};