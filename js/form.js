'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPin = map.querySelector('.map__pin--main');
  var formAd = document.querySelector('.ad-form');
  var formAdPrice = formAd.querySelector('#price');
  var formAdTimeIn = formAd.querySelector('#timein');
  var formAdTimeOut = formAd.querySelector('#timeout');
  var formAdCapacity = formAd.querySelector('#capacity');

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

  var TypePrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var RoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var convertTypeToPrice = function (type) {
    formAdPrice.placeholder = TypePrices[type];
    formAdPrice.min = TypePrices[type];
  };

  var checkGuestSelected = function (rooms, guest) {
    if (!RoomsCapacity[rooms].includes(guest)) {
      return formAdCapacity.setCustomValidity('Необходимо выбрать иное количество гостей');
    }
    return formAdCapacity.setCustomValidity('');
  };

  window.form = {
    convertTypeToPrice: convertTypeToPrice,
    checkGuestSelected: checkGuestSelected,
    getAddress: getAddress
  };
})();
