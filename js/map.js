'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var DEFAULT_PIN_X = 600;
  var DEFAULT_PIN_Y = 375;
  var TAIL_HEIGHT = 16;

  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
  };

  var mapPin = window.application.map.querySelector('.map__pin--main');
  var pageActive = false;

  var onMapPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

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

      var pinWidthShift = window.application.map.offsetWidth - mapPin.offsetWidth;

      var BorderY = {
        TOP: MIN_Y - mapPin.offsetHeight - TAIL_HEIGHT,
        BOTTOM: MAX_Y - mapPin.offsetHeight - TAIL_HEIGHT
      };

      if (pinCoords.y >= BorderY.TOP && pinCoords.y <= BorderY.BOTTOM) {
        mapPin.style.top = (pinCoords.y) + 'px';
      }

      if (pinCoords.x >= window.application.map.style.left && pinCoords.x <= pinWidthShift) {
        mapPin.style.left = (pinCoords.x) + 'px';
      }

      var pinFinalCoordinates = {
        x: pinCoords.x + Math.ceil(PinSize.WIDTH / 2),
        y: pinCoords.y + PinSize.HEIGHT + TAIL_HEIGHT
      };

      window.form.getAddress(pinFinalCoordinates);
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (!pageActive) {
        turnActive();
        pageActive = true;
      }

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  var turnActive = function () {
    window.application.map.classList.remove('map--faded');
    window.form.activate();
    window.backend.load(function (data) {
      window.filter.activate();
      window.map.allPins = data;
      window.pin.create(window.map.allPins);
    }, window.util.renderError);
  };

  var turnDeactive = function () {
    window.application.map.classList.add('map--faded');
    window.filter.deactivate();
    window.pin.remove();
    window.card.close();
    window.form.deactivate();
    pageActive = false;
    mapPin.style.left = DEFAULT_PIN_X - PinSize.WIDTH / 2 + 'px';
    mapPin.style.top = DEFAULT_PIN_Y - PinSize.HEIGHT / 2 + 'px';
  };

  var getPinCoordinates = function () {
    return {
      x: DEFAULT_PIN_X,
      y: DEFAULT_PIN_Y
    };
  };

  var startPage = function () {
    turnDeactive();
    mapPin.addEventListener('mousedown', onMapPinMouseDown);
  };

  startPage();

  window.map = {
    deactivate: turnDeactive,
    getPinCoordinates: getPinCoordinates
  };
})();
