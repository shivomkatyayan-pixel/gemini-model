"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var _target = null;
var _action = null;
var _scaleX = 0;
var _scaleY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _ex = 0;
var _ey = 0;
var _ex1 = 0;
var _ey1 = 0;
var _ex2 = 0;
var _ey2 = 0;
var _left = 0;
var _top = 0;
var _theta = 0;
var _centerX = 0;
var _centerY = 0;
var lastX = 0;
var lastY = 0;
var doubletouch = false;
var doubletouchconut = 0;
var flag2 = false; //双指校验

var ET_Canvas = /*#__PURE__*/function () {
  //构造函数
  function ET_Canvas(el, oConfig) {
    _classCallCheck(this, ET_Canvas);

    this.index = null;
    this.curAccIndex = null;
    this.accCount = 0;
    this.accList = [];
    this._canvas = null;
    this._context = null;
    this._oConfig = null;
    this.canvas_offsetX = 0;
    this.canvas_offsetY = 0;
    this.isSelected = false;
    this.onfocus = true;
    this.doubletouchEl = document.getElementById("toucharea");

    if (this._initElement(el)) {
      this._initConfig(oConfig);

      this._initEvents();
    }
  }

  _createClass(ET_Canvas, [{
    key: "_initElement",
    value: function _initElement(el) {
      var exist = false;
      var canvases = document.getElementsByTagName('canvas');

      for (var i = 0; i < canvases.length; i++) {
        var id = canvases[i].id;

        if (id == el) {
          exist = true;
          this._canvas = document.getElementById(el);
          this._context = this._canvas.getContext('2d');
        }
      }

      return exist;
    }
  }, {
    key: "_initConfig",
    value: function _initConfig(oConfig) {
      this._oConfig = oConfig;
      this._canvas.width = this._oConfig.width * g_ratio;
      this._canvas.height = this._oConfig.height * g_ratio;
      this._canvas.style.width = this._oConfig.width + 'px';
      this._canvas.style.height = this._oConfig.height + 'px';
      this._canvas.style.left = px2int(this._canvas.style.left) + this._oConfig.left + 'px';
      this._canvas.style.top = px2int(this._canvas.style.top) + this._oConfig._top + 'px';
      this._canvas.style.zIndex = this._oConfig.zIndex;
      this.canvas_offsetX = $single_scope.mcanvas.previewL;
      this.canvas_offsetY = $single_scope.mcanvas.previewT;
    }
  }, {
    key: "_initEvents",
    value: function _initEvents() {
      var _this = this;
      /*
      if( this._canvas.id == 'comp_canvas' ){
          this._canvas.addEventListener( 'touchstart', function(event){_this.onTouchStart(event,_this)}, false);
          this._canvas.addEventListener( 'touchmove', function(event){_this.onTouchMove(event,_this)}, false);
          this._canvas.addEventListener( 'touchend', function(event){_this.onTouchEnd(event,_this)}, false);
      }
      */


      this.doubletouchEl.addEventListener('touchstart', function (event) {
        _this.onTouchStart(event, _this);
      }, false);
      this.doubletouchEl.addEventListener('touchmove', function (event) {
        _this.onTouchMove(event, _this);
      }, false);
      this.doubletouchEl.addEventListener('touchend', function (event) {
        _this.onTouchEnd(event, _this);
      }, false);
      this.doubletouchEl.addEventListener('click', function (event) {
        _this.chooseAcc(event, _this);
      }, false);
    }
  }, {
    key: "onTouchStart",
    value:
    /**
     * canvas的点击事件
     */
    function onTouchStart(event, _this) {
      if (!_this.onfocus) return; //不在配饰tab页,不触发位置调整方法。
      //event = event || window.event;

      var accIndex = $single_scope.getCurAccIndex();
      if (accIndex < 0) return; //获取当前配饰

      var acc = $single_scope.curacclist.getAccessory(accIndex);
      _target = acc;
      _scaleX = acc.scalex;
      _scaleY = acc.scaley;
      _centerX = (acc.oCoords.tl.x + acc.oCoords.br.x) / 2;
      _centerY = (acc.oCoords.tl.y + acc.oCoords.br.y) / 2;
      _theta = acc.theta;

      if (event.targetTouches.length >= 2) {
        doubletouch = true;
        flag2 = true;
        var xpos1 = event.targetTouches[0].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
        var ypos1 = event.targetTouches[0].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
        var xpos2 = event.targetTouches[1].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
        var ypos2 = event.targetTouches[1].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
        xpos1 *= g_ratio;
        ypos1 *= g_ratio;
        xpos2 *= g_ratio;
        ypos2 *= g_ratio;
        _action = 'no';
        _ex1 = xpos1;
        _ey1 = ypos1;
        _ex2 = xpos2;
        _ey2 = ypos2;
      } else if (event.targetTouches.length === 1) {
        doubletouch = false;
        var xpos = event.targetTouches[0].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
        var ypos = event.targetTouches[0].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
        xpos *= g_ratio;
        ypos *= g_ratio;
        lastX = xpos;
        lastY = ypos;

        var action = _this.findAccCorner(xpos, ypos, acc);

        _action = action;
        _ex = xpos;
        _ey = ypos;
      }
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(event, _this) {
      event.preventDefault();
      if (!_this.onfocus || !_target) return; //不在配饰tab页,不触发位置调整方法。
      //event = event || window.event;
      //不绘制按钮

      if (event.targetTouches.length >= 2 && flag2) {
        if (_target !== null && event.targetTouches[1]) {
          var xpos1 = event.targetTouches[0].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
          var ypos1 = event.targetTouches[0].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
          var xpos2 = event.targetTouches[1].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
          var ypos2 = event.targetTouches[1].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
          xpos1 *= g_ratio;
          ypos1 *= g_ratio;
          xpos2 *= g_ratio;
          ypos2 *= g_ratio;

          if (!_target.can_rotate_scale(_ex1, _ey1, _ex2, _ey2, _centerX, _centerY, _theta, _scaleX, _scaleY, xpos1, ypos1, xpos2, ypos2, _this._canvas.width, _this._canvas.height)) {
            _action = 'no';
            return;
          }

          _target.do_doubletouch_rotate(_ex1, _ey1, _ex2, _ey2, _centerX, _centerY, _theta, xpos1, ypos1, xpos2, ypos2);

          _target.do_doubletouch_scale(_ex1, _ey1, _ex2, _ey2, _centerX, _centerY, _scaleX, _scaleY, xpos1, ypos1, xpos2, ypos2);

          _target.set_move(true);
        }
      } else if (event.targetTouches.length === 1 && !doubletouch) {
        var xpos = event.targetTouches[0].pageX - _this._canvas.offsetLeft - _this.canvas_offsetX;
        var ypos = event.targetTouches[0].pageY - _this._canvas.offsetTop - _this.canvas_offsetY;
        xpos *= g_ratio;
        ypos *= g_ratio;

        if (_target != null) {
          if (_action == 'translate') {
            if (_target.can_move(xpos - lastX, ypos - lastY, _this._canvas.width, _this._canvas.height)) {
              _target.do_translate(xpos - lastX, ypos - lastY);

              _target.set_move(true);
            }
          } else if (_action == 'scale') {
            if (!_target.can_scale(_ex, _ey, _centerX, _centerY, _scaleX, _scaleY, xpos, ypos, _this._canvas.width, _this._canvas.height)) {
              _action = 'no';
              return;
            }

            _target.do_scale(_ex, _ey, _centerX, _centerY, _scaleX, _scaleY, xpos, ypos);

            _target.set_move(true);
          } else if (_action == 'rotate') {
            _target.do_rotate(_ex, _ey, _centerX, _centerY, _theta, xpos, ypos);

            _target.set_move(true);
          }
        }

        lastX = xpos;
        lastY = ypos;
      }

      _this.renderCompCanvas(comp_canvas, false);
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd(event, _this) {
      flag2 = false;
      if (!_this.onfocus) return; //不在配饰tab页,不触发位置调整方法。

      var accIndex = $single_scope.getCurAccIndex();

      if (accIndex > -1 && _action == 'delete') {
        $single_scope.delCompFromCurList(accIndex);
        /*
        if( $single_scope.curacclist.getLength() >= 0 ){
            accIndex = $single_scope.curacclist.getLength() - 1;
            $single_scope.updateCurAccIndex( accIndex );
        }
        */

        _this.renderCompCanvas(comp_canvas, true);

        _action = 'no';
        return;
      }

      _action = 'no'; // 更新config
      // 重新获取图片，刷新界面

      if (_target) {
        $single_scope.setSingleState(true);

        _target.redraw();
      }
    }
  }, {
    key: "chooseAcc",
    value: function chooseAcc(event, _this) {
      if (!_this) return;
      var xpos = event.offsetX - _this._canvas.offsetLeft;
      var ypos = event.offsetY - _this._canvas.offsetTop;
      xpos *= g_ratio;
      ypos *= g_ratio;
      lastX = xpos;
      lastY = ypos;
      var res_accIndex = $single_scope.getCurAccIndex();

      var cur_accIndex = _this.getAccIndex(xpos, ypos);

      if (res_accIndex === cur_accIndex || cur_accIndex < 0) {
        $single_scope.updateCurAccIndex(-1);

        _this.renderCompCanvas(comp_canvas, true);

        return;
      }

      if (cur_accIndex > -1) {
        $single_scope.updateCurAccIndex(cur_accIndex);

        _this.renderCompCanvas(comp_canvas, true);
      } else {
        _target = null;
      }
    }
  }, {
    key: "focus",
    value: function focus(isfocus) {
      this.onfocus = isfocus;
    }
  }, {
    key: "getAccRect",
    value: function getAccRect(coords) {
      var poly = [];
      var tl = {
        x: 0,
        y: 0
      };
      var tr = {
        x: 0,
        y: 0
      };
      var br = {
        x: 0,
        y: 0
      };
      var bl = {
        x: 0,
        y: 0
      };
      tl.x = coords.tl.x;
      tl.y = coords.tl.y;
      poly.push(tl);
      tr.x = coords.tr.x;
      tr.y = coords.tr.y;
      poly.push(tr);
      br.x = coords.br.x;
      br.y = coords.br.y;
      poly.push(br);
      bl.x = coords.bl.x;
      bl.y = coords.bl.y;
      poly.push(bl);
      return poly;
    }
  }, {
    key: "isPointInPolygon",
    value: function isPointInPolygon(ex, ey, polygon) {
      var i,
          j = 3;
      var inside = false;

      for (i = 0; i < 4; j = i++) {
        if (polygon[i].y > ey != polygon[j].y > ey) {
          var xi = (polygon[j].x - polygon[i].x) * (ey - polygon[i].y) / (polygon[j].y - polygon[i].y);
          if (polygon[i].x + xi > ex) inside = !inside;
        }
      }

      return inside;
    }
  }, {
    key: "findAccCorner",
    value: function findAccCorner(ex, ey, acc) {
      var poly = this.getAccRect(acc.oCoords.tl.corner);
      var inside = this.isPointInPolygon(ex, ey, poly);
      if (inside) return 'delete';
      poly = this.getAccRect(acc.oCoords.br.corner);
      inside = this.isPointInPolygon(ex, ey, poly);
      if (inside) return 'scale';
      poly = this.getAccRect(acc.oCoords.tr.corner);
      inside = this.isPointInPolygon(ex, ey, poly);
      if (inside) return 'rotate';
      return 'translate';
    }
  }, {
    key: "getAccIndex",
    value: function getAccIndex(x, y) {
      for (var i = $single_scope.curacclist.getLength() - 1; i >= 0; i--) {
        var ctx = comp_canvas._canvas.getContext('2d');

        var acc = $single_scope.curacclist.accessories[i];
        var poly = this.getAccRect(acc.oCoords);
        var inside = this.isPointInPolygon(x, y, poly);
        var polyd = this.getAccRect(acc.oCoords.tl.corner);
        var insided = this.isPointInPolygon(x, y, polyd);
        var polyr = this.getAccRect(acc.oCoords.tr.corner);
        var insider = this.isPointInPolygon(x, y, polyr);
        var polys = this.getAccRect(acc.oCoords.br.corner);
        var insides = this.isPointInPolygon(x, y, polys);
        if (inside || insided || insider || insides) return i;
      }

      return -1;
    }
  }, {
    key: "renderMainCanvas",
    value:
    /**
     * 绘制
     */
    function renderMainCanvas(tmp_canvas) {
      var can = tmp_canvas._canvas;
      can.getContext('2d').drawImage($single_scope.curchar.img, 0, 0, can.width, can.height);
    }
  }, {
    key: "renderCompCanvas",
    value: function renderCompCanvas(tmp_canvas, drawCorner) {
      var can = tmp_canvas._canvas;
      var accList = $single_scope.curacclist.accessories;
      clearCanvas(can);
      var ctx = can.getContext('2d');

      for (var i = 0; i < accList.length; i++) {
        var acc = accList[i];

        if ($single_scope.curaccIndex == i) {
          acc.render(ctx, drawCorner, true, tmp_canvas.onfocus);
        } else {
          acc.render(ctx, false, false, tmp_canvas.onfocus);
        }
      }
    }
  }]);

  return ET_Canvas;
}(); //清空canvas


var clearCanvas = function clearCanvas(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}; //canvas上绘制图片


var canvasDrawImg = function canvasDrawImg(canvas, img, x, y, width, height) {
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height, x, y, width, height);
}; //canvas上绘制新增配饰


var canvasDrawAcc = function canvasDrawAcc(tmp_canvas, accList, curIndex) {
  var can = tmp_canvas._canvas;
  clearCanvas(tmp_canvas._canvas);
  var ctx = can.getContext('2d');

  for (var i = 0; i < accList.getLength(); i++) {
    var acc = accList.accessories[i];

    if (curIndex == i) {
      acc.render(ctx, true, true, tmp_canvas.onfocus);
    } else {
      acc.render(ctx, false, false, tmp_canvas.onfocus);
    }
  }
};