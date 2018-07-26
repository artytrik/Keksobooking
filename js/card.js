'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  var PHOTO_CLASS_NAME = 'popup__photo';
  var PHOTO_ALT = 'Фотография жилья';
  var FEATURE_CLASS_NAME = 'popup__feature ';
  var FEATURE_CLASS_NAME_ADD = 'popup__feature--';

  var TranslateType = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  var mapCardElement = window.application.mapCardTemplate.content.querySelector('.map__card').cloneNode(true);
  var mapFilter = window.application.map.querySelector('.map__filters-container');
  var mapCardCloseButton = mapCardElement.querySelector('.popup__close');

  var addPhoto = function (photos, destinationElement) {
    destinationElement.innerHTML = '';
    var photoFragment = document.createDocumentFragment();
    photos.forEach(function (item) {
      var photoElement = document.createElement('img');
      photoElement.src = item;
      photoElement.width = PHOTO_WIDTH;
      photoElement.height = PHOTO_HEIGHT;
      photoElement.className = PHOTO_CLASS_NAME;
      photoElement.alt = PHOTO_ALT;
      photoFragment.appendChild(photoElement);
    });
    destinationElement.appendChild(photoFragment);
    return destinationElement;
  };

  var addFeatures = function (features, destinationElement) {
    destinationElement.innerHTML = '';
    var featureFragment = document.createDocumentFragment();
    features.forEach(function (item) {
      var featureElement = document.createElement('li');
      featureElement.className = FEATURE_CLASS_NAME + FEATURE_CLASS_NAME_ADD + item;
      featureFragment.appendChild(featureElement);
    });
    destinationElement.appendChild(featureFragment);
    return destinationElement;
  };

  var createCard = function (ads) {
    mapCardElement.querySelector('.popup__title').textContent = ads.offer.title;
    mapCardElement.querySelector('.popup__text--address').textContent = ads.offer.address;
    mapCardElement.querySelector('.popup__text--price').textContent = ads.offer.price + '₽/ночь';
    mapCardElement.querySelector('.popup__type').textContent = TranslateType[ads.offer.type.toUpperCase()];
    mapCardElement.querySelector('.popup__text--capacity').textContent = ads.offer.rooms + ' комнаты для ' + ads.offer.guests + ' гостей';
    mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
    addFeatures(ads.offer.features, mapCardElement.querySelector('.popup__features'));
    mapCardElement.querySelector('.popup__description').textContent = ads.offer.description;
    addPhoto(ads.offer.photos, mapCardElement.querySelector('.popup__photos'));
    mapCardElement.querySelector('.popup__avatar').src = ads.author.avatar;

    window.application.map.insertBefore(mapCardElement, mapFilter);

    document.addEventListener('keydown', onPopupEscPress);

    mapCardCloseButton.addEventListener('click', onCloseIconClick);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  var onCloseIconClick = function () {
    closePopup();
  };

  var closePopup = function () {
    var mapCard = window.application.map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
    document.removeEventListener('keydown', onPopupEscPress);
    mapCardCloseButton.removeEventListener('click', onCloseIconClick);
  };

  window.card = {
    create: createCard,
    close: closePopup
  };
})();
