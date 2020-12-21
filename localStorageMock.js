var localStorageMock = (function () {
  window.store = {};
  return {
    getItem: function (key) {
      return window.store[key];
    },
    setItem: function (key, value) {
      window.store[key] = value.toString();
    },
    clear: function () {
      window.store = {};
    },
    removeItem: function (key) {
      delete window.store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
