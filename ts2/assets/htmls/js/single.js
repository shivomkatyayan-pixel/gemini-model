"use strict";

//新增配饰，与上一个配饰的偏移距离
var g_comp_init_dis = 10; //最多添加配饰个数

var MAX_ACC_NUM = 3;
var res_unicode = null;

var openSinglePage = function openSinglePage(unicode) {
  changePage('single');
  initTab('single-tab-1');
  res_unicode = unicode;
  $single_scope.initCanvasSize();
  $single_scope.initCurChar(g_json_config, unicode);
  $single_scope.refresh(); //页面刷新
  //获取main_canvas字符的图片

  ET_Get_Char_Index(unicode); //通知打开样式tab

  tellAndroidChangeTab('2');
}; //ET_Get_Char_Index回调函数，获取字符图片，包含配饰


var getSingleCharPng = function getSingleCharPng(obj) {
  for (var index = 0; index < g_json_config.chars.length; index++) {
    var _char = g_json_config.chars[index];

    if (_char.unicode === obj.unicode) {
      _char.primary = obj.glyphIndex;
    }
  }

  $single_scope.curchar.primary = obj.glyphIndex; //获取main_canvas字符的图片

  getCharImage(); //绘制当前char的配饰

  drawComp();
}; //获取单字diy文字图片，不包含配饰


var getCharImage = function getCharImage() {
  var canvas_h = $single_scope.mcanvas.w * g_ratio;
  var dimensions = JSON.parse(angular.toJson(g_json_config.dimensions)); //字重为全局属性

  ET_Get_Component_Primary_PNG($single_scope.curchar.primary, $single_scope.singleSize.pixelSize, CHAR_COLOR, $single_scope.curchar.colorStyle, $single_scope.curchar.themeStyle, $single_scope.curchar.catalogs, dimensions, $single_scope.singleSize.offsetX, 0, canvas_h, canvas_h);
}; //绘制配饰


var drawComp = function drawComp() {
  //绘制配饰
  for (var i = 0; i < $single_scope.curchar.components.length; i++) {
    var compo = $single_scope.curchar.components[i];

    if (g_accessory_list != null) {
      var complist = g_accessory_list.compList;

      for (var j = 0; j < complist.length; j++) {
        if (compo.index == complist[j].index) {
          compo.glyphIndex = complist[j].glyphIndex;
          break;
        }
      }
    }

    $single_scope.addComp(compo.glyphIndex, compo);
  }
}; //重绘main_canvas中的图片，不包含配饰


var drawCharPNG = function drawCharPNG() {
  var main_canvas = document.getElementById('main_canvas');
  var ctx = main_canvas.getContext('2d');
  loadImage($single_scope.curchar.image, function () {
    var canvas_h = $single_scope.mcanvas.h * g_ratio;
    ctx.clearRect(0, 0, canvas_h, canvas_h);
    ctx.save();
    ctx.drawImage(this, 0, 0, canvas_h, canvas_h);
    ctx.restore();
    closeLoading();
  });
}; //刷新配饰绘制，区分是否绘制边框


var refreshComp = function refreshComp(tabIndex) {
  tellAndroidChangeTab(tabIndex); //初始设定更换tab页，同时更换配饰状态，现取消。

  /*
  refresh_comp_accessory_png();
  */

  $single_scope.refresh();
}; //刷新配饰绘制


var refresh_comp_accessory_png = function refresh_comp_accessory_png() {
  canvasDrawAcc(comp_canvas, $single_scope.curacclist, $single_scope.curaccIndex);
  closeLoading();
}; //通知android删除单字


var tellAndroidDeleteSingle = function tellAndroidDeleteSingle() {
  DO_STAT_V2('delete_char', null);
}; //通知android保存当前编辑字


var tellAndroidSaveCurChar = function tellAndroidSaveCurChar() {
  DO_STAT_V2('set_single_char', null);
};