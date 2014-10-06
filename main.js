requirejs.config({
    baseUrl: "src/",
    paths: {
        'bower': 'bower_components/',
        'jquery': "bower_components/jquery/dist/jquery",
        'underscore': "bower_components/underscore/underscore",
        'underscore.string': "bower_components/underscore.string/dist/underscore.string.min"
    },
    deps: ['underscore', 'underscore.string'],
    callback: function(_, _str){
        _.mixin(_str.exports());
    }
});

require(['samlib'], function(Samlib){
    window.SamlibParser = Samlib();
});