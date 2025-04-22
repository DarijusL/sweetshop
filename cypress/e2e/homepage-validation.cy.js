// cypress/e2e/sweet_shop_homepage.cy.js

describe('Homepage Validation', () => {
    const selectors = {
        pageTitle: '.display-3',
        subTitle: '.lead',
        browseButton: '.btn.btn-primary.btn-lg.sweets',
        productContainer: '.row.text-center',
        productCard: '.col-lg-3.col-md-6.mb-4.cards',
        card: '.card',
        cardImage: '.card-img-top',
        cardTitle: '.card-title',
        cardText: '.card-text',
        addToBasketButton: '.btn.btn-success.btn-block.addItem',
        navigation: {
            navbar: '.navbar.navbar-expand-lg.navbar-light.bg-light',
            navLinks: '.nav-link'
        }
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('displays header content correctly', () => {
        cy.get(selectors.pageTitle)
            .should('be.visible')
            .and('contain', 'Welcome to the sweet shop!');

        cy.get(selectors.subTitle)
            .should('be.visible')
            .and('contain', 'The sweetest online shop out there.');

        cy.get(selectors.browseButton)
            .should('be.visible')
            .and('contain', 'Browse Sweets');
    });

    it('validates product cards display and structure [TC-01.2]', () => {
        // Check if the product container exists
        cy.get(selectors.productContainer)
            .should('be.visible');

        // Check if we have exactly 4 product cards
        cy.get(selectors.card)
            .should('have.length', 4);

        // Verify structure of each card
        cy.get(selectors.card).each(($card) => {
            cy.wrap($card).within(() => {
                cy.get('.card-img-top').should('be.visible');
                cy.get('.card-title').should('be.visible');
                cy.get('.card-text').should('be.visible');
                cy.get('.btn.btn-success.btn-block.addItem')
                    .should('be.visible')
                    .and('contain', 'Add to Basket');
            });
        });
    });

    it('verifies navigation links functionality [TC-01.3]', () => {
        // Check navigation bar exists
        cy.get(selectors.navigation.navbar)
            .should('be.visible');

        // Verify all nav links are present
        cy.get(selectors.navigation.navLinks).should(($links) => {
            expect($links).to.have.length.at.least(3);
            expect($links.eq(0)).to.contain('Sweets');
            expect($links.eq(1)).to.contain('About');
            expect($links.eq(2)).to.contain('Login');
        });
    });

    it('displays popular products section', () => {
        // Check for the "Most popular" heading
        cy.contains('h2', 'Most popular')
            .should('be.visible');
            
        // Check for the description text with correct class
        cy.get('span.lead')
            .should('be.visible')
            .and('contain', 'Our most popular choice of retro sweets.');

        // Verify specific products are present
        const expectedProducts = [
            'Sherbert Straws',
            'Bon Bons',
            'Chocolate Cups',
            'Sherbert Discs'
        ];

        expectedProducts.forEach(productName => {
            cy.contains('.card-title', productName)
                .should('be.visible');
        });
    });
});