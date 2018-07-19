'use strict';

(function () {
  var ANY_VALUE = 'any';
  var Price = {
    LOW_PRICE: 10000,
    MAX_PRICE: 50000
  };

  var PriceText = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var mapFilter = document.querySelector('.map__filters');
  var filterElements = mapFilter.querySelectorAll('select');
  var filterType = mapFilter.querySelector('#housing-type');
  var filterPrice = mapFilter.querySelector('#housing-price');
  var filterByRoom = mapFilter.querySelector('#housing-rooms');
  var filterByGuest = mapFilter.querySelector('#housing-guests');
  var filterFeatures = mapFilter.querySelectorAll('input[name="features"]');

  var compareFilterValues = function (selectedValue, compareValue) {
    return selectedValue === ANY_VALUE || compareValue === selectedValue;
  };

  var compareFilterByPrice = function (selectedValue, offerPrice) {
    switch (selectedValue) {
      case PriceText.MIDDLE:
        return offerPrice >= Price.LOW_PRICE && offerPrice < Price.MAX_PRICE;
      case PriceText.LOW:
        return offerPrice < Price.LOW_PRICE;
      case PriceText.HIGH:
        return offerPrice >= Price.MAX_PRICE;
      default:
        return true;
    }
  };

  var compareCollection = function (selectedCollection, comparedCollection) {
    for (var i = 0; i < selectedCollection.length; i++) {
      if (!comparedCollection.includes(selectedCollection[i])) {
        return false;
      }
    }
    return true;
  };

  var setFilter = function () {
    var features = Array.from(filterFeatures);
    var selectedFeatures = features.filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });

    return window.map.allPins.filter(function (item) {
      if (!compareFilterValues(filterType.value, item.offer.type)) {
        return false;
      }
      if (!compareFilterValues(filterByRoom.value, item.offer.rooms.toString())) {
        return false;
      }
      if (!compareFilterValues(filterByGuest.value, item.offer.guests.toString())) {
        return false;
      }
      if (!compareFilterByPrice(filterPrice.value, item.offer.price)) {
        return false;
      }
      if (!compareCollection(selectedFeatures, item.offer.features)) {
        return false;
      }
      return true;
    });
  };

  var onFilterChange = window.util.debounce(function () {
    window.card.close();
    window.pin.remove();
    window.pin.create(setFilter());
  });

  var resetFilter = function () {
    filterElements.forEach(function (element) {
      element.value = ANY_VALUE;
    });
    filterFeatures.forEach(function (feature) {
      feature.checked = false;
    });
  };

  var activateFilter = function () {
    filterElements.forEach(function (element) {
      element.disabled = false;
    });
    onFilterChange();
    mapFilter.addEventListener('change', onFilterChange);
  };

  var deactivateFilter = function () {
    filterElements.forEach(function (element) {
      element.disabled = true;
    });
    resetFilter();
    mapFilter.removeEventListener('change', onFilterChange);
  };

  window.filter = {
    activate: activateFilter,
    deactivate: deactivateFilter
  };
})();
