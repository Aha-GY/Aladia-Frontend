import { createApp } from 'vue';

import OrganizationHubShareLoading from '~/components/Organization/Hub/Share/Loading.vue';

let app = null;
let container = null;

export const showLoading = ({ logo }) => {
  const divToRemove = document.getElementById('loading-div');
  if (divToRemove) {
    document.body.removeChild(divToRemove);
  }
  container = document.createElement('div');
  container.id = 'loading-div';
  document.body.appendChild(container);
  app = createApp(OrganizationHubShareLoading, { logo });
  app.mount(container);
};

export const hiddenLoading = () => {
  app?.unmount();
  if (container) {
    document.body.removeChild(container);
  }
};
