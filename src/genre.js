'use strict';

define(['jquery', 'underscore'], function ($, _) {

    function Genre(genreUrl, immediateLoad) {
        this.url = genreUrl;
        this.ready = $.Deferred();
        this._info = {};
        immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

        if (immediateLoad) {
            this.load();
        }
    }

    var result = {
        pageContent: '',

        load: function () {
            var _this = this;
            $.get(_this.url).done(function (resultAsString, result, xhr) {
                _this.parse(resultAsString);
            }).fail(function (xhr) {
                _this.ready.reject(xhr);
            })
        },

        parse: function (pageContent) {
            this.pageContent = pageContent;
            //TODO: standalone parsing
            this.ready.resolve(this);
        },

        info: function (data, replace) {
            data = data || false;
            if (data) {
                replace = replace || false;
                if (replace) {
                    this._info = data;
                } else {
                    _.extend(this._info, data);
                }
            }
            return this._info;
        }
    };

    _.extend(Genre.prototype, result);

    return Genre;
});