describe('My first test', function () {
    it('Should work all the time', function () {
        expect(true).to.equal(true);      
        // this works!      
        cy.request('http://localhost:8000/examples/alp.amp.html');
             
        // this does not work. see https://github.com/cypress-io/cypress/issues/1872
        //cy.visit('http://localhost:8000/examples/alp.amp.html');
    })
})