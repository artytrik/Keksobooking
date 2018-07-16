'use strict';

(function () {
  var PIN_NUMBER = 5;

  var map = document.querySelector('.map');
  var mapPinsElement = map.querySelector('.map__pins');
  var mapCardTemplate = document.querySelector('#map-card-template');
  var mapPinTemplate = mapCardTemplate.content.querySelector('.map__pin');

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
//  mapPinsElement.innerHTML = '';
    for (var i = 0; i < takeNumber; i++) {
      mapPinsElement.appendChild(renderPins(ads[i]));
    }
  };

  window.pin = {
    create: createPin
  };
})();
