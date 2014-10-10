'use strict';

define(
    ['jquery', 'underscore', 'mainpage', 'authorIndex', 'literaryForm', 'genre', 'book', 'bookSeries', 'author'],
    function ($, _, MainPage, AuthorIndex, LiteraryForm, Genre, Book, BookSeries, Author) {

        function SamLib(mainPageUrl, immediateLoad) {
            mainPageUrl = _(mainPageUrl).isUndefined() ? 'http://samlib.ru' : _(mainPageUrl).trim('/');
            immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

            this._info = {};
            this.pages = {
                MainPage: MainPage,
                AuthorIndex: AuthorIndex,
                LiteraryForm: LiteraryForm,
                Genre: Genre,
                Book: Book,
                BookSeries: BookSeries,
                Author: Author
            };

            this.mainpage = new MainPage(mainPageUrl, immediateLoad);
            this.ready = this.mainpage.ready;
            this.url = this.mainpage.url;
        }

        var result = {

            load: function () {
                this.mainpage.load();
            },

            normalizeUrl: function (url) {
                if (!_(url).startsWith(this.url)) {
                    if (_(url).startsWith('/')) {
                        url = this.url + url;
                    } else {
                        url = this.url + '/' + url;
                    }
                }
                return url.replace(/[\/]{2,}/gi,'/').replace('http:/', 'http://');
            },

            getPageObject: function (url, immediateLoad) {
                immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;
                var result = {
                    type: this.determinePageTypeByUrl(url)
                }
                if (result.type !== 'Unknown') {
                    result.page = new (this.pages[result.type])(url, immediateLoad);
                }
                return result;
            },

            determinePageTypeByUrl: function (url) {
                url = this.normalizeUrl(url);
                if (!_(url).startsWith(this.url)) {
                    return 'Unknown';
                }

                //Mainpage
                if (url === this.url || url === this.url + '/') {
                    return 'MainPage';
                }

                //AuthorIndex
                var isAuthorIndex = _(this.mainpage.info().authorIndexes).find({url: url});
                if (isAuthorIndex) {
                    return 'AuthorIndex';
                }

                //Genres
                var re = new RegExp('^' + this.url + '/janr/index_janr_[\\d]+?-[\\d]+?.shtml$');
                if (re.test(url)) {
                    return 'Genre';
                }

                //Literary forms
                var re = new RegExp('^' + this.url + '/type/index_type_[\\d]+?-[\\d]+?.shtml$');
                if (re.test(url)) {
                    return 'LiteraryForm';
                }

                //Authors
                var re = new RegExp('^' + this.url + '/[^/]+?/[^/]+?/(|index\\.shtml|indexvote\\.shtml|indexdate\\.shtml)$');
                if (re.test(url)) {
                    return 'Author';
                }

                //BookSerie
                var re = new RegExp('^' + this.url + '/[^/]+?/[^/]+?/index_[\\d]+?\\.shtml$');
                if (re.test(url)) {
                    return 'BookSeries';
                }

                //Book
                var re = new RegExp('^' + this.url + '/[^/]+?/[^/]+?/[^/]+?\\.shtml$');
                if (re.test(url)) {
                    return 'Book';
                }

                return 'Unknown';
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

        _.extend(SamLib.prototype, result);

        return SamLib;
    }
);