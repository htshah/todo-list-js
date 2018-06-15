var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RippleModal = function () {
  function RippleModal() {
    var _this = this;

    var triggerClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modal-trigger';
    var modalClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'modal';

    _classCallCheck(this, RippleModal);

    this.triggerClass = triggerClass;
    var $body = document.body;

    var $rippleContainer = document.createElement('div');
    this.ripple = document.createElement('div');

    $rippleContainer.classList.add('ripple-container');
    this.ripple.classList.add('ripple');

    $rippleContainer.appendChild(this.ripple);
    $body.appendChild($rippleContainer);

    this.modals = [].slice.call(document.querySelectorAll('.' + modalClass));

    this.animationStart = 0;
    this.activeModal = null;

    this.modals.map(function (modal) {
      var close = document.createElement('button');
      close.innerHTML = 'close';
      close.classList.add('close');
      modal.appendChild(close);
      close.addEventListener('click', function (evt) {
        return _this._closeModal(evt, modal);
      }, false);
    });

    this._setRippleSize();
    this._initEvents();
  }

  _createClass(RippleModal, [{
    key: '_setRippleSize',
    value: function _setRippleSize() {
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      var s = w > h ? w * 2 : h * 2;

      this.ripple.style.width = s + 'px';
      this.ripple.style.height = s + 'px';
    }
  }, {
    key: '_initEvents',
    value: function _initEvents() {
      var _this2 = this;

      window.addEventListener('resize', function () {
        return _this2._setRippleSize();
      }, false);
      document.body.addEventListener('click', function (evt) {
        return _this2._handleClicks(evt);
      }, false);
    }
  }, {
    key: '_handleClicks',
    value: function _handleClicks(evt) {
      var target = evt.target;
      this.animationStart = 0;

      if (target.classList.contains(this.triggerClass)) {
        var modalId = target.dataset.modal.substr(1);
        this.activeModal = document.getElementById(modalId);

        var clickTop = evt.clientY;
        var clickLeft = evt.clientX;

        this.ripple.style.left = clickLeft + 'px';
        this.ripple.style.top = clickTop + 'px';
        this.ripple.classList.add('is-animating');

        window.requestAnimationFrame(this._triggerAnimation.bind(this));
      }
    }
  }, {
    key: '_triggerAnimation',
    value: function _triggerAnimation(timestamp) {
      if (!this.animationStart) {
        this.animationStart = timestamp;
      }

      var progress = timestamp - this.animationStart;
      if (progress > 1000) {
        this.ripple.classList.remove('is-animating');
        return true;
      } else if (progress > 500) {
        this.activeModal.classList.add('active');
      }

      window.requestAnimationFrame(this._triggerAnimation.bind(this));
    }
  }, {
    key: '_closeModal',
    value: function _closeModal(evt, modal) {
      evt.preventDefault();
      modal.classList.remove('active');
    }
  }]);

  return RippleModal;
}();

(function () {
  new RippleModal();
})();

/** RAF Polyfill **/
(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();