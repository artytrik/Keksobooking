'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var DEFAULT_ROOM_NUMBER = 1;
  var DEFAULT_GUEST_NUMBER = 3;

  var map = document.querySelector('.map');
  var mapPin = map.querySelector('.map__pin--main');
  var formAd = document.querySelector('.ad-form');
  var formAdFieldset = formAd.querySelectorAll('fieldset');
  var formAdAddress = formAd.querySelector('#address');
  var formAdType = formAd.querySelector('#type');
  var formAdRooms = formAd.querySelector('#room_number');
  var formAdCapacity = formAd.querySelector('#capacity');

  var movePin = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      formAdAddress.value = window.form.getAddress();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
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

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var turnActive = function () {
    mapPin.removeEventListener('mousedown', turnActive);
    map.classList.remove('map--faded');
    formAd.classList.remove('ad-form--disabled');
    window.form.convertTypeToPrice(formAdType.value);
    formAdType.addEventListener('change', function () {
      window.form.convertTypeToPrice(formAdType.value);
    });
    window.form.checkGuestSelected(DEFAULT_ROOM_NUMBER, DEFAULT_GUEST_NUMBER);
    formAdCapacity.addEventListener('change', function (evt) {
      var currentGuests = evt.currentTarget.value;
      var currentRooms = formAdRooms.value;
      window.form.checkGuestSelected(currentRooms, currentGuests);
    });

    for (var i = 0; i < formAdFieldset.length; i++) {
      formAdFieldset[i].removeAttribute('disabled', false);
    }
    formAdAddress.value = window.form.getAddress();
    window.createPin();
  };

  mapPin.addEventListener('mousedown', turnActive);
  mapPin.addEventListener('mousedown', movePin);
})();
