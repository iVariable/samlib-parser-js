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
    deps: ['underscore', 'underscore.string'],
    callback: function(_, _str){
        _.mixin(_str.exports());
    }
});

require([
    'test/models/author',
    'test/models/bookSeries',
    'test/models/book',
    'test/models/authorIndex',
    'test/models/mainpage',
    'test/models/samlib'
], function (_, _str) {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
})