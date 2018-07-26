'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var DEFAULT_PIN_X = 600;
  var DEFAULT_PIN_Y = 375;

  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
  };

  var mapPin = window.application.map.querySelector('.map__pin--main');
  var mapOverlay = window.application.map.querySelector('.map__overlay');

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
        x: moveEvt.clientX - startCoordinates.x,
        y: moveEvt.clientY - startCoordinates.y
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var shiftOffsetX = mapPin.offsetLeft + shift.x;
      var shiftOffsetY = mapPin.offsetTop + shift.y;
      var borderLeft = mapOverlay.clientWidth - mapPin.offsetWidth;

      shiftOffsetY = shiftOffsetY < MIN_Y ? MIN_Y : shiftOffsetY;
      shiftOffsetY = shiftOffsetY > MAX_Y ? MAX_Y : shiftOffsetY;

      shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
      shiftOffsetX = shiftOffsetX > borderLeft ? borderLeft : shiftOffsetX;

      mapPin.style.top = shiftOffsetY + 'px';
      mapPin.style.left = shiftOffsetX + 'px';

      window.form.getAddress({x: shiftOffsetX, y: shiftOffsetY});
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
