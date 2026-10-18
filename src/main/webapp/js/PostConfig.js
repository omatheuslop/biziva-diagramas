/**
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
 * Copyright (c) 2006-2024, draw.io AG
 */
// null'ing of global vars need to be after init.js
window.ICONSEARCH_PATH = null;
window.ICON_SERVICE_PATH = null;

// Extend the current full editor, preserving its initialization and native model.
(function () {
  var originalInit = App.prototype.init;
  App.prototype.init = function () {
    originalInit.apply(this, arguments);
    var ui = this;
    import('./biziva/start.mjs').then(function (module) {
      module.startBiziva(ui);
    }).catch(function () {
      console.error('Biziva assistant could not be initialized. The native editor remains available.');
    });
  };
})();
