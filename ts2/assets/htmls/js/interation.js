"use strict";

var config_to_json = function config_to_json(config) {
  var json = {};
  json.version = config.version;
  json.font_id = config.fontId;
  json.upem = config.upem;
  json.height = config.height;
  json.advance = config.advance;
  json.color_style = config.colorStyle;
  json.theme_style = config.themeStyle;

  if (config.hasOwnProperty('dimensions') && config.dimensions.length > 0) {
    json.dimensions = JSON.parse(angular.toJson(config.dimensions));
  }

  if (config.hasOwnProperty('catalogs') && config.catalogs.length > 0) {
    json.catalogs = JSON.parse(angular.toJson(config.catalogs));
  }

  if (config.chars.length > 0) {
    json.chars = [];
  }

  for (var i = 0; i < config.chars.length; i++) {
    var ch = config.chars[i];
    var _char = {};
    _char.unicode = ch.unicode;
    _char.color_style = ch.colorStyle;
    _char.theme_style = ch.themeStyle;

    if (ch.hasOwnProperty('catalogs') && ch.catalogs.length > 0) {
      _char.catalogs = JSON.parse(angular.toJson(ch.catalogs));
    } else if (ch.catalogs.length === 0) {
      _char.catalogs = [];

      _char.catalogs.push({
        type: -1,
        id: -1
      });
    }

    _char.components = [];

    for (var j = 0; j < ch.components.length; j++) {
      var compo = ch.components[j];
      var co = {};
      co.component = compo.index;
      co.matrix = matrix_to_string(compo);

      _char.components.push(co);
    }

    json.chars.push(_char);
  }

  return angular.toJson(json);
};

var get_file_name = function get_file_name(path) {
  var filename = '';
  var strlist = path.split('/');

  if (strlist.length > 1) {
    var name = strlist[strlist.length - 1];
    filename = name.split('.')[0].split('_')[1];
  }

  return filename;
};

var config_to_stat = function config_to_stat(config, res_config) {
  var json = {};
  var change_main = false; //颜色素材id

  if (res_config.colors && res_config.colors.length > 0) {
    var res_ids = [];
    json.colorIds = [];
    var bid = config.colorStyle;

    if (bid !== 0) {
      change_main = true;
    }

    res_ids.push(bid);

    for (var i = 0; i < config.chars.length; i++) {
      var ch = config.chars[i];
      var ccid = ch.colorStyle;
      res_ids.push(ccid);
    }

    for (var _i = 0; _i < res_ids.length; _i++) {
      var tid = res_ids[_i];
      var ttname = res_config.colors[tid].filename;
      var ttindex = 'color_' + parseInt(get_file_name(ttname));

      if (json.colorIds.indexOf(ttindex) === -1) {
        json.colorIds.push(ttindex);
      }
    }
  } //背景


  if (res_config.backgrounds && res_config.backgrounds.length > 0) {
    var _res_ids = [];
    var id_arr = [];
    json.backgroundIds = [];

    for (var _i2 = 0; _i2 < res_config.backgrounds.length; _i2++) {
      id_arr.push(res_config.backgrounds[_i2].id);
    }

    var _bid = config.getCatalogId('background');

    if (_bid !== -1) {
      change_main = true;
    }

    _res_ids.push(_bid);

    for (var _i3 = 0; _i3 < config.chars.length; _i3++) {
      var _ch = config.chars[_i3];

      var _ccid = _ch.getCatalogId('background');

      _res_ids.push(_ccid);
    }

    for (var _i4 = 0; _i4 < _res_ids.length; _i4++) {
      var _tid = _res_ids[_i4];

      if (_tid !== -1) {
        var ttid = id_arr.indexOf(_tid);
        var _ttname = res_config.backgrounds[ttid].filename;

        var _ttindex = 'background_' + parseInt(get_file_name(_ttname));

        if (json.backgroundIds.indexOf(_ttindex) === -1) {
          json.backgroundIds.push(_ttindex);
        }
      }
    }
  }

  if (res_config.themes && res_config.themes.length > 0) {
    var _res_ids2 = [];
    json.backgroundIds = [];
    var _bid2 = config.themeStyle;

    if (_bid2 !== 0) {
      change_main = true;
    }

    _res_ids2.push(_bid2);

    for (var _i5 = 0; _i5 < config.chars.length; _i5++) {
      var _ch2 = config.chars[_i5];
      var _ccid2 = _ch2.themeStyle;

      _res_ids2.push(_ccid2);
    }

    for (var _i6 = 0; _i6 < _res_ids2.length; _i6++) {
      var _tid2 = _res_ids2[_i6];
      var _ttname2 = res_config.themes[_tid2].filename;

      var _ttindex2 = 'background_' + parseInt(get_file_name(_ttname2));

      if (json.backgroundIds.indexOf(_ttindex2) === -1) {
        json.backgroundIds.push(_ttindex2);
      }
    }
  } //下划线


  if (res_config.underlines && res_config.underlines.length > 0) {
    var _res_ids3 = [];
    var _id_arr = [];
    json.underlineIds = [];

    for (var _i7 = 0; _i7 < res_config.underlines.length; _i7++) {
      _id_arr.push(res_config.underlines[_i7].id);
    }

    var _bid3 = config.getCatalogId('underline');

    if (_bid3 !== -1) {
      change_main = true;
    }

    _res_ids3.push(_bid3);

    for (var _i8 = 0; _i8 < config.chars.length; _i8++) {
      var _ch3 = config.chars[_i8];

      var _ccid3 = _ch3.getCatalogId('underline');

      _res_ids3.push(_ccid3);
    }

    for (var _i9 = 0; _i9 < _res_ids3.length; _i9++) {
      var _tid3 = _res_ids3[_i9];

      if (_tid3 !== -1) {
        var _ttid = _id_arr.indexOf(_tid3);

        var _ttname3 = res_config.underlines[_ttid].filename;

        var _ttindex3 = 'underline_' + parseInt(get_file_name(_ttname3));

        if (json.underlineIds.indexOf(_ttindex3) === -1) {
          json.underlineIds.push(_ttindex3);
        }
      }
    }
  } //字形


  if (res_config.substitutes && res_config.substitutes.length > 0 && config.chars.length > 0) {
    var _res_ids4 = [];
    var _id_arr2 = [];
    json.substituteIds = [];

    for (var _i10 = 0; _i10 < res_config.substitutes.length; _i10++) {
      _id_arr2.push(res_config.substitutes[_i10].id);
    }

    for (var _i11 = 0; _i11 < config.chars.length; _i11++) {
      var _ch4 = config.chars[_i11];

      var _ccid4 = _ch4.getCatalogId('substitute');

      _res_ids4.push(_ccid4);
    }

    for (var _i12 = 0; _i12 < _res_ids4.length; _i12++) {
      var _tid4 = _res_ids4[_i12];

      if (_tid4 !== -1) {
        var _ttid2 = _id_arr2.indexOf(_tid4);

        var _ttname4 = res_config.substitutes[_ttid2].filename;

        var _ttindex4 = 'substitute_' + parseInt(get_file_name(_ttname4));

        if (json.substituteIds.indexOf(_ttindex4) === -1) {
          json.substituteIds.push(_ttindex4);
        }
      }
    }
  } //配饰


  if (res_config.pendants && res_config.pendants.compList.length > 0 && config.chars.length > 0) {
    var _res_ids5 = [];
    json.pendantIds = [];

    for (var _i13 = 0; _i13 < config.chars.length; _i13++) {
      var _ch5 = config.chars[_i13];

      for (var j = 0; j < _ch5.components.length; j++) {
        _res_ids5.push(_ch5.components[j].index);
      }
    }

    for (var _i14 = 0; _i14 < _res_ids5.length; _i14++) {
      var _tid5 = _res_ids5[_i14];

      if (_tid5 !== -1) {
        var _ttid3 = 'pendant_' + parseInt(_tid5);

        if (json.pendantIds.indexOf(_ttid3) === -1) {
          json.pendantIds.push(_ttid3);
        }
      }
    }
  } //拼音


  if (res_config.pinyins.length > 0) {
    if (config.getCatalogId('pinyin') !== -1) {
      json.pinyinState = 1;
      change_main = true;
    } else {
      json.pinyinState = 0;
    }
  } //粗细


  if (res_config.weight) {
    if (config.getDimensionValue('weight') !== res_config.weight["default"]) {
      json.weightState = 1;
      change_main = true;
    } else {
      json.weightState = 0;
    }
  } //全局或者单字


  if (config.chars.length === 0) {
    json.styleState = 1;
  } else if (change_main) {
    json.styleState = 3;
  } else {
    json.styleState = 2;
  }

  return angular.toJson(json);
}; // DIY完成后，把配置信息传到java层，用于生成彩色位图字库。
//


var ET_Set_Config = function ET_Set_Config() {
  var json = config_to_json(g_json_config);
  var statjson = config_to_stat(g_json_config, g_json_res_config);
  window.etrump.set_config(fontId, parseInt(g_json_res_config.fontType), json, statjson);
}; // 获取当前字体的id值
//


var ET_Get_FontId = function ET_Get_FontId() {
  window.etrump.get_fontId('ET_Get_FontId_Callback');
};
/*  获取当前字体id的回调函数，然后获取当前字体的config信息
 *
 *  parameter:
 *  fid     字体id值
 */


var ET_Get_FontId_Callback = function ET_Get_FontId_Callback(jsonObject) {
  fontId = jsonObject.index;
  historyId = jsonObject.history; //获取config数据

  if (g_json_config == null) ET_Get_Config();
};
/*  选择字库
 *
 *  parameter:
 *  fid     字体id值
 */


var ET_Select_Font = function ET_Select_Font() {
  window.etrump.select_font(fontId);
}; // 应用启动后，获取当前字体的DIY配置信息，用于初始化数据。
//


var ET_Get_Config = function ET_Get_Config() {
  window.etrump.get_config(fontId, historyId, 'ET_Get_Config_Callback');
};
/* 获取当前字体配置信息的回调函数，获取配置信息后开始初始化界面的操作。
 *
 * parameter:
 * jsonObject       java层返回的配置信息对象
 */


var ET_Get_Config_Callback = function ET_Get_Config_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return null;
  g_json_config = new ET_Config();
  g_json_config.initData(obj);
  g_init_json_config = new ET_Config();
  g_init_json_config.clone(g_json_config);
  ET_Get_Res_Config();
}; // 应用启动后，获取当前字体的DIY页面配置信息，用于初始化界面。
//


var ET_Get_Res_Config = function ET_Get_Res_Config() {
  window.etrump.get_res_config('ET_Get_Res_Config_Callback');
};
/* 获取当前字体页面配置信息的回调函数，获取配置信息后开始初始化界面的操作。
 *
 * parameter:
 * jsonObject       java层返回的配置信息对象
 */


var ET_Get_Res_Config_Callback = function ET_Get_Res_Config_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return null;
  g_json_res_config.initData(obj);
  initPageData();
}; // 获取预览区的背景气泡图片，(不包含文本图像)
//


var ET_Get_Preview_BG_PNG = function ET_Get_Preview_BG_PNG() {
  window.etrump.get_chat_background(fontId, 'ET_Get_Preview_BG_PNG_Callback');
}; // 获取背景图片的回调函数，以及该字体用于展示效果的4个文字
//


var ET_Get_Preview_BG_PNG_Callback = function ET_Get_Preview_BG_PNG_Callback(jsonObject) {
  var preview_bg_path = jsonObject;
  if (preview_bg_path == null) return null;
  var count = preview_bg_path.split('|').length;
  if (count != 2) return null;
  var img = preview_bg_path.split('|')[0];
  $main_scope.updatePreviewBg(img);
};
/* 获取DIY预览效果图，把相关信息传递到java，生成效果图后传回页面显示。
 *
 * parameter:
 * pixelSize    预览文本字号，单位像素，（大小可根据实际相关调整）
 * width        文本区域的宽度，根据pixelSize计算出来的
 * height       文本区域的高度，根据pixelSize和字体的相关参数计算得到
 *              参考onLoad.js中的initPreviewInfo函数
 * unistr       unicode编码的字符串
 * count        文本字符数量
 * xpos         x坐标数组，存储每个字符绘制的x坐标，起点在[width,height]所构造区域的左上角
 * ypos         y坐标数据，存储每个字符绘制的y坐标，起点同上
 */


var ET_Get_Preview_PNG = function ET_Get_Preview_PNG(pixelSize, textColor, width, height, unistr, count, xpos, ypos) {
  var json = config_to_json(g_json_config);
  window.etrump.get_preview_PNG(fontId, pixelSize, textColor, width, height, unistr, count, xpos, ypos, json, 'ET_Get_Preview_PNG_Callback');
}; // 获取预览效果图的回调函数，得到预览图后刷新页面
//


var ET_Get_Preview_PNG_Callback = function ET_Get_Preview_PNG_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return;
  $main_scope.updatePreviewImg(obj.image); //$scope.refresh();//页面刷新
};
/* 根据字符的unicode编码，获取字符在字库的索引号
 *
 * parameter:
 * unicode      字符的unicode编码
 */


var ET_Get_Char_Index = function ET_Get_Char_Index(unicode) {
  window.etrump.get_char_index(fontId, parseInt(unicode), 'ET_Get_Char_Index_Callback');
}; // 获取字符索引的回调函数
// return json object,  ['index' : int]
//


var ET_Get_Char_Index_Callback = function ET_Get_Char_Index_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj === null) return;

  if (obj.glyphIndex === 0) {
    $dialog_scope.toastNotFoundChar();
    return;
  }

  if (!g_json_config.hasChar(obj.unicode)) {
    if (page === 'main') {
      $main_scope.appendChar(obj);
    } else {
      $single_scope.appendChar(obj);
    }
  } else {
    if (page === 'main') {
      getMainCharPng(obj);
    } else {
      getSingleCharPng(obj);
    }
  }
};

var ET_Get_Char_PNG = function ET_Get_Char_PNG(unicode, glyphIndex, pixelSize, textColor, x, y, width, height) {
  var json = config_to_json(g_json_config);
  window.etrump.get_char_PNG(fontId, parseInt(unicode), parseInt(glyphIndex), parseInt(pixelSize), textColor, json, x, y, width, height, 'ET_Get_Char_PNG_Callback');
};

var ET_Get_Char_PNG_Callback = function ET_Get_Char_PNG_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return;
  $main_scope.updateCharImg(obj);
};
/*  获取字符DIY后的完整效果图片
 *
 *  parameter:
 *  glyphIndex      字符索引号
 *  pixelSize       字符大小
 *  colorStyle      当前选择的颜色类型
 *  themeStyle      当前选择的主题类型
 *  x               绘制x坐标，默认为0
 *  y               绘制y坐标，默认为0
 *  width           图片的宽度
 *  height          图片的高度
 */


var ET_Get_Component_Primary_PNG = function ET_Get_Component_Primary_PNG(glyphIndex, pixelSize, textColor, colorStyle, themeStyle, catalogs, dimensions, x, y, width, height) {
  //let fontId = ET_Get_FontId(fontId_userName);
  var post = {};
  post.colorStyle = colorStyle;
  post.themeStyle = themeStyle;
  post.catalogs = catalogs;
  post.dimensions = dimensions;
  window.etrump.get_component_primary_PNG(fontId, parseInt(glyphIndex), parseInt(pixelSize), textColor, angular.toJson(post), x, y, width, height, 'ET_Get_Component_Primary_PNG_Callback');
}; // 字符效果图片的回调函数
// return json object,  ['image':'base64-data']
//


var ET_Get_Component_Primary_PNG_Callback = function ET_Get_Component_Primary_PNG_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return;
  $single_scope.curchar.image = obj.image;
  drawCharPNG();
}; // 获取装饰图片列表信息，用于操作界面的显示。配饰图片是sdk动态生成的，该函数获取配饰的索引信息，
// 配饰图片在getAccessoryListPNG函数中获取。


var ET_Get_AccessoryList = function ET_Get_AccessoryList() {
  window.etrump.get_accessoryList(fontId, 'ET_Get_AccessoryList_Callback');
}; // 获取装饰图片列表信息的回调函数
//


var ET_Get_AccessoryList_Callback = function ET_Get_AccessoryList_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return null;
  var list = new ET_ComponentList();
  var comp_list = obj.indices.split(',');

  if (comp_list.length > 0) {
    var count = comp_list.length;

    for (var i = 0; i < count; i++) {
      var access = new ET_Component();
      access.index = i;
      access.glyphIndex = parseInt(comp_list[i]);
      list.addComponent(access);
      list.count++;
    }
  }

  g_json_res_config.pendants = list;
  g_accessory_list = list;
  $single_scope.initPendants(g_json_res_config);
  var size = 1.08 * g_rem * g_ratio; //配饰尺寸，1/10屏幕宽度。

  var accw = size * g_json_config.upem / g_json_config.height;
  var accsize = parseInt(accw) * g_json_config.upem / g_json_config.advance;

  for (var _i15 = 0; _i15 < list.count; _i15++) {
    var acc = list.compList[_i15];
    ET_Get_Accessory_PNG(acc.glyphIndex, accsize, CHAR_COLOR, (size - accw) / 2, 0, size, size);
  }
};
/* 获取配饰图片，配饰图片可以看成一个字符。
 *
 * parameter:
 * glyphIndex       配饰图片对应的索引号
 * pixelSize        配饰图片的尺寸
 * x                绘制x坐标，默认为0
 * y                绘制y坐标，默认为0
 * width            图片的宽度
 * height           图片的高度
 */


var ET_Get_Accessory_PNG = function ET_Get_Accessory_PNG(glyphIndex, pixelSize, textColor, x, y, width, height) {
  //let fontId = ET_Get_FontId(fontId_userName);
  window.etrump.get_accessory_PNG(fontId, parseInt(glyphIndex), parseInt(pixelSize), textColor, parseInt(x), parseInt(y), width, height, 'ET_Get_Accessory_PNG_Callback');
}; // 获取配饰图片的回调函数
// return json object,  ['index':int,  'image':'base64-data']
// 


var ET_Get_Accessory_PNG_Callback = function ET_Get_Accessory_PNG_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return; // add to accessory list, then refresh

  var comp = g_json_res_config.pendants.addComponentImg(obj.index, obj.image);
};
/*  获取选择的配饰图片，在预览区域，可以进行移动和旋转操作，结果保存在矩阵中。
 *
 *  parameter:
 *  timestamp       时间戳，用于回调函数中的校验
 *  glyphIndex      配饰的索引号
 *  pixelSize       配饰的大小
 *  xx              变换矩阵xx分量
 *  xy              变换矩阵xy分量
 *  yx              变换矩阵yx分量
 *  yy              变换矩阵yy分量
 *  dx              变换矩阵的dx分量
 *  dy              变换矩阵的dy分量
 */


var ET_Get_Component_Accessory_PNG = function ET_Get_Component_Accessory_PNG(timestamp, glyphIndex, pixelSize, textColor, xx, xy, yx, yy, dx, dy) {
  var upem = g_json_config.upem; //let fontId = ET_Get_FontId(fontId_userName);

  pixelSize = parseInt(pixelSize);
  xx = xx * pixelSize / upem;
  xy = xy * pixelSize / upem;
  yx = yx * pixelSize / upem;
  yy = yy * pixelSize / upem;
  dx = dx * pixelSize / upem;
  dy = dy * pixelSize / upem;
  window.etrump.get_component_accessory_PNG(parseInt(timestamp), fontId, parseInt(glyphIndex), pixelSize, textColor, parseInt(-1), parseInt(-1), parseFloat(xx), parseFloat(xy), parseFloat(yx), parseFloat(yy), parseFloat(dx), parseFloat(dy), 'ET_Get_Component_Accessory_PNG_Callback');
}; // 获取配饰图片的回调函数
// return json object, ['width':w, 'height:h', 'left':l, 'top':t,  'index':1800, 'image':'base64-data']
//


var ET_Get_Component_Accessory_PNG_Callback = function ET_Get_Component_Accessory_PNG_Callback(jsonObject) {
  var obj = jsonObject;
  if (obj == null) return; //alert(obj.index + ';;;;'+ obj.image);

  $single_scope.curacclist.updateAccImage(obj.timestamp, obj.index, obj.image, obj.left, obj.top, obj.width, obj.height);
  refresh_comp_accessory_png();
}; // 预览DIY后的所有单字效果


var ET_Preview_Singles = function ET_Preview_Singles() {
  var json = config_to_json(g_json_config);
  window.etrump.preview_singles(fontId, json);
}; //toast提示框


var Toast = function Toast(msg) {
  window.etrump.make_toast(msg);
}; //判断手机外观色系


var Is_NightMode = function Is_NightMode() {
  window.etrump.is_nightmode('nightmodecallback');
}; //手机外观色系回调函数


var NIGHT_MODE = false;

var nightmodecallback = function nightmodecallback(nightmode) {
  NIGHT_MODE = nightmode;
  refreshStyle(NIGHT_MODE);
  resetAniTBBgColor(NIGHT_MODE);

  if (undefined !== $main_scope && null !== $main_scope) {
    $main_scope.NIGHT_MODE = NIGHT_MODE;
  }

  if (undefined !== $single_scope && null !== $single_scope) {
    $single_scope.NIGHT_MODE = NIGHT_MODE;
  }
}; //设置加载中


var Set_Loading = function Set_Loading(loading) {
  window.etrump.set_loading(loading);
}; //获取键盘高度


var Get_Keyboard_Height = function Get_Keyboard_Height() {
  window.etrump.get_keyboard_height('Get_Keyboard_Height_Callback');
}; //键盘高度回调函数


var Get_Keyboard_Height_Callback = function Get_Keyboard_Height_Callback(KboardH) {
  document.getElementById('add_text_el').style.bottom = KboardH + 'px';
}; //删除历史数据


var Delelte_History = function Delelte_History() {
  window.etrump.delete_history_item(fontId, historyId);
}; //切换页面调用修改下方按钮,String 类型 pageName{'main','page'}


var SET_BOTTOM_BUTTON = function SET_BOTTOM_BUTTON(pageName) {
  window.etrump.set_bottom_button(pageName);
}; //android通知调用后退事件


var ON_BACK = function ON_BACK() {
  if (page === 'main') {
    $main_scope.goback();
  } else if (page === 'single') {
    $single_scope.goback();
  }
}; //backActivity,h5通知android后退


var ON_BACK_ACTIVITY = function ON_BACK_ACTIVITY() {
  window.etrump.on_back_activity();
}; //android与js的点击交互事件


var DO_STAT_V2 = function DO_STAT_V2(event_name, event_value) {
  window.etrump.do_stat_v2(event_name, event_value);
}; //调用andriod购买


var BUY_PRODUBT = function BUY_PRODUBT() {
  window.etrump.buy_product(fontId);
}; //判断有几个按钮


var set_btn = function set_btn(button1, button2) {
  var isVIP = true;

  if (undefined === button2 || null === button2 || button2 === '') {
    isVIP = false;
  }

  $main_scope.bottomButton = {
    isVIP: isVIP,
    btn1Text: button1,
    btn2Text: button2
  };
  $main_scope.refresh();
};