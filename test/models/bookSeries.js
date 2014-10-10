/**
 * Created by vladimirsavenkov on 05/10/14.
 */
define(['bookSeries'], function (BookSeries) {

    describe("BookSeries model tests", function () {

        it("Can be lazily created", function () {
            var bookSeries = new BookSeries('fixtures/book_series.html', false);
            expect(bookSeries.ready.state()).to.be.equal('pending');
        })

        it('Could have different custom properties', function () {
            var bookSeries = new BookSeries('fixtures/book_series.html', false);
            expect(bookSeries.info()).not.to.have.property('test');
            bookSeries.info({test: "Hello"});
            expect(bookSeries.info().test).to.be.equal('Hello');
            bookSeries.info({test2: "Hello2"})
            expect(bookSeries.info().test).to.be.equal('Hello');
            expect(bookSeries.info().test2).to.be.equal('Hello2');
            bookSeries.info({}, true);
            expect(bookSeries.info()).not.to.have.property('test');
            expect(bookSeries.info()).not.to.have.property('test2');
        });


        it("Should correctly parse general information", function (done) {
            var bookSeries = new BookSeries('fixtures/book_series.html');
            bookSeries.ready.done(function () {

                var shouldBe = {
                    authorName: "Горъ Василий",
                    title: "Пророчество",
                    booksCount: 7,
                    annotation: "Могла ли подумать студентка 1-го курса института Мария Логинова, что знакомство с новым одногруппником обернется для нее не только чередой захватывающих приключений, но и ввергнет ее в эпицентр междоусобиц могущественных спецслужб России, а закончится вообще в другом мире? Вряд ли… Но близость к юноше, когда-то вынужденному бежать из своего мира на Землю, однажды круто изменила ее жизнь…\
И однажды, доверчиво вложив ладошку в ладонь, привычную к мечу, она сделала первый шаг в жизнь, в которой, кроме Счастья и Любви, ее ждали и смерти близких, и интриги Империи Ордена Алого Топора, и Твари из иного мира…\
",
                    books: {
                        'fixtures/prorochestwo.shtml': {
                            'title': 'Пророчество',
                            'size': '687',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано.'
                        },
                        'fixtures/prorochestwo-7.shtml': {
                            'title': 'Пророчество-7. "Джокер для Паука"...',
                            'size': '688',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано)'
                        },
                        'fixtures/prorochestwochastx5.shtml': {
                            'title': 'Пророчество-5. "Чужая кровь"',
                            'size': '651',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано.'
                        },
                        'fixtures/prorochestwochastx6glawa1.shtml': {
                            'title': 'Пророчество-6. "Каменный клинок"',
                            'size': '687',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано.'
                        },
                        'fixtures/prorochestwochastxchetwertaja.shtml': {
                            'title': 'Пророчество-4. "Аз воздам"',
                            'size': '655',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано'
                        },
                        'fixtures/prorochestwochastxtretxja.shtml': {
                            'title': 'Пророчество-3. "Понять пророка".',
                            'size': '567',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано'
                        },
                        'fixtures/prorochestwochastxwtoraja.shtml': {
                            'title': 'Пророчество-2. "Враг моего врага"',
                            'size': '616',
                            'genres': ['Фантастика', 'Фэнтези'],
                            'annotation': 'Издано'
                        }
                    }
                }

                var info = bookSeries.info();

                expect(info.authorName).to.be.equal(shouldBe.authorName);
                expect(info.title).to.be.equal(shouldBe.title);
                expect(info.annotation.replace(/\s/ig, '')).to.be.equal(shouldBe.annotation.replace(/\s/ig, ''));

                expect(info.books).to.have.length(shouldBe.booksCount);

                var _books = _(info.books);

                _(shouldBe.books).each(function (info, url) {
                    var book = _books.find(function (book) {
                        return book.url.indexOf(url) !== -1;
                    });

                    expect(book).not.to.be.undefined;

                    expect(book.info().title).to.be.equal(info.title);
                    expect(book.info().size).to.be.equal(info.size);
                    expect(book.info().genres).to.have.members(info.genres);
                    expect(book.info().annotation).to.be.equal(info.annotation);
                });
            });

            done();
        })

    })

})