'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.weSwiper = factory();
})(undefined, function () {
  'use strict';

  var device = wx.getSystemInfoSync(); //  获取设备信息

  var DEFAULT = {
    /**
     * 必填项
     */
    slideLength: 0, //  由于目前无法直接获取slide页数，目前只能通过参数写入
    /**
     * 可选参数
     */
    width: device.windowWidth,
    height: device.windowHeight,
    direction: 'horizontal',
    initialSlide: 0,
    speed: 300,
    effect: 'slide', //  过渡效果
    timingFunction: 'ease', //  过渡动画速度曲线
    autoplay: 0, //  自动播放间隔，设置为0时不自动播放
    animationViewName: 'animationData', //  对应视图wrapper中animation属性名
    /**
     * 事件回调
     * @type {[type]}
     */
    onInit: null, //  swiper初始化时执行
    onTouchStart: null, //  手指碰触slide时执行
    onTouchMove: null, //  手指碰触slide并且滑动时执行
    onTouchEnd: null, //  手指离开slide时执行
    onSlideChangeStart: null, //  slide达到过渡条件时执行
    onSlideChangeEnd: null, //  swiper从一个slide过渡到另一个slide结束时执行
    onTransitionStart: null, //  过渡时触发
    onTransitionEnd: null, //  过渡结束时执行
    onSlideMove: null, //  手指触碰swiper并且拖动slide时执行
    onSlideNextStart: null, //  slide达到过渡条件 且规定了方向 向前（右、下）切换时执行
    onSlideNextEnd: null, //  slide达到过渡条件 且规定了方向 向前（右、下）切换结束时执行
    onSlidePrevStart: null, //  slide达到过渡条件 且规定了方向 向前（左、上）切换时执行
    onSlidePrevEnd: null //  slide达到过渡条件 且规定了方向 向前（左、上）切换结束时执行
  };

  var handle = {
    touchstart: function touchstart(e) {
      if (this.noSwiper) return;
      var onTouchStart = this.onTouchStart,
          XORY = this.XORY,
          activeIndex = this.activeIndex,
          rectDistance = this.rectDistance;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var translate = -activeIndex * rectDistance;

      this['touchStart' + XORY] = distance;
      this['translate' + XORY] = translate;
      this.touchStartTime = new Date().getTime();

      typeof onTouchStart === 'function' && onTouchStart(this, e); //  当手指碰触到slide时执行

      this.slideAnimation(translate, 0);
    },
    touchmove: function touchmove(e) {
      if (this.noSwiper) return;
      var onTouchMove = this.onTouchMove,
          XORY = this.XORY,
          onSlideMove = this.onSlideMove;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var tmpMove = this['translate' + XORY] + distance - this['touchStart' + XORY];

      typeof onTouchMove === 'function' && onTouchMove(this, e); //  手指碰触slide并且滑动时执行

      this.slideAnimation(tmpMove, 0);

      typeof onSlideMove === 'function' && onSlideMove(this);
    },
    touchend: function touchend(e) {
      if (this.noSwiper) return;
      var onTouchEnd = this.onTouchEnd,
          XORY = this.XORY,
          speed = this.speed,
          touchStartTime = this.touchStartTime,
          rectDistance = this.rectDistance;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var touchEndTime = new Date().getTime();

      var action = this.action(touchStartTime, touchEndTime, this['touchStart' + XORY], distance, rectDistance);

      typeof onTouchEnd === 'function' && onTouchEnd(this, e); //  手指离开slide时执行

      this[action](true, speed);
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */

  var controller = {
    /**
     * 切换控制器
     * @param touchStartTime： 手指触碰slide时的时间戳
     * @param et： 手指离开slide时的时间戳
     * @param from： 手指触碰slide时的屏幕位置
     * @param to： 手指离开slide时的屏幕位置
     * @param wrapperDistance： slide滑动方向上的容器长度
     * @returns {*}
     */
    action: function action(touchStartTime, touchEndTime, from, to, wrapperDistance) {
      var activeIndex = this.activeIndex,
          slideLength = this.slideLength,
          onTransitionStart = this.onTransitionStart;

      var deltaTime = touchEndTime - touchStartTime; //  手指触摸时长
      var distance = Math.abs(to - from); //  滑动距离

      var k = distance / deltaTime;

      if (to > from) {
        typeof onTransitionStart === 'function' && onTransitionStart(this); // slide达到过渡条件时执行
        return k > 0.3 || distance > wrapperDistance / 2 ? activeIndex === 0 ? 'slideBack' : 'slidePrev' : 'slideBack';
      }

      if (to < from) {
        typeof onTransitionStart === 'function' && onTransitionStart(this); // slide达到过渡条件时执行
        return k > 0.3 || distance > wrapperDistance / 2 ? activeIndex === slideLength - 1 ? 'slideBack' : 'slideNext' : 'slideBack';
      }

      if (to = from) {
        return 'slideBack';
      }
    }
  };

  var methods = {
    /**
     * 切换至下一个slide
     * @param runCallbacks： 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slideNext: function slideNext() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var onSlideNextStart = self.onSlideNextStart,
          onSlideNextEnd = self.onSlideNextEnd;

      typeof onSlideNextStart === 'function' && onSlideNextStart(self); // slide达到过渡条件时执行

      self.slideTo(self.activeIndex + 1, speed, runCallbacks);

      typeof onSlideNextEnd === 'function' && setTimeout(function () {
        onSlideNextEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 切换至上一个slide
     * @param runCallbacks： 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slidePrev: function slidePrev() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var onSlidePrevStart = self.onSlidePrevStart,
          onSlidePrevEnd = self.onSlidePrevEnd;

      typeof onSlidePrevStart === 'function' && onSlidePrevStart(self); // slide达到过渡条件时执行

      self.slideTo(self.activeIndex - 1, speed, runCallbacks);

      typeof onSlidePrevEnd === 'function' && setTimeout(function () {
        onSlidePrevEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 回弹
     * @param runCallbacks: 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slideBack: function slideBack() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var XORY = self.XORY,
          activeIndex = self.activeIndex,
          rectDistance = self.rectDistance,
          onTransitionEnd = self.onTransitionEnd;

      var translate = -activeIndex * rectDistance;

      self.slideAnimation(translate, speed);

      typeof onTransitionEnd === 'function' && setTimeout(function () {
        onTransitionEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 切换到指定slide
     * @param index：必选，num，指定将要切换到的slide的索引
     * @param speed：可选，num(单位ms)，切换速度
     * @param runCallbacks：可选，boolean，设置为false时不会触发onSlideChange回调函数
     */
    slideTo: function slideTo(index) {
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      var runCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var self = this;
      var slideLength = self.slideLength,
          activeIndex = self.activeIndex,
          rectDistance = self.rectDistance,
          onSlideChangeStart = self.onSlideChangeStart,
          onSlideChangeEnd = self.onSlideChangeEnd,
          onTransitionEnd = self.onTransitionEnd,
          consoleException = self.consoleException;

      try {
        if (typeof index !== 'number') throw 'paramType'; //  参数类型错误
        if (index < 0 || index > slideLength - 1) throw 'bound'; //  越界

        var translate = -index * rectDistance;
        self.previousIndex = activeIndex;
        self.activeIndex = index;
        self.isBeginning = self.activeIndex === self.initialSlide;
        self.isEnd = self.activeIndex === self.slideLength - 1;

        runCallbacks && typeof onSlideChangeStart === 'function' && onSlideChangeStart(self); // slide达到过渡条件时执行

        self.slideAnimation(translate, speed);

        runCallbacks && typeof onSlideChangeEnd === 'function' && setTimeout(function () {
          onSlideChangeEnd(self);
        }, speed); //  swiper从一个slide过渡到另一个slide结束后执行
        typeof onTransitionEnd === 'function' && setTimeout(function () {
          onTransitionEnd(self);
        }, speed); //  slide过渡结束后执行
      } catch (err) {
        consoleException(err, 'slideTo[Function]');
      }
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var REG = {
    SPEED: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/,
    TIMINGFUNCTION: /linear|ease|ease-in|ease-in-out|ease-out|step-start|step-end/
  };

  var animate = {
    /**
     * 平移动画
     * @param translate：平移位置
     * @param speed：过渡时长
     * @param timingFunction：过渡类型
     */
    slideAnimation: function slideAnimation() {
      var translate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      var timingFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ease';
      var XORY = this.XORY,
          animationViewName = this.animationViewName,
          consoleException = this.consoleException;

      try {
        /**
         * 异常处理
         */
        if (!REG.SPEED.test(speed)) throw 'paramType';
        if (!REG.TIMINGFUNCTION.test(timingFunction)) throw 'paramType';
        /**
         * 创建一个动画实例
         */
        var animation = wx.createAnimation({
          transformOrigin: '50% 50%',
          duration: speed,
          timingFunction: timingFunction,
          delay: 0
        });

        animation['translate' + XORY](translate).step(); //  动画描述

        this.syncView(animationViewName, animation.export()); //  同步动画到视图
      } catch (err) {
        consoleException(err, 'slideAnimation[Function]');
      }
    }
  };

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var sync = {
    /**
     * 同步设置到视图
     * @param DEFAULT：默认参数
     * @param param：构造参数
     */
    syncView: function syncView(viewName, prop) {
      this.pageContext.setData(defineProperty({}, "" + viewName, prop));
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var ERROR = {
    'paramType': '参数类型错误',
    'bound': '参数越界'
  };

  var exception = {
    /**
     * 错误对照
     */
    consoleException: function consoleException(type, place) {
      console.error('%c' + place + ':' + ERROR[type], 'color: red');
    }
  };

  var weSwiper = function () {
    function weSwiper(param) {
      classCallCheck(this, weSwiper);

      var pages = getCurrentPages();

      //  获取到当前page上下文
      this.pageContext = pages[pages.length - 1];
      //  把this依附在Page上下文的wecropper属性上，便于在page钩子函数中访问
      this.pageContext.weswiper = this;

      var all = Object.assign(this, DEFAULT, param || {});

      this.init(all);
    }

    /**
     * 初始化配置
     */

    createClass(weSwiper, [{
      key: 'init',
      value: function init(param) {
        var _this = this;

        var speed = param.speed,
            initialSlide = param.initialSlide,
            direction = param.direction,
            autoplay = param.autoplay,
            directionViewName = param.directionViewName;

        var directionClass = direction === 'horizontal' ? 'we-container-horizontal' : 'we-container-vertical';
        this.syncView(directionViewName, directionClass);
        this.rectDistance = direction === 'horizontal' ? this.width : this.height;
        this.XORY = direction === 'horizontal' ? 'X' : 'Y';
        this.activeIndex = initialSlide; //  将初始页码赋给activeIndex
        this.noSwiper = false; //  阻止手势滑动
        this.previousIndex = initialSlide; //  返回上一个活动块的索引，切换前的索引
        this.slideTo(initialSlide, 0);
        typeof autoplay === 'number' && autoplay > 0 && setInterval(function () {
          if (_this.isEnd) {
            _this.slideTo(0, speed);
          } else {
            _this.slideTo(_this.activeIndex + 1, speed);
          }
        }, autoplay);
        /**
         * 处理callback
         */
        var onInit = this.onInit;

        typeof onInit === 'function' && onInit(this);
      }
    }]);
    return weSwiper;
  }();

  Object.assign(weSwiper.prototype, controller);
  Object.assign(weSwiper.prototype, handle);
  Object.assign(weSwiper.prototype, methods);
  Object.assign(weSwiper.prototype, animate);
  Object.assign(weSwiper.prototype, sync);
  Object.assign(weSwiper.prototype, exception);

  return weSwiper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlU3dpcGVyLmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiYW1kIiwid2VTd2lwZXIiLCJkZXZpY2UiLCJ3eCIsImdldFN5c3RlbUluZm9TeW5jIiwiREVGQVVMVCIsInNsaWRlTGVuZ3RoIiwid2lkdGgiLCJ3aW5kb3dXaWR0aCIsImhlaWdodCIsIndpbmRvd0hlaWdodCIsImRpcmVjdGlvbiIsImluaXRpYWxTbGlkZSIsInNwZWVkIiwiZWZmZWN0IiwidGltaW5nRnVuY3Rpb24iLCJhdXRvcGxheSIsImFuaW1hdGlvblZpZXdOYW1lIiwib25Jbml0Iiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwib25TbGlkZUNoYW5nZVN0YXJ0Iiwib25TbGlkZUNoYW5nZUVuZCIsIm9uVHJhbnNpdGlvblN0YXJ0Iiwib25UcmFuc2l0aW9uRW5kIiwib25TbGlkZU1vdmUiLCJvblNsaWRlTmV4dFN0YXJ0Iiwib25TbGlkZU5leHRFbmQiLCJvblNsaWRlUHJldlN0YXJ0Iiwib25TbGlkZVByZXZFbmQiLCJoYW5kbGUiLCJ0b3VjaHN0YXJ0IiwiZSIsIm5vU3dpcGVyIiwiWE9SWSIsImFjdGl2ZUluZGV4IiwicmVjdERpc3RhbmNlIiwidG91Y2giLCJjaGFuZ2VkVG91Y2hlcyIsImRpc3RhbmNlIiwidHJhbnNsYXRlIiwidG91Y2hTdGFydFRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInNsaWRlQW5pbWF0aW9uIiwidG91Y2htb3ZlIiwidG1wTW92ZSIsInRvdWNoZW5kIiwidG91Y2hFbmRUaW1lIiwiYWN0aW9uIiwiY29udHJvbGxlciIsImZyb20iLCJ0byIsIndyYXBwZXJEaXN0YW5jZSIsImRlbHRhVGltZSIsIk1hdGgiLCJhYnMiLCJrIiwibWV0aG9kcyIsInNsaWRlTmV4dCIsInJ1bkNhbGxiYWNrcyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsInNlbGYiLCJzbGlkZVRvIiwic2V0VGltZW91dCIsInNsaWRlUHJldiIsInNsaWRlQmFjayIsImluZGV4IiwiY29uc29sZUV4Y2VwdGlvbiIsInByZXZpb3VzSW5kZXgiLCJpc0JlZ2lubmluZyIsImlzRW5kIiwiZXJyIiwiUkVHIiwiU1BFRUQiLCJUSU1JTkdGVU5DVElPTiIsImFuaW1hdGUiLCJ0ZXN0IiwiYW5pbWF0aW9uIiwiY3JlYXRlQW5pbWF0aW9uIiwidHJhbnNmb3JtT3JpZ2luIiwiZHVyYXRpb24iLCJkZWxheSIsInN0ZXAiLCJzeW5jVmlldyIsImV4cG9ydCIsImNsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJDb25zdHJ1Y3RvciIsIlR5cGVFcnJvciIsImNyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInByb3RvdHlwZSIsIm9iaiIsInZhbHVlIiwic3luYyIsInZpZXdOYW1lIiwicHJvcCIsInBhZ2VDb250ZXh0Iiwic2V0RGF0YSIsIkVSUk9SIiwiZXhjZXB0aW9uIiwidHlwZSIsInBsYWNlIiwiY29uc29sZSIsImVycm9yIiwicGFyYW0iLCJwYWdlcyIsImdldEN1cnJlbnRQYWdlcyIsIndlc3dpcGVyIiwiYWxsIiwiYXNzaWduIiwiaW5pdCIsIl90aGlzIiwiZGlyZWN0aW9uVmlld05hbWUiLCJkaXJlY3Rpb25DbGFzcyIsInNldEludGVydmFsIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUMsV0FBVUEsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7QUFDM0IsVUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFuQixJQUErQixPQUFPQyxNQUFQLEtBQWtCLFdBQWpELEdBQStEQSxPQUFPRCxPQUFQLEdBQWlCRCxTQUFoRixHQUNBLE9BQU9HLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE9BQU9DLEdBQXZDLEdBQTZDRCxPQUFPSCxPQUFQLENBQTdDLEdBQ0NELE9BQU9NLFFBQVAsR0FBa0JMLFNBRm5CO0FBR0EsQ0FKQSxhQUlRLFlBQVk7QUFBRTs7QUFFdkIsTUFBSU0sU0FBU0MsR0FBR0MsaUJBQUgsRUFBYixDQUZxQixDQUVnQjs7QUFFckMsTUFBSUMsVUFBVTtBQUNaOzs7QUFHQUMsaUJBQWEsQ0FKRCxFQUlJO0FBQ2hCOzs7QUFHQUMsV0FBT0wsT0FBT00sV0FSRjtBQVNaQyxZQUFRUCxPQUFPUSxZQVRIO0FBVVpDLGVBQVcsWUFWQztBQVdaQyxrQkFBYyxDQVhGO0FBWVpDLFdBQU8sR0FaSztBQWFaQyxZQUFRLE9BYkksRUFhSztBQUNqQkMsb0JBQWdCLE1BZEosRUFjWTtBQUN4QkMsY0FBVSxDQWZFLEVBZUM7QUFDYkMsdUJBQW1CLGVBaEJQLEVBZ0J3QjtBQUNwQzs7OztBQUlBQyxZQUFRLElBckJJLEVBcUJFO0FBQ2RDLGtCQUFjLElBdEJGLEVBc0JRO0FBQ3BCQyxpQkFBYSxJQXZCRCxFQXVCTztBQUNuQkMsZ0JBQVksSUF4QkEsRUF3Qk07QUFDbEJDLHdCQUFvQixJQXpCUixFQXlCYztBQUMxQkMsc0JBQWtCLElBMUJOLEVBMEJZO0FBQ3hCQyx1QkFBbUIsSUEzQlAsRUEyQmE7QUFDekJDLHFCQUFpQixJQTVCTCxFQTRCVztBQUN2QkMsaUJBQWEsSUE3QkQsRUE2Qk87QUFDbkJDLHNCQUFrQixJQTlCTixFQThCWTtBQUN4QkMsb0JBQWdCLElBL0JKLEVBK0JVO0FBQ3RCQyxzQkFBa0IsSUFoQ04sRUFnQ1k7QUFDeEJDLG9CQUFnQixJQWpDSixDQWlDUztBQWpDVCxHQUFkOztBQW9DQSxNQUFJQyxTQUFTO0FBQ1hDLGdCQUFZLFNBQVNBLFVBQVQsQ0FBb0JDLENBQXBCLEVBQXVCO0FBQ2pDLFVBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNuQixVQUFJZixlQUFlLEtBQUtBLFlBQXhCO0FBQUEsVUFDSWdCLE9BQU8sS0FBS0EsSUFEaEI7QUFBQSxVQUVJQyxjQUFjLEtBQUtBLFdBRnZCO0FBQUEsVUFHSUMsZUFBZSxLQUFLQSxZQUh4Qjs7QUFLQSxVQUFJQyxRQUFRTCxFQUFFTSxjQUFGLENBQWlCLENBQWpCLENBQVo7QUFDQSxVQUFJQyxXQUFXRixNQUFNLFdBQVdILElBQWpCLENBQWY7QUFDQSxVQUFJTSxZQUFZLENBQUNMLFdBQUQsR0FBZUMsWUFBL0I7O0FBRUEsV0FBSyxlQUFlRixJQUFwQixJQUE0QkssUUFBNUI7QUFDQSxXQUFLLGNBQWNMLElBQW5CLElBQTJCTSxTQUEzQjtBQUNBLFdBQUtDLGNBQUwsR0FBc0IsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQXRCOztBQUVBLGFBQU96QixZQUFQLEtBQXdCLFVBQXhCLElBQXNDQSxhQUFhLElBQWIsRUFBbUJjLENBQW5CLENBQXRDLENBZmlDLENBZTRCOztBQUU3RCxXQUFLWSxjQUFMLENBQW9CSixTQUFwQixFQUErQixDQUEvQjtBQUNELEtBbkJVO0FBb0JYSyxlQUFXLFNBQVNBLFNBQVQsQ0FBbUJiLENBQW5CLEVBQXNCO0FBQy9CLFVBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNuQixVQUFJZCxjQUFjLEtBQUtBLFdBQXZCO0FBQUEsVUFDSWUsT0FBTyxLQUFLQSxJQURoQjtBQUFBLFVBRUlULGNBQWMsS0FBS0EsV0FGdkI7O0FBSUEsVUFBSVksUUFBUUwsRUFBRU0sY0FBRixDQUFpQixDQUFqQixDQUFaO0FBQ0EsVUFBSUMsV0FBV0YsTUFBTSxXQUFXSCxJQUFqQixDQUFmO0FBQ0EsVUFBSVksVUFBVSxLQUFLLGNBQWNaLElBQW5CLElBQTJCSyxRQUEzQixHQUFzQyxLQUFLLGVBQWVMLElBQXBCLENBQXBEOztBQUVBLGFBQU9mLFdBQVAsS0FBdUIsVUFBdkIsSUFBcUNBLFlBQVksSUFBWixFQUFrQmEsQ0FBbEIsQ0FBckMsQ0FWK0IsQ0FVNEI7O0FBRTNELFdBQUtZLGNBQUwsQ0FBb0JFLE9BQXBCLEVBQTZCLENBQTdCOztBQUVBLGFBQU9yQixXQUFQLEtBQXVCLFVBQXZCLElBQXFDQSxZQUFZLElBQVosQ0FBckM7QUFDRCxLQW5DVTtBQW9DWHNCLGNBQVUsU0FBU0EsUUFBVCxDQUFrQmYsQ0FBbEIsRUFBcUI7QUFDN0IsVUFBSSxLQUFLQyxRQUFULEVBQW1CO0FBQ25CLFVBQUliLGFBQWEsS0FBS0EsVUFBdEI7QUFBQSxVQUNJYyxPQUFPLEtBQUtBLElBRGhCO0FBQUEsVUFFSXRCLFFBQVEsS0FBS0EsS0FGakI7QUFBQSxVQUdJNkIsaUJBQWlCLEtBQUtBLGNBSDFCO0FBQUEsVUFJSUwsZUFBZSxLQUFLQSxZQUp4Qjs7QUFNQSxVQUFJQyxRQUFRTCxFQUFFTSxjQUFGLENBQWlCLENBQWpCLENBQVo7QUFDQSxVQUFJQyxXQUFXRixNQUFNLFdBQVdILElBQWpCLENBQWY7QUFDQSxVQUFJYyxlQUFlLElBQUlOLElBQUosR0FBV0MsT0FBWCxFQUFuQjs7QUFFQSxVQUFJTSxTQUFTLEtBQUtBLE1BQUwsQ0FBWVIsY0FBWixFQUE0Qk8sWUFBNUIsRUFBMEMsS0FBSyxlQUFlZCxJQUFwQixDQUExQyxFQUFxRUssUUFBckUsRUFBK0VILFlBQS9FLENBQWI7O0FBRUEsYUFBT2hCLFVBQVAsS0FBc0IsVUFBdEIsSUFBb0NBLFdBQVcsSUFBWCxFQUFpQlksQ0FBakIsQ0FBcEMsQ0FkNkIsQ0FjNEI7O0FBRXpELFdBQUtpQixNQUFMLEVBQWEsSUFBYixFQUFtQnJDLEtBQW5CO0FBQ0Q7QUFyRFUsR0FBYjs7QUF3REE7Ozs7QUFJQSxNQUFJc0MsYUFBYTtBQUNmOzs7Ozs7Ozs7QUFTQUQsWUFBUSxTQUFTQSxNQUFULENBQWdCUixjQUFoQixFQUFnQ08sWUFBaEMsRUFBOENHLElBQTlDLEVBQW9EQyxFQUFwRCxFQUF3REMsZUFBeEQsRUFBeUU7QUFDL0UsVUFBSWxCLGNBQWMsS0FBS0EsV0FBdkI7QUFBQSxVQUNJOUIsY0FBYyxLQUFLQSxXQUR2QjtBQUFBLFVBRUlrQixvQkFBb0IsS0FBS0EsaUJBRjdCOztBQUlBLFVBQUkrQixZQUFZTixlQUFlUCxjQUEvQixDQUwrRSxDQUtoQztBQUMvQyxVQUFJRixXQUFXZ0IsS0FBS0MsR0FBTCxDQUFTSixLQUFLRCxJQUFkLENBQWYsQ0FOK0UsQ0FNM0M7O0FBRXBDLFVBQUlNLElBQUlsQixXQUFXZSxTQUFuQjs7QUFFQSxVQUFJRixLQUFLRCxJQUFULEVBQWU7QUFDYixlQUFPNUIsaUJBQVAsS0FBNkIsVUFBN0IsSUFBMkNBLGtCQUFrQixJQUFsQixDQUEzQyxDQURhLENBQ3VEO0FBQ3BFLGVBQU9rQyxJQUFJLEdBQUosSUFBV2xCLFdBQVdjLGtCQUFrQixDQUF4QyxHQUE0Q2xCLGdCQUFnQixDQUFoQixHQUFvQixXQUFwQixHQUFrQyxXQUE5RSxHQUE0RixXQUFuRztBQUNEOztBQUVELFVBQUlpQixLQUFLRCxJQUFULEVBQWU7QUFDYixlQUFPNUIsaUJBQVAsS0FBNkIsVUFBN0IsSUFBMkNBLGtCQUFrQixJQUFsQixDQUEzQyxDQURhLENBQ3VEO0FBQ3BFLGVBQU9rQyxJQUFJLEdBQUosSUFBV2xCLFdBQVdjLGtCQUFrQixDQUF4QyxHQUE0Q2xCLGdCQUFnQjlCLGNBQWMsQ0FBOUIsR0FBa0MsV0FBbEMsR0FBZ0QsV0FBNUYsR0FBMEcsV0FBakg7QUFDRDs7QUFFRCxVQUFJK0MsS0FBS0QsSUFBVCxFQUFlO0FBQ2IsZUFBTyxXQUFQO0FBQ0Q7QUFDRjtBQWpDYyxHQUFqQjs7QUFvQ0EsTUFBSU8sVUFBVTtBQUNaOzs7OztBQUtBQyxlQUFXLFNBQVNBLFNBQVQsR0FBcUI7QUFDOUIsVUFBSUMsZUFBZUMsVUFBVUMsTUFBVixHQUFtQixDQUFuQixJQUF3QkQsVUFBVSxDQUFWLE1BQWlCRSxTQUF6QyxHQUFxREYsVUFBVSxDQUFWLENBQXJELEdBQW9FLEtBQXZGO0FBQ0EsVUFBSWpELFFBQVFpRCxVQUFVQyxNQUFWLEdBQW1CLENBQW5CLElBQXdCRCxVQUFVLENBQVYsTUFBaUJFLFNBQXpDLEdBQXFERixVQUFVLENBQVYsQ0FBckQsR0FBb0UsR0FBaEY7O0FBRUEsVUFBSUcsT0FBTyxJQUFYO0FBQ0EsVUFBSXRDLG1CQUFtQnNDLEtBQUt0QyxnQkFBNUI7QUFBQSxVQUNJQyxpQkFBaUJxQyxLQUFLckMsY0FEMUI7O0FBSUEsYUFBT0QsZ0JBQVAsS0FBNEIsVUFBNUIsSUFBMENBLGlCQUFpQnNDLElBQWpCLENBQTFDLENBVDhCLENBU29DOztBQUVsRUEsV0FBS0MsT0FBTCxDQUFhRCxLQUFLN0IsV0FBTCxHQUFtQixDQUFoQyxFQUFtQ3ZCLEtBQW5DLEVBQTBDZ0QsWUFBMUM7O0FBRUEsYUFBT2pDLGNBQVAsS0FBMEIsVUFBMUIsSUFBd0N1QyxXQUFXLFlBQVk7QUFDN0R2Qyx1QkFBZXFDLElBQWY7QUFDRCxPQUZ1QyxFQUVyQ3BELEtBRnFDLENBQXhDLENBYjhCLENBZW5CO0FBQ1osS0F0Qlc7O0FBd0JaOzs7OztBQUtBdUQsZUFBVyxTQUFTQSxTQUFULEdBQXFCO0FBQzlCLFVBQUlQLGVBQWVDLFVBQVVDLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JELFVBQVUsQ0FBVixNQUFpQkUsU0FBekMsR0FBcURGLFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxLQUF2RjtBQUNBLFVBQUlqRCxRQUFRaUQsVUFBVUMsTUFBVixHQUFtQixDQUFuQixJQUF3QkQsVUFBVSxDQUFWLE1BQWlCRSxTQUF6QyxHQUFxREYsVUFBVSxDQUFWLENBQXJELEdBQW9FLEdBQWhGOztBQUVBLFVBQUlHLE9BQU8sSUFBWDtBQUNBLFVBQUlwQyxtQkFBbUJvQyxLQUFLcEMsZ0JBQTVCO0FBQUEsVUFDSUMsaUJBQWlCbUMsS0FBS25DLGNBRDFCOztBQUlBLGFBQU9ELGdCQUFQLEtBQTRCLFVBQTVCLElBQTBDQSxpQkFBaUJvQyxJQUFqQixDQUExQyxDQVQ4QixDQVNvQzs7QUFFbEVBLFdBQUtDLE9BQUwsQ0FBYUQsS0FBSzdCLFdBQUwsR0FBbUIsQ0FBaEMsRUFBbUN2QixLQUFuQyxFQUEwQ2dELFlBQTFDOztBQUVBLGFBQU8vQixjQUFQLEtBQTBCLFVBQTFCLElBQXdDcUMsV0FBVyxZQUFZO0FBQzdEckMsdUJBQWVtQyxJQUFmO0FBQ0QsT0FGdUMsRUFFckNwRCxLQUZxQyxDQUF4QyxDQWI4QixDQWVuQjtBQUNaLEtBN0NXOztBQStDWjs7Ozs7QUFLQXdELGVBQVcsU0FBU0EsU0FBVCxHQUFxQjtBQUM5QixVQUFJUixlQUFlQyxVQUFVQyxNQUFWLEdBQW1CLENBQW5CLElBQXdCRCxVQUFVLENBQVYsTUFBaUJFLFNBQXpDLEdBQXFERixVQUFVLENBQVYsQ0FBckQsR0FBb0UsS0FBdkY7QUFDQSxVQUFJakQsUUFBUWlELFVBQVVDLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JELFVBQVUsQ0FBVixNQUFpQkUsU0FBekMsR0FBcURGLFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxHQUFoRjs7QUFFQSxVQUFJRyxPQUFPLElBQVg7QUFDQSxVQUFJOUIsT0FBTzhCLEtBQUs5QixJQUFoQjtBQUFBLFVBQ0lDLGNBQWM2QixLQUFLN0IsV0FEdkI7QUFBQSxVQUVJQyxlQUFlNEIsS0FBSzVCLFlBRnhCO0FBQUEsVUFHSVosa0JBQWtCd0MsS0FBS3hDLGVBSDNCOztBQU1BLFVBQUlnQixZQUFZLENBQUNMLFdBQUQsR0FBZUMsWUFBL0I7O0FBRUE0QixXQUFLcEIsY0FBTCxDQUFvQkosU0FBcEIsRUFBK0I1QixLQUEvQjs7QUFFQSxhQUFPWSxlQUFQLEtBQTJCLFVBQTNCLElBQXlDMEMsV0FBVyxZQUFZO0FBQzlEMUMsd0JBQWdCd0MsSUFBaEI7QUFDRCxPQUZ3QyxFQUV0Q3BELEtBRnNDLENBQXpDLENBZjhCLENBaUJuQjtBQUNaLEtBdEVXOztBQXdFWjs7Ozs7O0FBTUFxRCxhQUFTLFNBQVNBLE9BQVQsQ0FBaUJJLEtBQWpCLEVBQXdCO0FBQy9CLFVBQUl6RCxRQUFRaUQsVUFBVUMsTUFBVixHQUFtQixDQUFuQixJQUF3QkQsVUFBVSxDQUFWLE1BQWlCRSxTQUF6QyxHQUFxREYsVUFBVSxDQUFWLENBQXJELEdBQW9FLEdBQWhGO0FBQ0EsVUFBSUQsZUFBZUMsVUFBVUMsTUFBVixHQUFtQixDQUFuQixJQUF3QkQsVUFBVSxDQUFWLE1BQWlCRSxTQUF6QyxHQUFxREYsVUFBVSxDQUFWLENBQXJELEdBQW9FLEtBQXZGOztBQUVBLFVBQUlHLE9BQU8sSUFBWDtBQUNBLFVBQUkzRCxjQUFjMkQsS0FBSzNELFdBQXZCO0FBQUEsVUFDSThCLGNBQWM2QixLQUFLN0IsV0FEdkI7QUFBQSxVQUVJQyxlQUFlNEIsS0FBSzVCLFlBRnhCO0FBQUEsVUFHSWYscUJBQXFCMkMsS0FBSzNDLGtCQUg5QjtBQUFBLFVBSUlDLG1CQUFtQjBDLEtBQUsxQyxnQkFKNUI7QUFBQSxVQUtJRSxrQkFBa0J3QyxLQUFLeEMsZUFMM0I7QUFBQSxVQU1JOEMsbUJBQW1CTixLQUFLTSxnQkFONUI7O0FBU0EsVUFBSTtBQUNGLFlBQUksT0FBT0QsS0FBUCxLQUFpQixRQUFyQixFQUErQixNQUFNLFdBQU4sQ0FEN0IsQ0FDZ0Q7QUFDbEQsWUFBSUEsUUFBUSxDQUFSLElBQWFBLFFBQVFoRSxjQUFjLENBQXZDLEVBQTBDLE1BQU0sT0FBTixDQUZ4QyxDQUV1RDs7QUFFekQsWUFBSW1DLFlBQVksQ0FBQzZCLEtBQUQsR0FBU2pDLFlBQXpCO0FBQ0E0QixhQUFLTyxhQUFMLEdBQXFCcEMsV0FBckI7QUFDQTZCLGFBQUs3QixXQUFMLEdBQW1Ca0MsS0FBbkI7QUFDQUwsYUFBS1EsV0FBTCxHQUFtQlIsS0FBSzdCLFdBQUwsS0FBcUI2QixLQUFLckQsWUFBN0M7QUFDQXFELGFBQUtTLEtBQUwsR0FBYVQsS0FBSzdCLFdBQUwsS0FBcUI2QixLQUFLM0QsV0FBTCxHQUFtQixDQUFyRDs7QUFFQXVELHdCQUFnQixPQUFPdkMsa0JBQVAsS0FBOEIsVUFBOUMsSUFBNERBLG1CQUFtQjJDLElBQW5CLENBQTVELENBVkUsQ0FVb0Y7O0FBRXRGQSxhQUFLcEIsY0FBTCxDQUFvQkosU0FBcEIsRUFBK0I1QixLQUEvQjs7QUFFQWdELHdCQUFnQixPQUFPdEMsZ0JBQVAsS0FBNEIsVUFBNUMsSUFBMEQ0QyxXQUFXLFlBQVk7QUFDL0U1QywyQkFBaUIwQyxJQUFqQjtBQUNELFNBRnlELEVBRXZEcEQsS0FGdUQsQ0FBMUQsQ0FkRSxDQWdCUztBQUNYLGVBQU9ZLGVBQVAsS0FBMkIsVUFBM0IsSUFBeUMwQyxXQUFXLFlBQVk7QUFDOUQxQywwQkFBZ0J3QyxJQUFoQjtBQUNELFNBRndDLEVBRXRDcEQsS0FGc0MsQ0FBekMsQ0FqQkUsQ0FtQlM7QUFDWixPQXBCRCxDQW9CRSxPQUFPOEQsR0FBUCxFQUFZO0FBQ1pKLHlCQUFpQkksR0FBakIsRUFBc0IsbUJBQXRCO0FBQ0Q7QUFDRjtBQW5IVyxHQUFkOztBQXNIQTs7O0FBR0EsTUFBSUMsTUFBTTtBQUNSQyxXQUFPLGdDQURDO0FBRVJDLG9CQUFnQjtBQUZSLEdBQVY7O0FBS0EsTUFBSUMsVUFBVTtBQUNaOzs7Ozs7QUFNQWxDLG9CQUFnQixTQUFTQSxjQUFULEdBQTBCO0FBQ3hDLFVBQUlKLFlBQVlxQixVQUFVQyxNQUFWLEdBQW1CLENBQW5CLElBQXdCRCxVQUFVLENBQVYsTUFBaUJFLFNBQXpDLEdBQXFERixVQUFVLENBQVYsQ0FBckQsR0FBb0UsQ0FBcEY7QUFDQSxVQUFJakQsUUFBUWlELFVBQVVDLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JELFVBQVUsQ0FBVixNQUFpQkUsU0FBekMsR0FBcURGLFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxHQUFoRjtBQUNBLFVBQUkvQyxpQkFBaUIrQyxVQUFVQyxNQUFWLEdBQW1CLENBQW5CLElBQXdCRCxVQUFVLENBQVYsTUFBaUJFLFNBQXpDLEdBQXFERixVQUFVLENBQVYsQ0FBckQsR0FBb0UsTUFBekY7QUFDQSxVQUFJM0IsT0FBTyxLQUFLQSxJQUFoQjtBQUFBLFVBQ0lsQixvQkFBb0IsS0FBS0EsaUJBRDdCO0FBQUEsVUFFSXNELG1CQUFtQixLQUFLQSxnQkFGNUI7O0FBSUEsVUFBSTtBQUNGOzs7QUFHQSxZQUFJLENBQUNLLElBQUlDLEtBQUosQ0FBVUcsSUFBVixDQUFlbkUsS0FBZixDQUFMLEVBQTRCLE1BQU0sV0FBTjtBQUM1QixZQUFJLENBQUMrRCxJQUFJRSxjQUFKLENBQW1CRSxJQUFuQixDQUF3QmpFLGNBQXhCLENBQUwsRUFBOEMsTUFBTSxXQUFOO0FBQzlDOzs7QUFHQSxZQUFJa0UsWUFBWTlFLEdBQUcrRSxlQUFILENBQW1CO0FBQ2pDQywyQkFBaUIsU0FEZ0I7QUFFakNDLG9CQUFVdkUsS0FGdUI7QUFHakNFLDBCQUFnQkEsY0FIaUI7QUFJakNzRSxpQkFBTztBQUowQixTQUFuQixDQUFoQjs7QUFPQUosa0JBQVUsY0FBYzlDLElBQXhCLEVBQThCTSxTQUE5QixFQUF5QzZDLElBQXpDLEdBaEJFLENBZ0IrQzs7QUFFakQsYUFBS0MsUUFBTCxDQUFjdEUsaUJBQWQsRUFBaUNnRSxVQUFVTyxNQUFWLEVBQWpDLEVBbEJFLENBa0JvRDtBQUN2RCxPQW5CRCxDQW1CRSxPQUFPYixHQUFQLEVBQVk7QUFDWkoseUJBQWlCSSxHQUFqQixFQUFzQiwwQkFBdEI7QUFDRDtBQUNGO0FBckNXLEdBQWQ7O0FBd0NBLE1BQUljLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBVUMsUUFBVixFQUFvQkMsV0FBcEIsRUFBaUM7QUFDcEQsUUFBSSxFQUFFRCxvQkFBb0JDLFdBQXRCLENBQUosRUFBd0M7QUFDdEMsWUFBTSxJQUFJQyxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUNEO0FBQ0YsR0FKRDs7QUFNQSxNQUFJQyxjQUFjLFlBQVk7QUFDNUIsYUFBU0MsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5QztBQUN2QyxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBTWpDLE1BQTFCLEVBQWtDa0MsR0FBbEMsRUFBdUM7QUFDckMsWUFBSUMsYUFBYUYsTUFBTUMsQ0FBTixDQUFqQjtBQUNBQyxtQkFBV0MsVUFBWCxHQUF3QkQsV0FBV0MsVUFBWCxJQUF5QixLQUFqRDtBQUNBRCxtQkFBV0UsWUFBWCxHQUEwQixJQUExQjtBQUNBLFlBQUksV0FBV0YsVUFBZixFQUEyQkEsV0FBV0csUUFBWCxHQUFzQixJQUF0QjtBQUMzQkMsZUFBT0MsY0FBUCxDQUFzQlIsTUFBdEIsRUFBOEJHLFdBQVdNLEdBQXpDLEVBQThDTixVQUE5QztBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxVQUFVUCxXQUFWLEVBQXVCYyxVQUF2QixFQUFtQ0MsV0FBbkMsRUFBZ0Q7QUFDckQsVUFBSUQsVUFBSixFQUFnQlgsaUJBQWlCSCxZQUFZZ0IsU0FBN0IsRUFBd0NGLFVBQXhDO0FBQ2hCLFVBQUlDLFdBQUosRUFBaUJaLGlCQUFpQkgsV0FBakIsRUFBOEJlLFdBQTlCO0FBQ2pCLGFBQU9mLFdBQVA7QUFDRCxLQUpEO0FBS0QsR0FoQmlCLEVBQWxCOztBQXNCQSxNQUFJWSxpQkFBaUIsU0FBakJBLGNBQWlCLENBQVVLLEdBQVYsRUFBZUosR0FBZixFQUFvQkssS0FBcEIsRUFBMkI7QUFDOUMsUUFBSUwsT0FBT0ksR0FBWCxFQUFnQjtBQUNkTixhQUFPQyxjQUFQLENBQXNCSyxHQUF0QixFQUEyQkosR0FBM0IsRUFBZ0M7QUFDOUJLLGVBQU9BLEtBRHVCO0FBRTlCVixvQkFBWSxJQUZrQjtBQUc5QkMsc0JBQWMsSUFIZ0I7QUFJOUJDLGtCQUFVO0FBSm9CLE9BQWhDO0FBTUQsS0FQRCxNQU9PO0FBQ0xPLFVBQUlKLEdBQUosSUFBV0ssS0FBWDtBQUNEOztBQUVELFdBQU9ELEdBQVA7QUFDRCxHQWJEOztBQWVBOzs7QUFHQSxNQUFJRSxPQUFPO0FBQ1Q7Ozs7O0FBS0F2QixjQUFVLFNBQVNBLFFBQVQsQ0FBa0J3QixRQUFsQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDMUMsV0FBS0MsV0FBTCxDQUFpQkMsT0FBakIsQ0FBeUJYLGVBQWUsRUFBZixFQUFtQixLQUFLUSxRQUF4QixFQUFrQ0MsSUFBbEMsQ0FBekI7QUFDRDtBQVJRLEdBQVg7O0FBV0E7OztBQUdBLE1BQUlHLFFBQVE7QUFDVixpQkFBYSxRQURIO0FBRVYsYUFBUztBQUZDLEdBQVo7O0FBS0EsTUFBSUMsWUFBWTtBQUNkOzs7QUFHQTdDLHNCQUFrQixTQUFTQSxnQkFBVCxDQUEwQjhDLElBQTFCLEVBQWdDQyxLQUFoQyxFQUF1QztBQUN2REMsY0FBUUMsS0FBUixDQUFjLE9BQU9GLEtBQVAsR0FBZSxHQUFmLEdBQXFCSCxNQUFNRSxJQUFOLENBQW5DLEVBQWdELFlBQWhEO0FBQ0Q7QUFOYSxHQUFoQjs7QUFTQSxNQUFJcEgsV0FBVyxZQUFZO0FBQ3pCLGFBQVNBLFFBQVQsQ0FBa0J3SCxLQUFsQixFQUF5QjtBQUN2QmhDLHFCQUFlLElBQWYsRUFBcUJ4RixRQUFyQjs7QUFHQSxVQUFJeUgsUUFBUUMsaUJBQVo7O0FBRUE7QUFDQSxXQUFLVixXQUFMLEdBQW1CUyxNQUFNQSxNQUFNM0QsTUFBTixHQUFlLENBQXJCLENBQW5CO0FBQ0E7QUFDQSxXQUFLa0QsV0FBTCxDQUFpQlcsUUFBakIsR0FBNEIsSUFBNUI7O0FBRUEsVUFBSUMsTUFBTXZCLE9BQU93QixNQUFQLENBQWMsSUFBZCxFQUFvQnpILE9BQXBCLEVBQTZCb0gsU0FBUyxFQUF0QyxDQUFWOztBQUVBLFdBQUtNLElBQUwsQ0FBVUYsR0FBVjtBQUNEOztBQUVEOzs7O0FBS0FoQyxnQkFBWTVGLFFBQVosRUFBc0IsQ0FBQztBQUNyQnVHLFdBQUssTUFEZ0I7QUFFckJLLGFBQU8sU0FBU2tCLElBQVQsQ0FBY04sS0FBZCxFQUFxQjtBQUMxQixZQUFJTyxRQUFRLElBQVo7O0FBRUEsWUFBSW5ILFFBQVE0RyxNQUFNNUcsS0FBbEI7QUFBQSxZQUNJRCxlQUFlNkcsTUFBTTdHLFlBRHpCO0FBQUEsWUFFSUQsWUFBWThHLE1BQU05RyxTQUZ0QjtBQUFBLFlBR0lLLFdBQVd5RyxNQUFNekcsUUFIckI7QUFBQSxZQUlJaUgsb0JBQW9CUixNQUFNUSxpQkFKOUI7O0FBT0EsWUFBSUMsaUJBQWlCdkgsY0FBYyxZQUFkLEdBQTZCLHlCQUE3QixHQUF5RCx1QkFBOUU7QUFDQSxhQUFLNEUsUUFBTCxDQUFjMEMsaUJBQWQsRUFBaUNDLGNBQWpDO0FBQ0EsYUFBSzdGLFlBQUwsR0FBb0IxQixjQUFjLFlBQWQsR0FBNkIsS0FBS0osS0FBbEMsR0FBMEMsS0FBS0UsTUFBbkU7QUFDQSxhQUFLMEIsSUFBTCxHQUFZeEIsY0FBYyxZQUFkLEdBQTZCLEdBQTdCLEdBQW1DLEdBQS9DO0FBQ0EsYUFBS3lCLFdBQUwsR0FBbUJ4QixZQUFuQixDQWQwQixDQWNPO0FBQ2pDLGFBQUtzQixRQUFMLEdBQWdCLEtBQWhCLENBZjBCLENBZUg7QUFDdkIsYUFBS3NDLGFBQUwsR0FBcUI1RCxZQUFyQixDQWhCMEIsQ0FnQlM7QUFDbkMsYUFBS3NELE9BQUwsQ0FBYXRELFlBQWIsRUFBMkIsQ0FBM0I7QUFDQSxlQUFPSSxRQUFQLEtBQW9CLFFBQXBCLElBQWdDQSxXQUFXLENBQTNDLElBQWdEbUgsWUFBWSxZQUFZO0FBQ3RFLGNBQUlILE1BQU10RCxLQUFWLEVBQWlCO0FBQ2ZzRCxrQkFBTTlELE9BQU4sQ0FBYyxDQUFkLEVBQWlCckQsS0FBakI7QUFDRCxXQUZELE1BRU87QUFDTG1ILGtCQUFNOUQsT0FBTixDQUFjOEQsTUFBTTVGLFdBQU4sR0FBb0IsQ0FBbEMsRUFBcUN2QixLQUFyQztBQUNEO0FBQ0YsU0FOK0MsRUFNN0NHLFFBTjZDLENBQWhEO0FBT0E7OztBQUdBLFlBQUlFLFNBQVMsS0FBS0EsTUFBbEI7O0FBRUEsZUFBT0EsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBTyxJQUFQLENBQWhDO0FBQ0Q7QUFqQ29CLEtBQUQsQ0FBdEI7QUFtQ0EsV0FBT2pCLFFBQVA7QUFDRCxHQTFEYyxFQUFmOztBQTREQXFHLFNBQU93QixNQUFQLENBQWM3SCxTQUFTMEcsU0FBdkIsRUFBa0N4RCxVQUFsQztBQUNBbUQsU0FBT3dCLE1BQVAsQ0FBYzdILFNBQVMwRyxTQUF2QixFQUFrQzVFLE1BQWxDO0FBQ0F1RSxTQUFPd0IsTUFBUCxDQUFjN0gsU0FBUzBHLFNBQXZCLEVBQWtDaEQsT0FBbEM7QUFDQTJDLFNBQU93QixNQUFQLENBQWM3SCxTQUFTMEcsU0FBdkIsRUFBa0M1QixPQUFsQztBQUNBdUIsU0FBT3dCLE1BQVAsQ0FBYzdILFNBQVMwRyxTQUF2QixFQUFrQ0csSUFBbEM7QUFDQVIsU0FBT3dCLE1BQVAsQ0FBYzdILFNBQVMwRyxTQUF2QixFQUFrQ1MsU0FBbEM7O0FBRUEsU0FBT25ILFFBQVA7QUFFQyxDQWpjQSxDQUFEIiwiZmlsZSI6IndlU3dpcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLndlU3dpcGVyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGV2aWNlID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKTsgLy8gIOiOt+WPluiuvuWkh+S/oeaBr1xuXG52YXIgREVGQVVMVCA9IHtcbiAgLyoqXG4gICAqIOW/heWhq+mhuVxuICAgKi9cbiAgc2xpZGVMZW5ndGg6IDAsIC8vICDnlLHkuo7nm67liY3ml6Dms5Xnm7TmjqXojrflj5ZzbGlkZemhteaVsO+8jOebruWJjeWPquiDvemAmui/h+WPguaVsOWGmeWFpVxuICAvKipcbiAgICog5Y+v6YCJ5Y+C5pWwXG4gICAqL1xuICB3aWR0aDogZGV2aWNlLndpbmRvd1dpZHRoLFxuICBoZWlnaHQ6IGRldmljZS53aW5kb3dIZWlnaHQsXG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBpbml0aWFsU2xpZGU6IDAsXG4gIHNwZWVkOiAzMDAsXG4gIGVmZmVjdDogJ3NsaWRlJywgLy8gIOi/h+a4oeaViOaenFxuICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2UnLCAvLyAg6L+H5rih5Yqo55S76YCf5bqm5puy57q/XG4gIGF1dG9wbGF5OiAwLCAvLyAg6Ieq5Yqo5pKt5pS+6Ze06ZqU77yM6K6+572u5Li6MOaXtuS4jeiHquWKqOaSreaUvlxuICBhbmltYXRpb25WaWV3TmFtZTogJ2FuaW1hdGlvbkRhdGEnLCAvLyAg5a+55bqU6KeG5Zu+d3JhcHBlcuS4rWFuaW1hdGlvbuWxnuaAp+WQjVxuICAvKipcbiAgICog5LqL5Lu25Zue6LCDXG4gICAqIEB0eXBlIHtbdHlwZV19XG4gICAqL1xuICBvbkluaXQ6IG51bGwsIC8vICBzd2lwZXLliJ3lp4vljJbml7bmiafooYxcbiAgb25Ub3VjaFN0YXJ0OiBudWxsLCAvLyAg5omL5oyH56Kw6Kemc2xpZGXml7bmiafooYxcbiAgb25Ub3VjaE1vdmU6IG51bGwsIC8vICDmiYvmjIfnorDop6ZzbGlkZeW5tuS4lOa7keWKqOaXtuaJp+ihjFxuICBvblRvdWNoRW5kOiBudWxsLCAvLyAg5omL5oyH56a75byAc2xpZGXml7bmiafooYxcbiAgb25TbGlkZUNoYW5nZVN0YXJ0OiBudWxsLCAvLyAgc2xpZGXovr7liLDov4fmuKHmnaHku7bml7bmiafooYxcbiAgb25TbGlkZUNoYW5nZUVuZDogbnVsbCwgLy8gIHN3aXBlcuS7juS4gOS4qnNsaWRl6L+H5rih5Yiw5Y+m5LiA5Liqc2xpZGXnu5PmnZ/ml7bmiafooYxcbiAgb25UcmFuc2l0aW9uU3RhcnQ6IG51bGwsIC8vICDov4fmuKHml7bop6blj5FcbiAgb25UcmFuc2l0aW9uRW5kOiBudWxsLCAvLyAg6L+H5rih57uT5p2f5pe25omn6KGMXG4gIG9uU2xpZGVNb3ZlOiBudWxsLCAvLyAg5omL5oyH6Kem56Kwc3dpcGVy5bm25LiU5ouW5Yqoc2xpZGXml7bmiafooYxcbiAgb25TbGlkZU5leHRTdGFydDogbnVsbCwgLy8gIHNsaWRl6L6+5Yiw6L+H5rih5p2h5Lu2IOS4lOinhOWumuS6huaWueWQkSDlkJHliY3vvIjlj7PjgIHkuIvvvInliIfmjaLml7bmiafooYxcbiAgb25TbGlkZU5leHRFbmQ6IG51bGwsIC8vICBzbGlkZei+vuWIsOi/h+a4oeadoeS7tiDkuJTop4TlrprkuobmlrnlkJEg5ZCR5YmN77yI5Y+z44CB5LiL77yJ5YiH5o2i57uT5p2f5pe25omn6KGMXG4gIG9uU2xpZGVQcmV2U3RhcnQ6IG51bGwsIC8vICBzbGlkZei+vuWIsOi/h+a4oeadoeS7tiDkuJTop4TlrprkuobmlrnlkJEg5ZCR5YmN77yI5bem44CB5LiK77yJ5YiH5o2i5pe25omn6KGMXG4gIG9uU2xpZGVQcmV2RW5kOiBudWxsIC8vICBzbGlkZei+vuWIsOi/h+a4oeadoeS7tiDkuJTop4TlrprkuobmlrnlkJEg5ZCR5YmN77yI5bem44CB5LiK77yJ5YiH5o2i57uT5p2f5pe25omn6KGMXG59O1xuXG52YXIgaGFuZGxlID0ge1xuICB0b3VjaHN0YXJ0OiBmdW5jdGlvbiB0b3VjaHN0YXJ0KGUpIHtcbiAgICBpZiAodGhpcy5ub1N3aXBlcikgcmV0dXJuO1xuICAgIHZhciBvblRvdWNoU3RhcnQgPSB0aGlzLm9uVG91Y2hTdGFydCxcbiAgICAgICAgWE9SWSA9IHRoaXMuWE9SWSxcbiAgICAgICAgYWN0aXZlSW5kZXggPSB0aGlzLmFjdGl2ZUluZGV4LFxuICAgICAgICByZWN0RGlzdGFuY2UgPSB0aGlzLnJlY3REaXN0YW5jZTtcblxuICAgIHZhciB0b3VjaCA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgdmFyIGRpc3RhbmNlID0gdG91Y2hbJ2NsaWVudCcgKyBYT1JZXTtcbiAgICB2YXIgdHJhbnNsYXRlID0gLWFjdGl2ZUluZGV4ICogcmVjdERpc3RhbmNlO1xuXG4gICAgdGhpc1sndG91Y2hTdGFydCcgKyBYT1JZXSA9IGRpc3RhbmNlO1xuICAgIHRoaXNbJ3RyYW5zbGF0ZScgKyBYT1JZXSA9IHRyYW5zbGF0ZTtcbiAgICB0aGlzLnRvdWNoU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICB0eXBlb2Ygb25Ub3VjaFN0YXJ0ID09PSAnZnVuY3Rpb24nICYmIG9uVG91Y2hTdGFydCh0aGlzLCBlKTsgLy8gIOW9k+aJi+aMh+eisOinpuWIsHNsaWRl5pe25omn6KGMXG5cbiAgICB0aGlzLnNsaWRlQW5pbWF0aW9uKHRyYW5zbGF0ZSwgMCk7XG4gIH0sXG4gIHRvdWNobW92ZTogZnVuY3Rpb24gdG91Y2htb3ZlKGUpIHtcbiAgICBpZiAodGhpcy5ub1N3aXBlcikgcmV0dXJuO1xuICAgIHZhciBvblRvdWNoTW92ZSA9IHRoaXMub25Ub3VjaE1vdmUsXG4gICAgICAgIFhPUlkgPSB0aGlzLlhPUlksXG4gICAgICAgIG9uU2xpZGVNb3ZlID0gdGhpcy5vblNsaWRlTW92ZTtcblxuICAgIHZhciB0b3VjaCA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgdmFyIGRpc3RhbmNlID0gdG91Y2hbJ2NsaWVudCcgKyBYT1JZXTtcbiAgICB2YXIgdG1wTW92ZSA9IHRoaXNbJ3RyYW5zbGF0ZScgKyBYT1JZXSArIGRpc3RhbmNlIC0gdGhpc1sndG91Y2hTdGFydCcgKyBYT1JZXTtcblxuICAgIHR5cGVvZiBvblRvdWNoTW92ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBvblRvdWNoTW92ZSh0aGlzLCBlKTsgLy8gIOaJi+aMh+eisOinpnNsaWRl5bm25LiU5ruR5Yqo5pe25omn6KGMXG5cbiAgICB0aGlzLnNsaWRlQW5pbWF0aW9uKHRtcE1vdmUsIDApO1xuXG4gICAgdHlwZW9mIG9uU2xpZGVNb3ZlID09PSAnZnVuY3Rpb24nICYmIG9uU2xpZGVNb3ZlKHRoaXMpO1xuICB9LFxuICB0b3VjaGVuZDogZnVuY3Rpb24gdG91Y2hlbmQoZSkge1xuICAgIGlmICh0aGlzLm5vU3dpcGVyKSByZXR1cm47XG4gICAgdmFyIG9uVG91Y2hFbmQgPSB0aGlzLm9uVG91Y2hFbmQsXG4gICAgICAgIFhPUlkgPSB0aGlzLlhPUlksXG4gICAgICAgIHNwZWVkID0gdGhpcy5zcGVlZCxcbiAgICAgICAgdG91Y2hTdGFydFRpbWUgPSB0aGlzLnRvdWNoU3RhcnRUaW1lLFxuICAgICAgICByZWN0RGlzdGFuY2UgPSB0aGlzLnJlY3REaXN0YW5jZTtcblxuICAgIHZhciB0b3VjaCA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgdmFyIGRpc3RhbmNlID0gdG91Y2hbJ2NsaWVudCcgKyBYT1JZXTtcbiAgICB2YXIgdG91Y2hFbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICB2YXIgYWN0aW9uID0gdGhpcy5hY3Rpb24odG91Y2hTdGFydFRpbWUsIHRvdWNoRW5kVGltZSwgdGhpc1sndG91Y2hTdGFydCcgKyBYT1JZXSwgZGlzdGFuY2UsIHJlY3REaXN0YW5jZSk7XG5cbiAgICB0eXBlb2Ygb25Ub3VjaEVuZCA9PT0gJ2Z1bmN0aW9uJyAmJiBvblRvdWNoRW5kKHRoaXMsIGUpOyAvLyAg5omL5oyH56a75byAc2xpZGXml7bmiafooYxcblxuICAgIHRoaXNbYWN0aW9uXSh0cnVlLCBzcGVlZCk7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlZCBieSBzYWlsIG9uIDIwMTcvNC8xLlxuICovXG5cbnZhciBjb250cm9sbGVyID0ge1xuICAvKipcbiAgICog5YiH5o2i5o6n5Yi25ZmoXG4gICAqIEBwYXJhbSB0b3VjaFN0YXJ0VGltZe+8miDmiYvmjIfop6bnorBzbGlkZeaXtueahOaXtumXtOaIs1xuICAgKiBAcGFyYW0gZXTvvJog5omL5oyH56a75byAc2xpZGXml7bnmoTml7bpl7TmiLNcbiAgICogQHBhcmFtIGZyb23vvJog5omL5oyH6Kem56Kwc2xpZGXml7bnmoTlsY/luZXkvY3nva5cbiAgICogQHBhcmFtIHRv77yaIOaJi+aMh+emu+W8gHNsaWRl5pe255qE5bGP5bmV5L2N572uXG4gICAqIEBwYXJhbSB3cmFwcGVyRGlzdGFuY2XvvJogc2xpZGXmu5HliqjmlrnlkJHkuIrnmoTlrrnlmajplb/luqZcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBhY3Rpb246IGZ1bmN0aW9uIGFjdGlvbih0b3VjaFN0YXJ0VGltZSwgdG91Y2hFbmRUaW1lLCBmcm9tLCB0bywgd3JhcHBlckRpc3RhbmNlKSB7XG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5hY3RpdmVJbmRleCxcbiAgICAgICAgc2xpZGVMZW5ndGggPSB0aGlzLnNsaWRlTGVuZ3RoLFxuICAgICAgICBvblRyYW5zaXRpb25TdGFydCA9IHRoaXMub25UcmFuc2l0aW9uU3RhcnQ7XG5cbiAgICB2YXIgZGVsdGFUaW1lID0gdG91Y2hFbmRUaW1lIC0gdG91Y2hTdGFydFRpbWU7IC8vICDmiYvmjIfop6bmkbjml7bplb9cbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLmFicyh0byAtIGZyb20pOyAvLyAg5ruR5Yqo6Led56a7XG5cbiAgICB2YXIgayA9IGRpc3RhbmNlIC8gZGVsdGFUaW1lO1xuXG4gICAgaWYgKHRvID4gZnJvbSkge1xuICAgICAgdHlwZW9mIG9uVHJhbnNpdGlvblN0YXJ0ID09PSAnZnVuY3Rpb24nICYmIG9uVHJhbnNpdGlvblN0YXJ0KHRoaXMpOyAvLyBzbGlkZei+vuWIsOi/h+a4oeadoeS7tuaXtuaJp+ihjFxuICAgICAgcmV0dXJuIGsgPiAwLjMgfHwgZGlzdGFuY2UgPiB3cmFwcGVyRGlzdGFuY2UgLyAyID8gYWN0aXZlSW5kZXggPT09IDAgPyAnc2xpZGVCYWNrJyA6ICdzbGlkZVByZXYnIDogJ3NsaWRlQmFjayc7XG4gICAgfVxuXG4gICAgaWYgKHRvIDwgZnJvbSkge1xuICAgICAgdHlwZW9mIG9uVHJhbnNpdGlvblN0YXJ0ID09PSAnZnVuY3Rpb24nICYmIG9uVHJhbnNpdGlvblN0YXJ0KHRoaXMpOyAvLyBzbGlkZei+vuWIsOi/h+a4oeadoeS7tuaXtuaJp+ihjFxuICAgICAgcmV0dXJuIGsgPiAwLjMgfHwgZGlzdGFuY2UgPiB3cmFwcGVyRGlzdGFuY2UgLyAyID8gYWN0aXZlSW5kZXggPT09IHNsaWRlTGVuZ3RoIC0gMSA/ICdzbGlkZUJhY2snIDogJ3NsaWRlTmV4dCcgOiAnc2xpZGVCYWNrJztcbiAgICB9XG5cbiAgICBpZiAodG8gPSBmcm9tKSB7XG4gICAgICByZXR1cm4gJ3NsaWRlQmFjayc7XG4gICAgfVxuICB9XG59O1xuXG52YXIgbWV0aG9kcyA9IHtcbiAgLyoqXG4gICAqIOWIh+aNouiHs+S4i+S4gOS4qnNsaWRlXG4gICAqIEBwYXJhbSBydW5DYWxsYmFja3PvvJog5Y+v6YCJ77yMYm9vbGVhbu+8jOiuvue9ruS4umZhbHNl5pe25LiN5Lya6Kem5Y+Rb25TbGlkZUNoYW5nZeWbnuiwg+WHveaVsFxuICAgKiBAcGFyYW0gc3BlZWQ6IOWPr+mAie+8jG51bSjljZXkvY1tcynvvIzliIfmjaLpgJ/luqZcbiAgICovXG4gIHNsaWRlTmV4dDogZnVuY3Rpb24gc2xpZGVOZXh0KCkge1xuICAgIHZhciBydW5DYWxsYmFja3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZhbHNlO1xuICAgIHZhciBzcGVlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMzAwO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvblNsaWRlTmV4dFN0YXJ0ID0gc2VsZi5vblNsaWRlTmV4dFN0YXJ0LFxuICAgICAgICBvblNsaWRlTmV4dEVuZCA9IHNlbGYub25TbGlkZU5leHRFbmQ7XG5cblxuICAgIHR5cGVvZiBvblNsaWRlTmV4dFN0YXJ0ID09PSAnZnVuY3Rpb24nICYmIG9uU2xpZGVOZXh0U3RhcnQoc2VsZik7IC8vIHNsaWRl6L6+5Yiw6L+H5rih5p2h5Lu25pe25omn6KGMXG5cbiAgICBzZWxmLnNsaWRlVG8oc2VsZi5hY3RpdmVJbmRleCArIDEsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuXG4gICAgdHlwZW9mIG9uU2xpZGVOZXh0RW5kID09PSAnZnVuY3Rpb24nICYmIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgb25TbGlkZU5leHRFbmQoc2VsZik7XG4gICAgfSwgc3BlZWQpOyAvLyAgc2xpZGXov4fmuKHnu5PmnZ/lkI7miafooYxcbiAgfSxcblxuICAvKipcbiAgICog5YiH5o2i6Iez5LiK5LiA5Liqc2xpZGVcbiAgICogQHBhcmFtIHJ1bkNhbGxiYWNrc++8miDlj6/pgInvvIxib29sZWFu77yM6K6+572u5Li6ZmFsc2Xml7bkuI3kvJrop6blj5FvblNsaWRlQ2hhbmdl5Zue6LCD5Ye95pWwXG4gICAqIEBwYXJhbSBzcGVlZDog5Y+v6YCJ77yMbnVtKOWNleS9jW1zKe+8jOWIh+aNoumAn+W6plxuICAgKi9cbiAgc2xpZGVQcmV2OiBmdW5jdGlvbiBzbGlkZVByZXYoKSB7XG4gICAgdmFyIHJ1bkNhbGxiYWNrcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZmFsc2U7XG4gICAgdmFyIHNwZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAzMDA7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9uU2xpZGVQcmV2U3RhcnQgPSBzZWxmLm9uU2xpZGVQcmV2U3RhcnQsXG4gICAgICAgIG9uU2xpZGVQcmV2RW5kID0gc2VsZi5vblNsaWRlUHJldkVuZDtcblxuXG4gICAgdHlwZW9mIG9uU2xpZGVQcmV2U3RhcnQgPT09ICdmdW5jdGlvbicgJiYgb25TbGlkZVByZXZTdGFydChzZWxmKTsgLy8gc2xpZGXovr7liLDov4fmuKHmnaHku7bml7bmiafooYxcblxuICAgIHNlbGYuc2xpZGVUbyhzZWxmLmFjdGl2ZUluZGV4IC0gMSwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG5cbiAgICB0eXBlb2Ygb25TbGlkZVByZXZFbmQgPT09ICdmdW5jdGlvbicgJiYgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBvblNsaWRlUHJldkVuZChzZWxmKTtcbiAgICB9LCBzcGVlZCk7IC8vICBzbGlkZei/h+a4oee7k+adn+WQjuaJp+ihjFxuICB9LFxuXG4gIC8qKlxuICAgKiDlm57lvLlcbiAgICogQHBhcmFtIHJ1bkNhbGxiYWNrczog5Y+v6YCJ77yMYm9vbGVhbu+8jOiuvue9ruS4umZhbHNl5pe25LiN5Lya6Kem5Y+Rb25TbGlkZUNoYW5nZeWbnuiwg+WHveaVsFxuICAgKiBAcGFyYW0gc3BlZWQ6IOWPr+mAie+8jG51bSjljZXkvY1tcynvvIzliIfmjaLpgJ/luqZcbiAgICovXG4gIHNsaWRlQmFjazogZnVuY3Rpb24gc2xpZGVCYWNrKCkge1xuICAgIHZhciBydW5DYWxsYmFja3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZhbHNlO1xuICAgIHZhciBzcGVlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMzAwO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBYT1JZID0gc2VsZi5YT1JZLFxuICAgICAgICBhY3RpdmVJbmRleCA9IHNlbGYuYWN0aXZlSW5kZXgsXG4gICAgICAgIHJlY3REaXN0YW5jZSA9IHNlbGYucmVjdERpc3RhbmNlLFxuICAgICAgICBvblRyYW5zaXRpb25FbmQgPSBzZWxmLm9uVHJhbnNpdGlvbkVuZDtcblxuXG4gICAgdmFyIHRyYW5zbGF0ZSA9IC1hY3RpdmVJbmRleCAqIHJlY3REaXN0YW5jZTtcblxuICAgIHNlbGYuc2xpZGVBbmltYXRpb24odHJhbnNsYXRlLCBzcGVlZCk7XG5cbiAgICB0eXBlb2Ygb25UcmFuc2l0aW9uRW5kID09PSAnZnVuY3Rpb24nICYmIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgb25UcmFuc2l0aW9uRW5kKHNlbGYpO1xuICAgIH0sIHNwZWVkKTsgLy8gIHNsaWRl6L+H5rih57uT5p2f5ZCO5omn6KGMXG4gIH0sXG5cbiAgLyoqXG4gICAqIOWIh+aNouWIsOaMh+WumnNsaWRlXG4gICAqIEBwYXJhbSBpbmRleO+8muW/hemAie+8jG51be+8jOaMh+WumuWwhuimgeWIh+aNouWIsOeahHNsaWRl55qE57Si5byVXG4gICAqIEBwYXJhbSBzcGVlZO+8muWPr+mAie+8jG51bSjljZXkvY1tcynvvIzliIfmjaLpgJ/luqZcbiAgICogQHBhcmFtIHJ1bkNhbGxiYWNrc++8muWPr+mAie+8jGJvb2xlYW7vvIzorr7nva7kuLpmYWxzZeaXtuS4jeS8muinpuWPkW9uU2xpZGVDaGFuZ2Xlm57osIPlh73mlbBcbiAgICovXG4gIHNsaWRlVG86IGZ1bmN0aW9uIHNsaWRlVG8oaW5kZXgpIHtcbiAgICB2YXIgc3BlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDMwMDtcbiAgICB2YXIgcnVuQ2FsbGJhY2tzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc2xpZGVMZW5ndGggPSBzZWxmLnNsaWRlTGVuZ3RoLFxuICAgICAgICBhY3RpdmVJbmRleCA9IHNlbGYuYWN0aXZlSW5kZXgsXG4gICAgICAgIHJlY3REaXN0YW5jZSA9IHNlbGYucmVjdERpc3RhbmNlLFxuICAgICAgICBvblNsaWRlQ2hhbmdlU3RhcnQgPSBzZWxmLm9uU2xpZGVDaGFuZ2VTdGFydCxcbiAgICAgICAgb25TbGlkZUNoYW5nZUVuZCA9IHNlbGYub25TbGlkZUNoYW5nZUVuZCxcbiAgICAgICAgb25UcmFuc2l0aW9uRW5kID0gc2VsZi5vblRyYW5zaXRpb25FbmQsXG4gICAgICAgIGNvbnNvbGVFeGNlcHRpb24gPSBzZWxmLmNvbnNvbGVFeGNlcHRpb247XG5cblxuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgdGhyb3cgJ3BhcmFtVHlwZSc7IC8vICDlj4LmlbDnsbvlnovplJnor69cbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiBzbGlkZUxlbmd0aCAtIDEpIHRocm93ICdib3VuZCc7IC8vICDotornlYxcblxuICAgICAgdmFyIHRyYW5zbGF0ZSA9IC1pbmRleCAqIHJlY3REaXN0YW5jZTtcbiAgICAgIHNlbGYucHJldmlvdXNJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgICAgc2VsZi5hY3RpdmVJbmRleCA9IGluZGV4O1xuICAgICAgc2VsZi5pc0JlZ2lubmluZyA9IHNlbGYuYWN0aXZlSW5kZXggPT09IHNlbGYuaW5pdGlhbFNsaWRlO1xuICAgICAgc2VsZi5pc0VuZCA9IHNlbGYuYWN0aXZlSW5kZXggPT09IHNlbGYuc2xpZGVMZW5ndGggLSAxO1xuXG4gICAgICBydW5DYWxsYmFja3MgJiYgdHlwZW9mIG9uU2xpZGVDaGFuZ2VTdGFydCA9PT0gJ2Z1bmN0aW9uJyAmJiBvblNsaWRlQ2hhbmdlU3RhcnQoc2VsZik7IC8vIHNsaWRl6L6+5Yiw6L+H5rih5p2h5Lu25pe25omn6KGMXG5cbiAgICAgIHNlbGYuc2xpZGVBbmltYXRpb24odHJhbnNsYXRlLCBzcGVlZCk7XG5cbiAgICAgIHJ1bkNhbGxiYWNrcyAmJiB0eXBlb2Ygb25TbGlkZUNoYW5nZUVuZCA9PT0gJ2Z1bmN0aW9uJyAmJiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb25TbGlkZUNoYW5nZUVuZChzZWxmKTtcbiAgICAgIH0sIHNwZWVkKTsgLy8gIHN3aXBlcuS7juS4gOS4qnNsaWRl6L+H5rih5Yiw5Y+m5LiA5Liqc2xpZGXnu5PmnZ/lkI7miafooYxcbiAgICAgIHR5cGVvZiBvblRyYW5zaXRpb25FbmQgPT09ICdmdW5jdGlvbicgJiYgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9uVHJhbnNpdGlvbkVuZChzZWxmKTtcbiAgICAgIH0sIHNwZWVkKTsgLy8gIHNsaWRl6L+H5rih57uT5p2f5ZCO5omn6KGMXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlRXhjZXB0aW9uKGVyciwgJ3NsaWRlVG9bRnVuY3Rpb25dJyk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgc2FpbCBvbiAyMDE3LzQvMS5cbiAqL1xudmFyIFJFRyA9IHtcbiAgU1BFRUQ6IC9eKDB8WzEtOV1bMC05XSp8LVsxLTldWzAtOV0qKSQvLFxuICBUSU1JTkdGVU5DVElPTjogL2xpbmVhcnxlYXNlfGVhc2UtaW58ZWFzZS1pbi1vdXR8ZWFzZS1vdXR8c3RlcC1zdGFydHxzdGVwLWVuZC9cbn07XG5cbnZhciBhbmltYXRlID0ge1xuICAvKipcbiAgICog5bmz56e75Yqo55S7XG4gICAqIEBwYXJhbSB0cmFuc2xhdGXvvJrlubPnp7vkvY3nva5cbiAgICogQHBhcmFtIHNwZWVk77ya6L+H5rih5pe26ZW/XG4gICAqIEBwYXJhbSB0aW1pbmdGdW5jdGlvbu+8mui/h+a4oeexu+Wei1xuICAgKi9cbiAgc2xpZGVBbmltYXRpb246IGZ1bmN0aW9uIHNsaWRlQW5pbWF0aW9uKCkge1xuICAgIHZhciB0cmFuc2xhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gICAgdmFyIHNwZWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAzMDA7XG4gICAgdmFyIHRpbWluZ0Z1bmN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnZWFzZSc7XG4gICAgdmFyIFhPUlkgPSB0aGlzLlhPUlksXG4gICAgICAgIGFuaW1hdGlvblZpZXdOYW1lID0gdGhpcy5hbmltYXRpb25WaWV3TmFtZSxcbiAgICAgICAgY29uc29sZUV4Y2VwdGlvbiA9IHRoaXMuY29uc29sZUV4Y2VwdGlvbjtcblxuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIOW8guW4uOWkhOeQhlxuICAgICAgICovXG4gICAgICBpZiAoIVJFRy5TUEVFRC50ZXN0KHNwZWVkKSkgdGhyb3cgJ3BhcmFtVHlwZSc7XG4gICAgICBpZiAoIVJFRy5USU1JTkdGVU5DVElPTi50ZXN0KHRpbWluZ0Z1bmN0aW9uKSkgdGhyb3cgJ3BhcmFtVHlwZSc7XG4gICAgICAvKipcbiAgICAgICAqIOWIm+W7uuS4gOS4quWKqOeUu+WunuS+i1xuICAgICAgICovXG4gICAgICB2YXIgYW5pbWF0aW9uID0gd3guY3JlYXRlQW5pbWF0aW9uKHtcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgIGR1cmF0aW9uOiBzcGVlZCxcbiAgICAgICAgdGltaW5nRnVuY3Rpb246IHRpbWluZ0Z1bmN0aW9uLFxuICAgICAgICBkZWxheTogMFxuICAgICAgfSk7XG5cbiAgICAgIGFuaW1hdGlvblsndHJhbnNsYXRlJyArIFhPUlldKHRyYW5zbGF0ZSkuc3RlcCgpOyAvLyAg5Yqo55S75o+P6L+wXG5cbiAgICAgIHRoaXMuc3luY1ZpZXcoYW5pbWF0aW9uVmlld05hbWUsIGFuaW1hdGlvbi5leHBvcnQoKSk7IC8vICDlkIzmraXliqjnlLvliLDop4blm75cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGVFeGNlcHRpb24oZXJyLCAnc2xpZGVBbmltYXRpb25bRnVuY3Rpb25dJyk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHNhaWwgb24gMjAxNy80LzEuXG4gKi9cbnZhciBzeW5jID0ge1xuICAvKipcbiAgICog5ZCM5q2l6K6+572u5Yiw6KeG5Zu+XG4gICAqIEBwYXJhbSBERUZBVUxU77ya6buY6K6k5Y+C5pWwXG4gICAqIEBwYXJhbSBwYXJhbe+8muaehOmAoOWPguaVsFxuICAgKi9cbiAgc3luY1ZpZXc6IGZ1bmN0aW9uIHN5bmNWaWV3KHZpZXdOYW1lLCBwcm9wKSB7XG4gICAgdGhpcy5wYWdlQ29udGV4dC5zZXREYXRhKGRlZmluZVByb3BlcnR5KHt9LCBcIlwiICsgdmlld05hbWUsIHByb3ApKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHNhaWwgb24gMjAxNy80LzEuXG4gKi9cbnZhciBFUlJPUiA9IHtcbiAgJ3BhcmFtVHlwZSc6ICflj4LmlbDnsbvlnovplJnor68nLFxuICAnYm91bmQnOiAn5Y+C5pWw6LaK55WMJ1xufTtcblxudmFyIGV4Y2VwdGlvbiA9IHtcbiAgLyoqXG4gICAqIOmUmeivr+WvueeFp1xuICAgKi9cbiAgY29uc29sZUV4Y2VwdGlvbjogZnVuY3Rpb24gY29uc29sZUV4Y2VwdGlvbih0eXBlLCBwbGFjZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJyVjJyArIHBsYWNlICsgJzonICsgRVJST1JbdHlwZV0sICdjb2xvcjogcmVkJyk7XG4gIH1cbn07XG5cbnZhciB3ZVN3aXBlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gd2VTd2lwZXIocGFyYW0pIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCB3ZVN3aXBlcik7XG5cblxuICAgIHZhciBwYWdlcyA9IGdldEN1cnJlbnRQYWdlcygpO1xuXG4gICAgLy8gIOiOt+WPluWIsOW9k+WJjXBhZ2XkuIrkuIvmlodcbiAgICB0aGlzLnBhZ2VDb250ZXh0ID0gcGFnZXNbcGFnZXMubGVuZ3RoIC0gMV07XG4gICAgLy8gIOaKinRoaXPkvp3pmYTlnKhQYWdl5LiK5LiL5paH55qEd2Vjcm9wcGVy5bGe5oCn5LiK77yM5L6/5LqO5ZyocGFnZemSqeWtkOWHveaVsOS4reiuv+mXrlxuICAgIHRoaXMucGFnZUNvbnRleHQud2Vzd2lwZXIgPSB0aGlzO1xuXG4gICAgdmFyIGFsbCA9IE9iamVjdC5hc3NpZ24odGhpcywgREVGQVVMVCwgcGFyYW0gfHwge30pO1xuXG4gICAgdGhpcy5pbml0KGFsbCk7XG4gIH1cblxuICAvKipcbiAgICog5Yid5aeL5YyW6YWN572uXG4gICAqL1xuXG5cbiAgY3JlYXRlQ2xhc3Mod2VTd2lwZXIsIFt7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQocGFyYW0pIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBzcGVlZCA9IHBhcmFtLnNwZWVkLFxuICAgICAgICAgIGluaXRpYWxTbGlkZSA9IHBhcmFtLmluaXRpYWxTbGlkZSxcbiAgICAgICAgICBkaXJlY3Rpb24gPSBwYXJhbS5kaXJlY3Rpb24sXG4gICAgICAgICAgYXV0b3BsYXkgPSBwYXJhbS5hdXRvcGxheSxcbiAgICAgICAgICBkaXJlY3Rpb25WaWV3TmFtZSA9IHBhcmFtLmRpcmVjdGlvblZpZXdOYW1lO1xuXG5cbiAgICAgIHZhciBkaXJlY3Rpb25DbGFzcyA9IGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gJ3dlLWNvbnRhaW5lci1ob3Jpem9udGFsJyA6ICd3ZS1jb250YWluZXItdmVydGljYWwnO1xuICAgICAgdGhpcy5zeW5jVmlldyhkaXJlY3Rpb25WaWV3TmFtZSwgZGlyZWN0aW9uQ2xhc3MpO1xuICAgICAgdGhpcy5yZWN0RGlzdGFuY2UgPSBkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IHRoaXMud2lkdGggOiB0aGlzLmhlaWdodDtcbiAgICAgIHRoaXMuWE9SWSA9IGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gJ1gnIDogJ1knO1xuICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGluaXRpYWxTbGlkZTsgLy8gIOWwhuWIneWni+mhteeggei1i+e7mWFjdGl2ZUluZGV4XG4gICAgICB0aGlzLm5vU3dpcGVyID0gZmFsc2U7IC8vICDpmLvmraLmiYvlir/mu5HliqhcbiAgICAgIHRoaXMucHJldmlvdXNJbmRleCA9IGluaXRpYWxTbGlkZTsgLy8gIOi/lOWbnuS4iuS4gOS4qua0u+WKqOWdl+eahOe0ouW8le+8jOWIh+aNouWJjeeahOe0ouW8lVxuICAgICAgdGhpcy5zbGlkZVRvKGluaXRpYWxTbGlkZSwgMCk7XG4gICAgICB0eXBlb2YgYXV0b3BsYXkgPT09ICdudW1iZXInICYmIGF1dG9wbGF5ID4gMCAmJiBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChfdGhpcy5pc0VuZCkge1xuICAgICAgICAgIF90aGlzLnNsaWRlVG8oMCwgc3BlZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLnNsaWRlVG8oX3RoaXMuYWN0aXZlSW5kZXggKyAxLCBzcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGF1dG9wbGF5KTtcbiAgICAgIC8qKlxuICAgICAgICog5aSE55CGY2FsbGJhY2tcbiAgICAgICAqL1xuICAgICAgdmFyIG9uSW5pdCA9IHRoaXMub25Jbml0O1xuXG4gICAgICB0eXBlb2Ygb25Jbml0ID09PSAnZnVuY3Rpb24nICYmIG9uSW5pdCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIHdlU3dpcGVyO1xufSgpO1xuXG5PYmplY3QuYXNzaWduKHdlU3dpcGVyLnByb3RvdHlwZSwgY29udHJvbGxlcik7XG5PYmplY3QuYXNzaWduKHdlU3dpcGVyLnByb3RvdHlwZSwgaGFuZGxlKTtcbk9iamVjdC5hc3NpZ24od2VTd2lwZXIucHJvdG90eXBlLCBtZXRob2RzKTtcbk9iamVjdC5hc3NpZ24od2VTd2lwZXIucHJvdG90eXBlLCBhbmltYXRlKTtcbk9iamVjdC5hc3NpZ24od2VTd2lwZXIucHJvdG90eXBlLCBzeW5jKTtcbk9iamVjdC5hc3NpZ24od2VTd2lwZXIucHJvdG90eXBlLCBleGNlcHRpb24pO1xuXG5yZXR1cm4gd2VTd2lwZXI7XG5cbn0pKSk7XG4iXX0=