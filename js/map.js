'use strict';

var getPictureNumber = function (length) {
  for (var i = 1, numbers = []; i <= length; i++) {
    numbers.push('0' + i);
  }
  return numbers;
};

var pictureNumbers = getPictureNumber(8);

var livingTitle = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var livingTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photosList = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

var getFeatures = function (array, length) {
  var randomLength = getRandomNumber(0, length);
  return array.slice(0, randomLength);
};

var shuffle = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

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

var createAds = function (quantity) {
  for (var i = 0, ads = []; i < quantity; i++) {
    var locationX = getRandomNumber(MIN_X, MAX_X);
    var locationY = getRandomNumber(MIN_Y, MAX_Y);
    ads.push({
      author: {
        avatar: 'img/avatars/user' + pictureNumbers[i] + '.png'
      },
      offer: {
        title: livingTitle[i],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: livingTypes[getRandomNumber(0, livingTypes.length - 1)],
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
        checkout: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
        features: getFeatures(featuresList, featuresList.length),
        description: '',
        photos: shuffle(photosList)
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

document.querySelector('.map').classList.remove('map--faded');

var mapPinsElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#map-card-template')
  .content
  .querySelector('.map__pin');
var mapAdTemplate = document.querySelector('#map-card-template')
  .content
  .querySelector('.map__card');
var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
var adPhoto = document.querySelector('#map-card-template')
  .content
  .querySelector('.popup__photo');
var adPhotos = document.querySelector('.popup__photos');


var typeTranslate = function (element) {
  var englishType = element.offer.type;
  var russianType;
  if (englishType === 'flat') {
    russianType = 'Квартира';
  } else
  if (englishType === 'bungalo') {
    russianType = 'Бунгало';
  }
  if (englishType === 'house') {
    russianType = 'Дом';
  } else
  if (englishType === 'palace') {
    russianType = 'Дворец';
  }
  return russianType;
};

var addingPhoto = function (array) {
  for (var i = 0; i < array.offer.photos.length; i++) {
    var photoElement = adPhoto.cloneNode(true);
    adPhoto.src = array.offer.photos[i];
    adPhotos.appendChild(photoElement);
  }
};

var addingFeatures = function (array) {

};

var renderPins = function (ads) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinX = ads.location.x - PIN_X;
  var pinY = ads.location.y - PIN_Y;
  pinElement.style = 'left: ' + pinX + 'px; top: ' + pinY + 'px;';
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
  adElement.querySelector('.popup__title').textContent = ads[0].offer.title;
  adElement.querySelector('.popup__text--address').textContent = ads[0].offer.address;
  adElement.querySelector('.popup__text--price').textContent = ads[0].offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = typeTranslate(ads[0]);
  adElement.querySelector('.popup__text--capacity').textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;
  addingFeatures(ads[0]);
  adElement.querySelector('.popup__description').textContent = ads[0].offer.description;
  addingPhoto(ads[0]);
  adElement.querySelector('.popup__avatar').src = ads[0].author.avatar;

  map.insertBefore(adElement, mapFilters);
};

createPin();
createCard(adsList);
