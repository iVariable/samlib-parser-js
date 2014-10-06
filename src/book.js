'use strict';

define(['jquery', 'underscore'], function ($, _) {

    function Book(bookUrl, immediateLoad) {
        this.url = bookUrl;
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
            var _this = this;
            this.pageContent = pageContent;

            var re = {
                title: /<center><h2>([^]+?)<\/h2>[^]+?<!------- Первый блок ссылок ------------->/gi,
                literaryForm: /<li><a href=\/type\/[^]+?>([^]+?)<\/a>/gi,
                content: /<!----------- Собственно произведение --------------->([^]+?)<!--------------------------------------------------->/gi,
                genre: /<a href="\/janr\/[^]+?">([^]+?)<\/a>/gi,
                description: /<ul><small><li><\/small><b>Аннотация:<\/b><br><font color="#555555"><i>([^]+?)<\/i><\/font><\/ul>/gi,
                group: /<li> <a href=index.shtml#gr[^]+?>([^]+?)<\/a>/gi
            }

            _(re).each(function (re, title) {
                var match = re.exec(pageContent);
                if (match) {
                    var info = {};
                    info[title] = match[1];
                    _this.info(info);
                }
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

    _.extend(Book.prototype, result);

    return Book;

});