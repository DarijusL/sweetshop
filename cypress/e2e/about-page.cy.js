describe('TS_04 About Us Page Validation', () => {
    const selectors = {
        mainHeading: 'h1.display-3',
        contentSection: '.container',
        description: 'p.lead',
        footer: '.m-0.text-center',
        alert: '.alert.alert-success.mobileShow'
    };

    beforeEach(() => {
        cy.visit('https://sweetshop.netlify.app/about');
    });

    it('TC_04.1 Validate page title and structure', () => {
        // Check main heading
        cy.get(selectors.mainHeading)
            .should('be.visible')
            .and('contain', 'Sweet Shop Project');

        // Verify content section exists
        cy.get(selectors.contentSection)
            .should('be.visible');
    });

    it('TC_04.2 Check content description', () => {
        // Verify description paragraphs exist
        cy.get(selectors.description).first()
            .should('be.visible')
            .and('contain', 'An intentionally broken web application');

        cy.get(selectors.description).last()
            .should('be.visible')
            .and('contain', 'Sweet Shop is a project created');
    });

    it('TC_04.3 Validate footer content', () => {
        cy.get(selectors.footer)
            .should('be.visible')
            .and('contain', 'Sweet Shop Project 2018');
    });

    it('TC_04.4 Verify alert message exists in DOM', () => {
        cy.get('.alert.alert-success.mobileShow')
            .should('exist')
            .and('have.attr', 'role', 'alert')
            .within(() => {
                cy.get('strong')
                    .should('contain', '20% Off');
                cy.contains('Get 20% off your first sweet shop order!')
                    .should('exist');
            });
    });
}); 