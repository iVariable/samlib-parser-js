'use strict';

define(
    ['jquery', 'underscore', 'mainpage', 'authorIndex', 'literaryForm', 'genre'],
    function ($, _, MainPage, AuthorIndex, LiteraryForm, Genre) {
        return function (mainPageUrl, immediateLoad) {
            mainPageUrl = _(mainPageUrl).isUndefined() ? 'http://samlib.ru' : _(mainPageUrl).trim('/');
            immediateLoad = _(immediateLoad).isUndefined() ? true : immediateLoad;

            var mainpage = MainPage(mainPageUrl, immediateLoad);

            var result = {
                mainpage: mainpage,
                ready: mainpage.ready,
                _info: {},

                load: function () {
                    mainpage.load();
                },

                normalizeUrl: function(url){
                    if (!_(url).startsWith(mainPageUrl)) {
                        if (_(url).startsWith('/')) {
                            url = mainPageUrl + url;
                        } else {
                            url = mainPageUrl + '/' + url;
                        }
                    }
                    return url;
                },

                determinePageTypeByUrl: function (url) {
                    url = this.normalizeUrl(url);
                    if (!_(url).startsWith(mainPageUrl)) {
                        return 'unknown';
                    };

                    //Mainpage
                    if (url === mainPageUrl || url === mainPageUrl+'/') {
                        return 'mainpage';
                    };

                    //AuthorIndex
                    var isAuthorIndex = _(this.mainpage.info().authorIndexes).find({url: url});
                    if (isAuthorIndex) {
                        return 'authorIndex';
                    };

                    //Genres
                    var re = new RegExp('^'+mainPageUrl+'/janr/index_janr_[\\d]+?-[\\d]+?.shtml$');
                    if (re.test(url)) {
                        return 'genre';
                    };

                    //Literary forms
                    var re = new RegExp('^'+mainPageUrl+'/type/index_type_[\\d]+?-[\\d]+?.shtml$');
                    if (re.test(url)) {
                        return 'literaryForm';
                    };

                    //Authors
                    var re = new RegExp('^'+mainPageUrl+'/[^/]+?/[^/]+?/(|index\\.shtml)$');
                    if (re.test(url)) {
                        return 'author';
                    };

                    //BookSerie
                    var re = new RegExp('^'+mainPageUrl+'/[^/]+?/[^/]+?/index_[\\d]+?\\.shtml$');
                    if (re.test(url)) {
                        return 'bookSerie';
                    };

                    //Book
                    var re = new RegExp('^'+mainPageUrl+'/[^/]+?/[^/]+?/[^/]+?\\.shtml$');
                    if (re.test(url)) {
                        return 'book';
                    };

                    return 'unknown';
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

            return result;
        };
    }
);