'use strict';

define(['jquery', 'underscore', 'author'], function ($, _, Author) {

    function AuthorIndex(authorIndexUrl, immediateLoad) {
        this.url = authorIndexUrl;
        this.ready = $.Deferred();
        this._info = {};

        immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;
        if (immediateLoad) {
            result.load();
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
            });
        },

        parse: function (pageContent) {
            var _this = this;
            this.pageContent = pageContent;

            var authorsRe = /<DL><a href=([^]+?)>([^]+?)<\/a> "([^]+?)"\(([\d]*?)k,([^]+?)\)/gi;
            var authors = [];
            pageContent.replace(authorsRe, function (match, link, name, announce, size, booksCount) {
                var author = new Author('http://samlib.ru' + link, false);
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

            this.ready.resolve();
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

    _.extend(AuthorIndex.prototype, result);

    return AuthorIndex;
});