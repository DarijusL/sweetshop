describe('Basket', () => {
    const config = {
        selectors: {
            basketList: '.list-group.mb-3',
            basketItem: '.list-group-item.d-flex.justify-content-between.lh-condensed',
            itemName: 'h6.my-0',
            itemQuantity: 'small.text-muted',
            itemPrice: 'span.text-muted',
            deleteButton: 'a[href*="javascript:removeItem"]',
            totalPrice: 'strong',
            checkoutButton: 'button:contains("Continue to checkout")',
            emptyBasketButton: 'a:contains("Empty Basket")'
        }
    };

    beforeEach(() => {
        // Start at home page
        cy.visit('/');
        
        // Add some items to basket first
        cy.get('.btn.btn-success.btn-block.addItem').first().click();
        cy.get('.btn.btn-success.btn-block.addItem').eq(1).click();
        
        // Then go to basket page
        cy.visit('/basket');
    });

    it('displays basket items correctly', () => {
        cy.get(config.selectors.basketList)
            .should('be.visible');
        
        cy.get(config.selectors.basketItem)
            .should('have.length.at.least', 1);
    });

    it('shows correct item details', () => {
        cy.get(config.selectors.basketItem).first()
            .within(() => {
                cy.get(config.selectors.itemName)
                    .should('be.visible');
                cy.get(config.selectors.itemQuantity)
                    .should('be.visible')
                    .and('contain', 'x');
                cy.get(config.selectors.itemPrice)
                    .should('be.visible')
                    .and('contain', '£');
            });
    });

    it('shows total price', () => {
        cy.get(config.selectors.totalPrice)
            .should('be.visible')
            .and('contain', '£');
    });

    it('shows delivery options', () => {
        cy.contains('Collect (FREE)')
            .should('be.visible');
        cy.contains('Standard Shipping (£1.99)')
            .should('be.visible');
    });

    it('allows removing items', () => {
        cy.get(config.selectors.deleteButton)
            .first()
            .should('be.visible')
            .click();
        
        // Verify item was removed
        cy.get(config.selectors.basketItem)
            .should('have.length.at.least', 0);
    });

    it('allows checkout', () => {
        cy.get(config.selectors.checkoutButton)
            .should('be.visible')
            .and('contain', 'Continue to checkout');
    });
}); 