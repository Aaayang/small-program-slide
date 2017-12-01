"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _nav = require('./../components/nav.js');

var _nav2 = _interopRequireDefault(_nav);

var _weSwiper = require('./../utils/weSwiper.js');

var _weSwiper2 = _interopRequireDefault(_weSwiper);

var _imgData = require('./../utils/imgData.js');

var _imgData2 = _interopRequireDefault(_imgData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var spkCase = null;

var index = function (_wepy$page) {
  _inherits(index, _wepy$page);

  function index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = index.__proto__ || Object.getPrototypeOf(index)).call.apply(_ref, [this].concat(args))), _this), _this.components = {
      nav: _nav2.default
    }, _this.config = {
      navigationBarTitleText: "\u4E00\u547C\u767E\u97F3",
      navigationBarTextStyle: "#fff",
      navigationBarBackgroundColor: "#F04C46",
      backgroundColor: "#fff",
      enablePullDownRefresh: false
    }, _this.data = {
      type: "seltype",
      activeTileNow: 1,
      activeConNow: 1,
      imgData: [{
        url: _imgData2.default.img1
      }, {
        url: _imgData2.default.img2
      }, {
        url: _imgData2.default.img3
      }]
    }, _this.methods = {
      touchstart: function touchstart(e) {
        spkCase.touchstart(e);
      },
      touchmove: function touchmove(e) {
        spkCase.touchmove(e);
      },
      touchend: function touchend(e) {
        spkCase.touchend(e);
      },
      slideTap: function slideTap(e) {
        console.log(e.target.dataset.tag);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(index, [{
    key: "initSlide",
    value: function initSlide() {
      var self = this;
      var device = wx.getSystemInfoSync();
      spkCase = new _weSwiper2.default({
        animationViewName: "animationData",
        slideLength: 3,
        initialSlide: 1,
        width: 550 * device.windowWidth / 750,
        height: 500 * device.windowWidth / 750,
        onSlideChangeStart: function onSlideChangeStart(weswiper) {
          // slide达到过渡条件时执行
          self.activeTileNow = weswiper.activeIndex;
          self.activeConNow = weswiper.activeIndex;
          self.$apply();
        }
      });
    }
  }, {
    key: "onLoad",
    value: function onLoad(option) {
      // 初始化
      this.initSlide();
    }
  }]);

  return index;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(index , 'pages/demo'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbW8uanMiXSwibmFtZXMiOlsic3BrQ2FzZSIsImluZGV4IiwiY29tcG9uZW50cyIsIm5hdiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlIiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImJhY2tncm91bmRDb2xvciIsImVuYWJsZVB1bGxEb3duUmVmcmVzaCIsImRhdGEiLCJ0eXBlIiwiYWN0aXZlVGlsZU5vdyIsImFjdGl2ZUNvbk5vdyIsImltZ0RhdGEiLCJ1cmwiLCJpbWcxIiwiaW1nMiIsImltZzMiLCJtZXRob2RzIiwidG91Y2hzdGFydCIsImUiLCJ0b3VjaG1vdmUiLCJ0b3VjaGVuZCIsInNsaWRlVGFwIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsImRhdGFzZXQiLCJ0YWciLCJzZWxmIiwiZGV2aWNlIiwid3giLCJnZXRTeXN0ZW1JbmZvU3luYyIsImFuaW1hdGlvblZpZXdOYW1lIiwic2xpZGVMZW5ndGgiLCJpbml0aWFsU2xpZGUiLCJ3aWR0aCIsIndpbmRvd1dpZHRoIiwiaGVpZ2h0Iiwib25TbGlkZUNoYW5nZVN0YXJ0Iiwid2Vzd2lwZXIiLCJhY3RpdmVJbmRleCIsIiRhcHBseSIsIm9wdGlvbiIsImluaXRTbGlkZSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxVQUFVLElBQWQ7O0lBRXFCQyxLOzs7Ozs7Ozs7Ozs7OztvTEFDbkJDLFUsR0FBYTtBQUNYQztBQURXLEssUUFHYkMsTSxHQUFTO0FBQ1BDLHdEQURPO0FBRVBDLDhCQUF3QixNQUZqQjtBQUdQQyxvQ0FBOEIsU0FIdkI7QUFJUEMsdUJBQWlCLE1BSlY7QUFLUEMsNkJBQXVCO0FBTGhCLEssUUFPVEMsSSxHQUFPO0FBQ0xDLFlBQU0sU0FERDtBQUVMQyxxQkFBZSxDQUZWO0FBR0xDLG9CQUFjLENBSFQ7QUFJTEMsZUFBUyxDQUNQO0FBQ0VDLGFBQUssa0JBQVFDO0FBRGYsT0FETyxFQUlQO0FBQ0VELGFBQUssa0JBQVFFO0FBRGYsT0FKTyxFQU9QO0FBQ0VGLGFBQUssa0JBQVFHO0FBRGYsT0FQTztBQUpKLEssUUFnQlBDLE8sR0FBVTtBQUNSQyxnQkFEUSxzQkFDR0MsQ0FESCxFQUNNO0FBQ1pyQixnQkFBUW9CLFVBQVIsQ0FBbUJDLENBQW5CO0FBQ0QsT0FITztBQUlSQyxlQUpRLHFCQUlFRCxDQUpGLEVBSUs7QUFDWHJCLGdCQUFRc0IsU0FBUixDQUFrQkQsQ0FBbEI7QUFDRCxPQU5PO0FBT1JFLGNBUFEsb0JBT0NGLENBUEQsRUFPSTtBQUNWckIsZ0JBQVF1QixRQUFSLENBQWlCRixDQUFqQjtBQUNELE9BVE87QUFVUkcsY0FWUSxvQkFVQ0gsQ0FWRCxFQVVJO0FBQ1ZJLGdCQUFRQyxHQUFSLENBQVlMLEVBQUVNLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQkMsR0FBN0I7QUFDRDtBQVpPLEs7Ozs7O2dDQWNFO0FBQ1YsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsVUFBTUMsU0FBU0MsR0FBR0MsaUJBQUgsRUFBZjtBQUNBakMsZ0JBQVUsdUJBQWE7QUFDckJrQywyQkFBbUIsZUFERTtBQUVyQkMscUJBQWEsQ0FGUTtBQUdyQkMsc0JBQWMsQ0FITztBQUlyQkMsZUFBTyxNQUFNTixPQUFPTyxXQUFiLEdBQTJCLEdBSmI7QUFLckJDLGdCQUFRLE1BQU1SLE9BQU9PLFdBQWIsR0FBMkIsR0FMZDtBQU1yQkUsMEJBTnFCLDhCQU1GQyxRQU5FLEVBTVE7QUFDM0I7QUFDQVgsZUFBS2xCLGFBQUwsR0FBcUI2QixTQUFTQyxXQUE5QjtBQUNBWixlQUFLakIsWUFBTCxHQUFvQjRCLFNBQVNDLFdBQTdCO0FBQ0FaLGVBQUthLE1BQUw7QUFDRDtBQVhvQixPQUFiLENBQVY7QUFhRDs7OzJCQUNNQyxNLEVBQVE7QUFDYjtBQUNBLFdBQUtDLFNBQUw7QUFDRDs7OztFQTdEZ0MsZUFBS0MsSTs7a0JBQW5CN0MsSyIsImZpbGUiOiJkZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xuaW1wb3J0IG5hdiBmcm9tIFwiLi4vY29tcG9uZW50cy9uYXZcIjtcbmltcG9ydCB3ZVN3aXBlciBmcm9tIFwiLi4vdXRpbHMvd2VTd2lwZXIuanNcIjtcbmltcG9ydCBpbWdEYXRhIGZyb20gXCIuLi91dGlscy9pbWdEYXRhLmpzXCI7XG5sZXQgc3BrQ2FzZSA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGluZGV4IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgY29tcG9uZW50cyA9IHtcbiAgICBuYXZcbiAgfTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IGDkuIDlkbznmb7pn7NgLFxuICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6IFwiI2ZmZlwiLFxuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI0YwNEM0NlwiLFxuICAgIGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCIsXG4gICAgZW5hYmxlUHVsbERvd25SZWZyZXNoOiBmYWxzZVxuICB9O1xuICBkYXRhID0ge1xuICAgIHR5cGU6IFwic2VsdHlwZVwiLFxuICAgIGFjdGl2ZVRpbGVOb3c6IDEsXG4gICAgYWN0aXZlQ29uTm93OiAxLFxuICAgIGltZ0RhdGE6IFtcbiAgICAgIHtcbiAgICAgICAgdXJsOiBpbWdEYXRhLmltZzFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVybDogaW1nRGF0YS5pbWcyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmw6IGltZ0RhdGEuaW1nM1xuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgbWV0aG9kcyA9IHtcbiAgICB0b3VjaHN0YXJ0KGUpIHtcbiAgICAgIHNwa0Nhc2UudG91Y2hzdGFydChlKTtcbiAgICB9LFxuICAgIHRvdWNobW92ZShlKSB7XG4gICAgICBzcGtDYXNlLnRvdWNobW92ZShlKTtcbiAgICB9LFxuICAgIHRvdWNoZW5kKGUpIHtcbiAgICAgIHNwa0Nhc2UudG91Y2hlbmQoZSk7XG4gICAgfSxcbiAgICBzbGlkZVRhcChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5kYXRhc2V0LnRhZyk7XG4gICAgfVxuICB9O1xuICBpbml0U2xpZGUoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGRldmljZSA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgc3BrQ2FzZSA9IG5ldyB3ZVN3aXBlcih7XG4gICAgICBhbmltYXRpb25WaWV3TmFtZTogXCJhbmltYXRpb25EYXRhXCIsXG4gICAgICBzbGlkZUxlbmd0aDogMyxcbiAgICAgIGluaXRpYWxTbGlkZTogMSxcbiAgICAgIHdpZHRoOiA1NTAgKiBkZXZpY2Uud2luZG93V2lkdGggLyA3NTAsXG4gICAgICBoZWlnaHQ6IDUwMCAqIGRldmljZS53aW5kb3dXaWR0aCAvIDc1MCxcbiAgICAgIG9uU2xpZGVDaGFuZ2VTdGFydCh3ZXN3aXBlcikge1xuICAgICAgICAvLyBzbGlkZei+vuWIsOi/h+a4oeadoeS7tuaXtuaJp+ihjFxuICAgICAgICBzZWxmLmFjdGl2ZVRpbGVOb3cgPSB3ZXN3aXBlci5hY3RpdmVJbmRleDtcbiAgICAgICAgc2VsZi5hY3RpdmVDb25Ob3cgPSB3ZXN3aXBlci5hY3RpdmVJbmRleDtcbiAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvbkxvYWQob3B0aW9uKSB7XG4gICAgLy8g5Yid5aeL5YyWXG4gICAgdGhpcy5pbml0U2xpZGUoKTtcbiAgfVxufVxuIl19