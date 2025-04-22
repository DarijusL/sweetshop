describe('Sweets Page', () => {
    const config = {
        selectors: {
            productCard: '.card',
            productTitle: '.card-title',
            productDescription: '.card-text',
            productPrice: '.text-muted',
            addToBasketButton: '.btn.btn-success.btn-block.addItem',
            productContainer: '.row.text-center'
        },
        products: [
            {
                title: 'Bon Bons',
                description: 'Pink Strawberry Bonbons - sugar dusted, strawberry flavoured chewy sweets.',
                price: '£1.00'
            },
            {
                title: 'Sherbert Discs',
                description: "UFO's Sherbert Filled Flying Saucers.",
                price: '£0.95'
            },
            {
                title: 'Chocolate Cups',
                description: 'Candy Chocolate Cups.',
                price: '£1.00'
            },
            {
                title: 'Sherbert Straws',
                description: 'Rainbow Dust Straws - Choose your colour.',
                price: '£0.75'
            }
        ]
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('displays product grid [SCRUM-19]', () => {
        cy.get(config.selectors.productContainer)
            .should('be.visible');
        
        cy.get(config.selectors.productCard)
            .should('have.length', 4);
    });

    it('shows product details [SCRUM-20]', () => {
        // Find and verify the Bon Bons card specifically
        cy.get(config.selectors.productCard).each(($card) => {
            const $title = $card.find('.card-title');
            if ($title.text().includes('Bon Bons')) {
                cy.wrap($card).within(() => {
                    cy.get(config.selectors.productTitle)
                        .should('contain', 'Bon Bons');
                    cy.get(config.selectors.productDescription)
                        .should('contain', 'Pink Strawberry Bonbons');
                    cy.get(config.selectors.productPrice)
                        .should('contain', '£1.00');
                    cy.get(config.selectors.addToBasketButton)
                        .should('be.visible')
                        .and('contain', 'Add to Basket');
                });
            }
        });
    });

    it('displays correct product information', () => {
        // Verify each product exists with correct information
        config.products.forEach(product => {
            cy.contains(config.selectors.productTitle, product.title)
                .parents(config.selectors.productCard)
                .within(() => {
                    cy.get(config.selectors.productDescription)
                        .should('contain', product.description);
                    cy.get(config.selectors.productPrice)
                        .should('contain', product.price);
                    cy.get(config.selectors.addToBasketButton)
                        .should('be.visible');
                });
        });
    });
}); 