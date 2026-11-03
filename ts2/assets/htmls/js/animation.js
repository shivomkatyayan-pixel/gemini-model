"use strict";

/*******************************下拉上滑到底回弹 ***********************************************/
var a_start_y = 0;
var to_top = false;
var to_bottom = false;
var whole_diy_content_el = null;
var single_texts_content_el = null;
var style_content_el = null;
var bg_content_el = null;
var acc_content_el = null;
var font_weight_el = null;
var font_weight_button_el = null;
var font_weight_filling_el = null;
var font_weight_border_el = null;
var font_weight_line_el = null;
var switch_button = null;
var switch_bg = null;
var content_scroll_el = null;
var single_content_scroll_el = null;
var style_content_scrolle_el = null;
var bg_content_scrolle_el = null;
var acc_content_scrolle_el = null;

var initAnimation = function initAnimation() {
  whole_diy_content_el = document.getElementById('whole-diy-content');
  content_scroll_el = document.getElementById('whole-content-scroll');
  whole_diy_content_el.addEventListener('touchstart', function (event) {
    pullTouchStart(event, content_scroll_el, whole_diy_content_el);
  }, false);
  whole_diy_content_el.addEventListener('touchmove', function (event) {
    pullTouchMove(event, content_scroll_el);
  }, false);
  whole_diy_content_el.addEventListener('touchend', function (event) {
    pullTouchEnd(event, content_scroll_el);
  }, false);
  whole_diy_content_el.addEventListener('transitionend', function (event) {
    pullTransitionEnd(event, content_scroll_el);
  }, false);
  whole_diy_content_el.addEventListener('touchcancel', function (event) {
    pullTouchEnd(event, content_scroll_el);
  }, false);
  single_texts_content_el = document.getElementById('single-texts-content');
  single_content_scroll_el = document.getElementById('single-content-scroll');
  single_texts_content_el.addEventListener('touchstart', function (event) {
    pullTouchStart(event, single_content_scroll_el, single_texts_content_el);
  }, false);
  single_texts_content_el.addEventListener('touchmove', function (event) {
    pullTouchMove(event, single_content_scroll_el);
  }, false);
  single_texts_content_el.addEventListener('touchend', function (event) {
    pullTouchEnd(event, single_content_scroll_el);
  }, false);
  single_texts_content_el.addEventListener('transitionend', function (event) {
    pullTransitionEnd(event, single_content_scroll_el);
  }, false);
  single_texts_content_el.addEventListener('touchcancel', function (event) {
    pullTouchEnd(event, single_content_scroll_el);
  }, false);
  style_content_el = document.getElementById('style-content');
  style_content_scrolle_el = document.getElementById('style-content-scroll');
  style_content_el.addEventListener('touchstart', function (event) {
    pullTouchStart(event, style_content_scrolle_el, style_content_el);
  }, false);
  style_content_el.addEventListener('touchmove', function (event) {
    pullTouchMove(event, style_content_scrolle_el);
  }, false);
  style_content_el.addEventListener('touchend', function (event) {
    pullTouchEnd(event, style_content_scrolle_el);
  }, false);
  style_content_el.addEventListener('transitionend', function (event) {
    pullTransitionEnd(event, style_content_scrolle_el);
  }, false);
  style_content_el.addEventListener('touchcancel', function (event) {
    pullTouchEnd(event, style_content_scrolle_el);
  }, false);
  bg_content_el = document.getElementById('bg-content');
  bg_content_scrolle_el = document.getElementById('bg-content-scroll');
  bg_content_el.addEventListener('touchstart', function (event) {
    pullTouchStart(event, bg_content_scrolle_el, bg_content_el);
  }, false);
  bg_content_el.addEventListener('touchmove', function (event) {
    pullTouchMove(event, bg_content_scrolle_el);
  }, false);
  bg_content_el.addEventListener('touchend', function (event) {
    pullTouchEnd(event, bg_content_scrolle_el);
  }, false);
  bg_content_el.addEventListener('transitionend', function (event) {
    pullTransitionEnd(event, bg_content_scrolle_el);
  }, false);
  bg_content_el.addEventListener('touchcancel', function (event) {
    pullTouchEnd(event, bg_content_scrolle_el);
  }, false);
  acc_content_el = document.getElementById('acc-content');
  acc_content_scrolle_el = document.getElementById('acc-content-scroll');
  acc_content_el.addEventListener('touchstart', function (event) {
    pullTouchStart(event, acc_content_scrolle_el, acc_content_el);
  }, false);
  acc_content_el.addEventListener('touchmove', function (event) {
    pullTouchMove(event, acc_content_scrolle_el);
  }, false);
  acc_content_el.addEventListener('touchend', function (event) {
    pullTouchEnd(event, acc_content_scrolle_el);
  }, false);
  acc_content_el.addEventListener('transitionend', function (event) {
    pullTransitionEnd(event, acc_content_scrolle_el);
  }, false);
  acc_content_el.addEventListener('touchcancel', function (event) {
    pullTouchEnd(event, acc_content_scrolle_el);
  }, false);
  font_weight_el = document.getElementById('font-weight');
  font_weight_button_el = document.getElementById('weight-button');
  font_weight_border_el = document.getElementById('weight-border');
  font_weight_border_el.addEventListener('touchstart', function (event) {
    weightTouchDown(event, font_weight_border_el);
  }, false);
  font_weight_border_el.addEventListener('touchmove', function (event) {
    weightTouchMove(event, font_weight_border_el);
  }, false);
  font_weight_border_el.addEventListener('touchend', function (event) {
    weightTouchEnd(event, font_weight_border_el);
  }, false);
  font_weight_filling_el = document.getElementById('weight-filling');
  font_weight_line_el = document.getElementById('weight-line');
  initWeight();
  tab_line_el = document.getElementById('tab_line');
  main_tab_box_el = document.getElementById('main-tab-box');
  tab_items_el = document.getElementsByClassName('tab-item');
  single_tab_line_el = document.getElementById('single-tab-line');
  single_tab_box_el = document.getElementById('single-tab-box');
  initTab('main-tab-1'); //拼音

  switch_button = document.getElementById('switch-button');
  switch_bg = document.getElementById('switch-2');
  aniInitPinyin(); //文字点击动画

  initTBAnimation();
}; //重置main页面


var aniResetMainPageEl = function aniResetMainPageEl() {
  content_scroll_el.style.transform = "translate3d(0, ".concat(0, "px, 0)");
  single_content_scroll_el.style.transform = "translate3d(0, ".concat(0, "px, 0)");
}; //重置single页面


var aniResetSinglePageEl = function aniResetSinglePageEl() {
  style_content_scrolle_el.style.transform = "translate3d(0, ".concat(0, "px, 0)");
  bg_content_scrolle_el.style.transform = "translate3d(0, ".concat(0, "px, 0)");
  acc_content_scrolle_el.style.transform = "translate3d(0, ".concat(0, "px, 0)");
  initTab('single-tab-1');
  single_tab_box_el.style.transform = "translateX(-".concat(0, "px)");
};
/*******************************下拉上滑到底回弹 ***********************************************/


var t_minY = 0;
var t_maxY = 0;
var t_wrapperHeight = 0;
var t_duration = 0;
var t_bezier = 'linear';
var t_pointY = 0; // touchStart 手势 y 坐标

var t_startX = 0;
var t_transX = 0;
var t_startT = 0;
var t_startY = 0; // touchStart 元素 y 偏移值

var t_offsetY = 0; // 元素实时 y 偏移值

var t_startTime = 0; // 惯性滑动范围内的 startTime

var t_momentumStartY = 0; // 惯性滑动范围内的 startY

var t_momentumTimeThreshold = 300; // 惯性滑动的启动 时间阈值

var t_momentumYThreshold = 15; // 惯性滑动的启动 距离阈值

var t_isStarted = false; // start锁

var t_curTag = '';
var t_mode = null;
var t_tab_lineX = 0;
var t_contentX = 0;
var t_line_id = 1;

var momentum = function momentum(current, start, duration) {
  var durationMap = {
    noBounce: 2500,
    weekBounce: 800,
    strongBounce: 400
  };
  var bezierMap = {
    noBounce: 'cubic-bezier(.17, .89, .45, 1)',
    weekBounce: 'cubic-bezier(.25, .46, .45, .94)',
    strongBounce: 'cubic-bezier(.25, .46, .45, .94)'
  };
  var type = 'noBounce'; // 惯性滑动加速度

  var deceleration = 0.003; // 回弹阻力

  var bounceRate = 10; // 强弱回弹的分割值

  var bounceThreshold = 300; // 回弹的最大限度

  var maxOverflowY = t_wrapperHeight / 6;
  var overflowY = 0;
  var distance = current - start;
  var speed = 2 * Math.abs(distance) / duration;
  var destination = current + speed / deceleration * (distance < 0 ? -1 : 1);

  if (destination < t_minY) {
    overflowY = t_minY - destination;
    type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
    destination = Math.max(t_minY - maxOverflowY, t_minY - overflowY / bounceRate);
  } else if (destination > t_maxY) {
    overflowY = destination - t_maxY;
    type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
    destination = Math.min(t_maxY + maxOverflowY, t_maxY + overflowY / bounceRate);
  }

  return {
    destination: destination,
    duration: durationMap[type],
    bezier: bezierMap[type]
  };
}; // 超出边界时需要重置位置


var isNeedReset = function isNeedReset(scrolldom) {
  var offsetY = null;

  if (t_minY < 0) {
    if (t_offsetY < t_minY) {
      offsetY = t_minY;
    } else if (t_offsetY > t_maxY) {
      offsetY = t_maxY;
    }
  } else {
    if (t_offsetY !== t_maxY) {
      offsetY = t_maxY;
    }
  }

  if (offsetY !== null) {
    t_offsetY = offsetY;
    t_duration = 500;
    t_bezier = 'cubic-bezier(.165, .84, .44, 1)';
    animationSet_Y(scrolldom);
    return true;
  }

  return false;
}; // 停止滚动


var stop = function stop(scrolldom) {
  getTranslate3dY(scrolldom);
  animationSet_Y(scrolldom);
};

var animationSet_Y = function animationSet_Y(scrolldom) {
  scrolldom.style.transform = "translate3d(0, ".concat(t_offsetY, "px, 0)");
  scrolldom.style.transitionDuration = "".concat(t_duration, "ms");
  scrolldom.style.transitionTimingFunction = t_bezier;
};

var initContentScroll = function initContentScroll() {
  t_minY = 0;
  t_maxY = 0;
  t_wrapperHeight = 0;
  t_duration = 0;
  t_bezier = 'linear';
  t_pointY = 0; //t_startY = 0; 
  //t_offsetY = 0; 

  t_startTime = 0;
  t_momentumStartY = 0;
  t_momentumTimeThreshold = 300;
  t_momentumYThreshold = 15;
  t_isStarted = false;
};

var getTranslate3dY = function getTranslate3dY(scrolldom) {
  var ts3y = 0;
  var matrix = window.getComputedStyle(scrolldom).getPropertyValue('transform');

  if (matrix !== 'none') {
    ts3y = Math.round(+matrix.split(')')[0].split(', ')[5]);
  }

  return ts3y;
};

var pullTouchStartY = function pullTouchStartY(e, scrolldom, dom) {
  if (t_curTag !== e.currentTarget.id) {
    initContentScroll();
    t_wrapperHeight = dom.getBoundingClientRect().height;
    t_minY = t_wrapperHeight - scrolldom.getBoundingClientRect().height;
    t_offsetY = getTranslate3dY(scrolldom);
    t_curTag = e.currentTarget.id;
  }

  var point = e.touches ? e.touches[0] : e;
  t_isStarted = true;
  t_duration = 0;
  animationSet_Y(scrolldom);
  stop(scrolldom);
  t_pointY = point.pageY;
  t_momentumStartY = t_startY = t_offsetY;
  t_startTime = new Date().getTime();
};

var pullTouchMoveY = function pullTouchMoveY(e, scrolldom) {
  if (!t_isStarted) return;
  var point = e.touches ? e.touches[0] : e;
  var deltaY = point.pageY - t_pointY; // 浮点数坐标会影响渲染速度

  var offsetY = Math.round(t_startY + deltaY); // 超出边界时增加阻力

  if (t_minY < 0) {
    if (offsetY < t_minY) {
      offsetY = Math.round(t_minY + (offsetY - t_minY) / 3);
    } else if (offsetY > t_maxY) {
      offsetY = Math.round(t_maxY + (offsetY - t_maxY) / 3);
    }
  } else {
    offsetY = Math.round(t_maxY + (offsetY - t_maxY) / 3);
  }

  t_offsetY = offsetY;
  animationSet_Y(scrolldom);
  var now = new Date().getTime(); // 记录在触发惯性滑动条件下的偏移值和时间

  if (now - t_startTime > t_momentumTimeThreshold) {
    t_momentumStartY = t_offsetY;
    t_startTime = now;
  }
};

var pullTouchEndY = function pullTouchEndY(e, scrolldom) {
  if (!t_isStarted) return;
  t_isStarted = false;
  if (isNeedReset(scrolldom)) return;
  var absDeltaY = Math.abs(t_offsetY - t_momentumStartY);
  var duration = new Date().getTime() - t_startTime; // 启动惯性滑动

  if (duration < t_momentumTimeThreshold && absDeltaY > t_momentumYThreshold) {
    var tt_momentum = momentum(t_offsetY, t_momentumStartY, duration);
    t_offsetY = Math.round(tt_momentum.destination);
    t_duration = tt_momentum.duration;
    t_bezier = tt_momentum.bezier;
    animationSet_Y(scrolldom);
  }
};

var pullTransitionEnd = function pullTransitionEnd(e, scrolldom) {
  isNeedReset(scrolldom);
};

var animationAdd = function animationAdd() {
  if (page === 'main') {
    tab_line_el.classList.add('line-animation');
    main_tab_box_el.classList.add('content-animation');
  } else if (page === 'single') {
    single_tab_line_el.classList.add('line-animation');
    single_tab_box_el.classList.add('content-animation');
  }
};

var animationRemove = function animationRemove() {
  if (page === 'main') {
    tab_line_el.classList.remove('line-animation');
    main_tab_box_el.classList.remove('content-animation');
  } else if (page === 'single') {
    single_tab_line_el.classList.remove('line-animation');
    single_tab_box_el.classList.remove('content-animation');
  }
};

var animationSetX = function animationSetX() {
  if (page === 'main') {
    var lineid = 'main-tab-' + t_line_id;
    tab_line_el.style.transform = "translateX(".concat(t_tab_lineX - t_transX * (getDom(lineid).clientWidth + 60) / getScreen(), "px)");
    main_tab_box_el.style.transform = "translateX(".concat(t_contentX + t_transX, "px)");
  } else if (page === 'single') {
    var _lineid = 'single-tab-' + t_line_id;

    single_tab_line_el.style.transform = "translateX(".concat(t_tab_lineX - t_transX * (getDom(_lineid).clientWidth + 60) / getScreen(), "px)");
    single_tab_box_el.style.transform = "translateX(".concat(t_contentX + t_transX, "px)");
  }
};

var pullTouchStartX = function pullTouchStartX(e) {
  var touch = e.touches[0];
  t_startX = touch.pageX;
  t_startT = new Date().getTime(); //记录手指按下的开始时间

  animationRemove();
};

var getContentBoxW = function getContentBoxW() {
  if (page === 'main') {
    return main_tab_box_el.clientWidth;
  } else if (page === 'single') {
    return single_tab_box_el.clientWidth;
  }

  return 0;
};

var pullTouchMoveX = function pullTouchMoveX(e) {
  var single_tab_el = document.getElementById('single-tab');

  if (page === 'single' && single_tab_el.style.display === 'none') {
    return; //旧版本单字diy仅一个tab页，不允许左右滑动。
  }

  var touch = e.touches[0];
  var deltaX = touch.pageX - t_startX;

  if (t_contentX >= 0) {
    if (deltaX >= 0) {
      t_transX = 0;
    } else {
      t_transX = deltaX;
    }
  } else if (t_contentX <= -(getContentBoxW() - getScreen()) + 5) {
    if (deltaX <= 0) {
      t_transX = 0;
    } else {
      t_transX = deltaX;
    }
  } else {
    t_transX = deltaX;
  }

  animationSetX();
};

var pullTouchEndX = function pullTouchEndX(e) {
  var touch = e.changedTouches[0];
  var deltaT = new Date().getTime() - t_startT;
  var deltaX = touch.pageX - t_startX;

  if (deltaT < 300) {
    if (deltaX > 0) {
      if (t_contentX >= 0) {
        return;
      } else {
        tabPre();
      }
    } else if (deltaX < 0) {
      if (t_contentX <= -(getContentBoxW() - getScreen()) + 5) {
        return;
      } else {
        tabNext();
      }
    }
  } else {
    if (deltaX > getScreen() * 0.5) {
      if (t_contentX >= 0) {
        return;
      } else {
        tabPre();
      }
    } else if (deltaX < -getScreen() * 0.5) {
      if (t_contentX <= -(getContentBoxW() - getScreen()) + 5) {
        return;
      } else {
        tabNext();
      }
    } else {
      tabReturn();
    }
  } //初始化tab数据


  if (page === 'main') {
    $main_scope.changeTab(t_line_id.toString());
  } else if (page === 'single') {
    var tabindex = t_line_id + 1;
    $single_scope.changeTab(tabindex.toString());
  }
};

var pullTouchStart = function pullTouchStart(e, scrolldom, dom) {
  stopPropaga(e);
  pullTouchStartX(e);
  pullTouchStartY(e, scrolldom, dom);
};

var pullTouchMove = function pullTouchMove(e, scrolldom) {
  stopPropaga(e);

  if (t_mode === 'X') {
    pullTouchMoveX(e);
  } else if (t_mode === 'Y') {
    pullTouchMoveY(e, scrolldom);
  } else {
    var touch = e.touches[0];
    var deltaX = touch.pageX - t_startX;
    var deltaY = touch.pageY - t_pointY;

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      t_mode = 'X';
      pullTouchMoveX(e);
    } else {
      t_mode = 'Y';
      pullTouchMoveY(e, scrolldom);
    }
  }
};

var pullTouchEnd = function pullTouchEnd(e, scrolldom) {
  stopPropaga(e);

  if (t_mode === 'X') {
    pullTouchEndX(e);
  } else if (t_mode === 'Y') {
    pullTouchEndY(e, scrolldom);
  }

  t_mode = null;
};
/*******************************下拉上滑到底回弹 ***********************************************/

/*******************************按钮点击缩放 ***********************************************/

/*******************************按钮点击缩放 ***********************************************/

/*******************************粗细变化 ***********************************************/


var change_weight = false;
var down_xy = '';
var wtouch = {
  x: 0,
  position: 0.15 * g_rem
};
var lineLength = 360;
var startY = 0;

var sport = function sport() {
  font_weight_filling_el.style.width = wtouch.x + wtouch.position + 0.15 * g_rem + 'px';
  font_weight_border_el.style.left = wtouch.x + wtouch.position - 0.42 * g_rem + 'px';
  font_weight_button_el.style.left = wtouch.x + wtouch.position - 0.15 * g_rem + 'px';
};

var weightTouchDown = function weightTouchDown(e, dom) {
  stopPropaga(e);
  e.preventDefault();
  down_xy = e.targetTouches[0];
  font_weight_line_el.setAttribute('class', 'weight-line weight-line-color line-bold');
  font_weight_filling_el.setAttribute('class', 'weight-filling weight-fill-color line-bold');
  font_weight_button_el.setAttribute('class', 'weight-button weight-fill-color weight-button-bold');
  font_weight_border_el.setAttribute('class', 'weight-border weight-border-show ');
};

var weightTouchMove = function weightTouchMove(e, dom) {
  stopPropaga(e);
  e.preventDefault();

  if (Math.abs(getVolecity(e)) > 0.5) {
    font_weight_button_el.setAttribute('class', 'weight-button weight-fill-color weight-button-bold button-speed');
    font_weight_border_el.setAttribute('class', 'weight-border  weight-border-show  border-speed');
  } else {
    font_weight_button_el.setAttribute('class', 'weight-button weight-fill-color weight-button-bold');
    font_weight_border_el.setAttribute('class', 'weight-border weight-border-show');
  }

  var x = e.targetTouches[0].clientX - down_xy.clientX;

  if (wtouch.position + x > lineLength) {
    x = lineLength - wtouch.position;
  } else if (wtouch.position + x < 0) {
    x = 0 - wtouch.position;
  }

  wtouch.x = x;
  sport();
  var per = (wtouch.x + wtouch.position) / lineLength;
  $main_scope.updateWeight(per, 'move');
};

var weightTouchEnd = function weightTouchEnd(e, dom) {
  wtouch.position = wtouch.x + wtouch.position;
  wtouch.x = 0;
  var per = (wtouch.x + wtouch.position) / lineLength;
  $main_scope.updateWeight(per, 'end');
  font_weight_line_el.setAttribute('class', 'weight-line weight-line-color');
  font_weight_filling_el.setAttribute('class', 'weight-filling weight-fill-color');
  font_weight_button_el.setAttribute('class', 'weight-button weight-fill-color');
  font_weight_border_el.setAttribute('class', 'weight-border');
};

var preX = 0;
var preTime = 0;

var getVolecity = function getVolecity(event) {
  var currTime = Date.now();
  var volecity = 0;

  if (undefined !== preTime) {
    //跳过第一次
    var dist = event.targetTouches[0].clientX - preX;
    var time = currTime - preTime;
    volecity = dist / time;
  }

  preX = event.targetTouches[0].clientX;
  preTime = currTime;
  return volecity;
};

var initWeight = function initWeight() {
  lineLength = 9 * g_rem;

  if ($main_scope.weight) {
    var total = $main_scope.weight.max - $main_scope.weight.min;
    var per = ($main_scope.weight.value - $main_scope.weight.min) / total;
    per = Math.min(per, 1);
    wtouch.position = lineLength * per;
  }

  sport();
};
/*******************************粗细变化 ***********************************************/

/*******************************tab页变化 ***********************************************/


var tab_line_el = null;
var main_tab_box_el = null;
var tab_items_el = null;
var single_tab_line_el = null;
var single_tab_box_el = null; // 获取指定元素属性

var getDom = function getDom(id) {
  var dom = document.getElementById(id);
  return dom;
};

var getScreen = function getScreen() {
  return cW;
};

var tabReturn = function tabReturn() {
  animationAdd();

  if (page === 'main') {
    tab_line_el.style.transform = "translateX(".concat(t_tab_lineX, "px)");
    main_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
  } else if (page === 'single') {
    single_tab_line_el.style.transform = "translateX(".concat(t_tab_lineX, "px)");
    single_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
  }
};

var tabNext = function tabNext() {
  animationAdd();
  t_line_id++;
  t_contentX = t_contentX - getScreen();

  if (page === 'main') {
    var lineid = 'main-tab-' + t_line_id;
    main_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
    initTab(lineid);
  } else if (page === 'single') {
    var _lineid2 = 'single-tab-' + t_line_id;

    single_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
    initTab(_lineid2);
  }
};

var tabPre = function tabPre() {
  animationAdd();
  t_line_id--;
  t_contentX = t_contentX + getScreen();

  if (page === 'main') {
    var lineid = 'main-tab-' + t_line_id;
    main_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
    initTab(lineid);
  } else if (page === 'single') {
    var _lineid3 = 'single-tab-' + t_line_id;

    single_tab_box_el.style.transform = "translateX(".concat(t_contentX, "px)");
    initTab(_lineid3);
  }
}; // 设置下划线动态宽度


var setUnderlineWidth = function setUnderlineWidth(id) {
  if (id.indexOf('single') !== -1) {
    single_tab_line_el.style.width = getDom(id).clientWidth + 'px';
  } else if (id.indexOf('main') !== -1) {
    tab_line_el.style.width = getDom(id).clientWidth + 'px';
  }
}; //


var aniCheckTab = function aniCheckTab(e) {
  var domId = e.currentTarget.id;
  initTab(domId);
  animationAdd(); //tab滑动

  var sl = domId.split('-');

  if (sl.length > 1) {
    var idNum = parseInt(sl[sl.length - 1]);

    if (domId.indexOf('single') !== -1) {
      single_tab_box_el.style.transform = "translateX(-".concat((idNum - 1) * cW, "px)");
    } else if (domId.indexOf('main') !== -1) {
      main_tab_box_el.style.transform = "translateX(-".concat((idNum - 1) * cW, "px)");
    }
  }
};

var resetTab = function resetTab(el) {
  var doms = document.getElementsByClassName('tab-item');
  tab_items_el = [];
  tab_items_el = doms;

  for (var i = 0; i < tab_items_el.length; i++) {
    var element = tab_items_el[i];
    element.setAttribute('class', 'tab-item font-medium font-secondary');
  }

  el.setAttribute('class', 'tab-item tab-check-font-style font-medium font-secondary');
};

var initTab = function initTab(tabid) {
  setUnderlineWidth(tabid);
  var sl = tabid.split('-');
  var idNum = parseInt(sl[sl.length - 1]);
  t_tab_lineX = getDom(tabid).offsetLeft;
  t_contentX = -(idNum - 1) * getScreen();
  t_line_id = idNum;

  if (tabid.indexOf('single') !== -1) {
    single_tab_line_el.style.transform = "translateX(".concat(getDom(tabid).offsetLeft, "px)");
  } else if (tabid.indexOf('main') !== -1) {
    tab_line_el.style.transform = "translateX(".concat(getDom(tabid).offsetLeft, "px)");
  }

  var doms = document.getElementsByClassName('tab-item');
  tab_items_el = [];
  tab_items_el = doms;

  for (var i = 0; i < tab_items_el.length; i++) {
    var element = tab_items_el[i];
    element.setAttribute('class', 'tab-item font-medium font-secondary');
  }

  var tdom = document.getElementById(tabid);
  tdom.setAttribute('class', 'tab-item tab-check-font-style font-medium font-secondary');
};
/*******************************tab页变化 ***********************************************/

/*******************************拼音变化 ***********************************************/


var switch_check2 = false;

var aniChangePinyin = function aniChangePinyin() {
  if (!$main_scope.change_pinyin) {
    $main_scope.change_pinyin = true;
    switch_button.classList.add('test');
    $main_scope.changePinyin(!switch_check2);
  }
};

var callbackChangePinyin = function callbackChangePinyin() {
  if (!switch_check2) {
    switch_button.setAttribute('class', 'switch-button move-right');
    switch_bg.setAttribute('class', 'switch-2 bg');
  } else {
    switch_button.setAttribute('class', 'switch-button move-left');
    switch_bg.setAttribute('class', 'switch-2');
  }

  switch_check2 = !switch_check2;
  $main_scope.change_pinyin = false;
};

var aniInitPinyin = function aniInitPinyin() {
  if ($main_scope.pinyinId === -1) {
    switch_check2 = false;
  } else {
    switch_check2 = true;
    switch_button.setAttribute('class', 'switch-button switch-right');
    switch_bg.setAttribute('class', 'switch-2 bg');
  }
};
/*******************************拼音变化 ***********************************************/

/*******************************文字按钮点击 ***********************************************/


var tb_canvas = {};
var tb_centerX = 0;
var tb_centerY = 0;
var tb_color = '';
var tb_context = {};
var tb_element = {};
var tb_radius = 0;
var tb_stop = false;
var tb_finish = false;
var tb_event = {};
var tb_func = '';
var tb_containers = document.getElementsByClassName('material-design'); // 根据callback生成requestAnimationFrame动画

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}(); // 为每个指定元素生成canves


var initTBAnimation = function initTBAnimation() {
  tb_containers = Array.prototype.slice.call(tb_containers);

  for (var i = 0; i < tb_containers.length; i += 1) {
    var canvas = {};
    canvas = document.createElement('canvas');
    canvas.addEventListener('touchstart', press, false);
    canvas.addEventListener('touchend', del, false);
    canvas.addEventListener('touchcancel', del, false);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.25';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.id = 'canvas-' + tb_containers[i].id;
    tb_containers[i].appendChild(canvas);
  }
}; //系统色系决定canvas绘制颜色


var resetAniTBBgColor = function resetAniTBBgColor(nightmode) {
  if (nightmode) {
    tb_color = 'rgba(255,255,255,0.08)';
  } else {
    tb_color = 'rgba(0, 0, 0, 0.3)';
  }
};

var initElementSize = function initElementSize() {
  tb_element.width = tb_element.offsetWidth;
  tb_element.height = tb_element.offsetHeight;
}; // 点击并且获取需要的数据，如点击坐标、元素大小、颜色


var press = function press(event) {
  tb_event = event;
  tb_element = event.srcElement;
  initElementSize();
  tb_func = getFunction(tb_element.id);
  tb_stop = false;
  tb_finish = false;
  tb_context = tb_element.getContext('2d');
  tb_radius = 0;
  tb_context.globalAlpha = 0;
  tb_centerX = event.targetTouches[0].pageX - tb_element.getBoundingClientRect().left;
  tb_centerY = event.targetTouches[0].pageY - tb_element.getBoundingClientRect().top;
  draw();
}; // 绘制圆形，并且执行动画


var draw = function draw() {
  tb_context.clearRect(0, 0, tb_element.width, tb_element.height);
  tb_context.beginPath();
  tb_context.arc(tb_centerX, tb_centerY, tb_radius, 0, 2 * Math.PI, false);
  tb_context.fillStyle = tb_color;
  tb_context.fill();
  tb_context.globalAlpha += 1 / 12;
  tb_radius += Math.sqrt(Math.pow(tb_element.width / 2 + Math.abs(tb_centerX - tb_element.width / 2), 2) + Math.pow(tb_element.height / 2 + Math.abs(tb_centerY - tb_element.height / 2), 2)) / 12; // 通过判断半径小于元素宽度，不断绘制 radius += 2 的圆形

  if (tb_radius < Math.sqrt(Math.pow(tb_element.width / 2 + Math.abs(tb_centerX - tb_element.width / 2), 2) + Math.pow(tb_element.height / 2 + Math.abs(tb_centerY - tb_element.height / 2), 2)) / 12 * 13) {
    requestAnimFrame(draw);
  } else {
    tb_finish = true;

    if (tb_stop) {
      clear();
    }
  }
}; // 删除效果


var del = function del(event) {
  tb_stop = true; //抬手，播完一遍

  if (tb_finish) {
    callFunc();
  }
};

var clear = function clear() {
  tb_context.clearRect(0, 0, tb_element.width, tb_element.height);
  tb_context.beginPath();
  tb_context.arc(tb_centerX, tb_centerY, tb_radius, 0, 2 * Math.PI, false);
  tb_context.fill();
  tb_context.globalAlpha -= 1 / 9;

  if (tb_context.globalAlpha > 1 / 9) {
    requestAnimFrame(clear);
  } else {
    tb_context.clearRect(0, 0, tb_element.width, tb_element.height);
    callFunc();
  }
};

var getFunction = function getFunction(id) {
  var ll = id.split('-');
  var func = ll[ll.length - 1];
  var dialogfunc = '';

  if (func === 'addChar') {
    dialogfunc = func;
  } else if (func.indexOf('globleApply') !== -1) {
    dialogfunc = '$dialog_scope.' + func;
  } else {
    dialogfunc = '$dialog_scope.' + func + '()';
  }

  return dialogfunc;
};

var callFunc = function callFunc() {
  if (tb_func === '') return;
  tb_context.clearRect(0, 0, tb_element.width, tb_element.height);

  if (tb_func === 'addChar') {
    $dialog_scope.addChar(tb_event);
  } else {
    eval(tb_func);
  }
};
/*******************************文字按钮点击 ***********************************************/