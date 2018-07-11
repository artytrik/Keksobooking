'use strict';

(function () {
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
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(renderPins(ads[i]));
    }
    mapPinsElement.appendChild(fragment);
  };

  window.pin = {
    create: createPin
  };
})();
