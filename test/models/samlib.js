define(['samlib', "underscore"], function (Samlib, _) {
    var facade = new Samlib('fixtures/mainpage.html');
    window.f = facade;
    facade.ready.done(function () {
        describe("Samlib facade tests", function () {

            describe("Page type detection", function () {

                var pageTypes = {
                    "unknown": [
                        'http://lol.com',
                        'asdasdasdsad'
                    ],
                    "mainpage": ['fixtures/mainpage.html', 'fixtures/mainpage.html/'],
                    "authorIndex": [
                        "fixtures/mainpage.html/s/index_s.shtml",
                        "fixtures/mainpage.html/i/",
                        "fixtures/mainpage.html/7/index_7.shtml",
                        "fixtures/mainpage.html/k/index_k.shtml",
                        "fixtures/mainpage.html/f/",
                        "fixtures/mainpage.html/s/index_sw.shtml"
                    ],
                    "genre": [
                        "fixtures/mainpage.html/janr/index_janr_5-1.shtml",
                        "fixtures/mainpage.html/janr/index_janr_5-13.shtml",
                        "fixtures/mainpage.html/janr/index_janr_15-1.shtml",
                        "fixtures/mainpage.html/janr/index_janr_11-1.shtml"
                    ],
                    "literaryForm": [
                        "fixtures/mainpage.html/type/index_type_16-1.shtml",
                        "fixtures/mainpage.html/type/index_type_5-1.shtml",
                        "fixtures/mainpage.html/type/index_type_16-11.shtml"
                    ],
                    "author": [
                        "fixtures/mainpage.html/e/egoist/",
                        "fixtures/mainpage.html/z/z_n/",
                        "fixtures/mainpage.html/5/56/",
                        "fixtures/mainpage.html/m/magnitostroew_e_e/",
                        "fixtures/mainpage.html/m/magnitostroew_e_e/index.shtml"
                    ],
                    "bookSerie": [
                        "fixtures/mainpage.html/g/gozalishwili_w_t/index_1.shtml",
                        "fixtures/mainpage.html/a/androsenko_a_d/index_4.shtml"
                    ],
                    "book": [
                        "fixtures/mainpage.html/a/anashkin_dmitrij_wladimirowich/1glava.shtml",
                        "fixtures/mainpage.html/l/lelxchuk_z/sobakineumirayut.shtml",
                        "fixtures/mainpage.html/a/ashurow_n_p/a-070412.shtml",
                        "fixtures/mainpage.html/g/gozalishwili_w_t/graf-2pokabeznazwanija.shtml"
                    ]
                }

                _(pageTypes).each(function (urls, pageType) {
                    it("Should be able to determine pages: " + pageType, function (done) {

                        _(urls).each(function (url) {
                            expect(facade.determinePageTypeByUrl(url)).to.be.equal(pageType);
                        });
                        done();

                    })
                });

            });
        });


    });

})