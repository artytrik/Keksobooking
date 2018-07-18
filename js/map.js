'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 620;
  var DEFAULT_PIN_X = 600;
  var DEFAULT_PIN_Y = 375;

  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
  };

  var map = document.querySelector('.map');
  var mapPin = map.querySelector('.map__pin--main');
  var formAd = document.querySelector('.ad-form');
  var formAdAddress = formAd.querySelector('#address');
  var pageActive = false;

  var movePin = function (evt) {
    evt.preventDefault();

    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      formAdAddress.value = window.form.getAddress();

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinCoords = {
        x: mapPin.offsetLeft - shift.x,
        y: mapPin.offsetTop - shift.y
      };

      var pinWidthShift = map.offsetWidth - mapPin.offsetWidth;

      if (pinCoords.y > MIN_Y && pinCoords.y < MAX_Y) {
        mapPin.style.top = (pinCoords.y) + 'px';
      }

      if (pinCoords.x > map.style.left && pinCoords.x < pinWidthShift) {
        mapPin.style.left = (pinCoords.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (!pageActive) {
        turnActive();
        pageActive = true;
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var turnActive = function () {
    mapPin.removeEventListener('mousedown', turnActive);
    map.classList.remove('map--faded');
    window.form.activate();
    window.backend.load(function (data) {
      window.filter.activate();
      window.map.allPins = data;
      window.pin.create(window.map.allPins);
    }, window.util.renderError);
  };

  var turnDeactive = function () {
    map.classList.add('map--faded');
    window.filter.deactivate();
    window.pin.remove();
    window.card.close();
    pageActive = false;
    mapPin.style.left = DEFAULT_PIN_X - PinSize.WIDTH / 2 + 'px';
    mapPin.style.top = DEFAULT_PIN_Y - PinSize.HEIGHT / 2 + 'px';
  };

  var startPage = function () {
    turnDeactive();
    mapPin.addEventListener('mousedown', movePin);
  };

  startPage();

  window.map = {
    deactivate: turnDeactive
  };
})();
