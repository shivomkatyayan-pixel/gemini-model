"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//标题栏图片路径
var navSrc = {
  back: {
    "default": './image/icon/ICON-back.png',
    dark: './image/icon/ICON-back-dark.png'
  },
  cancel: {
    "default": './image/icon/ICON-cancel.png',
    dark: './image/icon/ICON-cancel-dark.png'
  },
  edit: {
    "default": './image/icon/ICON-edit.png',
    dark: './image/icon/ICON-edit-dark.png'
  }
}; //双击蒙版关闭inputDialog的相关参数

var mask_click_num = 0;
var mask_close_timeout = null;
var Dialog_Scope = {
  create: function create() {
    var $dialog_scope = {};
    var appElement = document.querySelector('[ng-controller=dialogCtrl]');
    $dialog_scope = angular.element(appElement).scope();
    $dialog_scope.opened = false;
    $dialog_scope.globleApplyDialog = false;
    $dialog_scope.inputTextDialog = false;
    $dialog_scope.haveMadeDialog = false;
    $dialog_scope.deleteDialog = false;
    $dialog_scope.gobackDialog = false;
    $dialog_scope.inputChar = '';
    $dialog_scope.inputInit = false;
    $dialog_scope.showText = {};
    $dialog_scope.deletecharshow = false;
    var add_char_nput_el = document.getElementById('add-char-input');

    $dialog_scope.initText = function () {
      switch (page) {
        case 'main':
          {
            $dialog_scope.showText.addChar = '添加单字';
            $dialog_scope.showText.finishAddChar = '开始定制';
            $dialog_scope.showText.deleteText = '删除历史记录';
            $dialog_scope.inputInit = false;
            $dialog_scope.deletecharshow = false;
          }
          break;

        case 'single':
          {
            $dialog_scope.showText.addChar = '修改单字';
            $dialog_scope.showText.finishAddChar = '完成';
            $dialog_scope.showText.deleteText = '删除';
            $dialog_scope.inputInit = false;
            $dialog_scope.deletecharshow = true;
          }
          break;

        default:
          break;
      }

      $dialog_scope.refresh();
    };

    $dialog_scope.openDialogDiv = function () {
      if (!$dialog_scope.opened) {
        $dialog_scope.opened = true;
      }

      $dialog_scope.refresh();
    };

    $dialog_scope.closeDialogDiv = function () {
      $dialog_scope.opened = false;
      $dialog_scope.refresh();
    };

    $dialog_scope.stopPro = function (e) {
      stopPropaga(e);
    }; //软件盘返回时，判断若有弹窗则关闭弹窗，并返回true


    $dialog_scope.hasOpenDialog = function () {
      if ($dialog_scope.globleApplyDialog) {
        $dialog_scope.closeGlobleApplyDialog();
        return true;
      }

      if ($dialog_scope.inputTextDialog) {
        $dialog_scope.closeInputCharDialog();
        return true;
      }

      if ($dialog_scope.haveMadeDialog) {
        $dialog_scope.closeHaveMadeDialog();
        return true;
      }

      if ($dialog_scope.deleteDialog) {
        $dialog_scope.closeDeleteDialog();
        return true;
      }

      return false;
    };
    /***************************输入文字dialog **************************/
    //打开输入文字dialog


    $dialog_scope.openInputCharDialog = function (tchar) {
      $dialog_scope.openDialogDiv();
      $dialog_scope.inputTextDialog = true;
      $dialog_scope.clearInputText();
      $dialog_scope.initInputText(tchar);

      if (tchar !== '') {
        $dialog_scope.inputInit = true;
      } //element


      setTimeout(function () {
        add_char_nput_el.focus();
        add_char_nput_el.select();
      }, 1);
    }; //隐藏输入文字dialog


    $dialog_scope.hiddenInputCharDialog = function () {
      $dialog_scope.inputTextDialog = false;
    }; //关闭输入文字dialog


    $dialog_scope.closeInputCharDialog = function () {
      $dialog_scope.clearInputText();
      $dialog_scope.inputTextDialog = false;
      $dialog_scope.closeDialogDiv();
    }; //清空输入框


    $dialog_scope.clearInputText = function () {
      $dialog_scope.inputChar = '';
      add_char_nput_el.value = '';
    }; //初始化输入框


    $dialog_scope.initInputText = function (tchar) {
      $dialog_scope.inputChar = tchar;
      add_char_nput_el.value = tchar;
    }; //输入框focus


    $dialog_scope.inputFocus = function (event) {
      stopPropaga(event);
      add_char_nput_el.focus();
    }; //处理输入的字符串


    $dialog_scope.dealInputText = function (e) {
      //开始按键
      if (e.keyCode === 13) {
        if ($dialog_scope.inputChar.length > 0 && !$dialog_scope.inputInit) {
          $dialog_scope.addChar(e);
        }

        return;
      }

      var value = e.target.value;
      if (value.length === 0) return;
      var reg = /^[\u4E00-\u9FA5]+$/;

      if (!reg.test(value)) {
        $dialog_scope.clearInputText();
        Toast('当前暂不支持定制英文和符号，敬请期待');
        return;
      }

      if (value.length > 1) {
        Toast('单次只能添加 1 个中文哦');
      }

      e.target.value = value.replace(/[^\u4e00-\u9fa5]/g, '').slice(0, 1);
      $dialog_scope.inputChar = e.target.value;
      $dialog_scope.inputInit = false;
      var unicode = $dialog_scope.inputChar.charCodeAt(0);
      ET_Get_Char_Index(unicode);
    }; //提示字库中不存在该字


    $dialog_scope.toastNotFoundChar = function () {
      $dialog_scope.clearInputText();
      $dialog_scope.refresh();
      Toast('暂不支持定制该字，请输入其他汉字');
    }; //双击蒙版关闭inputdialog


    $dialog_scope.clickInputMask = function () {
      clearTimeout(mask_close_timeout);

      if ($dialog_scope.inputChar.length <= 0) {
        mask_click_num = 0;
        $dialog_scope.closeInputCharDialog();
        return;
      }

      mask_click_num += 1;

      if (mask_click_num === 1) {
        add_char_nput_el.focus();
        Toast('再次点击蒙版关闭');
        mask_close_timeout = setTimeout(function () {
          mask_click_num = 0;
        }, 3000);
      }

      if (mask_click_num === 2) {
        mask_click_num = 0;
        $dialog_scope.closeInputCharDialog();
      }
    }; //输入定制文字后


    $dialog_scope.addChar = function (event) {
      stopPropaga(event);
      var tchar = $dialog_scope.inputChar.slice(0, 1);

      if (page === 'main') {
        $main_scope.addChar(tchar);
      } else if (page === 'single') {
        $single_scope.addChar(tchar);
      }
    };
    /***************************输入文字dialog **************************/

    /***************************文字已定制dialog **************************/
    //打开已经定制dialog


    $dialog_scope.openHaveMadeDialog = function () {
      $dialog_scope.openDialogDiv();
      $dialog_scope.haveMadeDialog = true;
    };

    $dialog_scope.checkChar = function () {
      $dialog_scope.closeHaveMadeDialog();

      if (page === 'main') {
        $main_scope.checkChar();
      } else if (page === 'single') {
        $single_scope.checkChar();
      }
    };

    $dialog_scope.closeHaveMadeDialog = function () {
      $dialog_scope.haveMadeDialog = false;
      $dialog_scope.closeDialogDiv();
    };
    /***************************文字已定制dialog **************************/

    /***************************后退dialog **************************/


    $dialog_scope.openBackDialog = function () {
      $dialog_scope.openDialogDiv();
      $dialog_scope.gobackDialog = true;
    };

    $dialog_scope.stillBack = function () {
      $dialog_scope.closeBackDialog();

      if (page === 'main') {
        $main_scope.back2Activity();
      } else if (page === 'single') {
        $single_scope.back2Main();
      }
    };

    $dialog_scope.closeBackDialog = function () {
      $dialog_scope.gobackDialog = false;
      $dialog_scope.closeDialogDiv();
    };
    /***************************后退dialog **************************/

    /***************************全局应用dialog **************************/


    $dialog_scope.openGlobleApplyDialog = function () {
      $dialog_scope.openDialogDiv();
      $dialog_scope.globleApplyDialog = true;
    };

    $dialog_scope.globleApply = function (isGloble) {
      $main_scope.globleApply(isGloble);
    };

    $dialog_scope.closeGlobleApplyDialog = function () {
      $dialog_scope.globleApplyDialog = false;
      $dialog_scope.closeDialogDiv();
    };
    /***************************全局应用dialog **************************/

    /***************************删除dialog **************************/


    $dialog_scope.openDeleteDialog = function () {
      $dialog_scope.openDialogDiv();
      $dialog_scope.deleteDialog = true;
    };

    $dialog_scope.doDelete = function () {
      if (page === 'main') {
        $main_scope.deleteHistory();
      } else if (page === 'single') {
        $single_scope.deleteCurChar();
      }
    };

    $dialog_scope.closeDeleteDialog = function () {
      $dialog_scope.deleteDialog = false;
      $dialog_scope.closeDialogDiv();
    };
    /***************************删除dialog **************************/


    $dialog_scope.refresh = function () {
      if (!$dialog_scope.$$phase) $dialog_scope.$apply();
    };

    return $dialog_scope;
  }
}; //是否有改变全局样式

var Main_Scope = {
  create: function create() {
    var $main_scope = {};
    var appElement = document.querySelector('[ng-controller=mainCtrl]');
    $main_scope = angular.element(appElement).scope();
    $main_scope.pendants = null;
    $main_scope.inputChar = '';
    $main_scope.chars = [];
    $main_scope.curchar = {};
    $main_scope.previewBgStyle = {};
    $main_scope.isFirstDiy = false;
    $main_scope.change_pinyin = false;
    $main_scope.change_main = false;
    var globle_apply_dialog_el = document.getElementById('globle_apply_dialog_el');

    $main_scope.init = function (config, resConfig) {
      this.bgColor = resConfig.bgColor;
      this.bgTintColor = resConfig.bgTintColor;
      this.colors = resConfig.colors;
      this.colorStyle = config.getColorStyle();
      this.themes = resConfig.themes;
      this.themeStyle = config.getThemeStyle();
      this.pinyins = resConfig.pinyins;
      this.pinyinId = config.getCatalogId('pinyin');
      this.backgrounds = resConfig.backgrounds;
      this.backgroundId = config.getCatalogId('background');
      this.weight = resConfig.weight;

      if (null !== this.weight) {
        //weight_input_el.min=this.weight.min;
        //weight_input_el.max=this.weight.max;
        this.weight.value = config.getDimensionValue('weight');
      }

      this.underlines = resConfig.underlines;
      this.underlineId = config.getCatalogId('underline');
      this.substitutes = resConfig.substitutes;
      this.initChars(config);
      this.isFirstDiy = historyId === '-1';
      this.NIGHT_MODE = NIGHT_MODE; //初始化导航栏图片颜色

      if (config.version & 0x10000) {
        if (!NIGHT_MODE) {
          this.navBackImage = navSrc.back["default"];
          this.navCancelImage = navSrc.cancel["default"];
        } else {
          this.navBackImage = navSrc.back.dark;
          this.navCancelImage = navSrc.cancel.dark;
        }
      } else if (config.version & 0x20000) {
        if (resConfig.navColor === '#000000') {
          this.navBackImage = navSrc.back["default"];
          this.navCancelImage = navSrc.cancel["default"];
        } else {
          this.navBackImage = navSrc.back.dark;
          this.navCancelImage = navSrc.cancel.dark;
        }
      } //初始化背景图片尺寸


      if (config.version & 0x10000) {
        this.previewBgStyle.w = 9;
        this.previewBgStyle.h = 5.4;
        this.previewBgStyle.left = 0.9;
        this.previewBgStyle.top = 3.06;
      } else if (config.version & 0x20000) {
        this.previewBgStyle.w = 10.8;
        this.previewBgStyle.h = 10.17;
        this.previewBgStyle.left = 0;
        this.previewBgStyle.top = 0;
      }

      $main_scope.refresh();
    };

    $main_scope.initChars = function (config) {
      $main_scope.chars = [];
      $main_scope.chars = _toConsumableArray(config.chars);
    }; //更新预览背景图


    $main_scope.updatePreviewBg = function (img) {
      $main_scope.previewBg = img;
      $main_scope.refresh();
    }; //更新预览图


    $main_scope.updatePreviewImg = function (img) {
      $main_scope.mainPreviewImg = img;

      if ($main_scope.change_pinyin) {
        callbackChangePinyin();
      }

      $main_scope.refresh();
    }; //更新单字预览图


    $main_scope.updateCharImg = function (obj) {
      for (var index = 0; index < $main_scope.chars.length; index++) {
        var _char = $main_scope.chars[index];

        if (_char.primary === obj.glyphIndex) {
          _char.img = obj.image;
          $main_scope.refresh(); //页面刷新

          break;
        }
      }
    }; //改变全局颜色


    $main_scope.changeColor = function (colorId) {
      if (colorId !== $main_scope.colorStyle) {
        $main_scope.change_main = true;
      }

      $main_scope.colorStyle = colorId;
      g_json_config.setColorStyle(colorId);
      getPreviewImage();
    }; //改变全局主题


    $main_scope.changeTheme = function (themeId) {
      if (themeId !== $main_scope.themeStyle) {
        $main_scope.change_main = true;
      }

      $main_scope.themeStyle = themeId;
      g_json_config.setThemeStyle(themeId);
      getPreviewImage();
    }; //开关拼音


    $main_scope.changePinyin = function (state) {
      if (state) {
        $main_scope.pinyinId = $main_scope.pinyins[1].id; //1序号表示第一个拼音
      } else {
        $main_scope.pinyinId = $main_scope.pinyins[0].id; //0序号表示默认不加拼音
      }

      g_json_config.updateCatalogId('pinyin', $main_scope.pinyinId); //拼音仅能全局定义，所以同时需要修改每个char

      g_json_config.chars.forEach(function (_char2) {
        _char2.updateCatalogId('pinyin', $main_scope.pinyinId);
      });
      getPreviewImage();
    }; //改变下划线


    $main_scope.changeUnderline = function (underlineId) {
      if (underlineId !== $main_scope.underlineId) {
        $main_scope.change_main = true;
      }

      $main_scope.underlineId = underlineId; //获取下划线改变后的预览图

      g_json_config.updateCatalogId('underline', underlineId);
      getPreviewImage();
    }; //改变背景


    $main_scope.changeBackground = function (backgroundId) {
      if (backgroundId !== $main_scope.backgroundId) {
        $main_scope.change_main = true;
      }

      $main_scope.backgroundId = backgroundId; //获取背景改变后的预览图

      g_json_config.updateCatalogId('background', backgroundId);
      getPreviewImage();
    }; //改变字重


    $main_scope.$watch('weight.value', function (newValue, oldValue) {
      //if (!MOVE_THROTTLE_FLAG) return;
      //MOVE_THROTTLE_FLAG = false;
      //throttle();
      //获取字重改变后的预览图
      if (g_json_config) {
        g_json_config.updateDimensionValue('weight', parseInt(newValue));
        getPreviewImage();
      }
    }); //改变字重

    $main_scope.updateWeight = function (per, touchstate) {
      var curWeight = $main_scope.weight.min + per * ($main_scope.weight.max - $main_scope.weight.min);
      var lastWeight = g_json_config.getDimensionValue('weight');
      var dis = Math.abs(lastWeight - curWeight);
      var ifchange = touchstate === 'end' || touchstate === 'move' && dis > 100; //获取字重改变后的预览图

      if (g_json_config && ifchange) {
        g_json_config.updateDimensionValue('weight', parseInt(curWeight));
        getPreviewImage();
      }
    };

    $main_scope.checkTab = function (e, tabIndex) {
      aniCheckTab(e); //animation.js

      $main_scope.changeTab(tabIndex);
    };

    $main_scope.changeTab = function (tabIndex) {
      if (tabIndex === '1') {
        $main_scope.openMainTab();
      } else if (tabIndex === '2') {
        $main_scope.openAddTextTab();
      }
    }; //打开删除弹框


    $main_scope.openDeleteDialog = function () {
      $dialog_scope.openDeleteDialog();
    }; //输入定制文字后


    $main_scope.addChar = function (inputchar) {
      tellAndroidstartDiySingle();
      $main_scope.inputChar = inputchar;
      var exist = null;

      for (var i = 0; i < $main_scope.chars.length; i++) {
        if ($main_scope.chars[i]["char"] === $main_scope.inputChar) {
          exist = $main_scope.chars[i];
          break;
        }
      }

      if ($main_scope.inputChar.length <= 0 || exist != null) {
        $dialog_scope.hiddenInputCharDialog(); //Toast('已定制过该字体，请重新定制字体');

        setTimeout(function () {
          $dialog_scope.openHaveMadeDialog();
          $main_scope.refresh();
        }, 100);
      } else {
        //判断字库中是否有该字，生僻字返回index=0
        var unicode = $main_scope.inputChar.charCodeAt(0);
        ET_Get_Char_Index(unicode);
      }
    }; //ET_Get_Char_Index回调函数，若不是生僻字，增加到数据中。


    $main_scope.appendChar = function (obj) {
      var unicode = $main_scope.inputChar.charCodeAt(0);
      if (unicode !== obj.unicode) return; //关闭输入框

      $dialog_scope.closeInputCharDialog();
      $main_scope.openSinglePage(unicode);
    }; //打开全局设置tab页


    $main_scope.openMainTab = function () {
      tellAndroidChangeTab('0');
    }; //打开单字定制tab页


    $main_scope.openAddTextTab = function () {
      tellAndroidChangeTab('1'); //遍历一边预览图

      for (var i = 0; i < $main_scope.chars.length; i++) {
        if ($main_scope.chars[i].primary === -1) {
          ET_Get_Char_Index($main_scope.chars[i].unicode);
        } else {
          getCharPreviewImage($main_scope.chars[i]);
        }
      }
    }; //查看已diy过的字


    $main_scope.checkChar = function () {
      var unicode = $main_scope.inputChar.charCodeAt(0);
      $main_scope.openSinglePage(unicode);
    }; //点击进入对应单字diy页面


    $main_scope.openSinglePage = function (unicode) {
      aniResetMainPageEl();
      isFirstLoadPage = false;
      openSinglePage(unicode);
    }; //点击打开输入char页面


    $main_scope.openInputCharDialog = function () {
      tellAndroidAddChar();
      $dialog_scope.openInputCharDialog('');
    }; //保存并试用


    $main_scope.saveAndTryFont = function () {
      setTimeout(function () {
        if (g_json_config.chars.length > 0 && $main_scope.change_main) {
          $dialog_scope.openGlobleApplyDialog();
          $main_scope.refresh();
          return;
        }

        ET_Set_Config();
      }, 100);
    };

    $main_scope.refresh = function () {
      if (!$main_scope.$$phase) $main_scope.$apply();
    }; //全局属性应用与所有字


    $main_scope.globleApply = function (isGlobal) {
      if (isGlobal) {
        g_json_config.chars.forEach(function (_char3) {
          _char3.setColorStyle(g_json_config.getColorStyle());

          _char3.setThemeStyle(g_json_config.getThemeStyle());

          _char3.updateCatalogId('underline', g_json_config.getCatalogId('underline'));

          _char3.updateCatalogId('background', g_json_config.getCatalogId('background'));

          _char3.updateCatalogId('substitute', -1);

          _char3.clearComponent();
        }); //应用字体后，用于重置单字属性。

        window.sessionStorage.setItem('g_json_config', angular.toJson(g_json_config));
      }

      $dialog_scope.closeGlobleApplyDialog();
      $main_scope.refresh(); //判断弹窗是否关闭，并生成字库

      var className = '';
      var intervalId = setInterval(function () {
        className = globle_apply_dialog_el.className;

        if (className.indexOf("ng-hide") !== -1) {
          clearInterval(intervalId);
          ET_Set_Config();
          return;
        }
      }, 10);
    }; //购买


    $main_scope.buyProduct = function () {
      setTimeout(function () {
        BUY_PRODUBT();
      }, 100);
    }; //打开返回提示页


    $main_scope.goback = function () {
      if ($dialog_scope.hasOpenDialog()) {
        return;
      }

      if (!g_json_config.compare(g_init_json_config)) {
        $dialog_scope.openBackDialog();
        $main_scope.refresh();
        return;
      }

      $main_scope.back2Activity();
    }; //返回其他页面


    $main_scope.back2Activity = function () {
      $dialog_scope.closeBackDialog();
      ON_BACK_ACTIVITY();
    }; //删除历史


    $main_scope.deleteHistory = function () {
      $dialog_scope.closeDeleteDialog();
      Delelte_History();
    }; //背景图片加载完成，显示页面


    $main_scope.previewBgLoaded = function () {
      initAnimation();
      closeLoading();
    };

    return $main_scope;
  }
};
var Single_Scope = {
  create: function create() {
    var $single_scope = {};
    var appElement = document.querySelector('[ng-controller=singleCtrl]');
    $single_scope = angular.element(appElement).scope();
    $single_scope.pendants = null;
    $single_scope.inputChar = '';
    $single_scope.inputInit = false;
    $single_scope.singleSize = {};
    $single_scope.chars = [];
    $single_scope.curchar = null;
    $single_scope.curacclist = null;
    $single_scope.curaccIndex = -1;
    $single_scope.charIsFirstDiy = true;
    $single_scope.change_single = false;
    var main_canvas = document.getElementById('main_canvas');
    var single_tab_el = document.getElementById('single-tab');
    var single_tab1_el = document.getElementById('single-tab1');
    var single_tab2_el = document.getElementById('single-tab2');
    var fontacc_content_el = document.getElementById('fontacc-content');

    $single_scope.init = function (config, resConfig) {
      this.bgColor = resConfig.bgColor;
      this.colors = resConfig.colors;
      this.themes = resConfig.themes;
      this.backgrounds = resConfig.backgrounds;
      this.underlines = resConfig.underlines;
      this.substitutes = resConfig.substitutes; //this.pendants = resConfig.pendants.compList;

      this.NIGHT_MODE = NIGHT_MODE; //初始化背景图片尺寸

      if (config.version & 0x10000) {
        this.diyContentH = contentH + 1.56;
        single_tab_el.style.display = 'none';
        single_tab1_el.style.display = 'none';
        single_tab2_el.style.display = 'none';
        fontacc_content_el.style.paddingTop = '0.18rem';
      } else if (config.version & 0x20000) {
        this.diyContentH = contentH;
      }

      this.initNavImg();
    }; //初始化顶部按钮图片


    $single_scope.initNavImg = function () {
      if (!NIGHT_MODE) {
        $single_scope.navBackImage = navSrc.back["default"];
        $single_scope.navCancelImage = navSrc.cancel["default"];
        $single_scope.navEditImage = navSrc.edit["default"];
      } else {
        $single_scope.navBackImage = navSrc.back.dark;
        $single_scope.navCancelImage = navSrc.cancel.dark;
        $single_scope.navEditImage = navSrc.edit.dark;
      }
    }; //初始化预览图char的size


    $single_scope.initCanvasSize = function () {
      if ($single_scope.singleSize.pixelSize === undefined) {
        var canvas_h = $single_scope.mcanvas.w * g_ratio;
        var canvas_w = parseInt(g_json_config.upem * canvas_h / g_json_config.height);
        $single_scope.singleSize.pixelSize = canvas_w * g_json_config.upem / g_json_config.advance;
        $single_scope.singleSize.offsetX = (canvas_h - canvas_w) / 2;
        $single_scope.singleSize.canvasW = canvas_w / g_ratio;
        $single_scope.singleSize.canvasH = canvas_h / g_ratio;
        $single_scope.singleSize.canvasOffsetX = $single_scope.singleSize.offsetX / g_ratio;
      } //初始化配饰列表


      if ($single_scope.curacclist === null) {
        $single_scope.curacclist = new ET_AccessoryList();
      }

      $single_scope.initCompCanvas();
    }; //初始化配饰canvas


    $single_scope.initCompCanvas = function () {
      if (comp_canvas === null) {
        comp_canvas = new ET_Canvas('comp_canvas', {
          width: $single_scope.singleSize.canvasW,
          height: $single_scope.singleSize.canvasH,
          left: $single_scope.singleSize.canvasOffsetX,
          _top: 0,
          zIndex: 80
        });
      } else {
        comp_canvas._canvas.style.display = 'block';
      }
    }; //初始化配饰列表


    $single_scope.initPendants = function (resConfig) {
      $single_scope.pendants = resConfig.pendants.compList;
    }; //初始化当前char


    $single_scope.initCurChar = function (config, unicode) {
      $single_scope.charIsFirstDiy = !config.hasChar(unicode);
      $single_scope.curchar = config.getChar(unicode);
      $single_scope.curchar.underlineId = $single_scope.curchar.getCatalogId('underline');
      $single_scope.curchar.substituteId = $single_scope.curchar.getCatalogId('substitute');
      $single_scope.curchar.backgroundId = $single_scope.curchar.getCatalogId('background');
      $single_scope.curchar.colorStyle = $single_scope.curchar.getColorStyle();
      $single_scope.curchar.themeStyle = $single_scope.curchar.getThemeStyle();
    }; //打开删除弹框


    $single_scope.openDeleteDialog = function () {
      $dialog_scope.openDeleteDialog();
    }; //删除当前编辑char


    $single_scope.deleteCurChar = function () {
      $dialog_scope.closeDeleteDialog();
      tellAndroidDeleteSingle();
      g_json_config.deleteChar($single_scope.curchar.unicode);
      $single_scope.curchar = null;
      $single_scope.back2Main();
    }; //点击打开输入char页面


    $single_scope.openInputCharDialog = function () {
      var tchar = $single_scope.curchar["char"];
      $dialog_scope.openInputCharDialog(tchar);
    }; //增加char


    $single_scope.addChar = function (inputchar) {
      $single_scope.inputChar = inputchar;
      var exist = null;

      for (var i = 0; i < g_json_config.chars.length; i++) {
        if (g_json_config.chars[i]["char"] === $single_scope.inputChar) {
          exist = g_json_config.chars[i];
          break;
        }
      }

      if ($single_scope.inputChar.length <= 0 || exist != null) {
        $dialog_scope.closeInputCharDialog();
        setTimeout(function () {
          $dialog_scope.openHaveMadeDialog();
          $single_scope.refresh();
        }, 100);
      } else {
        //获取文字在字库中的GlyphIndex，判断是否为生僻字,是否包含在字库中。
        var unicode = $single_scope.inputChar.charCodeAt(0);
        ET_Get_Char_Index(unicode);
      }
    }; //若字库中包含输入文字，则增加数据。


    $single_scope.appendChar = function (obj) {
      if ($dialog_scope.inputTextDialog === true) {
        var unicode = $single_scope.inputChar.charCodeAt(0);
        if (unicode !== obj.unicode) return;
        $single_scope.change_single = true;
        $single_scope.curchar.unicode = unicode;
        $single_scope.curchar["char"] = $single_scope.inputChar;
        $single_scope.curchar.primary = obj.glyphIndex; //获取main_canvas字符的图片

        getCharImage(); //关闭输入框

        $dialog_scope.closeInputCharDialog();
        $single_scope.refresh();
      } else {
        //获取当前文字的图片
        getSingleCharPng(obj);
      }
    }; //查看已定制的字


    $single_scope.checkChar = function () {
      var unicode = parseInt($single_scope.inputChar.charCodeAt(0));
      res_unicode = unicode;
      $single_scope.initCurChar(g_json_config, unicode);
      $single_scope.clearComp(); //获取main_canvas字符的图片

      getCharImage(); //绘制当前char的配饰

      drawComp();
    }; //改变当前编辑char的颜色


    $single_scope.changeCurCharColor = function (colorId) {
      if (colorId !== $single_scope.curchar.colorStyle) {
        $single_scope.change_single = true;
      }

      $single_scope.curchar.colorStyle = colorId;
      $single_scope.curchar.setColorStyle(colorId);
      getCharImage();
    }; //改变当前编辑char的主题


    $single_scope.changeCurCharTheme = function (themeId) {
      if (themeId !== $single_scope.curchar.themeStyle) {
        $single_scope.change_single = true;
      }

      $single_scope.curchar.themeStyle = themeId;
      $single_scope.curchar.setThemeStyle(themeId);
      getCharImage();
    }; //改变当前编辑char的下划线


    $single_scope.changeCurCharUnderline = function (underlineId) {
      if (underlineId !== $single_scope.curchar.getCatalogId('underline')) {
        $single_scope.change_single = true;
      }

      $single_scope.curchar.underlineId = underlineId; //获取下划线改变后的预览图

      $single_scope.curchar.updateCatalogId('underline', underlineId);
      getCharImage();
    }; //改变当前编辑char的字形


    $single_scope.changeCurCharSubstitues = function (substituteId) {
      if (substituteId !== $single_scope.curchar.getCatalogId('substitute')) {
        $single_scope.change_single = true;
      }

      $single_scope.curchar.substituteId = substituteId; //获取字形改变后的预览图

      $single_scope.curchar.updateCatalogId('substitute', substituteId);
      getCharImage();
    }; //改变当前编辑char的背景


    $single_scope.changeCurCharBackground = function (backgroundId) {
      if (backgroundId !== $single_scope.curchar.getCatalogId('background')) {
        $single_scope.change_single = true;
      }

      $single_scope.curchar.backgroundId = backgroundId; //获取背景改变后的预览图

      $single_scope.curchar.updateCatalogId('background', backgroundId);
      getCharImage();
    }; //改变当前编辑char的配饰


    $single_scope.addComp = function (gId, compo) {
      if (compo === null) {
        $single_scope.change_single = true;
      }

      if ($single_scope.curchar !== null) {
        //新增配饰判断是否可以新增。最多有三个
        if ($single_scope.curacclist.getLength() === MAX_ACC_NUM && compo === null) {
          Toast('单字最多只能添加 3 个贴纸');
          return;
        }

        var timestamp = new Date().getTime();
        var canvas_h = $single_scope.mcanvas.h * g_ratio;
        var len = 0;

        for (var i = 0; i < $single_scope.curacclist.getLength(); i++) {
          var _acc = $single_scope.curacclist.getAccessory(i);

          if (!_acc.MOVED) {
            len += 1;
          }
        }

        var dX = len * g_comp_init_dis * g_ratio;
        var dY = len * g_comp_init_dis * g_ratio;
        var acc = new ET_Accessory(gId, timestamp, $single_scope.singleSize.pixelSize, canvas_h, canvas_h, 0, 0, dX, dY);

        if (compo != null) {
          acc.update(compo);
        }

        $single_scope.curacclist.appendAccessory(acc);
        $single_scope.curaccIndex = $single_scope.curacclist.getLength() - 1;
        var mtx = new ET_Matrix();

        if (compo != null) {
          mtx.compose(compo.sx, compo.sy, compo.degree, compo.dx, compo.dy);
        } else {
          mtx.compose(acc.scalex, acc.scaley, 0, acc.dx, acc.dy);
        }

        ET_Get_Component_Accessory_PNG(timestamp, gId, $single_scope.singleSize.pixelSize, CHAR_COLOR, mtx.xx, mtx.xy, mtx.yx, mtx.yy, mtx.dx, mtx.dy);
      }
    }; //更换tab页


    $single_scope.checkTab = function (e, tabIndex) {
      aniCheckTab(e); //animation.js

      $single_scope.changeTab(tabIndex);
    };

    $single_scope.changeTab = function (tabIndex) {
      refreshComp(tabIndex);
    }; //获取当前配饰index


    $single_scope.getCurAccIndex = function () {
      return $single_scope.curaccIndex;
    }; //更新当前配饰index


    $single_scope.updateCurAccIndex = function (index) {
      $single_scope.curaccIndex = index;
      $single_scope.refresh();
    }; //删除配饰


    $single_scope.delCompFromCurList = function (index) {
      $single_scope.curacclist.deleteCurAccessory(index);
      $single_scope.change_single = true;
    }; //改变当前单字配置


    $single_scope.setSingleState = function (state) {
      if (!$single_scope.change_single && state) {
        $single_scope.change_single = state;
        $single_scope.refresh();
      } else {
        $single_scope.change_single = state;
      }
    }; //将当前char的临时属性更新至json中


    $single_scope.updateCurChar = function () {
      if ($single_scope.curchar != null && g_json_config != null) {
        if ($single_scope.curacclist != null) {
          $single_scope.curchar.updateComponents($single_scope.curacclist);
        }

        if (g_json_config.hasChar(res_unicode)) {
          g_json_config.replaceChar(res_unicode, $single_scope.curchar);
        } else {
          g_json_config.updateChar($single_scope.curchar);
        }
      }
    }; //打开返回提示页


    $single_scope.goback = function () {
      if ($dialog_scope.hasOpenDialog()) {
        return;
      }

      if ($single_scope.curchar != null && g_json_config != null && $single_scope.curacclist != null) {
        $single_scope.curchar.updateComponents($single_scope.curacclist);
      }

      if ($single_scope.change_single) {
        $dialog_scope.openBackDialog();
        $single_scope.refresh();
        return;
      }

      $single_scope.back2Main();
    }; //返回main页面


    $single_scope.back2Main = function () {
      //window.history.back('-1');
      back2main = true;
      $single_scope.clearData();
      $single_scope.clearComp();
      clearCanvas(main_canvas);
      aniResetSinglePageEl();
      openMainPage();
    };

    $single_scope.clearData = function () {
      $single_scope.chars = [];
      $single_scope.curchar = null;
      $single_scope.charIsFirstDiy = true;
      $single_scope.change_single = false;
    }; //保存当前编辑效果


    $single_scope.save = function () {
      setTimeout(function () {
        tellAndroidSaveCurChar();

        if ($single_scope.curchar != null) {
          $single_scope.updateCurChar();
        }

        $single_scope.back2Main();
      }, 100);
    }; //清空配饰列表


    $single_scope.clearComp = function () {
      $single_scope.curacclist.clear();
      $single_scope.curaccIndex = -1;
      clearCanvas(comp_canvas._canvas);
    };

    $single_scope.refresh = function () {
      if (!$single_scope.$$phase) $single_scope.$apply();
    };

    return $single_scope;
  }
};