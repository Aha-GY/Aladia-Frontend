// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
import * as dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

Cypress.Commands.add('visitDesktop', (url: string) => {
  const desktopUserAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

  cy.visit(url, {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'userAgent', {
        value: desktopUserAgent,
      });
      win.localStorage.setItem('isCheckTimeZone', '1');
    },
  });
});

Cypress.Commands.add('visitMobile', (url: string) => {
  const mobileUserAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1';

  cy.visit(url, {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'userAgent', {
        value: mobileUserAgent,
      });
      win.localStorage.setItem('isCheckTimeZone', '1');
    },
  });
});

Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/auth/login`,
        body: {
          email,
          password,
        },
      }).then((response) => {
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiBaseUrl')}/profiles/me`,
          headers: {
            Authorization: `Bearer ${response.body.accessToken}`,
          },
        }).then((profileResponse) => {
          const user = {
            id: profileResponse.body.id,
            email: profileResponse.body.email,
            username: profileResponse.body.username,
            fullName: profileResponse.body.fullName,
            picture: profileResponse.body.picture,
            type: profileResponse.body.type,
            teachingSpace: profileResponse.body.teachingSpace,
          };

          cy.setCookie('user', JSON.stringify(user));
          cy.setCookie('context', profileResponse.body.id);
          cy.setCookie('accessToken', response.body.accessToken);

          cy.window().then((win) => {
            win.localStorage.setItem('test_user_id', profileResponse.body.id);
          });
        });
      });
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookie('accessToken')
          .then((cookie) => cookie?.value)
          .then((accessToken) => {
            cy.request({
              method: 'GET',
              url: `${Cypress.env('apiBaseUrl')}/profiles/me`,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          });
      },
    },
  );
});
Cypress.Commands.add('fillStripeElement', (selector, value) => {
  cy.get('iframe')
    .should((iframe) => expect(iframe.contents().find(selector)).to.exist)
    .then((iframe) => cy.wrap(iframe.contents().find(selector)))
    .within((input) => {
      cy.wrap(input).should('not.be.disabled').clear().type(value);
    });
});
Cypress.Commands.add('clickStripeElement', (selector) => {
  cy.get('iframe')
    .should((iframe) => expect(iframe.contents().find(selector)).to.exist)
    .then((iframe) => cy.wrap(iframe.contents().find(selector)))
    .within((input) => {
      cy.wrap(input).should('not.be.disabled').click();
    });
});

Cypress.Commands.add('getUserId', () => {
  cy.window().then((win) => {
    const userId = win.localStorage.getItem('test_user_id');
    return userId;
  });
});
Cypress.Commands.add('dayjs', (date?: Date) => {
  dayjs.extend(customParseFormat);
  return cy.wrap(dayjs(date));
});
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillStripeElement(
        selector: string,
        value: string,
      ): Chainable<JQuery<HTMLElement>>;
      clickStripeElement(selector: string): Chainable<JQuery<HTMLElement>>;
      login(email: string, password: string): Chainable<void>;
      visitMobile(url: string): Chainable<void>;
      visitDesktop(url: string): Chainable<void>;
      getUserId(): Chainable<string>;
      loginByGoogleApi(): Chainable<void>;
      createMailbox(): Chainable<{ name: string; token: string }>;
      deleteMailbox(mailboxName: string, mailboxToken: string): Chainable<void>;
      getLastMessageId(
        mailboxName: string,
        mailboxToken: string,
      ): Chainable<string>;
      getMessage(
        mailboxName: string,
        mailboxToken: string,
        messageId: string,
      ): Chainable<string>;
      registerUserAndVerifyEmail(): Chainable<{
        email: string;
        password: string;
        name: string;
        token: string;
      }>;
      dayjs: (date?: Date) => Cypress.Chainable<Dayjs>;
      // Course Commands
      reviewCourse(courseId: string): Chainable<boolean>;
    }
  }
}

export {};
