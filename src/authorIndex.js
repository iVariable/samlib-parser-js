'use strict';

define(['jquery', 'underscore', 'author'], function ($, _, Author) {
    return function (authorIndexUrl, immediateLoad) {
        immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

        var ready = $.Deferred();

        var result = {
            url: authorIndexUrl,
            ready: ready,
            pageContent: '',
            _info: {},

            load: function () {
                var _this = this;
                $.get(_this.url).done(function (resultAsString, result, xhr) {
                    _this.parse(resultAsString);
                }).fail(function (xhr) {
                    ready.reject(xhr);
                });
            },
            parse: function (pageContent) {
                this.pageContent = pageContent;

                var authorsRe = /<DL><a href=([^]+?)>([^]+?)<\/a> "([^]+?)"\(([\d]*?)k,([^]+?)\)/gi;
                var authors = [];
                pageContent.replace(authorsRe, function (match, link, name, announce, size, booksCount) {

                    var author = Author('http://samlib.ru' + link, false);

                    author.info({
                        name: name,
                        totalBooks: booksCount,
                        totalBookSize: size,
                        description: announce
                    });

                    authors.push(author);

                    return match;
                });

                this.info({
                    authors: authors
                });

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
                    };
                };
                return this._info;
            }
        };


        if (immediateLoad) {
            result.load();
        };

        return result;
    };

});