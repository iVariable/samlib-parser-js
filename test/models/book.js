/**
 * Created by vladimirsavenkov on 05/10/14.
 */
define(['book', "underscore"], function (Book, _) {

    describe("Book model tests", function () {

        it("Can be lazily created", function () {
            var book = Book.Book('fixtures/book.html', false);
            expect(book.ready.state()).to.be.equal('pending');
        })

        it('Could have different custom properties', function () {
            var book = Book.Book('fixtures/book_series.html', false);
            expect(book.info()).not.to.have.property('test');
            book.info({test: "Hello"});
            expect(book.info().test).to.be.equal('Hello');
            book.info({test2: "Hello2"})
            expect(book.info().test).to.be.equal('Hello');
            expect(book.info().test2).to.be.equal('Hello2');
            book.info({}, true);
            expect(book.info()).not.to.have.property('test');
            expect(book.info()).not.to.have.property('test2');
        });

        var tests = {
            "fixtures/book_small.html": {
                title: "Подписка на 6-го Шамана",
                contentLength: 8026,
                literaryForm: "Глава",
                genre: "Фэнтези",
                description: "Информация о подписке на 6-го Шамана. Прошу обратить внимание -- текст начнет писаться не ранее августа, так что решайте сами, когда хотите присоедениться к проекту.",
                group: "Мир Барлионы"
            },
            "fixtures/book_big.html": {
                title: "Путь Шамана. Шаг 1: Начало",
                contentLength: 567629 ,
                literaryForm: "Роман",
                genre: "Фэнтези",
                description: 'Первая книга про жизнь Шамана в Барлионе (Май 2013 года).  <dd> Приобрести бумажную книгу можно   <a href="http://www.labirint.ru/books/390127/">http://www.labirint.ru/books/390127/</a>  <dd> Электронный вариант книги: <a href="http://www.litres.ru/vasiliy-mahanenko/barliona/">Магазин электронных книги Литрес</a>',
                group: "Мир Барлионы"
            }
        }

        _(tests).each(function (shouldBe, fixtureUrl) {

            describe("Book tests with " + fixtureUrl + " fixture", function () {

                it("Should parse general book information", function (done) {
                    var book = Book.Book(fixtureUrl);
                    book.ready.done(function () {

                        expect(book.info().title).to.be.equal(shouldBe.title);
                        expect(book.info().description).to.be.equal(shouldBe.description);
                        expect(book.info().literaryForm).to.be.equal(shouldBe.literaryForm);
                        expect(book.info().genre).to.be.equal(shouldBe.genre);
                        expect(book.info().group).to.be.equal(shouldBe.group);

                        expect(book.info().content).to.have.length(shouldBe.contentLength)
                        done();
                    });
                });

            })

        });

    })

})