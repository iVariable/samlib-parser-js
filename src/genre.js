define(['jquery', 'underscore'], function ($, _) {
    return function (genreUrl, immediateLoad) {
        immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

        var ready = $.Deferred();

        var result = {
            url: genreUrl,
            ready: ready,
            pageContent: '',
            _info: {},

            load: function () {
                var _this = this;
                $.get(_this.url).done(function (resultAsString, result, xhr) {
                    _this.parse(resultAsString);
                }).fail(function (xhr) {
                    ready.reject(xhr);
                })
            },
            parse: function (pageContent) {
                this.pageContent = pageContent;
                //TODO: standalone parsing
                ready.resolve(this);
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


        if (immediateLoad) {
            result.load();
        }

        return result;
    };

});