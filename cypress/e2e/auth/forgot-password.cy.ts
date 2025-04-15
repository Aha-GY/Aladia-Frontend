describe('Forgot Password', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let email: string;
    let mailboxName = '';
    let mailboxToken = '';
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.registerUserAndVerifyEmail().then(
        (creds: {
          email: string;
          password: string;
          name: string;
          token: string;
        }) => {
          email = creds.email;
          password = creds.password;
          mailboxName = creds.name;
          mailboxToken = creds.token;
          cy.visitDesktop('/');
        },
      );
    });

    afterEach(() => {
      if (email) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/auth/users`,
        });
      }
    });

    it('Check forgot password recovery', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="join-now-button"]').click();
      cy.get('[data-cy="login-email-text-field"]').clear();
      cy.get('[data-cy="login-email-text-field"]').type(email);
      cy.get('[data-cy="login-submit-button"]').click();
      cy.get('[data-cy="login-forgot-password-button"]').click();
      cy.wait(10000); // Wait for all emails to be received
      cy.deleteAllMessages(mailboxName, mailboxToken); // Clean up all messages
      cy.get('[data-cy="confirm-forgot-auth-button"]').click(); // Click on the forgot password button to send the email
      cy.getLastMessageId(mailboxName, mailboxToken).then((messageId) => {
        cy.getMessage(mailboxName, mailboxToken, messageId).then((message) => {
          cy.task('parse:developermail:body', message).then((html: string) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const url = doc
              .querySelector('[aria-label="resetLink"]')
              ?.getAttribute('href');
            const queryStrings = url?.split('?')[1];
            expect(url).to.include('password-recovery');
            expect(url).to.include('token');
            expect(url).to.include('provider=email');
            cy.visit(`/password-recovery?${queryStrings}`);
            cy.get('[data-cy="new-password-create-password-field"]').clear();
            cy.get('[data-cy="new-password-create-password-field"]').type(
              'p@SSW0RD',
            );
            cy.get(
              '[data-cy="confirm-password-create-password-field"]',
            ).clear();
            cy.get('[data-cy="confirm-password-create-password-field"]').type(
              'p@SSW0RD',
            );
            cy.get('[data-cy="create-password-submit-button"]').click();
            cy.get('[data-cy="success-recovery-password-button"]').click();
          });
        });
      });
      /* ==== End Cypress Studio ==== */
    });
  });
});
