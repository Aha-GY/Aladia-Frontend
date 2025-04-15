export default {
  auth: {
    button: {
      back: 'Back to Login',
      enter: 'Enter',
      forgot: 'Forgot your password?',
      sendEmail: 'Send Recovery Email',
      login: 'Login',
      signup: 'Sign Up',
    },
    hint: {
      email: 'Enter your recovery email',
      name: 'First Name',
      surname: 'Last Name',
      confirmPassword: 'Confirm your password',
      password: 'Enter your password',
    },
    privacy_policy: 'Privacy Policy',
    terms_conditions: 'Terms and Conditions',
    accept: 'I accept the',
    and: 'and',
    or: 'or',
    login: {
      header: {
        welcome: 'Welcome to Aladia!',
        description1: 'Create or log into your',
        description2: 'account below',
      },
      body: {
        title: {
          email: 'Enter your email address',
          password: 'Enter your password',
        },
      },
      socials: {
        google: 'Continue with Google',
        facebook: 'Continue with Facebook',
        apple: 'Continue with Apple',
        terms: 'Terms & Conditions',
      },
    },
    forgot: {
      header: {
        title: 'Send Recovery Mail',
        description:
          'We’ll send a recovery email to the address you provide. Make sure it’s correct before proceeding',
      },
      confirm: 'Confirm',
      recovery: {
        title: 'Password Recovery - Aladia',
        description1: 'Retrieve your account',
        description2: 'password using your',
        description3: 'registered email',
        sent: {
          title: 'Recovery Link Sent',
          description1: 'Check your inbox to reset',
          description2: 'your password',
        },
        password: {
          new: 'Enter a New Password',
          create: 'Create Password',
          added: 'Password added successfully!',
          changed: 'Password changed successfully!',
          success: 'Continue to Aladia',
        },
      },
    },
    signup: {
      year: 'On Aladia Since {year}',
      header: {
        title: 'Nice to Meet You!',
        description1: 'Upload a profile picture',
        description2: 'and complete your',
        description3: 'profile',
      },
      image: {
        upload: '',
        error: 'Please upload the file in image format',
      },
      thanks: 'Thank you for signing up!',
      otp: {
        welcome: 'Welcome back!',
        description:
          'Enter the 6-digit code sent to your registered email below:',
        button: {
          resend: 'Resend Email',
          send: 'Submit',
        },
        empty: 'Please enter the email verification code',
        ask: "Didn't receive the email?",
        sent: 'Sent successfully',
      },
      body: {
        title: 'Complete Your Details',
      },
      button: {
        marketplace: 'Enter the Marketplace',
      },
    },
    error: {
      unauthorized: 'Please login again',
      stripe: 'An error occurred',
      required: 'This field is required',
      email: {
        invalid: 'Invalid email address',
      },
      password: {
        notMatch: 'Passwords do not match',
        invalid: 'Invalid password',
        required: {
          char7: 'Must be different from the previous password',
          char8: 'Must be at least 8 characters',
          uppercase: 'Must begin with uppercase letter',
          lowercase: 'Must contain a lowercase letter',
          number: 'Must contain a number',
          special: 'Must contain a character',
          symbol: 'Invalid symbol used',
        },
        strong: 'Your password is strong',
      },
      name: {
        required: 'Must be at least 2 characters',
      },
    },
    provider: {
      header: {
        title: 'Create a Password',
        description: 'Your account is currently linked with',
        signIn: 'Sign in using these credentials',
      },
      sent: {
        email: 'Send Email',
        link: 'Send Link',
      },
    },
  },
};
