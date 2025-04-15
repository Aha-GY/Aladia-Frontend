describe('Social | create a story, add highlight from the story gallery and then post a reel', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let userId: string;
    let storyId: string;
    let highlightId: string;
    let reelId: string;

    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.getUserId().then((id: string) => {
        userId = id;
        cy.visitDesktop(`/user/hub/${userId}/feed`);
      });
    });
    it('Should create a story, highlight and reel', () => {
      testStoryPostDesktop();
      testReelPostDesktop();
      testHighlightCreationDesktop();
    });

    afterEach(() => {
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      deleteStory();
      deleteHighlight();
      deleteReel();
    });

    function testStoryPostDesktop() {
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/stories`).as(
        'createStory',
      );
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/storage/files/signed-upload`,
      }).as('signedUpload');
      cy.intercept({
        method: 'PUT',
        url: `https://storage.googleapis.com/**`,
      }).as('uploadImage');
      cy.fixture('background.jpg', null).as('storyPicture');

      cy.get('[data-cy="create-story-trigger"]').click();
      cy.get('[data-cy="main-story-media-input"]').selectFile('@storyPicture', {
        force: true,
      });
      cy.wait(5000);
      // zoom the photo
      cy.get(
        '[title="Undo"] > .PinturaButtonInner > .PinturaButtonIcon',
      ).click();

      // drawing on the picture
      cy.get('.PinturaRadioGroupOptions > :nth-child(4)').click();
      cy.get('.PinturaShapeEditor').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        const startX = rect.left;
        const startY = rect.top + rect.height / 2;

        const targetX = startX + rect.width;
        const targetY = startY;

        cy.wrap($el)
          .trigger('mousedown', {
            eventConstructor: 'MouseEvent',
            clientX: startX,
            clientY: startY,
          })
          .trigger('mousemove', { clientX: targetX, clientY: targetY })
          .trigger('mouseup', { eventConstructor: 'MouseEvent' });
      });

      // add a filter
      cy.get('.PinturaTabList > :nth-child(4)').click();
      cy.get(
        ':nth-child(3) > .PinturaRadioGroupOptions > :nth-child(3) > label > .PinturaFilterOption > .PinturaFilterPreview',
      ).click();

      // crop the photo
      cy.get('.PinturaTabList > :nth-child(3)').click();
      cy.get('[aria-label="Drag right"]').then(($slider) => {
        const initialX = parseFloat($slider.css('--tx'));
        const moveDistance = -40;
        cy.wrap($slider)
          .trigger('mousedown', {
            eventConstructor: 'MouseEvent',
          })
          .trigger('mousemove', {
            clientX: initialX + moveDistance,
          })
          .trigger('mouseup', {
            eventConstructor: 'MouseEvent',
          });
      });

      // edit finetune
      cy.get('.PinturaTabList > :nth-child(5)').click();
      cy.get(
        '.PinturaControlPanel > .PinturaRangeInput > .PinturaRangeInputInner > .PinturaRangeInputMeter',
      )
        .first()
        .then(($el) => {
          const rect = $el[0].getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const targetX = startX - 100;

          cy.wrap($el)
            .trigger('mousedown', {
              eventConstructor: 'MouseEvent',
              force: true,
              which: 1,
              pageX: startX,
              pageY: rect.top,
            })
            .trigger('mousemove', {
              eventConstructor: 'MouseEvent',
              force: true,
              pageX: targetX,
              pageY: rect.top,
            })
            .trigger('mouseup', {
              eventConstructor: 'MouseEvent',
              force: true,
            });
        });

      cy.get('[data-cy="story-publish-button"]').click({ force: true });
      cy.wait('@signedUpload', { timeout: 10000 });
      cy.wait('@uploadImage', { timeout: 10000 });
      cy.wait('@createStory', { timeout: 25000 }).then((interception) => {
        storyId = interception.response.body.id;
      });
    }
    function testHighlightCreationDesktop() {
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/story-groups`).as(
        'createHighlight',
      );
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/storage/files/signed-upload`,
      }).as('signedUpload');
      cy.intercept({
        method: 'PUT',
        url: `https://storage.googleapis.com/**`,
      }).as('uploadImage');

      cy.fixture('profile-picture.jpg', null).as('hightLightCoverPhoto');

      cy.get('[data-cy="create-story-trigger"]').click();
      cy.get('[data-cy="Highlight-tab-button"]').click();
      cy.get('[data-cy="default-story-gallery-trigger-button"]').click();

      cy.get('[data-cy="highlight-editor-gallery-stories"]').each(
        ($el, index) => {
          if (index < 3) {
            // Select only the first 3 elements
            cy.wrap($el)
              .find('[data-cy="highlight-editor-gallery-story-selector"]')
              .click();
          }
        },
      );

      cy.get(
        '[data-cy="highlight-editor-gallery-addToHighlight-button"]',
      ).click();

      cy.get('[data-cy="create-highlight-form-title-text-field"]').type(
        'test-highlight',
      );
      cy.get('[data-cy="create-highlight-form-avatar-trigger"]').click();
      cy.get('[data-cy="create-highlight-form-avatar-dialog-editor"]', {
        timeout: 12000,
      }).selectFile('@hightLightCoverPhoto', { force: true });

      cy.wait(5000);
      cy.get(
        '[data-cy="create-highlight-form-avatar-dialog-save-button"]',
      ).click();
      cy.wait('@signedUpload', { timeout: 10000 });
      cy.wait('@uploadImage', { timeout: 10000 });

      cy.get('[data-cy="create-highlight-form-publish-button"]').click();

      cy.wait('@createHighlight', { timeout: 25000 }).then((interception) => {
        highlightId = interception.response.body.id;
      });
    }

    function testReelPostDesktop() {
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/posts`).as(
        'createReel',
      );
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/storage/files/signed-upload`,
      }).as('signedUpload');
      cy.intercept({
        method: 'PUT',
        url: `https://storage.googleapis.com/**`,
      }).as('uploadImage');

      cy.fixture('test_reel.mp4', null).as('testReelVideo');
      cy.fixture('background.jpg', null).as('reelCoverPhoto');
      cy.wait(5000);
      cy.get('[data-cy="Reel-tab-button"]').click();

      cy.get('[data-cy="create-reel-form-nav-media-input"]', {
        timeout: 12000,
      }).selectFile('@testReelVideo', { force: true });
      cy.wait('@signedUpload', { timeout: 10000 });
      cy.wait('@uploadImage', { timeout: 10000 });
      cy.wait(5000);

      // add a filter
      cy.get('.PinturaTabList > :nth-child(3)').click();
      cy.get(
        ':nth-child(3) > .PinturaRadioGroupOptions > :nth-child(3) > label > .PinturaFilterOption > .PinturaFilterPreview',
      ).click({ force: true });

      cy.get('.PinturaTabList > :nth-child(7)').click();
      cy.get('.PinturaImageButtonList > :nth-child(1)').click({ force: true });
      cy.get('[data-cy="create-reel-form-cover-input"]').selectFile(
        '@reelCoverPhoto',
        {
          force: true,
        },
      );
      cy.wait(5000);
      cy.get('[data-cy="create-reel-form-description-input"]').type(
        'this is a test reel post from the CICD',
      );

      cy.get('[data-cy="create-reel-form-editor-publish-button"]').click();
      cy.wait('@createReel', { timeout: 25000 }).then((interception) => {
        reelId = interception.response.body.id;
      });
    }

    function deleteStory() {
      if (storyId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/stories/${storyId}`,
        });
      }
    }
    function deleteHighlight() {
      if (highlightId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/story-groups/${highlightId}`,
        });
      }
    }
    function deleteReel() {
      if (reelId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/posts/${reelId}`,
        });
      }
    }
  });
});
