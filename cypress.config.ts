import { installPlugin } from '@chromatic-com/cypress';
import { defineConfig } from 'cypress';
import { decode as quotedPrintableDecode } from 'quoted-printable';

export default defineConfig({
  projectId: 'f9xuzv',
  env: {
    apiBaseUrl: 'https://dev-api.aladia.io/v2',
    email: 'test-teacher-4@aladia.io',
    password: 'Pass@123',
    webhookURL: 'https://webhook-test.com/c0e8e6fa4e7e29031e095dd9feca3f0b',
  },
  e2e: {
    experimentalStudio: true,
    defaultCommandTimeout: 10_000,
    setupNodeEvents(on, config) {
      installPlugin(on, config);

      on('task', {
        'parse:developermail:body'(emailBody: string): string | null {
          const htmlStart = emailBody.indexOf('<html');
          const htmlEnd = emailBody.lastIndexOf('</html>');

          if (htmlStart !== -1 && htmlEnd !== -1) {
            const body = emailBody.substring(htmlStart, htmlEnd + 7); // Include the closing </html> tag
            const parsedHTMLBody = quotedPrintableDecode(body).toString();
            return parsedHTMLBody;
          }

          return null; // Return null if no HTML content is found
        },
      });
    },
    baseUrl: 'http://localhost:3000',
  },
});
