describe('Checkout Process', () => {
    const selectors = {
        billingForm: {
            firstName: '.form-control',  // We'll use index to find the right one
            lastName: '.form-control',
            email: '.form-control[placeholder="you@example.com"]',
            address: '.form-control[placeholder="1234 Main St"]',
            address2: '.form-control[placeholder="Apartment or suite"]',
            country: 'select.custom-select',
            city: 'select.custom-select',
            zip: '.form-control'
        },
        paymentForm: {
            credit: 'input[name="paymentMethod"][value="credit"]',
            debit: 'input[name="paymentMethod"][value="debit"]',
            paypal: 'input[name="paymentMethod"][value="paypal"]',
            nameOnCard: '.form-control',
            cardNumber: '.form-control',
            expiration: '.form-control',
            cvv: '.form-control'
        },
        buttons: {
            continueToCheckout: 'button[type="submit"]',
            placeOrder: 'button[type="submit"]'
        },
        validation: {
            firstNameError: 'Valid first name is required.',
            lastNameError: 'Valid last name is required.',
            emailError: 'Please enter a valid email address for shipping updates.',
            addressError: 'Please enter your shipping address.',
            countryError: 'Please select a valid country.',
            cityError: 'Please provide a valid state.',
            zipError: 'Zip code required.',
            cardNameError: 'Name on card is required',
            cardNumberError: 'Credit card number is required',
            expirationError: 'Expiration date required',
            cvvError: 'Security code required'
        },
        orderSummary: '.list-group',
        orderConfirmation: '.order-confirmation'
    };

    beforeEach(() => {
        // Add items to cart and go to checkout
        cy.visit('/sweets');
        cy.get('a.btn.btn-success.btn-block.addItem').first().click();
        cy.wait(1000);
        
        cy.visit('/basket');
        cy.contains('button', 'Continue to checkout').click();
        cy.wait(2000); // Wait for form to load

        // Log form structure to help debug
        cy.get('form').then($form => {
            cy.log('Form found:', $form.length > 0);
            cy.log('Form HTML:', $form.html());
        });
    });

    context('Billing Information', () => {
        it('fills billing form with valid data', () => {
            // Fill out billing information using more general selectors
            cy.get('.form-control').eq(0).type('John');
            cy.get('.form-control').eq(1).type('Doe');
            cy.get('.form-control').eq(2).type('john.doe@example.com');
            cy.get('.form-control').eq(3).type('123 Sweet Street');
            cy.get('.form-control').eq(4).type('Apt 4B');
            
            // Handle dropdowns with better error handling
            cy.get('select.custom-select').first().should('be.visible').then($select => {
                if ($select.find('option').length > 0) {
                    cy.wrap($select).select($select.find('option').eq(1).val());
                }
            });

            cy.get('select.custom-select').eq(1).should('be.visible').then($select => {
                if ($select.find('option').length > 0) {
                    cy.wrap($select).select($select.find('option').eq(1).val());
                }
            });
            
            // Fill zip code
            cy.get('.form-control').eq(5).type('SW1A 1AA');

            // Remove all radio button and placeholder code, just use simple form-control selectors
            // Name on card
            cy.get('.form-control').eq(6).type('John Doe');

            // Card number
            cy.get('.form-control').eq(7).type('4242424242424242');

            // Expiration
            cy.get('.form-control').eq(8).type('12/25');

            // CVV
            cy.get('.form-control').eq(9).type('123');

            // Update the submit button click
            cy.contains('button', 'Continue to checkout', { multiple: true }).first().click();
        });

        it('validates required fields', () => {
            // Click the submit button without filling any fields
            cy.get('button[type="submit"]').first().click();
            
            // Check for error messages using the invalid-feedback class
            cy.get('.invalid-feedback')
                .should('exist')  // First check if they exist
                .and('contain', 'Valid first name is required')
                .and('contain', 'Valid last name is required')
                .and('contain', 'Please enter a valid email address')
                .and('contain', 'Please enter your shipping address')
                .and('contain', 'Please select a valid country');

            // Alternative approach if needed:
            // cy.get('form').within(() => {
            //     cy.get('.invalid-feedback').should('exist');
            // });
        });
    });

    context('Order Summary', () => {
        it('displays correct order details', () => {
            // First make sure we're on the right page and wait for content to load
            cy.wait(1000);

            // Get the basket items container using the correct ID
            cy.get('#basketItems')
                .should('exist')
                .within(() => {
                    // Check for items using the correct list-group-item class
                    cy.get('.list-group-item')
                        .should('have.length.at.least', 1);

                    // Check for prices using text-muted class
                    cy.get('.text-muted')
                        .should('exist');

                    // Check for total with the correct structure
                    cy.contains('Total (GBP)')
                        .parent('.list-group-item')
                        .should('exist');
                });

            // Check for Delivery section
            cy.get('h4')
                .contains('Delivery')
                .should('exist');
        });

        it('calculates correct totals', () => {
            cy.get('#basketItems')
                .within(() => {
                    let expectedTotal = 0;

                    // Get all item prices (excluding the total)
                    cy.get('.list-group-item')
                        .not(':contains("Total")')
                        .find('.text-muted')
                        .each(($el) => {
                            // Extract price from text (e.g., "£1.00" -> 1.00)
                            const price = parseFloat($el.text().replace('£', ''));
                            if (!isNaN(price)) {
                                expectedTotal += price;
                            }
                        })
                        .then(() => {
                            // Get and verify the total
                            cy.get('.list-group-item')
                                .contains('Total (GBP)')
                                .parent()
                                .find('strong')
                                .invoke('text')
                                .then(totalText => {
                                    const actualTotal = parseFloat(totalText.replace('£', ''));
                                    expect(actualTotal).to.equal(expectedTotal);
                                });
                        });
                });
        });
    });
}); 