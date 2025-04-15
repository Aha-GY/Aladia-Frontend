// plugins/global-components.js
import ProfileSettingDialogMenuRoadMap from '~/components/Profile/Setting/Dialog/Menu/RoadMap.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component(
    'ProfileSettingDialogMenuRoadMap',
    ProfileSettingDialogMenuRoadMap,
  );
});
