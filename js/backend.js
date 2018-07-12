'use strict';

(function () {
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var CodeList = {
    SUCCESSFUL: 200,
    BAD_REQUEST: 400,
    NOT_AUTHORIZE: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };
  var TIMEOUT = 10000;

  var getErrorCode = function (error) {
    switch (error) {
      case CodeList.BAD_REQUEST:
        return 'Неверный зпрос';
      case CodeList.NOT_AUTHORIZE:
        return 'Пользователь не авторизован';
      case CodeList.NOT_FOUND:
        return 'Страница не найдена';
      case CodeList.INTERNAL_SERVER_ERROR:
        return 'Ошибка сервера';
      default:
        return 'Статус ответа: ' + error.status + ' ' + error.statusText;
    }
  };

  var serverRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;
    xhr.addEventListener('load', function () {
      if (xhr.status === CodeList.SUCCESSFUL) {
        onLoad(xhr.response);
      } else {
        onError(getErrorCode(xhr.status));
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = serverRequest(onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = serverRequest(onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    save: save,
    load: load
  };
})();
