describe('Edit Profile - Profile Info', () => {
  const defaultUser = {
    firstName: 'test',
    lastName: 'ci-cd',
    bio: null,
    phoneNumber: ',it,39',
    timezone: '',
    birthAddress: {
      city: '',
      state: '',
      country: '',
    },
    address: {
      country: '',
      state: '',
      city: '',
      zipCode: '',
      streetAddress: '',
    },
    birthDate: null,
  };

  function resetToDefaultProfile() {
    cy.request({
      method: 'PATCH',
      url: `${Cypress.env('apiBaseUrl')}/profiles/`,
      body: defaultUser,
    });
  }

  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.visitDesktop('/');
    });

    afterEach(() => {
      resetToDefaultProfile();
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Check First Name, Last Name, Phone Number, Bio and Time Zone Edit', () => {
      let requestTriggered = false;
      cy.intercept(
        {
          url: `${Cypress.env('apiBaseUrl')}/**`,
          method: 'GET',
        },
        () => {
          requestTriggered = true;
        },
      ).as('getRequests');
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="header-avatar"]').click();
      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });
      cy.get('[data-cy="ProfileInfo-list"]').should('be.visible').click();
      cy.get('[data-cy="profile-edit-phone-number-text-field"]').clear();
      cy.get('[data-cy="profile-edit-phone-number-text-field"]').type(
        '0226830102',
      );
      cy.get('[data-cy="profile-edit-time-zone-text-field"]').click({
        force: true,
      });
      cy.get('[data-cy="0-time-zone"]').click({ force: true });
      cy.get('[data-cy="profile-edit-first-name-text-field"]').clear({
        force: true,
      });
      cy.get('[data-cy="profile-edit-first-name-text-field"]').type(
        'test-updated',
      );
      cy.get('[data-cy="profile-edit-last-name-text-field"]').clear({
        force: true,
      });
      cy.get('[data-cy="profile-edit-last-name-text-field"]').type(
        'ci-cd-updated',
      );
      cy.get('[data-cy="profile-edit-bio-text-field"]').clear();
      cy.get('[data-cy="profile-edit-bio-text-field"]').type(
        "Hi I'm Test Account.",
      );
      cy.get('[data-cy="profile-edit-emoji-button"]').click({ force: true });
      cy.get(
        '.justify-between > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-header > .v3-search > input',
      ).clear();
      cy.get(
        '.justify-between > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-header > .v3-search > input',
      ).type('thumbs');
      cy.get(
        '.justify-between > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-footer > .v3-tone > .v3-icon',
      ).click({ force: true });
      cy.get('.v3-is-open > .v3-skin-tone-1f3ff').click({ force: true });
      cy.get(
        '.justify-between > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-body > .v3-body-inner > #smileys_people > .v3-emojis > :nth-child(1) > span',
      ).click({ force: true });

      cy.intercept({
        url: `${Cypress.env('apiBaseUrl')}/profiles`,
        method: 'PATCH',
      }).as('updateProfile');
      cy.get('[data-cy="personal-save-changes-button"]').click({ force: true });

      cy.wait('@updateProfile').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
        cy.getUserId().then((userId) => {
          cy.visitDesktop(`/user/hub/${userId}/profile`);
          cy.wait('@getRequests');
          cy.get('[data-cy="full-name-profile-detail"]').should(
            'have.text',
            'test-updated ci-cd-updated',
          );
          cy.get('[data-cy="bio-profile-detail"]').should(
            'have.text',
            "Hi I'm Test Account.👍🏿",
          );
        });
      });
      /* ==== End Cypress Studio ==== */
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Check Current Location, Birth Location and Birth Date Edit', () => {
      let requestTriggered = false;
      cy.intercept(
        {
          url: `${Cypress.env('apiBaseUrl')}/**`,
          method: 'GET',
        },
        () => {
          requestTriggered = true;
        },
      ).as('getRequests');
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="header-avatar"]').click();
      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });
      cy.get('[data-cy="ProfileInfo-list"]').should('be.visible').click();
      cy.get(
        '[data-cy="profile-edit-current-location-country-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });

      cy.get(
        '[data-cy="profile-edit-current-location-AL-country-option"]',
      ).click({ force: true });

      cy.get(
        '[data-cy="profile-edit-current-location-state-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });

      cy.get(
        '[data-cy="profile-edit-current-location-state-Berat District-option"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-current-location-city-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-current-location-city-Banaj-option"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-location-country-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });
      cy.get('[data-cy="profile-edit-birth-location-AF-country-option"]').click(
        { force: true },
      );
      cy.get(
        '[data-cy="profile-edit-birth-location-state-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });

      cy.get(
        '[data-cy="profile-edit-birth-location-state-Badghis-option"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-location-city-select-toggle"] > .el-select > .el-select__wrapper',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-location-city-Ghormach-option"]',
      ).click({ force: true });
      cy.get('[data-cy="profile-edit-birth-date-text-field"]').click({
        force: true,
      });

      cy.get(
        '[data-cy="profile-edit-birth-date-month-year-date-picker"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-date-left-arrow-date-picker"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-date-left-arrow-date-picker"]',
      ).click({ force: true });
      cy.get(
        '[data-cy="profile-edit-birth-date-1-number-of-month-date-picker"]',
      ).click({
        force: true,
      });
      cy.get('[data-cy="profile-edit-birth-date-day-19-date-picker"]').click({
        force: true,
      });

      cy.intercept({
        url: `${Cypress.env('apiBaseUrl')}/profiles`,
        method: 'PATCH',
      }).as('updateProfile');
      cy.get('[data-cy="personal-save-changes-button"]').click({ force: true });
      cy.get('.fa-sharp').click({ force: true });

      cy.wait('@updateProfile').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
        cy.getUserId().then((userId) => {
          cy.visitDesktop(`/user/hub/${userId}/profile`);
          cy.wait('@getRequests');
          cy.get('[data-cy="birth-address-country-profile-detail"]')
            .should('be.visible')
            .should('have.text', 'Afghanistan');
          cy.get('[data-cy="birth-address-city-profile-detail"]').should(
            'have.text',
            'Ghormach',
          );
          cy.get('[data-cy="birth-date-profile-detail"]').should(
            'have.text',
            '14 Jan 2022',
          );
        });
      });
      /* ==== End Cypress Studio ==== */
    });
  });
});
