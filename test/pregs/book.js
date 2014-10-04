define(['jquery', 'bookSeries'], function($, BookSeries){
    describe("BookSeries pregs", function(){

        var fixtures = {};
        it("should load fixtures", function(done){
            $.get('fixtures/book_series.html', function(asString){
                fixtures['book_series.html'] = $('<div>').append(asString).html();
            }).always(function(){
                done();
            });
        });

        it("should find books", function(){
            var booksRe = BookSeries.RegExp.booksRe;
            var fixture = fixtures['book_series.html'];
            fixture.replace(booksRe, function(){
                console.log(arguments);
            })

        });

    });
})
