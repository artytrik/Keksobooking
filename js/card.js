'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;

  var TranslateTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var map = document.querySelector('.map');
  var mapCardTemplate = document.querySelector('#map-card-template');
  var mapAdTemplate = mapCardTemplate.content.querySelector('.map__card');
  var mapFilters = map.querySelector('.map__filters-container');

  var addPhoto = function (photos, destinationElement) {
    destinationElement.innerHTML = '';
    for (var i = 0; i < photos.length; i++) {
      var photoElement = document.createElement('img');
      photoElement.src = photos[i];
      photoElement.width = PHOTO_WIDTH;
      photoElement.height = PHOTO_HEIGHT;
      photoElement.className = 'popup__photo';
      photoElement.alt = 'Фотография жилья';
      destinationElement.appendChild(photoElement);
    }
    return destinationElement;
  };

  var addFeatures = function (features, destinationElement) {
    destinationElement.innerHTML = '';
    for (var i = 0; i < features.length; i++) {
      var featureElement = document.createElement('li');
      featureElement.className = 'popup__feature ' + 'popup__feature--' + features[i];
      destinationElement.appendChild(featureElement);
    }
    return destinationElement;
  };

  var createCard = function (ads) {
    var adElement = mapAdTemplate.cloneNode(true);
    adElement.querySelector('.popup__title').textContent = ads.offer.title;
    adElement.querySelector('.popup__text--address').textContent = ads.offer.address;
    adElement.querySelector('.popup__text--price').textContent = ads.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = TranslateTypes[ads.offer.type];
    adElement.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + ' комнаты для ' + ads.offer.guests + ' гостей';
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
    addFeatures(ads.offer.features, adElement.querySelector('.popup__features'));
    adElement.querySelector('.popup__description').textContent = ads.offer.description;
    addPhoto(ads.offer.photos, adElement.querySelector('.popup__photos'));
    adElement.querySelector('.popup__avatar').src = ads.author.avatar;

    var mapCard = map.querySelector('.map__card');
    var mapCardClose = adElement.querySelector('.popup__close');
    if (!mapCard) {
      mapCard = map.querySelector('.map__card');
      map.insertBefore(adElement, mapFilters);
    } else {
      map.replaceChild(adElement, mapCard);
    }

    var onPopupEscPress = function (evt) {
      window.util.isEscEvent(evt, closePopup);
    };

    document.addEventListener('keydown', onPopupEscPress);

    mapCardClose.addEventListener('click', function () {
      closePopup();
    });

    var closePopup = function () {
      map.removeChild(adElement);
      document.removeEventListener('keydown', onPopupEscPress);
    };
  };

  window.card = {
    create: createCard
  };
})();
