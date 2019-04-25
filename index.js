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
		if (requestsMocked < mocks.length) {
			cy.stub(win, 'fetch', async (...args) => {
				const [requestUri] = args;
				if (requestUri.includes('/graphql')) {
					const body = new Blob([JSON.stringify(mocks[requestsMocked++], null, 2)], { type: 'application/json' })
					return new Response(body)
				}
			});
		}
	});
});
