define(['jquery', 'underscore', 'book'], function ($, _, Book) {
    return function (bookSeriesUrl, immediateLoad) {
        var regExps = {
            booksRe: /<DL><DT><li>[^]*?<A HREF=([^]+?)><b>([^]+?)<\/b><\/A> &nbsp; <b>([\d]+?)k<\/b>[^]+?<small>(Оценка:[^]+?&nbsp;([^]+?)|([^]+?))(<A|<\/s)([^]+?)(<DD><font color="#555555">([^]+?)<\/font>[^]+?|)<\/DL>/ig,
            annotationRe: /<small><b>Аннотация<\/b>: <i>([^]+?)<\/i>/ig,
            booksAreaRe: /<!-------- вместо <body> вставятся ссылки на произведения! ------>([^]+?)<!--------- Подножие ------------------------------->/ig,
            authorInfoRe: /<center>[^]+?<h3>([^]+?):<br>[^]+?<font color="#cc5555">([^]+?)<\/font>/ig
        };

        immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

        var ready = $.Deferred();

        var result = {
            url: bookSeriesUrl,
            ready: ready,
            pageContent: '',
            _info: {
                separatePage: true
            },

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

                if (this.info().separatePage) {
                    var annotationRe = regExps.annotationRe;
                    var annotation = annotationRe.exec(pageContent);
                    annotation = annotation ? annotation[1] : '';
                    this.info({
                        annotation: _.trim(annotation)
                    })

                    var allBooks = regExps.booksAreaRe.exec(pageContent);
                    allBooks = allBooks[1];

                    var info = regExps.authorInfoRe.exec(pageContent);
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
                var booksRe = regExps.booksRe;
                allBooks.replace(booksRe, function (match, link, title, size, genre1, genre2, n, n2, n3, n4, annotation) {
                    link = bookSeriesUrl + "/" + link;

                    var genre = _(genre2).isUndefined() ? genre1 : genre2;
                    var book = Book(link, false);
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