Cypress.Commands.add('mockGraphQL', { prevSubject: false }, (...mocks) => {
    let requestsMocked = 0;
    Cypress.on('window:before:load', win => {
        /** 
         * If we've already wrapped 'fetch' we need to restore the stub to allow for overriding
         * with another call to mockGraphQL.
         */
        if (win.fetch && win.fetch.restore) {
            win.fetch.restore();
        }
        cy.stub(win, 'fetch', async (...args) => {
            // const [requestUri] = args;
            // if (requestUri.some(uri => uri.contains('/graphql'))) {
                /** Alert the user that there are more GraphQL calls than there are mocks. */
                if (requestsMocked >= mocks.length) {
                    Cypress.log({
                        message: 'WARNING: The number of GraphQL requests exceeded the number of mocks provided.'
                    });
                }
                return Promise.resolve(new Response(JSON.stringify(mocks[requestsMocked++])))
            // }
        });
        Cypress.on('command:end', command => console.log(command.toJSON().name));
    });
});