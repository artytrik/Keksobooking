'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';

  var ImageProperties = {
    WIDTH: '70px',
    HEIGHT: '70px',
    BORDER_RADIUS: '5px'
  };

  var avatarChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesChooser = document.querySelector('#images');
  var imagesPreview = document.querySelector('.ad-form__photo-container');
  var emptyImage = document.querySelector('.ad-form__photo--empty');

  var changeAvatar = function (src) {
    avatarPreview.src = src;
  };

  var filterByType = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  var removeEmptyImage = function () {
    if (emptyImage) {
      emptyImage.remove();
    }
  };

  var addImages = function (src) {
    var newImageContainer = document.createElement('div');
    var image = document.createElement('img');
    newImageContainer.classList.add('ad-form__photo');
    newImageContainer.classList.add('ad-form__photo--added');
    image.src = src;
    image.style.width = ImageProperties.WIDTH;
    image.style.height = ImageProperties.HEIGHT;
    image.style.borderRadius = ImageProperties.BORDER_RADIUS;
    newImageContainer.appendChild(image);
    imagesPreview.appendChild(newImageContainer);
    removeEmptyImage();
  };

  var addEmptyImage = function () {
    if (!emptyImage) {
      var emptyImageContainer = document.createElement('div');
      emptyImageContainer.classList.add('ad-form__photo');
      emptyImageContainer.classList.add('ad-form__photo--empty');
      imagesPreview.appendChild(emptyImageContainer);
    }
  };

  var loadPicture = function (chooser, func) {
    var files = Array.from(chooser.files).filter(filterByType);
    if (files) {
      files.forEach(function (it) {
        var reader = new FileReader();
        reader.addEventListener('load', function (evt) {
          func(evt.target.result);
        });
        reader.readAsDataURL(it);
      });
    }
  };

  var removeImages = function () {
    avatarPreview.src = DEFAULT_AVATAR;
    var addedImages = document.querySelectorAll('.ad-form__photo--added');
    if (addedImages) {
      addedImages.forEach(function (it) {
        it.remove();
      });
    }
    addEmptyImage();
  };

  var onAvatarChange = function (evt) {
    loadPicture(evt.target, changeAvatar);
  };

  var onImagesChange = function (evt) {
    loadPicture(evt.target, addImages);
  };

  var activateLoadPictures = function () {
    avatarChooser.addEventListener('change', onAvatarChange);
    imagesChooser.addEventListener('change', onImagesChange);
  };

  var deactivateLoadPirctures = function () {
    avatarChooser.removeEventListener('change', onAvatarChange);
    imagesChooser.removeEventListener('change', onImagesChange);
  };

  window.pictures = {
    activate: activateLoadPictures,
    deactivate: deactivateLoadPirctures,
    remove: removeImages
  };
})();
