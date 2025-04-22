describe('User Authentication Flow', () => {
    // Configuration
    const config = {
        selectors: {
            authForm: 'form.needs-validation',
            emailField: 'input[type="email"]',
            passwordField: 'input[type="password"]',
            submitBtn: '.btn.btn-primary',
            social: {
                twitter: 'img[alt="twitter"]',
                facebook: 'img[alt="facebook"]',
                linkedin: 'img[alt="linkedin"]'
            }
        }
    };

    // Test suite
    context('Authentication Form', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.contains('Login').click();
        });

        it('validates form structure and elements', () => {
            cy.get(config.selectors.emailField)
                .should('be.visible')
                .and('have.attr', 'type', 'email');
            
            cy.get(config.selectors.passwordField)
                .should('be.visible')
                .and('have.attr', 'type', 'password');

            cy.get(config.selectors.submitBtn)
                .should('be.visible')
                .and('contain.text', 'Login');
        });

        it('displays social media links', () => {
            cy.get(config.selectors.social.twitter).should('be.visible');
            cy.get(config.selectors.social.facebook).should('be.visible');
            cy.get(config.selectors.social.linkedin).should('be.visible');
        });
    });
}); 