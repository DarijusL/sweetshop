describe('Navigation Bar', () => {
    // Configuration
    const config = {
        selectors: {
            navbar: '.navbar.navbar-expand-lg.navbar-light.bg-light',
            brand: '.navbar-brand',
            navLinks: {
                sweets: 'a[href="/sweets"]',
                about: 'a[href="/about"]',
                login: 'a[href="/login"]',
                basket: 'a[href="/basket"]'
            },
            navContainer: '#navbarColor01',
            navItem: '.nav-item',
            navLink: '.nav-link'
        }
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('displays navigation bar', () => {
        cy.get(config.selectors.navbar).should('be.visible');
        cy.get(config.selectors.brand)
            .should('be.visible')
            .and('contain', 'Sweet Shop');
    });

    it('displays navigation links', () => {
        cy.get(config.selectors.navContainer).within(() => {
            Object.entries(config.selectors.navLinks).forEach(([name, selector]) => {
                cy.get(selector)
                    .should('be.visible')
                    .and('have.class', 'nav-link');
            });
        });
    });
}); 