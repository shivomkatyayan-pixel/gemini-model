"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ET_Matrix = /*#__PURE__*/function () {
  function ET_Matrix() {
    _classCallCheck(this, ET_Matrix);

    this.xx = 1;
    this.xy = 0;
    this.yx = 0;
    this.yy = 1;
    this.dx = 0;
    this.dy = 0;
    this.centerPos = g_json_config.upem / 2;
  }

  _createClass(ET_Matrix, [{
    key: "reset",
    value: function reset() {
      this.xx = this.yy = 1;
      this.xy = this.yx = this.dx = this.dy = 0;
    }
  }, {
    key: "vector_multiply",
    value: // vector = this * vector
    function vector_multiply(vector) {
      var x = parseFloat(this.xx * vector.x) + parseFloat(this.xy * vector.y) + this.dx;
      var y = parseFloat(this.yx * vector.x) + parseFloat(this.yy * vector.y) + this.dy;
      vector.x = parseFloat(x);
      vector.y = parseFloat(y);
    }
  }, {
    key: "matrix_pre_multiply",
    value: // this = matrix * this
    function matrix_pre_multiply(matrix) {
      var xx = parseFloat(matrix.xx * this.xx) + parseFloat(matrix.xy * this.yx);
      var xy = parseFloat(matrix.xx * this.xy) + parseFloat(matrix.xy * this.yy);
      var yx = parseFloat(matrix.yx * this.xx) + parseFloat(matrix.yy * this.yx);
      var yy = parseFloat(matrix.yx * this.xy) + parseFloat(matrix.yy * this.yy);
      var dx = parseFloat(matrix.xx * this.dx) + parseFloat(matrix.xy * this.dy) + matrix.dx;
      var dy = parseFloat(matrix.yx * this.dx) + parseFloat(matrix.yy * this.dy) + matrix.dy;
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
      this.dx = dx;
      this.dy = dy;
    }
  }, {
    key: "matrix_post_multiply",
    value: //  this = this * matrix
    function matrix_post_multiply(matrix) {
      var xx = parseFloat(this.xx * matrix.xx) + parseFloat(this.xy * matrix.yx);
      var xy = parseFloat(this.xx * matrix.xy) + parseFloat(this.xy * matrix.yy);
      var yx = parseFloat(this.yx * matrix.xx) + parseFloat(this.yy * matrix.yx);
      var yy = parseFloat(this.yx * matrix.xy) + parseFloat(this.yy * matrix.yy);
      var dx = parseFloat(this.xx * matrix.dx) + parseFloat(this.xy * matrix.dy) + this.dx;
      var dy = parseFloat(this.yx * matrix.dx) + parseFloat(this.yy * matrix.dy) + this.dy;
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
      this.dx = dx;
      this.dy = dy;
    }
  }, {
    key: "invert",
    value: function invert() {
      var determinant = parseFloat(this.xx * this.yy) - parseFloat(this.xy * this.yx);
      if (determinant == 0) return false;
      var reciprocal = 1 / determinant;
      var xx = parseFloat(this.yy * reciprocal);
      var xy = -parseFloat(this.xy * reciprocal);
      var yx = -parseFloat(this.yx * reciprocal);
      var yy = parseFloat(this.xx * reciprocal);
      var dx = parseFloat(this.dy * -xy) - parseFloat(this.dx * xx);
      var dy = parseFloat(this.dx * -yx) - parseFloat(this.dy * yy);
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
      this.dx = dx;
      this.dy = dy;
    }
  }, {
    key: "init",
    value: // width、height为绘制区域的宽度和高度，根据字体参数计算合适的矩阵
    function init(width, height, ascent, descent, advance) {
      var len = width < height ? width : height;
      var scale = len / (ascent + descent);
      this.xx = this.yy = scale;
      this.xy = this.yx = 0;
      this.dx = (width - advance * scale) / 2;
      this.dy = 0;
    }
  }, {
    key: "matrix_scale",
    value: function matrix_scale(sx, sy) {
      var dx = this.centerPos;
      var dy = this.centerPos;
      var vec = {
        x: dx,
        y: dy
      };
      var mtx = new ET_Matrix();
      mtx.xx = this.xx;
      mtx.xy = this.xy;
      mtx.yx = this.yx;
      mtx.yy = this.yy;
      mtx.vector_multiply(vec);
      dx = vec.x + this.dx;
      dy = vec.y + this.dy;
      var scale = new ET_Matrix();
      scale.xx = sx;
      scale.yy = sy;
      this.matrix_pre_multiply(scale);
      vec.x = dx;
      vec.y = dy;
      scale.vector_multiply(vec);
      this.dx += dx - vec.x;
      this.dy += dy - vec.y;
    }
  }, {
    key: "matrix_rotate",
    value: function matrix_rotate(degree) {
      var dx = this.centerPos;
      var dy = this.centerPos;
      var vec = {
        x: dx,
        y: dy
      };
      var mtx = new ET_Matrix();
      mtx.xx = this.xx;
      mtx.xy = this.xy;
      mtx.yx = this.yx;
      mtx.yy = this.yy;
      mtx.vector_multiply(vec);
      dx = vec.x + this.dx;
      dy = vec.y + this.dy;
      var arc = parseFloat(degree * Math.PI / 180);
      var cosa = Math.cos(arc);
      var sina = Math.sin(arc);
      var rotate = new ET_Matrix();
      rotate.xx = cosa;
      rotate.xy = -sina;
      rotate.yx = sina;
      rotate.yy = cosa;
      this.matrix_pre_multiply(rotate);
      vec.x = dx;
      vec.y = dy;
      rotate.vector_multiply(vec);
      this.dx += dx - vec.x;
      this.dy += dy - vec.y;
    }
  }, {
    key: "matrix_translate",
    value: function matrix_translate(dx, dy) {
      this.dx += dx;
      this.dy += dy;
    }
  }, {
    key: "compose",
    value: // this = M_trans * M_rotate * M_scale
    function compose(sx, sy, degree, dx, dy) {
      this.reset();
      this.matrix_scale(sx, sy);
      this.matrix_rotate(degree);
      this.matrix_translate(dx, dy);
    }
  }, {
    key: "decompose",
    value: function decompose() {
      var mtx1 = new ET_Matrix();
      mtx1.dx = this.centerPos;
      mtx1.dy = this.centerPos;
      if (mtx1.invert() == false) return;
      var mtx2 = new ET_Matrix();
      mtx2.dx = -this.centerPos;
      mtx2.dy = -this.centerPos;
      if (mtx2.invert() == false) return;
      this.matrix_pre_multiply(mtx1);
      this.matrix_post_multiply(mtx2);
      var arc = 0;
      var div = 0;
      var transform = {
        sx: 1,
        sy: 1,
        degree: 0,
        dx: 0,
        dy: 0
      };

      if (this.xy == 0 && this.yx == 0) {
        if (this.xx > 0) arc = 0;else arc = Math.PI;
      } else if (this.xx == 0 && this.yy == 0) {
        if (this.xy < 0) arc = Math.PI / 2;else arc = Math.PI * 3 / 2;
      } else {
        if (this.xx != 0) div = -this.xy / this.xx;else if (this.yy != 0) div = this.yx / this.yy;

        if (div > 0) {
          // (0, 90)
          if (this.xx > 0 && this.xy < 0 && this.yx > 0 && this.yy > 0) arc = Math.atan(div); // (180, 270)

          if (this.xx < 0 && this.xy > 0 && this.yx < 0 && this.yy < 0) arc = Math.PI + Math.atan(div);
        } else {
          // (90, 180)
          if (this.xx < 0 && this.xy < 0 && this.yx > 0 && this.yy < 0) arc = Math.PI + Math.atan(div); // (270, 360)

          if (this.xx > 0 && this.xy > 0 && this.yx < 0 && this.yy > 0) arc = 2 * Math.PI + Math.atan(div);
        }
      }

      if (arc == 0) {
        transform.sx = this.xx;
        transform.sy = this.yy;
      } else if (arc == Math.PI / 2) {
        transform.sx = this.yx;
        transform.sy = -this.xy;
      } else if (arc == Math.PI) {
        transform.sx = -this.xx;
        transform.sy = -this.yy;
      } else if (arc == Math.PI * 3 / 2) {
        transform.sx = -this.yx;
        transform.sy = this.xy;
      } else {
        var sina = Math.sin(arc);
        var cosa = Math.cos(arc);

        if (cosa != 0) {
          transform.sx = this.xx / cosa;
          transform.sy = this.yy / cosa;
        } else if (sina != 0) {
          transform.sx = this.yx / sina;
          transform.sy = this.xy / sina;
        }
      }

      transform.degree = parseFloat(arc * 180 / Math.PI);
      transform.dx = this.dx;
      transform.dy = this.dy;
      return transform;
    }
  }]);

  return ET_Matrix;
}();

;

var matrix_to_string = function matrix_to_string(compo) {
  var matrix = new ET_Matrix();
  matrix.compose(compo.sx, compo.sy, compo.degree, compo.dx, compo.dy);
  return matrix.xx + ',' + matrix.xy + ',' + matrix.yx + ',' + matrix.yy + ',' + matrix.dx + ',' + matrix.dy;
};