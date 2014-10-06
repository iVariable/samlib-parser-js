'use strict';

define(['jquery', 'underscore'], function ($, _) {

    function LiteraryForm(literaryFormUrl, immediateLoad) {
        this.url = literaryFormUrl;
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

    _.extend(LiteraryForm.prototype, result);

    return LiteraryForm;
});