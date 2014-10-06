define(['authorIndex', "underscore"], function (AuthorIndex, _) {

    describe("AuthorIndex tests", function () {

        it("Can be lazily created", function () {
            var book = AuthorIndex('fixtures/authorIndex_a.html', false);
            expect(book.ready.state()).to.be.equal('pending');
        })

        it('Could have different custom properties', function () {
            var authorIndex = AuthorIndex('fixtures/book_series.html', false);
            expect(authorIndex.info()).not.to.have.property('test');
            authorIndex.info({test: "Hello"});
            expect(authorIndex.info().test).to.be.equal('Hello');
            authorIndex.info({test2: "Hello2"})
            expect(authorIndex.info().test).to.be.equal('Hello');
            expect(authorIndex.info().test2).to.be.equal('Hello2');
            authorIndex.info({}, true);
            expect(authorIndex.info()).not.to.have.property('test');
            expect(authorIndex.info()).not.to.have.property('test2');
        });

        var tests = {
            "fixtures/authorIndex_a.html": {
                authorCount: 449
            }
        };

        _(tests).each(function (shouldBe, fixtureUrl) {

            describe("Tests with " + fixtureUrl + " fixture", function () {

                it("Should parse author index pages", function (done) {
                    var authorIndex = AuthorIndex(fixtureUrl);
                    authorIndex.ready.done(function () {
                        expect(authorIndex.info().authors).to.have.length(shouldBe.authorCount);
                        done();
                    });
                });

            })

        });

    })

})