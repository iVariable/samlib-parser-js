define(['author', 'underscore'], function(Author, _){

    var expect = chai.expect;

    describe('Author model tests', function(){

        it("Can be lazily created", function(){
            var author = new Author('fixtures/author.html', false);
            expect(author.ready.state()).to.be.equal('pending');
        });

        it('Could have different custom properties', function(){
            var author = new Author('fixtures/author.html', false);
            expect(author.info()).not.to.have.property('test');
            author.info({test: "Hello"});
            expect(author.info().test).to.be.equal('Hello');
            author.info({test2: "Hello2"})
            expect(author.info().test).to.be.equal('Hello');
            expect(author.info().test2).to.be.equal('Hello2');
            author.info({}, true);
            expect(author.info()).not.to.have.property('test');
            expect(author.info()).not.to.have.property('test2');
        });

        var tests = {
            'fixtures/author_simple.html': {
                'totalSeries': 5,
                'totalBooks': "15",
                'name': 'Распопов Дмитрий Викторович',
                'description': 'Мои произведения',
                'lastUpdate': "14/06/2014",
                'totalBookSize': "4554"
            },
            'fixtures/author_big.html': {
                'totalSeries' : 14,
                'totalBooks' : "50",
                'name' : 'Михайлов Руслан Алексеевич',
                'description' : 'Фентези и фантастика. Мои произведения.',
                'lastUpdate' : "23/11/1979",
                'totalBookSize' : "5212"
            },
            'fixtures/author_with_nonloadable_sections.html': {
                'totalSeries' : 4,
                'totalBooks' : "10",
                'name' : 'Янсюкевич Георгий Владимирович',
                'description' : 'юмор, рассказ',
                'lastUpdate' : "17/02/2009",
                'totalBookSize' : "113"
            },
            'fixtures/author_with_loadable_sections.html': {
                'totalSeries' : 12,
                'totalBooks' : "201",
                'name' : 'Горъ Василий',
                'description' : 'Готовь улыбку сюда входящий...',
                'lastUpdate' : "08/06/2014",
                'totalBookSize' : "14851"
            }
        }

        _(tests).each(function(shouldBe, fixtureUrl){
            describe("Tests with "+fixtureUrl+" fixtures", function(){

                it("Should correctly parse general author information", function(done){
                    var author = new Author(fixtureUrl);
                    author.ready.done(function(){
                        var info = author.info();

                        expect(info.name).to.be.equal(shouldBe.name);
                        expect(info.description).to.be.equal(shouldBe.description);
                        expect(info.lastUpdate).to.be.equal(shouldBe.lastUpdate);
                        expect(info.totalBookSize).to.be.equal(shouldBe.totalBookSize);
                        expect(info.totalBooks).to.be.equal(shouldBe.totalBooks);

                        expect(info.bookSeries).to.have.length(shouldBe.totalSeries);

                        done();
                    })

                });

            });
        })



    })

})