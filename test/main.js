requirejs.config({
    baseUrl: "../src/",
    paths: {
        'test': '../test',
        'test_pregs': '../test/pregs',
        'bower': '../bower_components/',
        'jquery': "../bower_components/jquery/dist/jquery",
        'underscore': "../bower_components/underscore/underscore",
        'underscore.string': "../bower_components/underscore.string/dist/underscore.string.min",
        'text': '../bower_components/requirejs-text/text'
    },
    shim: {
        'underscore': {
            deps: ['underscore.string']
        }
    }
});

require([
    'underscore', 'underscore.string',

    'test/models/author',
    'test/models/bookSeries',
    'test/models/book',
    'test/models/authorIndex',
    'test/models/mainpage'
], function (_, _str) {
    _.mixin(_str.exports());

    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
})