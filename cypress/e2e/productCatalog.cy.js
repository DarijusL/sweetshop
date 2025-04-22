describe('Product Catalog', () => {
    const config = {
        selectors: {
            browseButton: 'a:contains("Browse Sweets")',
            productCard: '.card',
            productTitle: '.card-title',
            productPrice: '.text-muted',
            productDescription: '.card-text',
            productImage: '.card-img-top',
            addToCartButton: '.btn.btn-success.btn-block.addItem',
            productGrid: '.col-lg-3.col-md-6.mb-4.cards'
        }
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('displays welcome section', () => {
        cy.contains('h1', 'Welcome to the sweet shop!')
            .should('be.visible');
        cy.contains('The sweetest online shop out there.')
            .should('be.visible');
        cy.get(config.selectors.browseButton)
            .should('be.visible');
    });

    it('displays product cards correctly', () => {
        // Verify each product card exists
        cy.get(config.selectors.productCard)
            .should('have.length', 4)
            .each($card => {
                // Check that each card has the required elements
                cy.wrap($card).within(() => {
                    cy.get(config.selectors.productTitle).should('be.visible');
                    cy.get(config.selectors.productDescription).should('be.visible');
                    cy.get(config.selectors.productPrice).should('be.visible');
                    cy.get(config.selectors.addToCartButton)
                        .should('be.visible')
                        .and('contain', 'Add to Basket');
                });
            });
    });

    // Test specific products individually
    it('displays Bon Bons product correctly', () => {
        cy.contains(config.selectors.productTitle, 'Bon Bons')
            .parents(config.selectors.productCard)
            .within(() => {
                cy.get(config.selectors.productDescription)
                    .should('contain', 'Pink Strawberry Bonbons');
                cy.get(config.selectors.productPrice)
                    .should('contain', '£1.00');
            });
    });

    it('displays Sherbert Discs product correctly', () => {
        cy.contains(config.selectors.productTitle, 'Sherbert')
            .parents(config.selectors.productCard)
            .within(() => {
                cy.get(config.selectors.productDescription)
                    .should('contain', 'UFO');
                cy.get(config.selectors.productPrice)
                    .should('contain', '£0.95');
            });
    });

    it('allows adding products to basket', () => {
        cy.get(config.selectors.addToCartButton).first()
            .should('be.visible')
            .click();
        
        // Verify basket update
        cy.get('[data-id="4"]').should('exist');
    });
}); 