describe('Product Visit Test', () => {
    before(() => {
        cy.visit('https://gymbeam.sk/');
        Cypress.on('uncaught:exception', (err, runnable) => false);
    });

    const getTitle = (selector) => {
        return cy.get(selector, { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .invoke('attr', 'title');
    };

    const waitForTitle = (selector) => {
        return cy.wrap(null).then(() => {
            return getTitle(selector).then((title) => {
                if (title) {
                    return cy.wrap(title);
                } else {
                    cy.wait(500);
                    return waitForTitle(selector);
                }
            });
        });
    };

    it('should display the last visited product as the first product on the homepage', () => {
        // Accept cookies
        cy.get('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 10000 })
            .should('be.visible')
            .click();

        // Get title of the first product on the homepage
        let elementTitle1;
        waitForTitle('#maincontent ol > li:first-child div > div:nth-of-type(2) strong a')
            .then((title) => {
                elementTitle1 = title;
                cy.log('Element Title 1:', elementTitle1);
            });

        // Navigate to another category and get the title of the first product
        cy.get('#widget-homepage-categories > div > a:nth-of-type(8) > span', { timeout: 10000 })
            .should('be.visible')
            .click();

        let elementTitle2;
        getTitle('ol > li:first-child > div > a')
            .then((title) => {
                elementTitle2 = title;
                cy.log('Element Title 2:', elementTitle2);
            });

        // Click on the first product and return to the homepage
        cy.get('ol > li:first-child > div > a', { timeout: 10000 })
            .should('be.visible')
            .click();

        cy.get('header a img', { timeout: 10000 })
            .should('be.visible')
            .click();

        // Verify the title of the first product on the homepage again
        let elementTitle3;
        waitForTitle('#maincontent ol > li:first-child div > div:nth-of-type(2) strong a')
            .then((title) => {
                elementTitle3 = title;
                cy.log('Element Title 3:', elementTitle3);
                expect(elementTitle2).to.equal(elementTitle3);
                expect(elementTitle3).to.not.equal(elementTitle1);
            });
    });
});
