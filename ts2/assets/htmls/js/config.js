"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ET_ComponentList = /*#__PURE__*/function () {
  //构造函数
  function ET_ComponentList() {
    _classCallCheck(this, ET_ComponentList);

    this.count = 0;
    this.compList = [];
  }

  _createClass(ET_ComponentList, [{
    key: "addComponent",
    value: function addComponent(component) {
      component.index = this.count;
      this.compList.push(component);
    }
  }, {
    key: "addComponentImg",
    value: function addComponentImg(index, img) {
      for (var i = 0; i < this.count; i++) {
        if (this.compList[i].glyphIndex === index) {
          this.compList[i].img = img;
          return this.compList[i];
        }
      }
    }
  }, {
    key: "delComponent",
    value: function delComponent(index) {
      if (index < 0 || index >= this.compList.length) return;
      this.compList.splice(index, 1);
    }
  }]);

  return ET_ComponentList;
}();

var ET_Component = /*#__PURE__*/function () {
  //构造函数
  function ET_Component() {
    _classCallCheck(this, ET_Component);

    this.index = 0;
    this.glyphIndex = 0;
    this.img = null;
    this.left = 0;
    this._top = 0;
    this.matrix = null;
    this.degree = 0;
    this.sx = 0;
    this.sy = 0;
    this.dx = 0;
    this.dy = 0;
  }

  _createClass(ET_Component, [{
    key: "setMatrix",
    value: function setMatrix(mtx) {
      this.matrix = mtx;
      var info = mtx.decompose();
      this.sx = info.sx;
      this.sy = info.sy;
      this.dx = info.dx;
      this.dy = info.dy;
      this.degree = info.degree;
    }
  }, {
    key: "clone",
    value: function clone() {
      var compo = new ET_Component();
      compo.left = this.left;
      compo._top = this._top;
      compo.sx = this.sx;
      compo.sy = this.sy;
      compo.dx = this.dx;
      compo.dy = this.dy;
      compo.degree = this.degree;
      compo.index = this.index;
      compo.glyphIndex = this.glyphIndex;
      compo.matrix = new ET_Matrix();
      compo.matrix.xx = this.matrix.xx;
      compo.matrix.xy = this.matrix.xy;
      compo.matrix.yx = this.matrix.yx;
      compo.matrix.yy = this.matrix.yy;
      compo.matrix.dx = this.matrix.dx;
      compo.matrix.dy = this.matrix.dy;
      return compo;
    }
  }]);

  return ET_Component;
}();

var ET_Char = /*#__PURE__*/function () {
  //构造函数
  function ET_Char() {
    _classCallCheck(this, ET_Char);

    this.unicode = 0;
    this.primary = -1; //glyphindex

    this["char"] = '';
    this.colorStyle = -1;
    this.themeStyle = -1;
    this.catalogs = [];
    this.numOfComponent = 0;
    this.components = [];
  }

  _createClass(ET_Char, [{
    key: "init",
    value: function init(ch, config) {
      this.unicode = ch.charCodeAt(0);
      this["char"] = ch;
      this.colorStyle = config.colorStyle;
      this.themeStyle = config.themeStyle;

      if (config.hasOwnProperty('catalogs')) {
        this.catalogs = JSON.parse(angular.toJson(config.catalogs));
      }

      this.updateCatalogId('substitute', -1);
    }
  }, {
    key: "getColorStyle",
    value: function getColorStyle() {
      return this.colorStyle;
    }
  }, {
    key: "setColorStyle",
    value: function setColorStyle(colorStyle) {
      this.colorStyle = colorStyle;
    }
  }, {
    key: "getThemeStyle",
    value: function getThemeStyle() {
      return this.themeStyle;
    }
  }, {
    key: "setThemeStyle",
    value: function setThemeStyle(themeStyle) {
      this.themeStyle = themeStyle;
    }
  }, {
    key: "findItem",
    value: function findItem(arr, typeId) {
      var exist = null;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === typeId) {
          exist = arr[i];
          return exist;
        }
      }
    }
  }, {
    key: "getCatalogId",
    value: function getCatalogId(type) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return -1;
      var exist = this.findItem(this.catalogs, typeId);

      if (exist) {
        return exist.id;
      } else {
        return -1;
      }
    }
  }, {
    key: "updateCatalogId",
    value: function updateCatalogId(type, id) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return;
      var exist = this.findItem(this.catalogs, typeId);

      if (exist) {
        exist.id = id;
      } else {
        this.catalogs.push({
          type: typeId,
          id: id
        });
      }
    }
  }, {
    key: "getDimensionValue",
    value: function getDimensionValue(type) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return -1;
      var exist = this.findItem(this.dimensions, typeId);

      if (exist) {
        return exist.value;
      } else {
        return -1;
      }
    }
  }, {
    key: "updateDimensionValue",
    value: function updateDimensionValue(type, value) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return;
      var exist = this.findItem(this.dimensions, typeId);

      if (exist) {
        exist.value = value;
      } else {
        this.catalogs.push({
          type: typeId,
          value: value
        });
      }
    }
  }, {
    key: "compare",
    value: function compare(_char) {
      if (undefined === _char || null === _char) return false;
      if (this.unicode !== _char.unicode) return false;
      if (this.colorStyle !== _char.colorStyle) return false;
      if (this.themeStyle !== _char.themeStyle) return false;
      if (JSON.stringify(this.catalogs) !== JSON.stringify(_char.catalogs)) return false;
      if (this.numOfComponent !== _char.numOfComponent) return false;

      for (var j = 0; j < this.components.length; j++) {
        var thiscomp = this.components[j];
        var confcomp = _char.components[j];
        if (thiscomp.index !== confcomp.index) return false;
        if (matrix_to_string(thiscomp) !== matrix_to_string(confcomp)) return false;
      }

      return true;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.unicode = 0;
      this.primary = -1;
      this.colorStyle = -1;
      this.themeStyle = -1;
      this.catalogs = [];
      this.numOfComponent = 0;
      this.components = [];
    }
  }, {
    key: "clone",
    value: function clone() {
      var ch = new ET_Char();
      ch.unicode = this.unicode;
      ch.primary = this.primary;
      ch.colorStyle = this.colorStyle;
      ch.themeStyle = this.themeStyle;
      ch["char"] = this["char"];
      ch.catalogs = JSON.parse(angular.toJson(this.catalogs));

      for (var i = 0; i < this.components.length; i++) {
        var compo = this.components[i].clone();
        ch.appendComponent(compo);
      }

      return ch;
    }
  }, {
    key: "appendComponent",
    value: function appendComponent(component) {
      this.components.push(component);
      this.numOfComponent++;
    }
  }, {
    key: "getComponent",
    value: function getComponent(index) {
      for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].index === index) return this.components[i];
      }

      return null;
    }
  }, {
    key: "updateComponents",
    value: function updateComponents(acclist) {
      this.numOfComponent = 0;
      this.components = [];
      var accs = acclist.accessories;

      for (var i = 0; i < accs.length; i++) {
        var compo = new ET_Component();
        compo.glyphIndex = accs[i].glyphIndex;
        var complist = g_accessory_list.compList;

        for (var j = 0; j < complist.length; j++) {
          if (compo.glyphIndex === complist[j].glyphIndex) {
            compo.index = complist[j].index;
            break;
          }
        }

        compo.degree = accs[i].theta * 180 / Math.PI;
        compo.sx = accs[i].scalex;
        compo.sy = accs[i].scaley;
        compo.dx = accs[i].dx;
        compo.dy = accs[i].dy;
        compo.matrix = new ET_Matrix();
        compo.matrix.compose(compo.sx, compo.sy, compo.degree, compo.dx, compo.dy);
        this.appendComponent(compo);
      }
    }
  }, {
    key: "deleteComponent",
    value: function deleteComponent(index) {
      var i,
          pos = 0;

      for (i = 0; i < this.components.length; i++, pos++) {
        if (this.components[i].index === index) break;
      }

      this.components.splice(pos, 1);
      this.numOfComponent--;
    }
  }, {
    key: "clearComponent",
    value: function clearComponent() {
      this.numOfComponent = 0;
      this.components = [];
    }
  }]);

  return ET_Char;
}();

var ET_Config = /*#__PURE__*/function () {
  function ET_Config() {
    _classCallCheck(this, ET_Config);

    this.version = 65536;
    this.fontId = 0;
    this.upem = 0;
    this.height = 0;
    this.advance = 0;
    this.colorStyle = 0;
    this.themeStyle = 0;
    this.dimensions = []; //字重

    this.catalogs = []; //一些属性   背景，下划线，拼音

    this.numOfChar = 0;
    this.chars = [];
  }

  _createClass(ET_Config, [{
    key: "initData",
    value: function initData(obj) {
      this.version = obj.version;
      this.fontId = obj.font_id;
      this.upem = obj.upem;
      this.height = obj.height;
      this.advance = obj.advance;
      this.colorStyle = obj.color_style;
      this.themeStyle = obj.theme_style;

      if (obj.hasOwnProperty('dimensions')) {
        this.dimensions = JSON.parse(angular.toJson(obj.dimensions));
      }

      if (obj.hasOwnProperty('catalogs')) {
        this.catalogs = JSON.parse(angular.toJson(obj.catalogs));
      } // 单字DIY的配置信息


      if (obj.hasOwnProperty('chars')) {
        if (obj.chars.length > 0) {
          var count = obj.chars.length;

          for (var i = 0; i < count; i++) {
            var etchar = new ET_Char();
            var charData = obj.chars[i];
            etchar.unicode = charData.unicode;
            etchar["char"] = int2text(parseInt(etchar.unicode));
            etchar.colorStyle = charData.color_style;
            etchar.themeStyle = charData.theme_style;

            if (charData.hasOwnProperty('catalogs')) {
              etchar.catalogs = JSON.parse(angular.toJson(charData.catalogs));

              for (var a = 0; a < etchar.catalogs.length; a++) {
                var cata = etchar.catalogs[a];

                if (cata.type === -1 && cata.id === -1) {
                  etchar.catalogs.splice(a, 1);
                  break;
                }
              }
            }

            if (!charData.hasOwnProperty('components')) continue;

            if (charData.components.length > 0) {
              var count2 = charData.components.length;

              for (var j = 0; j < count2; j++) {
                var etcompo = new ET_Component();
                var compoData = charData.components[j];
                var matrix = new ET_Matrix();
                etcompo.index = compoData.component;
                var comp_matrix = compoData.matrix.split(',', 6);
                matrix.xx = parseFloat(comp_matrix[0]);
                matrix.xy = parseFloat(comp_matrix[1]);
                matrix.yx = parseFloat(comp_matrix[2]);
                matrix.yy = parseFloat(comp_matrix[3]);
                matrix.dx = parseFloat(comp_matrix[4]);
                matrix.dy = parseFloat(comp_matrix[5]);
                etcompo.setMatrix(matrix);
                etchar.appendComponent(etcompo);
              }
            }

            this.appendChar(etchar);
          }
        }
      }
    }
  }, {
    key: "isDefault",
    value: function isDefault() {
      if (this.colorStyle !== 0 || this.themeStyle !== 0) return false;
      var weight = g_json_res_config.weight;

      if (undefined !== weight && null !== weight) {
        for (var i = 0; i < this.dimensions.length; i++) {
          if (this.dimensions[i].value !== weight["default"]) return false;
        }
      }

      for (var _i = 0; _i < this.catalogs.length; _i++) {
        if (this.catalogs[_i].id !== -1) return false;
      }

      if (this.numOfChar > 0) return false;
      return true;
    }
  }, {
    key: "getColorStyle",
    value: function getColorStyle() {
      return this.colorStyle;
    }
  }, {
    key: "setColorStyle",
    value: function setColorStyle(colorStyle) {
      this.colorStyle = colorStyle;
    }
  }, {
    key: "getThemeStyle",
    value: function getThemeStyle() {
      return this.themeStyle;
    }
  }, {
    key: "setThemeStyle",
    value: function setThemeStyle(themeStyle) {
      this.themeStyle = themeStyle;
    }
  }, {
    key: "findItem",
    value: function findItem(arr, typeId) {
      var exist = null;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === typeId) {
          exist = arr[i];
          return exist;
        }
      }
    }
  }, {
    key: "getCatalogId",
    value: function getCatalogId(type) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return -1;
      var exist = this.findItem(this.catalogs, typeId);

      if (exist) {
        return exist.id;
      } else {
        return -1;
      }
    }
  }, {
    key: "updateCatalogId",
    value: function updateCatalogId(type, id) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return;
      var exist = this.findItem(this.catalogs, typeId);

      if (exist) {
        exist.id = id;
      } else {
        this.catalogs.push({
          type: typeId,
          id: id
        });
      }
    }
  }, {
    key: "getDimensionValue",
    value: function getDimensionValue(type) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return -1;
      var exist = this.findItem(this.dimensions, typeId);

      if (exist) {
        return exist.value;
      } else {
        return -1;
      }
    }
  }, {
    key: "updateDimensionValue",
    value: function updateDimensionValue(type, value) {
      var typeId = g_json_res_config.types[type];
      if (undefined === typeId) return;
      var exist = this.findItem(this.dimensions, typeId);

      if (exist) {
        exist.value = value;
      } else {
        this.catalogs.push({
          type: typeId,
          value: value
        });
      }
    }
  }, {
    key: "appendChar",
    value: function appendChar(charData) {
      this.chars.push(charData);
      this.numOfChar++;
    }
  }, {
    key: "getChar",
    value: function getChar(unicode) {
      var i;
      var ch;
      var found = false;

      for (i = 0; i < this.chars.length; i++) {
        if (this.chars[i].unicode === unicode) {
          found = true;
          break;
        }
      }

      if (found) {
        ch = this.chars[i].clone();
      } else {
        ch = new ET_Char();

        var _char2 = unescape('%u' + parseInt(unicode).toString(16));

        ch.init(_char2, g_json_config);
      }

      return ch;
    }
  }, {
    key: "hasChar",
    value: function hasChar(unicode) {
      var i;
      var ch;
      var found = false;

      for (i = 0; i < this.chars.length; i++) {
        if (this.chars[i].unicode === unicode) {
          found = true;
          break;
        }
      }

      return found;
    }
  }, {
    key: "updateChar",
    value: function updateChar(etchar) {
      var i;
      var found = false;

      for (i = 0; i < this.chars.length; i++) {
        if (this.chars[i].unicode === etchar.unicode) {
          found = true;
          break;
        }
      }

      if (found) {
        this.chars[i] = etchar.clone(); //this.chars.splice(i, 1);
      } else {
        var ch = etchar.clone();
        this.appendChar(ch);
      } //this.insertChar(i, ch);

    }
  }, {
    key: "replaceChar",
    value: function replaceChar(res_ui, _char3) {
      for (var i = 0; i < this.chars.length; i++) {
        if (this.chars[i].unicode === res_ui) {
          this.chars[i] = _char3.clone();
          break;
        }
      }
    }
  }, {
    key: "deleteChar",
    value: function deleteChar(unicode) {
      var i;
      var found = false;

      for (i = 0; i < this.chars.length; i++) {
        if (this.chars[i].unicode === unicode) {
          found = true;
          break;
        }
      }

      if (found) {
        this.chars.splice(i, 1);
        this.numOfChar--;
        return true;
      } else return false;
    }
  }, {
    key: "clone",
    value: function clone(jsonObject) {
      this.version = jsonObject.version;
      this.fontId = jsonObject.fontId;
      this.upem = jsonObject.upem;
      this.height = jsonObject.height;
      this.advance = jsonObject.advance;
      this.colorStyle = jsonObject.colorStyle;
      this.themeStyle = jsonObject.themeStyle;

      if (jsonObject.hasOwnProperty('dimensions')) {
        this.dimensions = JSON.parse(angular.toJson(jsonObject.dimensions));
      }

      if (jsonObject.hasOwnProperty('catalogs')) {
        this.catalogs = JSON.parse(angular.toJson(jsonObject.catalogs));
      }

      this.numOfChar = 0;
      this.chars = [];

      for (var i = 0; i < jsonObject.chars.length; i++) {
        var jchar = jsonObject.chars[i];

        var _char4 = new ET_Char();

        _char4.unicode = jchar.unicode;
        _char4.primary = jchar.primary;
        _char4["char"] = jchar["char"];
        _char4.colorStyle = jchar.colorStyle;
        _char4.themeStyle = jchar.themeStyle;

        if (jchar.hasOwnProperty('catalogs')) {
          _char4.catalogs = JSON.parse(angular.toJson(jchar.catalogs));
        }

        for (var j = 0; j < jchar.components.length; j++) {
          var jcompo = jchar.components[j];
          var compo = new ET_Component();
          compo.index = jcompo.index;
          compo.glyphIndex = jcompo.glyphIndex;
          compo.img = jcompo.img;
          compo.left = jcompo.left;
          compo._top = jcompo._top;
          compo.degree = jcompo.degree;
          compo.sx = jcompo.sx;
          compo.sy = jcompo.sy;
          compo.dx = jcompo.dx;
          compo.dy = jcompo.dy;
          compo.matrix = new ET_Matrix();
          compo.matrix.xx = jcompo.matrix.xx;
          compo.matrix.xy = jcompo.matrix.xy;
          compo.matrix.yx = jcompo.matrix.yx;
          compo.matrix.yy = jcompo.matrix.yy;
          compo.matrix.dx = jcompo.matrix.dx;
          compo.matrix.dy = jcompo.matrix.dy;

          _char4.appendComponent(compo);
        }

        this.appendChar(_char4);
      }
    }
  }, {
    key: "compare",
    value: function compare(config) {
      if (undefined === config || null === config) return false;
      if (this.version !== config.version) return false;
      if (this.fontId !== config.fontId) return false;
      if (this.upem !== config.upem) return false;
      if (this.height !== config.height) return false;
      if (this.advance !== config.advance) return false;
      if (this.colorStyle !== config.colorStyle) return false;
      if (this.themeStyle !== config.themeStyle) return false;
      if (JSON.stringify(this.dimensions) !== JSON.stringify(config.dimensions)) return false;
      if (JSON.stringify(this.catalogs) !== JSON.stringify(config.catalogs)) return false;
      if (this.numOfChar !== config.numOfChar) return false;

      for (var i = 0; i < this.chars.length; i++) {
        var thischar = this.chars[i];
        var confchar = config.chars[i];
        if (!thischar.compare(confchar)) return false;
      }

      return true;
    }
  }]);

  return ET_Config;
}();

var ET_ResConfig = /*#__PURE__*/function () {
  function ET_ResConfig() {
    _classCallCheck(this, ET_ResConfig);

    this.fontVersion = 0x10000;
    this.sdkVersion = 0;
    this.previewText = '';
    this.fontType = null;
    this.textColor = '#000000';
    this.bgColor = '#000000';
    this["default"] = {};
    this.colors = [];
    this.themes = [];
    this.underlines = [];
    this.backgrounds = [];
    this.substitutes = [];
    this.pendants = null;
    this.pinyins = [];
    this.weight = null;
    this.types = {};
  }

  _createClass(ET_ResConfig, [{
    key: "initData",
    value: function initData(obj) {
      this.fontVersion = obj.fontVersion;
      this.sdkVersion = obj.sdkVersion;
      this.previewText = obj.previewText;
      this.fontType = obj.fontType;
      this.textColor = obj.textColor;
      this.bgColor = obj.bgColor; //深色背景

      this.bgTintColor = obj.bgTintColor; //浅色背景
      //判断颜色是否合理

      if (!inspectColor(this.bgColor)) {
        this.bgColor = '#CC4553';
      }

      if (!inspectColor(this.bgTintColor)) {
        this.bgTintColor = '#FADCDF';
      }

      var keys = [];
      var v = obj.fontVersion >= 0x20000 ? 2 : 1;

      switch (v) {
        case 1:
          this.colors = obj.color;
          this.themes = obj.theme;
          getPendantList();
          break;

        case 2:
          //获取导航栏颜色
          this.navColor = obj.navColor; //设置默认图标

          this["default"] = {
            id: -1,
            filename: 'image/default.png',
            //obj.global['default'],
            filename_dark: 'image/default_dark.png' //obj.global['default'],

          }; //初始化字重

          if (undefined !== obj.weight) {
            this.weight = {};
            this.types.weight = obj.weight.type;
            this.weight["default"] = obj.weight["default"];
            this.weight.max = obj.weight.max;
            this.weight.min = obj.weight.min;
          } //初始化颜色


          if (undefined !== obj.color) {
            this.colors = JSON.parse(angular.toJson(obj.color));
          } //初始话主题,新版本没有主题

          /*
          if( undefined !== obj.theme ){
              this.themes = JSON.parse(angular.toJson(obj.theme))
          }
          */
          //初始化下划线


          if (undefined !== obj.underline) {
            this.types.underline = obj.underline.type;
            this.underlines = JSON.parse(angular.toJson(obj.underline.data));
            this.underlines.splice(0, 0, this["default"]);
          } //初始化背景


          if (undefined !== obj.background) {
            this.types.background = obj.background.type;
            this.backgrounds = JSON.parse(angular.toJson(obj.background.data));
            this.backgrounds.splice(0, 0, this["default"]);
          } //初始化字形


          if (undefined !== obj.substitute) {
            this.types.substitute = obj.substitute.type;
            this.substitutes = JSON.parse(angular.toJson(obj.substitute.data));
            this.substitutes.splice(0, 0, this["default"]);
          } //初始化拼音


          if (undefined !== obj.pinyin) {
            this.types.pinyin = obj.pinyin.type;
            this.pinyins = JSON.parse(angular.toJson(obj.pinyin.data));
            this.pinyins.splice(0, 0, this["default"]);
          } //获取配饰列表


          getPendantList();
          break;

        default:
          break;
      }
    }
  }]);

  return ET_ResConfig;
}();