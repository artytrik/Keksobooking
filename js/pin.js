'use strict';

(function () {
  var PIN_NUMBER = 5;

  var mapPinsElement = window.application.map.querySelector('.map__pins');
  var mapPinTemplate = window.application.mapCardTemplate.content.querySelector('.map__pin');

  var renderPins = function (ads) {
    var pinElement = mapPinTemplate.cloneNode(true);
    var pinX = ads.location.x;
    var pinY = ads.location.y;
    pinElement.style.left = pinX + 'px';
    pinElement.style.top = pinY + 'px';
    pinElement.querySelector('img').src = ads.author.avatar;
    pinElement.querySelector('img').alt = ads.offer.title;
    pinElement.addEventListener('click', function () {
      window.card.create(ads);
    });

    return pinElement;
  };

  var createPin = function (ads) {
    var takeNumber = ads.length > PIN_NUMBER ? PIN_NUMBER : ads.length;
    var mapPinsFragment = document.createDocumentFragment();
    for (var i = 0; i < takeNumber; i++) {
      mapPinsFragment.appendChild(renderPins(ads[i]));
    }
    mapPinsElement.appendChild(mapPinsFragment);
  };

  var removePins = function () {
    var mapPinsSmall = window.application.map.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinsSmall.forEach(function (item) {
      item.remove();
    });
  };

  window.pin = {
    create: createPin,
    remove: removePins
  };
})();
