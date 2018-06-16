'use strict';

var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var PIN_X = 25;
var PIN_Y = 70;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var LIVING_TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var LIVING_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES_LIST = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getPictureNumber = function (length) {
  for (var i = 1, numbers = []; i <= length; i++) {
    numbers.push('0' + i.toString());
  }
  return numbers;
};

var pictureNumbers = getPictureNumber(8);

var getAvatarPath = function (number) {
  var avatarPath = 'img/avatars/user' + number + '.png';
  return avatarPath;
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getFeatures = function (array, length) {
  var randomLength = getRandomNumber(0, length);
  return array.slice(0, randomLength);
};

var shuffle = function (sourceArray) {
  var array = sourceArray.slice(0);
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var createAds = function (quantity) {
  for (var i = 0, ads = []; i < quantity; i++) {
    var locationX = getRandomNumber(MIN_X, MAX_X) - PIN_X;
    var locationY = getRandomNumber(MIN_Y, MAX_Y) - PIN_Y;
    ads.push({
      author: {
        avatar: getAvatarPath(pictureNumbers[i])
      },
      offer: {
        title: LIVING_TITLE[i],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: LIVING_TYPES[getRandomNumber(0, LIVING_TYPES.length - 1)],
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: CHECK_TIMES[getRandomNumber(0, CHECK_TIMES.length - 1)],
        checkout: CHECK_TIMES[getRandomNumber(0, CHECK_TIMES.length - 1)],
        features: getFeatures(FEATURES_LIST, FEATURES_LIST.length),
        description: '',
        photos: shuffle(PHOTOS_LIST)
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return ads;
};

var adsList = createAds(8);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPinsElement = map.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('#map-card-template');
var mapPinTemplate = mapCardTemplate.content.querySelector('.map__pin');
var mapAdTemplate = mapCardTemplate.content.querySelector('.map__card');
var mapFilters = map.querySelector('.map__filters-container');

var TranslateTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

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

var renderPins = function (ads) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinX = ads.location.x;
  var pinY = ads.location.y;
  pinElement.style.left = pinX + 'px';
  pinElement.style.top = pinY + 'px';
  pinElement.querySelector('img').src = ads.author.avatar;
  pinElement.querySelector('img').alt = ads.offer.title;

  return pinElement;
};

var createPin = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsList.length; i++) {
    fragment.appendChild(renderPins(adsList[i]));
  }
  mapPinsElement.appendChild(fragment);
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

  map.insertBefore(adElement, mapFilters);
};

createPin();
createCard(adsList[0]);
