<template>
  <div class="flex h-screen flex-col items-center justify-center">
    <img class="size-64 object-cover" src="~/assets/images/splash/bg.gif" />
    <div class="text-xl text-white">Connect Aladia...</div>
  </div>
</template>
<script setup>
import { authCannySSO } from '~/api/v2/auth';

const route = useRoute();
const feedbackURL = 'https://feedback.aladia.io/';

const getQueryParameterByName = (name) =>
  route.query[name] ? decodeURIComponent(route.query[name]) : null;

/** Constructs the full redirect URL for Canny SSO */
const getRedirectURL = (ssoToken) => {
  const redirectURL = getQueryParameterByName('redirect');
  const companyID = getQueryParameterByName('companyID');

  if (!redirectURL || !redirectURL.startsWith('https://') || !companyID) {
    console.error('Invalid redirect parameters.');
    return null;
  }

  console.log(companyID);
  console.log(ssoToken);
  console.log(redirectURL);
  return `https://canny.io/api/redirects/sso?companyID=${companyID}&ssoToken=${ssoToken}&redirect=${encodeURIComponent(
    redirectURL,
  )}`;
};
const redirectToCanny = async () => {
  try {
    const res = await authCannySSO();
    const redirectURL = getRedirectURL(res.ssoToken);
    if (redirectURL) {
      window.location.assign(redirectURL);
    } else {
      window.location.assign(feedbackURL);
    }
  } catch (error) {
    window.location.assign(feedbackURL);
  }
};
redirectToCanny();
</script>
