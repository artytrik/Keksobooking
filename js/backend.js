'use strict';

(function () {
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;
  var HTTPCodeList = {
    SUCCESSFUL: 200,
    BAD_REQUEST: 400,
    NOT_AUTHORIZE: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };

  var ErrorMessage = {
    BAD_REQUEST: 'Неверный зпрос',
    NOT_AUTHORIZE: 'Пользователь не авторизован',
    NOT_FOUND: 'Страница не найдена',
    INTERNAL_SERVER_ERROR: 'Ошибка сервера'
  };

  var getErrorCode = function (error) {
    switch (error) {
      case HTTPCodeList.BAD_REQUEST:
        return ErrorMessage.BAD_REQUEST;
      case HTTPCodeList.NOT_AUTHORIZE:
        return ErrorMessage.NOT_AUTHORIZE;
      case HTTPCodeList.NOT_FOUND:
        return ErrorMessage.NOT_FOUND;
      case HTTPCodeList.INTERNAL_SERVER_ERROR:
        return ErrorMessage.INTERNAL_SERVER_ERROR;
      default:
        return 'Статус ответа: ' + error.status + ' ' + error.statusText;
    }
  };

  var makeConfig = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;
    xhr.addEventListener('load', function () {
      if (xhr.status === HTTPCodeList.SUCCESSFUL) {
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
    var xhr = makeConfig(onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = makeConfig(onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    save: save,
    load: load
  };
})();
