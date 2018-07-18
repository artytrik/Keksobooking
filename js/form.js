'use strict';

(function () {
  var DEFAULT_ROOM_NUMBER = 1;
  var DEFAULT_GUEST_NUMBER = 3;

  var TYPE_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var map = document.querySelector('.map');
  var success = document.querySelector('.success');
  var mapPin = map.querySelector('.map__pin--main');
  var formAd = document.querySelector('.ad-form');
  var formAdFieldset = formAd.querySelectorAll('fieldset');
  var formAdType = formAd.querySelector('#type');
  var formAdRooms = formAd.querySelector('#room_number');
  var formAdAddress = formAd.querySelector('#address');
  var formAdPrice = formAd.querySelector('#price');
  var formAdTimeIn = formAd.querySelector('#timein');
  var formAdTimeOut = formAd.querySelector('#timeout');
  var formAdCapacity = formAd.querySelector('#capacity');
  var formAdElements = formAd.querySelectorAll('.ad-form__element');
  var formAdHeader = formAd.querySelector('.ad-form-header');
  var resetButton = formAd.querySelector('.ad-form__reset');

  var onFormAdTimeInChange = function () {
    formAdTimeOut.value = formAdTimeIn.value;
  };

  var onFormAdTimeOutChange = function () {
    formAdTimeIn.value = formAdTimeOut.value;
  };

  var onFormAdTypeChange = function () {
    convertTypeToPrice(formAdType.value);
  };

  var onFormAdCapacity = function (evt) {
    var currentGuests = evt.currentTarget.value;
    var currentRooms = formAdRooms.value;
    isGuestSelected(currentRooms, currentGuests);
  };

  var getAddress = function () {
    var xCoordinate = mapPin.offsetLeft - (mapPin.offsetWidth / 2);
    var yCoordinate = mapPin.offsetTop - (mapPin.offsetHeight / 2);
    return Math.floor(xCoordinate) + ', ' + Math.floor(yCoordinate);
  };

  var convertTypeToPrice = function (type) {
    formAdPrice.placeholder = TYPE_PRICES[type];
    formAdPrice.min = TYPE_PRICES[type];
  };

  var isGuestSelected = function (rooms, guest) {
    if (!ROOMS_CAPACITY[rooms].includes(guest)) {
      return formAdCapacity.setCustomValidity('Необходимо выбрать иное количество гостей');
    }
    return formAdCapacity.setCustomValidity('');
  };

  var onCloseSuccessClick = function () {
    success.classList.add('hidden');
    document.removeEventListener('click', onCloseSuccessClick);
    document.removeEventListener('keydown', onCloseSuccessPressEsc);
  };

  var onCloseSuccessPressEsc = function (evt) {
    window.util.isEscEvent(evt, onCloseSuccessClick);
  };

  var onSendClick = function () {
    formAd.reset();
    success.classList.remove('hidden');
    document.addEventListener('click', onCloseSuccessClick);
    document.addEventListener('keydown', onCloseSuccessPressEsc);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivateForm();
    window.map.deactivate();
  };

  resetButton.addEventListener('click', onResetClick);

  formAd.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formAd), onSendClick, window.util.renderError);
  });

  var addFormAdListeners = function () {
    formAdTimeIn.addEventListener('change', onFormAdTimeInChange);
    formAdTimeOut.addEventListener('change', onFormAdTimeOutChange);
    formAdType.addEventListener('change', onFormAdTypeChange);
    formAdCapacity.addEventListener('change', onFormAdCapacity);
  };

  var removeFormAdListeners = function () {
    formAdTimeIn.removeEventListener('change', onFormAdTimeInChange);
    formAdTimeOut.removeEventListener('change', onFormAdTimeOutChange);
    formAdType.removeEventListener('change', onFormAdTypeChange);
    formAdCapacity.removeEventListener('change', onFormAdCapacity);
  };

  var activateForm = function () {
    formAd.classList.remove('ad-form--disabled');
    addFormAdListeners();
    convertTypeToPrice(formAdType.value);
    isGuestSelected(DEFAULT_ROOM_NUMBER, DEFAULT_GUEST_NUMBER);
    formAdFieldset.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    formAdAddress.value = getAddress();
  };

  var deactivateForm = function () {
    formAd.reset();
    formAdElements.forEach(function (element) {
      element.disabled = true;
    });
    formAdHeader.disabled = true;
    formAd.classList.add('ad-form--disabled');
    removeFormAdListeners();
  };

  window.form = {
    activate: activateForm,
    getAddress: getAddress
  };
})();
