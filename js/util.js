'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var isEscEvent = function (evt, callback) {
    if (evt.keyCode === ESC_KEYCODE) {
      callback();
    }
  };

  var renderError = function (error) {
    var node = document.querySelector('.error');
    node.classList.remove('hidden');
    node.textContent = error;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    isEscEvent: isEscEvent,
    renderError: renderError,
    debounce: debounce
  };
})();
