define(['mainPage', "underscore"], function (MainPage, _) {

    describe("AuthorIndex tests", function () {

        it("Can be lazily created", function () {
            var mainpage = new MainPage('fixtures/mainpage.html', false);
            expect(mainpage.ready.state()).to.be.equal('pending');
        })

        it('Could have different custom properties', function () {
            var mainpage = new MainPage('fixtures/mainpage.html', false);
            expect(mainpage.info()).not.to.have.property('test');
            mainpage.info({test: "Hello"});
            expect(mainpage.info().test).to.be.equal('Hello');
            mainpage.info({test2: "Hello2"})
            expect(mainpage.info().test).to.be.equal('Hello');
            expect(mainpage.info().test2).to.be.equal('Hello2');
            mainpage.info({}, true);
            expect(mainpage.info()).not.to.have.property('test');
            expect(mainpage.info()).not.to.have.property('test2');
        });


        it("Should correctly parse general information", function (done) {
            var mainpage = new MainPage('fixtures/mainpage.html');

            mainpage.ready.done(function () {

                expect(mainpage.info().genres).to.have.length(33);
                expect(mainpage.info().literaryForms).to.have.length(18);
                expect(mainpage.info().authorIndexes).to.have.length(69);

                done();
            });

        });
    })

})