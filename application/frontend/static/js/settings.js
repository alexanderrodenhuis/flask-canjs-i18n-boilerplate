define([], function () {
    'use strict';
    var exports = {};
    var require_to_url = require.toUrl('');
    var js_path = '..'+require_to_url;
    if(/^http(.)*:\/\//.test(require_to_url)) {
        js_path = require_to_url;
    }
    exports.static_root = js_path.toString().substring(0,js_path.length-4).toString();
    exports.i18n_options = {debug: true,
                            getAsync: true,
                            useLocalStorage: false,
                            localStorageExpirationTime: 86400000,
                            fallbackLng: 'en',
                            resGetPath: exports.static_root+'/locales/__lng__/__ns__.json'};
    exports.api_path = '/api/v1';
    exports.use_logger = true;
    exports.app_div_id = '#app';
    exports.spin_options = {
        lines: 7, // The number of lines to draw
        length: 4, // The length of each line
        width: 2, // The line thickness
        radius: 3, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb
        speed: 1.1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    return exports;
});
