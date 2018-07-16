'use strict';

(function () {
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
  var formAdPrice = formAd.querySelector('#price');
  var formAdTimeIn = formAd.querySelector('#timein');
  var formAdTimeOut = formAd.querySelector('#timeout');
  var formAdCapacity = formAd.querySelector('#capacity');
  var formAdElements = document.querySelectorAll('.ad-form__element');
  var formAdHeader = formAd.querySelector('.ad-form-header');
  var resetButton = formAd.querySelector('.ad-form__reset');

  formAdTimeIn.addEventListener('change', function () {
    formAdTimeOut.value = formAdTimeIn.value;
  });

  formAdTimeOut.addEventListener('change', function () {
    formAdTimeIn.value = formAdTimeOut.value;
  });

  var getAddress = function () {
    var xCoordinate = mapPin.offsetLeft - (mapPin.offsetWidth / 2);
    var yCoordinate = mapPin.offsetTop - (mapPin.offsetHeight / 2);
    var addressValue = Math.floor(xCoordinate) + ', ' + Math.floor(yCoordinate);
    return addressValue;
  };

  var convertTypeToPrice = function (type) {
    formAdPrice.placeholder = TYPE_PRICES[type];
    formAdPrice.min = TYPE_PRICES[type];
  };

  var checkGuestSelected = function (rooms, guest) {
    if (!ROOMS_CAPACITY[rooms].includes(guest)) {
      return formAdCapacity.setCustomValidity('Необходимо выбрать иное количество гостей');
    }
    return formAdCapacity.setCustomValidity('');
  };

  var closeSuccess = function () {
    success.classList.add('hidden');
    document.removeEventListener('click', closeSuccess);
    document.removeEventListener('keydown', pressEscSuccess);
  };

  var pressEscSuccess = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };

  var onSendSuccess = function () {
    formAd.reset();
    success.classList.remove('hidden');
    document.addEventListener('click', closeSuccess);
    document.addEventListener('keydown', pressEscSuccess);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivateForm();
    window.map.deactivate();
  };

  resetButton.addEventListener('click', onResetClick);

  formAd.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formAd), onSendSuccess, window.util.renderError);
  });

  var deactivateForm = function () {
    formAd.reset();
    for (var i = 0; i < formAdElements.length; i++) {
      formAdElements[i].disabled = true;
    }
    formAdHeader.disabled = true;
    formAd.classList.add('ad-form--disabled');
  };

  window.form = {
    convertTypeToPrice: convertTypeToPrice,
    checkGuestSelected: checkGuestSelected,
    getAddress: getAddress
  };
})();
