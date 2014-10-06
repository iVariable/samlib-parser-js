'use strict';

define(['jquery', 'underscore', 'book'], function ($, _, Book) {

    function BookSeries(bookSeriesUrl, immediateLoad) {
        this.url = bookSeriesUrl;
        this._info = {separatePage: true};
        this.ready = $.Deferred();

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
            var _this = this;
            this.pageContent = pageContent;

            if (this.info().separatePage) {
                var annotationRe = /<small><b>Аннотация<\/b>: <i>([^]+?)<\/i>/ig;
                var annotation = annotationRe.exec(pageContent);
                annotation = annotation ? annotation[1] : '';
                this.info({
                    annotation: _.trim(annotation)
                })

                var booksAreaRe = /<!-------- вместо <body> вставятся ссылки на произведения! ------>([^]+?)<!--------- Подножие ------------------------------->/ig;
                var allBooks = booksAreaRe.exec(pageContent);
                allBooks = allBooks[1];

                var authorInfoRe = /<center>[^]+?<h3>([^]+?):<br>[^]+?<font color="#cc5555">([^]+?)<\/font>/ig;
                var info = authorInfoRe.exec(pageContent);
                this.info({
                    authorName: info[1],
                    title: _(info[2]).trim()
                });
            } else {
                var description = pageContent.substring(0, pageContent.search('<DL>'));
                var annotationRe = /<font color=#393939 size=-1><i>([^]+?)<\/i>/ig;
                var annotation = annotationRe.exec(description);
                annotation = annotation ? annotation[1] : '';
                this.info({
                    annotation: _.trim(annotation)
                });

                var allBooks = pageContent;
            }

            var books = [];
            var booksRe = /<DL><DT><li>[^]*?<A HREF=([^]+?)><b>([^]+?)<\/b><\/A> &nbsp; <b>([\d]+?)k<\/b>[^]+?<small>(Оценка:[^]+?&nbsp;([^]+?)|([^]+?))(<A|<\/s)([^]+?)(<DD><font color="#555555">([^]+?)<\/font>[^]+?|)<\/DL>/ig;
            allBooks.replace(booksRe, function (match, link, title, size, genre1, genre2, n, n2, n3, n4, annotation) {
                link = _this.url + "/" + link;

                var genre = _(genre2).isUndefined() ? genre1 : genre2;
                var book = new Book(link, false);
                book.info({
                    title: title,
                    size: size,
                    genres: _.trim(genre).split(',').map(function (elem) {
                        return _.trim(elem);
                    }),
                    annotation: annotation
                });

                books.push(book);
            });

            this.info({
                books: books
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

    _.extend(BookSeries.prototype, result);

    return BookSeries;

});