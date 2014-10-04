/**
 * Created by vladimirsavenkov on 05/10/14.
 */
define(['book'], function (Book) {

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

    })

})