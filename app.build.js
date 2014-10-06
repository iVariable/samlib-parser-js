({
    baseUrl: "src/",
    name: "samlib",
    out: "samlib-parser.min.js",
    paths: {
        jquery: "empty:",
        "underscore": "empty:",
        "underscore.string": "empty:"
//        bower: '../bower_components/',
//        jquery: "../bower_components/jquery/dist/jquery",
//        "underscore": "../bower_components/underscore/underscore",
//        "underscore.string": "../bower_components/underscore.string/dist/underscore.string.min"
    },
//    deps: ['underscore', 'underscore.string'],
//    callback: function(_, _str){
//        _.mixin(_str.exports());
//    },
    optimize: "none"
})