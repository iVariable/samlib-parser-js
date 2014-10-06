define(
    ['jquery', 'underscore', 'authorIndex', 'literaryForm', 'genre'],
    function ($, _, AuthorIndex, LiteraryForm, Genre) {
        return {
            MainPage: function (mainPageUrl, immediateLoad) {
                mainPageUrl = _(mainPageUrl).isUndefined() ? 'http://samlib.ru/' : mainPageUrl;
                immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

                var ready = $.Deferred();

                var result = {
                    url: mainPageUrl,
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
                        var _this = this;
                        this.pageContent = pageContent;

                        //Genres
                        var genresRe = /<a href=(\/janr\/index_janr_[\d]+?\-[\d]+?\.shtml)>([^]+?)<\/a> \((\d+?)\)/gi;
                        var genres = [];
                        pageContent.replace(genresRe, function (match, link, title, booksCount) {
                            var genre = Genre.Genre(mainPageUrl+link, false);
                            genre.info({
                                title: title,
                                booksCount: booksCount
                            });
                            genres.push(genre);

                            return match;
                        });

                        //AuthorIndex
                        var index = pageContent.match(/<!------------------ Тело индекса -------------------->([^]+?)<p>/gi);
                        var authorIndexRe = /<a href=([^]+?)>([^]+?)<\/a>/gi;
                        var authorIndexes = [];
                        index[0].replace(authorIndexRe, function (match, link, title) {
                            var authorIndex = AuthorIndex.AuthorIndex(mainPageUrl+link, false);
                            authorIndex.info({
                                title: title
                            });
                            authorIndexes.push(authorIndex);

                            return match;
                        });

                        //Literary forms
                        var literaryFormsRe = /<a href=(\/type\/index_type_[\d]+?\-[\d]+?\.shtml)>([^]+?)<\/a> \((\d+?)\)/gi;
                        var literaryForms = [];
                        pageContent.replace(literaryFormsRe, function (match, link, title, booksCount) {
                            var literaryForm = LiteraryForm.LiteraryForm(mainPageUrl+link, false);
                            literaryForm.info({
                                title: title,
                                booksCount: booksCount
                            });
                            literaryForms.push(literaryForm);

                            return match;
                        });

                        this.info({
                            genres: genres,
                            authorIndexes: authorIndexes,
                            literaryForms: literaryForms
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
            }
        };

    }
);