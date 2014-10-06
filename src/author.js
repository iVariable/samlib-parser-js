'use strict';

define(['jquery', 'bookSeries', 'underscore'], function ($, BookSeries, _) {

    function Author(authorUrl, immediateLoad) {
        this.url = authorUrl;
        this.ready = $.Deferred();
        this._info = {}

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
            });
            return this.ready;
        },

        parse: function (pageContent) {
            var _this = this;
            this.pageContent = pageContent;

            this._info = {
                name: "",
                description: "",

                lastUpdate: "",
                totalBookSize: 0,
                totalBooks: 0,

                bookSeries: []
            };

            var authorInfoRe = /<center>[^]+?<h3[^>]*?>([^]+?):<br>[^]+?<font color="[^"]*?">([^]+?)<\/font>/gi;
            var authorInfo = authorInfoRe.exec(pageContent);

            if (authorInfo === null) {
                throw Error("Incorrect author page! [" + this.url + "]");
            }
            this._info.name = authorInfo[1];
            this._info.description = authorInfo[2];

            var generalInfoRe = /<li><b><a href=\/long.shtml><font color=#393939>Обновлялось:<\/font><\/a><\/b> ([\d]{2}\/[\d]{2}\/[\d]{4})[^]+?<li><b><a href=\/rating\/size\/><font color=#393939>Об[ъь]ем:<\/font><\/a><\/b> ([\d]*?)k\/([\d]*?)\s/gi;
            var generalInfo = generalInfoRe.exec(pageContent);

            if (generalInfo === null) {
                throw Error("Incorrect author page! [" + this.url + "]");
            }

            this._info.lastUpdate = generalInfo[1];
            this._info.totalBookSize = generalInfo[2];
            this._info.totalBooks = generalInfo[3];

            var books = pageContent.match(/<!-------- вместо <body> вставятся ссылки на произведения! ------>([^]+?)<!--------- Подножие ------------------------------->/);
            books = books[0] + '</small><p><font size=+1> ';

            var bookSeriesRe = /<a name=[^]+?>([^]+?)(<gr0>|<\/a>)([^]+?)<\/small><p><font size=\+1>/gi;

            var bookSeries = [];
            var bookInfoRe = /<a href="([^]+?)"><font color="#393939">([^]+?)<\/font>/ig;
            books.replace(bookSeriesRe, function (match, booksTitle, delimiter, unfilteredBooks) {
                var info = match.match(bookInfoRe);
                var separatePage = false;
                var url = '';
                if (info) {
                    booksTitle = info[2];
                    if (info[1].indexOf('/type/') !== -1) {
                        url = _this.url + '/' + info[1];
                        separatePage = true;
                    }
                }

                var series = new BookSeries(url, false);
                series.info({
                    title: _.trim(booksTitle, ":"),
                    authorName: _this.info().name,
                    author: _this,
                    separatePage: separatePage
                });

                if (!separatePage) {
                    series.parse('<!-------- вместо <body> вставятся ссылки на произведения! ------>' + unfilteredBooks + '<!--------- Подножие ------------------------------->');
                }
                bookSeries.push(
                    series
                );
                return match;
            });

            this.info({
                bookSeries: bookSeries
            });

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

    _.extend(Author.prototype, result);

    return Author;

});