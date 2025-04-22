// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom commands for Sweet Shop testing

// Visit specific pages
Cypress.Commands.add('visitSweetsPage', () => {
    cy.visit('/sweets');
    cy.get('h1').should('be.visible');
});

Cypress.Commands.add('visitBasketPage', () => {
    cy.visit('/basket');
    cy.get('.list-group', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('visitLoginPage', () => {
    cy.visit('/login');
    cy.get('h1').should('contain', 'Login');
});

// Basket management
Cypress.Commands.add('clearBasket', () => {
    cy.visit('/');
    
    // Clear using localStorage
    cy.window().then((win) => {
        win.localStorage.removeItem('basket');
    });
    
    // Reload page to reflect cleared basket
    cy.reload();
    
    // Verify empty state
    cy.get('.align-items-center > .text-muted')
        .should('contain', 'Your Basket');
    cy.get('a[href="/basket"]')
        .should('contain', '0');
});

Cypress.Commands.add('addProductsToBasket', (products) => {
    cy.visit('/sweets');
    cy.wait(1000); // Wait for page to load
    
    // Add each product and verify
    products.forEach((product) => {
        // Click "Browse Sweets" if we're on the homepage
        cy.get('body').then(($body) => {
            if ($body.find('button:contains("Browse Sweets")').length > 0) {
                cy.contains('button', 'Browse Sweets').click();
                cy.wait(1000);
            }
        });

        // Find the product by its exact data-name attribute and click Add to Basket link
        cy.get(`a.btn.btn-success.btn-block.addItem[data-name="${product.name}"]`, { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .click();
        
        // Wait for add to complete
        cy.wait(1000);
        
        // Verify the item was added by checking the basket count is not zero
        cy.get('a[href="/basket"]')
            .should('be.visible')
            .and('not.contain', '0');
    });
});

Cypress.Commands.add('addRandomItemsToBasket', (min, max) => {
    cy.visitSweetsPage();
    
    // Get all product cards
    cy.get('.card').then($cards => {
        // Generate random number of items to add
        const itemCount = Cypress._.random(min, max);
        
        // Keep track of selected items
        const selectedItems = new Set();
        
        // Add random items
        for(let i = 0; i < itemCount; i++) {
            let randomIndex;
            do {
                randomIndex = Cypress._.random(0, $cards.length - 1);
            } while(selectedItems.has(randomIndex));
            
            selectedItems.add(randomIndex);
            
            cy.wrap($cards)
                .eq(randomIndex)
                .within(() => {
                    cy.get('.btn.btn-success.btn-block.addItem').click();
                });
        }
        
        // Save the count for later verification
        cy.wrap(selectedItems.size).as('selectedItemCount');
    });
});

// Price calculations
Cypress.Commands.add('calculateBasketTotal', (items, shippingCost = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal + shippingCost;
    return cy.wrap(total.toFixed(2));
});

// Verification helpers
Cypress.Commands.add('verifyBasketCount', (expectedCount) => {
    cy.get('a[href="/basket"]')
        .should('be.visible')
        .and('contain', expectedCount);
});

Cypress.Commands.add('verifyEmptyBasket', () => {
    cy.get('.align-items-center > .text-muted')
        .should('contain', 'Your Basket');
    cy.get('a[href="/basket"]')
        .should('contain', '0');
});

// Product management
Cypress.Commands.add('removeAllProducts', () => {
    function deleteAllItems() {
        cy.get('body').then(($body) => {
            if ($body.find('.small').length > 0) {
                cy.get('.small').first().click();
                cy.wait(500);
                cy.reload();
                deleteAllItems();
            }
        });
    }
    deleteAllItems();
});

// Custom commands for authentication
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/auth');
    cy.get('input[data-test="email-input"]').type(email);
    cy.get('input[data-test="password-input"]').type(password);
    cy.get('button[data-test="login-submit"]').click();
});

Cypress.Commands.add('register', (userData) => {
    cy.visit('/register');
    cy.get('input[data-test="name-input"]').type(userData.name);
    cy.get('input[data-test="email-input"]').type(userData.email);
    cy.get('input[data-test="password-input"]').type(userData.password);
    cy.get('input[data-test="confirm-password"]').type(userData.password);
    cy.get('button[data-test="register-submit"]').click();
});

// Custom commands for cart operations
Cypress.Commands.add('addToCart', (productId, quantity = 1) => {
    cy.visit(`/products/${productId}`);
    cy.get('input[data-test="quantity-input"]').clear().type(quantity);
    cy.get('button[data-test="add-to-cart"]').click();
});

Cypress.Commands.add('clearCart', () => {
    // Start fresh
    cy.visit('/');
    
    // Clear all storage to ensure a clean state
    cy.window().then((win) => {
        win.localStorage.clear();  // Clear all localStorage, not just basket
        win.sessionStorage.clear();
    });
    
    // Force reload to ensure clean state
    cy.reload(true);  // Force reload, bypassing cache
    
    // Wait for page load
    cy.get('nav', { timeout: 10000 }).should('be.visible');
    
    // Verify basket is empty by checking localStorage directly
    cy.window().then((win) => {
        expect(win.localStorage.getItem('basket')).to.be.null;
    });
    
    // Now verify the badge shows 0
    cy.get('span.badge.badge-success', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then((text) => {
            // Convert text to number and verify it's 0
            expect(Number(text)).to.equal(0);
        });
});

// Custom commands for product operations
Cypress.Commands.add('searchProducts', (query) => {
    cy.get('input[data-test="search-input"]').type(query);
    cy.get('button[data-test="search-submit"]').click();
});

Cypress.Commands.add('filterProducts', (filterOptions) => {
    cy.get('select[data-test="category-filter"]').select(filterOptions.category);
    cy.get('input[data-test="price-range"]').type(filterOptions.priceRange);
    cy.get('button[data-test="apply-filters"]').click();
});

// Custom commands for checkout
Cypress.Commands.add('proceedToCheckout', () => {
    cy.visit('/cart');
    cy.get('button[data-test="proceed-checkout"]').click();
});

Cypress.Commands.add('completeCheckout', (paymentDetails) => {
    cy.get('input[data-test="card-number"]').type(paymentDetails.cardNumber);
    cy.get('input[data-test="expiry-date"]').type(paymentDetails.expiryDate);
    cy.get('input[data-test="cvv"]').type(paymentDetails.cvv);
    cy.get('button[data-test="place-order"]').click();
});

// Custom commands for user profile
Cypress.Commands.add('updateProfile', (profileData) => {
    cy.visit('/profile');
    cy.get('input[data-test="name-input"]').clear().type(profileData.name);
    cy.get('input[data-test="email-input"]').clear().type(profileData.email);
    cy.get('button[data-test="save-profile"]').click();
});

Cypress.Commands.add('changePassword', (passwordData) => {
    cy.visit('/profile/security');
    cy.get('input[data-test="current-password"]').type(passwordData.current);
    cy.get('input[data-test="new-password"]').type(passwordData.new);
    cy.get('input[data-test="confirm-password"]').type(passwordData.new);
    cy.get('button[data-test="change-password"]').click();
});

// Custom commands for accessibility
Cypress.Commands.add('checkAccessibility', () => {
    cy.injectAxe();
    cy.checkA11y();
});

// Custom commands for performance
Cypress.Commands.add('measurePageLoad', () => {
    cy.window().then((win) => {
        const performance = win.performance;
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            loadTime: navigation.loadEventEnd - navigation.navigationStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart
        };
    });
});

// Custom commands for error handling
Cypress.Commands.add('handleNetworkError', () => {
    cy.intercept('*', (req) => {
        req.destroy();
    });
});

Cypress.Commands.add('simulateOffline', () => {
    cy.window().then((win) => {
        win.navigator.onLine = false;
        win.dispatchEvent(new Event('offline'));
    });
});