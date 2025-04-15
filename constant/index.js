export const IS_DEV = process.env.NODE_ENV === 'development';

// eslint-disable-next-line import/no-mutable-exports
let DOMAIN_URL = '';

// eslint-disable-next-line import/no-mutable-exports
let BASE_API_URL = '';

// eslint-disable-next-line import/no-mutable-exports
let STRIPE_PUBLIC_KEY = '';

// eslint-disable-next-line import/no-mutable-exports
let AUTH_GOOGLE_LOGIN = '';

const GOOGLE_CLIENT_ID =
  '646302301051-b3fgjea60j5oed3lv429lpnmigu44o4f.apps.googleusercontent.com';

// eslint-disable-next-line import/no-mutable-exports
let LOOM_APP_ID = '';

// eslint-disable-next-line import/no-mutable-exports
let ENV_NAME = '';

export function setConfig({ BRANCH_NAME }) {
  switch (BRANCH_NAME) {
    // 线上生产环境
    case 'prod':
      DOMAIN_URL = 'https://aladia.io';
      BASE_API_URL = 'https://api.aladia.io/v2';
      AUTH_GOOGLE_LOGIN = 'https://api.aladia.io/v2/auth/google';
      STRIPE_PUBLIC_KEY =
        // Aladia S.r.l
        // 'pk_live_51MI5jvHQzZdDmyPqiI0hoydqmHDKk9q7xMCy8ZBJHoXNosWvqTnUp1I6Ha1DSW1znY87up1e6QOLJ1JhZdsZW0Qr00mXU2XWY5';
        // Aladia Corp
        'pk_test_51MBCrPAEhQTnwhtkrNxKxD0CvWRluREQ5TTs9R9GZ4EQ8RGzAs3eYLUrcpbDF8jeK7ecaCqKGZwSZRipewbTbTN600j9A7X9LY';
      LOOM_APP_ID = 'e47c94e8-ecba-48b3-9ae2-e1bb4c3e38ff';
      ENV_NAME = 'prod';
      break;
    // 线上测试环境
    case 'develop':
      DOMAIN_URL = 'https://develop.aladia.io';
      BASE_API_URL = 'https://dev-api.aladia.io/v2';
      AUTH_GOOGLE_LOGIN = 'https://dev-api.aladia.io/v2/auth/google';
      STRIPE_PUBLIC_KEY =
        // Aladia S.r.l
        // 'pk_test_51MI5jvHQzZdDmyPqCjGz7Uh5Kt8c2y6grLDTel7RAOWfU4mfYUMKZoIQ3RgQk2DP5ELdwxkd20KRG0NtihXQaMLC00w4ErPuwP';
        // Aladia Corp
        'pk_test_51MBCrPAEhQTnwhtkrNxKxD0CvWRluREQ5TTs9R9GZ4EQ8RGzAs3eYLUrcpbDF8jeK7ecaCqKGZwSZRipewbTbTN600j9A7X9LY';
      LOOM_APP_ID = 'e47c94e8-ecba-48b3-9ae2-e1bb4c3e38ff';
      ENV_NAME = 'develop';
      break;
    // 本地开发环境
    default:
      DOMAIN_URL = 'https://develop.aladia.io';
      BASE_API_URL = 'https://dev-api.aladia.io/v2';
      AUTH_GOOGLE_LOGIN = 'https://dev-api.aladia.io/v2/auth/google';
      STRIPE_PUBLIC_KEY =
        // Aladia S.r.l
        // 'pk_test_51MI5jvHQzZdDmyPqCjGz7Uh5Kt8c2y6grLDTel7RAOWfU4mfYUMKZoIQ3RgQk2DP5ELdwxkd20KRG0NtihXQaMLC00w4ErPuwP';
        // Aladia Corp
        'pk_test_51MBCrPAEhQTnwhtkrNxKxD0CvWRluREQ5TTs9R9GZ4EQ8RGzAs3eYLUrcpbDF8jeK7ecaCqKGZwSZRipewbTbTN600j9A7X9LY';
      LOOM_APP_ID = 'f0a2ff29-2c70-4a3d-87a8-241a58e7378d';
      ENV_NAME = 'local';
      break;
  }
}

export {
  DOMAIN_URL,
  BASE_API_URL,
  STRIPE_PUBLIC_KEY,
  AUTH_GOOGLE_LOGIN,
  GOOGLE_CLIENT_ID,
  LOOM_APP_ID,
  ENV_NAME,
};
