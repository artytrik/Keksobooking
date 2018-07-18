'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  var PHOTO_CLASS_NAME = 'popup__photo';
  var PHOTO_ALT = 'Фотография жилья';
  var FEATURE_CLASS_NAME = 'popup__feature ';
  var FEATURE_CLASS_NAME_ADD = 'popup__feature--';

  var TranslateType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var map = document.querySelector('.map');
  var mapCardTemplate = document.querySelector('#map-card-template');
  var mapAdTemplate = mapCardTemplate.content.querySelector('.map__card');
  var mapFilters = map.querySelector('.map__filters-container');
  var adElement = mapAdTemplate.cloneNode(true);
  var mapCardClose = adElement.querySelector('.popup__close');

  var addPhoto = function (photos, destinationElement) {
    destinationElement.innerHTML = '';
    photos.forEach(function (item) {
      var photoElement = document.createElement('img');
      photoElement.src = item;
      photoElement.width = PHOTO_WIDTH;
      photoElement.height = PHOTO_HEIGHT;
      photoElement.className = PHOTO_CLASS_NAME;
      photoElement.alt = PHOTO_ALT;
      destinationElement.appendChild(photoElement);
    });
    return destinationElement;
  };

  var addFeatures = function (features, destinationElement) {
    destinationElement.innerHTML = '';
    features.forEach(function (item) {
      var featureElement = document.createElement('li');
      featureElement.className = FEATURE_CLASS_NAME + FEATURE_CLASS_NAME_ADD + item;
      destinationElement.appendChild(featureElement);
    });
    return destinationElement;
  };

  var createCard = function (ads) {
    adElement.querySelector('.popup__title').textContent = ads.offer.title;
    adElement.querySelector('.popup__text--address').textContent = ads.offer.address;
    adElement.querySelector('.popup__text--price').textContent = ads.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = TranslateType[ads.offer.type];
    adElement.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + ' комнаты для ' + ads.offer.guests + ' гостей';
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
    addFeatures(ads.offer.features, adElement.querySelector('.popup__features'));
    adElement.querySelector('.popup__description').textContent = ads.offer.description;
    addPhoto(ads.offer.photos, adElement.querySelector('.popup__photos'));
    adElement.querySelector('.popup__avatar').src = ads.author.avatar;

    var mapCard = map.querySelector('.map__card');
    if (!mapCard) {
      mapCard = map.querySelector('.map__card');
      map.insertBefore(adElement, mapFilters);
    } else {
      map.replaceChild(adElement, mapCard);
    }

    document.addEventListener('keydown', onPopupEscPress);

    mapCardClose.addEventListener('click', onCloseIconClick);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  var onCloseIconClick = function () {
    closePopup();
  };

  var closePopup = function () {
    var mapCard = map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
    document.removeEventListener('keydown', onPopupEscPress);
    mapCardClose.removeEventListener('click', onCloseIconClick);
  };

  window.card = {
    create: createCard,
    close: closePopup
  };
})();
