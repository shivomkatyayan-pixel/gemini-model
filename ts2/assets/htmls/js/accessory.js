"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var c_scalex = 1;
var c_scaley = 1;
var c_theta = 0;
var cur_oCoords = {};

var ET_Accessory = /*#__PURE__*/function () {
  //构造函数
  function ET_Accessory(index, tm, pixelSize, canvasWidth, canvasHeight, offsetX, offsetY, dx, dy) {
    _classCallCheck(this, ET_Accessory);

    this.glyphIndex = 0;
    this.ACC_CANVAS = 'canvas-Imgessory';
    this.img = {};
    this.canvasIndex = 0;
    this.point = {};
    this._oConfig = null;
    this._top = 0;
    this.left = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.oCoords = null;
    this.dx = 0;
    this.dy = 0;
    this.angle = 0;
    this.theta = null;
    this.scalex = 1;
    this.scaley = 1;
    this.cornersize = 0;
    this.polaroidheight = null;
    this.randomposition = null;
    this.pixelSize = 10;
    this.png_theta = 0;
    this.png_scalex = 1;
    this.png_scaley = 1;
    this.png_dx = 0;
    this.png_dy = 0;
    this.selected = null;
    this.bordervisibility = false;
    this.cornervisibility = false;
    this.timestamp = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.MOVED = false; //是否移动过

    this._initElement(index, tm, pixelSize, offsetX, offsetY);

    this._initConfig(canvasWidth, canvasHeight);

    this.do_translate(dx, dy);
  }
  /**
   * 初始话数据
   * @param index
   * @param tm
   * @param pixelSize
   * @param offsetX
   * @param offsetY
   * @private
   */


  _createClass(ET_Accessory, [{
    key: "_initElement",
    value: function _initElement(index, tm, pixelSize, offsetX, offsetY) {
      this.glyphIndex = index;
      this.timestamp = tm;
      this.pixelSize = pixelSize;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
    }
  }, {
    key: "_initConfig",
    value: function _initConfig(width, height) {
      this.png_theta = 0;
      this.png_scalex = 1;
      this.png_scaley = 1;
      this.png_dx = 0;
      this.png_dy = 0;
      this.dx = 0;
      this.dy = 0;
      this.scalex = 1 / 3;
      this.scaley = 1 / 3;
      this.angle = 0;
      this.theta = this.angle * Math.PI / 180;
      width *= this.scalex;
      height *= this.scaley;
      this.width = width;
      this.height = height;
      this.maxWidth = width;
      this.maxHeight = height;
      this.img = new Image();
      this.img.width = width;
      this.img.height = height;
      this.cornersize = 25 * g_ratio;
    }
  }, {
    key: "updateImageCoords",
    value: function updateImageCoords() {
      var upem = g_json_config.upem;
      var height = g_json_config.height;
      var ll = (height - upem) / 2;
      var tl = {
        x: -ll,
        y: 0
      };
      var tr = {
        x: -ll + height,
        y: 0
      };
      var br = {
        x: -ll + height,
        y: height
      };
      var bl = {
        x: -ll,
        y: height
      }; //let csize = this.cornersize;//this.cornersize / this.scalex;

      var curMtx = new ET_Matrix();
      var ang = this.theta * 180 / Math.PI;
      var scale = new ET_Matrix();
      scale.xx = scale.yy = parseInt(this.pixelSize) / upem;
      curMtx.compose(this.scalex, this.scaley, ang, this.dx, this.dy);
      curMtx.matrix_pre_multiply(scale);
      curMtx.vector_multiply(tl);
      curMtx.vector_multiply(tr);
      curMtx.vector_multiply(br);
      curMtx.vector_multiply(bl);
      var dis = this.cornersize / 2;
      tl.corner = {
        tl: {
          x: tl.x - dis,
          y: tl.y - dis
        },
        tr: {
          x: tl.x + dis,
          y: tl.y - dis
        },
        br: {
          x: tl.x + dis,
          y: tl.y + dis
        },
        bl: {
          x: tl.x - dis,
          y: tl.y + dis
        }
      };
      tr.corner = {
        tl: {
          x: tr.x - dis,
          y: tr.y - dis
        },
        tr: {
          x: tr.x + dis,
          y: tr.y - dis
        },
        br: {
          x: tr.x + dis,
          y: tr.y + dis
        },
        bl: {
          x: tr.x - dis,
          y: tr.y + dis
        }
      };
      br.corner = {
        tl: {
          x: br.x - dis,
          y: br.y - dis
        },
        tr: {
          x: br.x + dis,
          y: br.y - dis
        },
        br: {
          x: br.x + dis,
          y: br.y + dis
        },
        bl: {
          x: br.x - dis,
          y: br.y + dis
        }
      };
      /*
                      curMtx.vector_multiply(tl.corner.tl);
                      curMtx.vector_multiply(tl.corner.tr);
                      curMtx.vector_multiply(tl.corner.bl);
                      curMtx.vector_multiply(tl.corner.br);
                        curMtx.vector_multiply(tr.corner.tl);
                      curMtx.vector_multiply(tr.corner.tr);
                      curMtx.vector_multiply(tr.corner.bl);
                      curMtx.vector_multiply(tr.corner.br);
                        curMtx.vector_multiply(br.corner.tl);
                      curMtx.vector_multiply(br.corner.tr);
                      curMtx.vector_multiply(br.corner.bl);
                      curMtx.vector_multiply(br.corner.br);
         */

      this.oCoords = {
        tl: tl,
        tr: tr,
        br: br,
        bl: bl
      };
    }
  }, {
    key: "update",
    value: function update(compo) {
      this.dx = compo.dx;
      this.dy = compo.dy;
      this.theta = compo.degree * Math.PI / 180;
      this.scalex = compo.sx;
      this.scaley = compo.sy;
    }
  }, {
    key: "can_move",
    value: function can_move(move_x, move_y, c_width, c_height) {
      var min_x = Math.min(this.oCoords.tl.x, this.oCoords.bl.x, this.oCoords.br.x, this.oCoords.tr.x) + move_x + this.offsetX;
      var max_x = Math.max(this.oCoords.tl.x, this.oCoords.bl.x, this.oCoords.br.x, this.oCoords.tr.x) + move_x + this.offsetX;
      var min_y = Math.min(this.oCoords.tl.y, this.oCoords.bl.y, this.oCoords.br.y, this.oCoords.tr.y) + move_y + this.offsetY;
      var max_y = Math.max(this.oCoords.tl.y, this.oCoords.bl.y, this.oCoords.br.y, this.oCoords.tr.y) + move_y + this.offsetY;
      var s = 0.1;

      if (min_x >= c_width * (1 - s) || max_x <= c_width * s || min_y >= c_height * (1 - s) || max_y <= c_height * s) {
        return false;
      }

      return true;
    }
  }, {
    key: "can_scale",
    value: function can_scale(_ex, _ey, _cx, _cy, _scaleX, _scaleY, startX, startY, c_width, c_height) {
      var lastLen = Math.sqrt(Math.pow(_ey - _cy, 2) + Math.pow(_ex - _cx, 2));
      var curLen = Math.sqrt(Math.pow(startY - _cy, 2) + Math.pow(startX - _cx, 2));
      c_scalex = _scaleX * curLen / lastLen;
      c_scaley = _scaleY * curLen / lastLen;

      if (this.pixelSize * c_scalex < this.cornersize || c_scalex > 1.2) {
        return false;
      }

      var upem = g_json_config.upem;
      var tl = {
        x: 0,
        y: 0
      };
      var tr = {
        x: upem,
        y: 0
      };
      var br = {
        x: upem,
        y: upem
      };
      var bl = {
        x: 0,
        y: upem
      };
      var curMtx = new ET_Matrix();
      var scale = new ET_Matrix();
      scale.xx = scale.yy = parseInt(this.pixelSize) / upem;
      curMtx.compose(c_scalex, c_scaley, this.angle, this.dx, this.dy);
      curMtx.matrix_pre_multiply(scale);
      curMtx.vector_multiply(tl);
      curMtx.vector_multiply(tr);
      curMtx.vector_multiply(br);
      curMtx.vector_multiply(bl);
      cur_oCoords = {
        tl: tl,
        tr: tr,
        br: br,
        bl: bl
      };
      var min_x = Math.min(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var max_x = Math.max(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var min_y = Math.min(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;
      var max_y = Math.max(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;
      var s = 0.1;

      if (min_x >= c_width * (1 - s) || max_x <= c_width * s || min_y >= c_height * (1 - s) || max_y <= c_height * s) {
        return false;
      }

      return true;
    }
  }, {
    key: "can_rotate",
    value: function can_rotate(_ex, _ey, _cx, _cy, _theta, startX, startY, c_width, c_height) {
      var lastAngle = Math.atan2(_ey - _cy, _ex - _cx);
      var curAngle = Math.atan2(startY - _cy, startX - _cx);
      c_theta = curAngle - lastAngle + _theta;
      var upem = g_json_config.upem;
      var tl = {
        x: 0,
        y: 0
      };
      var tr = {
        x: upem,
        y: 0
      };
      var br = {
        x: upem,
        y: upem
      };
      var bl = {
        x: 0,
        y: upem
      };
      var curMtx = new ET_Matrix();
      var ang = c_theta * 180 / Math.PI;
      var scale = new ET_Matrix();
      scale.xx = scale.yy = parseInt(this.pixelSize) / upem;
      curMtx.compose(this.scalex, this.scaley, ang, this.dx, this.dy);
      curMtx.matrix_pre_multiply(scale);
      curMtx.vector_multiply(tl);
      curMtx.vector_multiply(tr);
      curMtx.vector_multiply(br);
      curMtx.vector_multiply(bl);
      cur_oCoords = {
        tl: tl,
        tr: tr,
        br: br,
        bl: bl
      };
      var min_x = Math.min(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var max_x = Math.max(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var min_y = Math.min(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;
      var max_y = Math.max(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;

      if (max_x >= c_width - 2 || min_x <= 2 || max_y >= c_height - 2 || min_y <= 2) {
        return false;
      }

      return true;
    }
  }, {
    key: "can_rotate_scale",
    value: function can_rotate_scale(_ex1, _ey1, _ex2, _ey2, _cx, _cy, _theta, _scaleX, _scaleY, startX1, startY1, startX2, startY2, c_width, c_height) {
      var lastAngle = Math.atan2(_ey2 - _ey1, _ex2 - _ex1);
      var curAngle = Math.atan2(startY2 - startY1, startX2 - startX1);
      var lastLen = Math.sqrt(Math.pow(_ey2 - _ey1, 2) + Math.pow(_ex2 - _ex1, 2));
      var curLen = Math.sqrt(Math.pow(startY2 - startY1, 2) + Math.pow(startX2 - startX1, 2));
      c_theta = curAngle - lastAngle + _theta;
      c_scalex = _scaleX * curLen / lastLen;
      c_scaley = _scaleY * curLen / lastLen;

      if (this.pixelSize * c_scalex < this.cornersize || c_scalex > 1.2) {
        return false;
      }

      var upem = g_json_config.upem;
      var tl = {
        x: 0,
        y: 0
      };
      var tr = {
        x: upem,
        y: 0
      };
      var br = {
        x: upem,
        y: upem
      };
      var bl = {
        x: 0,
        y: upem
      };
      var curMtx = new ET_Matrix();
      var ang = c_theta * 180 / Math.PI;
      var scale = new ET_Matrix();
      scale.xx = scale.yy = parseInt(this.pixelSize) / upem;
      curMtx.compose(c_scalex, c_scaley, ang, this.dx, this.dy);
      curMtx.matrix_pre_multiply(scale);
      curMtx.vector_multiply(tl);
      curMtx.vector_multiply(tr);
      curMtx.vector_multiply(br);
      curMtx.vector_multiply(bl);
      cur_oCoords = {
        tl: tl,
        tr: tr,
        br: br,
        bl: bl
      };
      var min_x = Math.min(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var max_x = Math.max(cur_oCoords.tl.x, cur_oCoords.bl.x, cur_oCoords.br.x, cur_oCoords.tr.x) + this.offsetX;
      var min_y = Math.min(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;
      var max_y = Math.max(cur_oCoords.tl.y, cur_oCoords.bl.y, cur_oCoords.br.y, cur_oCoords.tr.y) + this.offsetY;
      var s = 0.1;

      if (min_x >= c_width * (1 - s) || max_x <= c_width * s || min_y >= c_height * (1 - s) || max_y <= c_height * s) {
        return false;
      }

      return true;
    }
  }, {
    key: "do_translate",
    value: function do_translate(dx, dy) {
      var upem = g_json_config.upem;
      this.dx = parseFloat(this.dx) + parseFloat(dx) * upem / parseInt(this.pixelSize);
      this.dy = parseFloat(this.dy) + parseFloat(dy) * upem / parseInt(this.pixelSize);
    }
  }, {
    key: "do_doubletouch_scale",
    value: function do_doubletouch_scale(_ex1, _ey1, _ex2, _ey2, _cx, _cy, _scaleX, _scaleY, startX1, startY1, startX2, startY2) {
      var lastLen = Math.sqrt(Math.pow(_ey2 - _ey1, 2) + Math.pow(_ex2 - _ex1, 2));
      var curLen = Math.sqrt(Math.pow(startY2 - startY1, 2) + Math.pow(startX2 - startX1, 2));
      this.scalex = _scaleX * curLen / lastLen;
      this.scaley = _scaleY * curLen / lastLen;
    }
  }, {
    key: "do_doubletouch_rotate",
    value: function do_doubletouch_rotate(_ex1, _ey1, _ex2, _ey2, _cx, _cy, _theta, startX1, startY1, startX2, startY2) {
      var lastAngle = Math.atan2(_ey1 - _ey2, _ex1 - _ex2);
      var curAngle = Math.atan2(startY1 - startY2, startX1 - startX2);
      this.theta = curAngle - lastAngle + _theta;
    }
  }, {
    key: "do_scale",
    value: function do_scale(_ex, _ey, _cx, _cy, _scaleX, _scaleY, startX, startY) {
      var lastLen = Math.sqrt(Math.pow(_ey - _cy, 2) + Math.pow(_ex - _cx, 2));
      var curLen = Math.sqrt(Math.pow(startY - _cy, 2) + Math.pow(startX - _cx, 2));
      this.scalex = _scaleX * curLen / lastLen;
      this.scaley = _scaleY * curLen / lastLen;
    }
  }, {
    key: "do_rotate",
    value: function do_rotate(_ex, _ey, _cx, _cy, _theta, startX, startY) {
      var lastAngle = Math.atan2(_ey - _cy, _ex - _cx);
      var curAngle = Math.atan2(startY - _cy, startX - _cx);
      this.theta = curAngle - lastAngle + _theta;
    }
  }, {
    key: "set_move",
    value: function set_move(move) {
      this.MOVED = move;
    }
  }, {
    key: "isSameMatrix",
    value: function isSameMatrix() {
      if (this.dx == this.png_dx && this.dy == this.png_dy && this.theta == this.png_theta && this.scalex == this.png_scalex && this.scaley == this.png_scaley) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "drawBorder",
    value: function drawBorder(context, coords) {
      context.strokeStyle = '#FFFFFF'; //rgba(0, 0, 0, 0.2)';
      //context.setLineDash([5]);

      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(coords.tl.x, coords.tl.y);
      context.lineTo(coords.tr.x, coords.tr.y);
      context.lineTo(coords.br.x, coords.br.y);
      context.lineTo(coords.bl.x, coords.bl.y);
      context.closePath();
      context.stroke();
    }
  }, {
    key: "drawDeleteCorner",
    value: function drawDeleteCorner(context, icon_img, corner) {
      loadImage(icon_img.src, function () {
        context.drawImage(this, corner.tl.x, corner.tl.y, corner.tr.x - corner.tl.x, corner.bl.y - corner.tl.y);
      });
      /*
      context.fillStyle = style;
      context.beginPath();
      context.moveTo(corner.tl.x, corner.tl.y);
      context.lineTo(corner.tr.x, corner.tr.y);
      context.lineTo(corner.br.x, corner.br.y);
      context.lineTo(corner.bl.x, corner.bl.y);
      context.closePath();
      context.fill();*/
    }
  }, {
    key: "drawScaleCorner",
    value: function drawScaleCorner(context, icon_img, corner) {
      loadImage(icon_img.src, function () {
        context.drawImage(this, corner.tl.x, corner.tl.y, corner.tr.x - corner.tl.x, corner.bl.y - corner.tl.y);
      });
    }
  }, {
    key: "drawRotateCorner",
    value: function drawRotateCorner(context, icon_img, corner) {
      loadImage(icon_img.src, function () {
        context.drawImage(this, corner.tl.x, corner.tl.y, corner.tr.x - corner.tl.x, corner.bl.y - corner.tl.y);
      });
    }
  }, {
    key: "redraw",
    value: function redraw() {
      var mtx = new ET_Matrix();
      var ang = this.theta * 180 / Math.PI;
      mtx.compose(this.scalex, this.scaley, ang, this.dx, this.dy);
      ET_Get_Component_Accessory_PNG(this.timestamp, this.glyphIndex, this.pixelSize, CHAR_COLOR, mtx.xx, mtx.xy, mtx.yx, mtx.yy, mtx.dx, mtx.dy);
    }
  }, {
    key: "render",
    value: function render(context, bDrawCorner, bDrawBorder, bOnFocus) {
      var src = this.img.src;

      var _this = this;

      loadImage(src, function () {
        context.save();
        context.translate(_this.offsetX, _this.offsetY);

        if (!_this.isSameMatrix()) {
          var upem = g_json_config.upem;
          var scale = new ET_Matrix();
          scale.xx = scale.yy = parseInt(_this.pixelSize) / upem;
          var curMtx = new ET_Matrix();
          var pngMtx = new ET_Matrix();
          var ang = _this.theta * 180 / Math.PI;
          curMtx.compose(_this.scalex, _this.scaley, ang, _this.dx, _this.dy);
          curMtx.matrix_pre_multiply(scale);
          ang = _this.png_theta * 180 / Math.PI;
          pngMtx.compose(_this.png_scalex, _this.png_scaley, ang, _this.png_dx, _this.png_dy);
          pngMtx.matrix_pre_multiply(scale);
          if (pngMtx.invert() == false) return;
          pngMtx.matrix_pre_multiply(curMtx);
          context.save();
          context.transform(pngMtx.xx, pngMtx.yx, pngMtx.xy, pngMtx.yy, pngMtx.dx, pngMtx.dy);
          context.drawImage(this, _this.png_marginLeft, _this.png_marginTop, _this.img.width, _this.img.height);
          context.restore();
        } else {
          context.drawImage(this, _this.png_marginLeft, _this.png_marginTop, _this.img.width, _this.img.height);
        }

        _this.updateImageCoords();

        context.restore();

        if (bDrawBorder && bOnFocus) {
          //绘制边框
          _this.drawBorder(context, _this.oCoords);
        }

        if (bDrawCorner && bOnFocus) {
          var style = 'rgba(20, 20, 20, 0.5)';
          var icon_img = new Image();
          var corner = {
            tl: {
              x: _this.oCoords.tl.corner.tl.x + _this.offsetX,
              y: _this.oCoords.tl.corner.tl.y + _this.offsetY
            },
            tr: {
              x: _this.oCoords.tl.corner.tr.x + _this.offsetX,
              y: _this.oCoords.tl.corner.tr.y + _this.offsetY
            },
            br: {
              x: _this.oCoords.tl.corner.br.x + _this.offsetX,
              y: _this.oCoords.tl.corner.br.y + _this.offsetY
            },
            bl: {
              x: _this.oCoords.tl.corner.bl.x + _this.offsetX,
              y: _this.oCoords.tl.corner.bl.y + _this.offsetY
            }
          };
          icon_img.src = 'image/icon/ICON-delete.png';

          _this.drawDeleteCorner(context, icon_img, corner);

          corner = {
            tl: {
              x: _this.oCoords.br.corner.tl.x + _this.offsetX,
              y: _this.oCoords.br.corner.tl.y + _this.offsetY
            },
            tr: {
              x: _this.oCoords.br.corner.tr.x + _this.offsetX,
              y: _this.oCoords.br.corner.tr.y + _this.offsetY
            },
            br: {
              x: _this.oCoords.br.corner.br.x + _this.offsetX,
              y: _this.oCoords.br.corner.br.y + _this.offsetY
            },
            bl: {
              x: _this.oCoords.br.corner.bl.x + _this.offsetX,
              y: _this.oCoords.br.corner.bl.y + _this.offsetY
            }
          };
          icon_img.src = 'image/icon/ICON-scale.png';

          _this.drawScaleCorner(context, icon_img, corner);

          corner = {
            tl: {
              x: _this.oCoords.tr.corner.tl.x + _this.offsetX,
              y: _this.oCoords.tr.corner.tl.y + _this.offsetY
            },
            tr: {
              x: _this.oCoords.tr.corner.tr.x + _this.offsetX,
              y: _this.oCoords.tr.corner.tr.y + _this.offsetY
            },
            br: {
              x: _this.oCoords.tr.corner.br.x + _this.offsetX,
              y: _this.oCoords.tr.corner.br.y + _this.offsetY
            },
            bl: {
              x: _this.oCoords.tr.corner.bl.x + _this.offsetX,
              y: _this.oCoords.tr.corner.bl.y + _this.offsetY
            }
          };
          icon_img.src = 'image/icon/ICON-rotate.png';

          _this.drawRotateCorner(context, icon_img, corner);
        }
      });
    }
  }]);

  return ET_Accessory;
}(); //constructor


var ET_AccessoryList = /*#__PURE__*/function () {
  //构造函数
  function ET_AccessoryList() {
    _classCallCheck(this, ET_AccessoryList);

    this.accessories = [];
  }

  _createClass(ET_AccessoryList, [{
    key: "getLength",
    value: function getLength() {
      return this.accessories.length;
    }
  }, {
    key: "appendAccessory",
    value: function appendAccessory(acc) {
      this.accessories.push(acc);
    }
  }, {
    key: "deleteCurAccessory",
    value: // delete current accessory
    function deleteCurAccessory(curAccIndex) {
      if (curAccIndex < 0) return;
      if (this.accessories.length <= 0) return;
      this.accessories.splice(curAccIndex, 1);
    }
  }, {
    key: "getAccessory",
    value: function getAccessory(index) {
      return this.accessories[index];
    } // update current accessory image

  }, {
    key: "updateAccImage",
    value: function updateAccImage(timestamp, gindex, image, left, _top, w, h) {
      var i;
      var found = false;

      for (i = 0; i < this.accessories.length; i++) {
        if (this.accessories[i].timestamp == timestamp) {
          found = true;
          break;
        }
      }

      if (found) {
        var acc = this.accessories[i];
        acc.img.src = image;
        acc.img.width = w;
        acc.img.height = h;
        acc.png_marginLeft = left;
        acc.png_marginTop = _top;
        acc.png_dx = acc.dx;
        acc.png_dy = acc.dy;
        acc.png_scalex = acc.scalex;
        acc.png_scaley = acc.scaley;
        acc.png_theta = acc.theta;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.accessories = [];
    }
  }]);

  return ET_AccessoryList;
}();