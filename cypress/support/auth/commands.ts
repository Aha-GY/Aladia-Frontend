import { recurse } from 'cypress-recurse';

// Commands related to developermail.com API
const developerMailApiUrl = 'https://www.developermail.com/api/v1/mailbox';

Cypress.Commands.add('createMailbox', () => {
  cy.request({
    method: 'PUT',
    url: developerMailApiUrl,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('result');
    expect(response.body.result).to.have.property('name');
    expect(response.body.result).to.have.property('token');
    cy.wrap(response.body.result as { name: string; token: string });
  });
});

// Set header X-MailboxToken to use the mailbox
Cypress.Commands.add(
  'deleteMailbox',
  (mailboxName: string, mailboxToken: string) => {
    cy.request({
      method: 'DELETE',
      url: `${developerMailApiUrl}/${mailboxName}`,
      headers: {
        'X-MailboxToken': mailboxToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  },
);

Cypress.Commands.add(
  'getLastMessageId',
  (mailboxName: string, mailboxToken: string) => {
    recurse(
      () =>
        cy
          .request({
            method: 'GET',
            url: `${developerMailApiUrl}/${mailboxName}`,
            headers: {
              'X-MailboxToken': mailboxToken,
            },
          })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('result');
            const lastMessageId =
              response.body.result[response.body.result.length - 1];
            cy.wrap(lastMessageId as string);
          }),
      (lastMessageId) => lastMessageId !== undefined,
      { delay: 5000, timeout: 30000, log: false },
    );
  },
);

Cypress.Commands.add(
  'getMessage',
  (mailboxName: string, mailboxToken: string, messageId: string) => {
    cy.request({
      method: 'GET',
      url: `${developerMailApiUrl}/${mailboxName}/messages/${messageId}`,
      headers: {
        'X-MailboxToken': mailboxToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('result');
      cy.wrap(response.body.result as string);
    });
  },
);

Cypress.Commands.add(
  'deleteAllMessages',
  (mailboxName: string, mailboxToken: string) => {
    cy.request({
      method: 'GET',
      url: `${developerMailApiUrl}/${mailboxName}`,
      headers: {
        'X-MailboxToken': mailboxToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('result');
      const messages = response.body.result as string[];
      messages.forEach((messageId) => {
        cy.request({
          method: 'DELETE',
          url: `${developerMailApiUrl}/${mailboxName}/messages/${messageId}`,
          headers: {
            'X-MailboxToken': mailboxToken,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  },
);

function generateRandomPassword() {
  const length = 8;
  const charset = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    special: '@$!%*?&',
  };
  let password = '';
  password += charset.upper.charAt(
    Math.floor(Math.random() * charset.upper.length),
  );
  password += charset.lower.charAt(
    Math.floor(Math.random() * charset.lower.length),
  );
  password += charset.number.charAt(
    Math.floor(Math.random() * charset.number.length),
  );
  password += charset.special.charAt(
    Math.floor(Math.random() * charset.special.length),
  );

  const allChars =
    charset.lower + charset.upper + charset.number + charset.special;
  for (let i = 3; i < length; ++i) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

Cypress.Commands.add('registerUserAndVerifyEmail', () => {
  cy.createMailbox().then((mailbox) => {
    const token = mailbox.token;
    const name = mailbox.name;
    const email = `${name}@developermail.com`;
    const password = generateRandomPassword();

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiBaseUrl')}/auth/register`,
      body: {
        email,
        password,
        firstName: 'Test',
        lastName: 'Test',
        privileges: [],
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.getLastMessageId(name, token).then((messageId) => {
      cy.getMessage(name, token, messageId).then((message) => {
        cy.task('parse:developermail:body', message).then((html: string) => {
          expect(html).to.not.be.null;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const code = doc
            .querySelector('[aria-label="verificationCode"]')
            .textContent?.trim();

          expect(code).to.not.be.undefined;

          cy.request({
            method: 'POST',
            url: `${Cypress.env('apiBaseUrl')}/auth/verify-user`,
            body: {
              email,
              code: parseInt(code as string),
            },
          }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('verified');
            expect(response.body.verified).to.be.true;

            cy.wrap({
              email,
              password,
              name,
              token,
            });
          });
        });
      });
    });
  });
});

// Login with google using google playground
Cypress.Commands.add('loginByGoogleApi', () => {
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('GOOGLE_CLIENT_ID'),
      client_secret: Cypress.env('GOOGLE_CLIENT_SECRET'),
      refresh_token: Cypress.env('GOOGLE_REFRESH_TOKEN'),
    },
  }).then(({ body }) => {
    const { id_token } = body;
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiBaseUrl')}/auth/connect/google`,
      body: {
        token: id_token,
      },
    }).then(({ body }) => {
      expect(body).to.have.property('connected');
      expect(body.connected).to.be.true;
    });
  });
});
