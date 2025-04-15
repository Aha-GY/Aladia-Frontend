````
<template>
  <div class="p-2">
    <div class="rounded-5 border border-white/5 bg-[#0c0c0c] px-2 py-4">
      <!-- title -->
      <div class="flex items-center">
        <div class="mr-4 flex-shrink-0">
          <div class="rounded-full border-[0.375rem] border-[#393939]">
            <div
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[#555555] text-xs text-white"
            >
              2
            </div>
          </div>
        </div>

        <div class="text-xl font-semibold text-[#e2e2e2]">
          {{ $t('payment.subscribe.description') }}
        </div>
      </div>

      <!-- sub infos -->
      <div
        class="mt-3 text-white"
        :class="!isProfileMenu ? 'flex justify-between' : 'grid grid-cols-1'"
      >
        <div class="flex-shrink-0 text-sm" :class="{ 'mb-4': isProfileMenu }">
          <div class="text-lg">
            {{ $t('payment.subscribe.benefits') }}
          </div>
          <div class="mt-3 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-solid fa-hard-drive text-[#fed54a]" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.packages.storage') }}
            </span>
          </div>
          <div class="mt-2 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-solid fa-film text-[#fed54a]" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.packages.streaming') }}
            </span>
          </div>
          <div class="mt-2 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-solid fa-robot text-[#fed54a]" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.packages.ai') }}
            </span>
          </div>
        </div>

        <div class="flex-shrink-0 text-sm">
          <div class="text-lg">
            {{ $t('payment.subscribe.cost') }}
          </div>
          <div class="mt-3 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-solid fa-hard-drive" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.payAsGo.storage') }}
            </span>
          </div>
          <div class="mt-2 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-regular fa-film" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.payAsGo.streaming') }}
            </span>
          </div>
          <div class="mt-2 flex items-center">
            <div class="w-6 text-center">
              <i class="fa-solid fa-robot" />
            </div>
            <span class="text-white/70">
              {{ $t('payment.subscribe.payAsGo.ai') }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="mt-3 flex items-center rounded-5 bg-[#fbffb0] bg-opacity-[0.08] p-2"
      >
        <i
          class="fa-regular fa-lightbulb-exclamation mb-4 mr-4 text-[#CFA200]"
        />
        <span>
          {{ $t('payment.subscribe.info') }}
        </span>
      </div>

      <div class="mt-4 flex w-full items-center justify-end">
        <BaseButton
          :loading="loading"
          :disabled="disableSub"
          @click="handleSubService"
        >
          {{ $t('org.subscribe.label') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { paymentSubscriptionsServices } from '~/api/v2/payment';

defineProps({
  dialogShow: {
    type: Boolean,
    default: false,
  },
  isProfileMenu: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['success']);
const { t } = useI18n();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const $toast = useToast();

const myProfileInfo = ref({});
const loading = ref(false);
const disableSub = computed(() => {
  if (authStore.isOrg) {
    return !authStore.finishedOrgSignup;
  } else {
    return authStore.hasServiceSubscription || !authStore.finishedTeacherSignup;
  }
});

watch(
  () => profileStore.myProfileDetail,
  (newVal) => {
    myProfileInfo.value.cover = newVal.cover;
    myProfileInfo.value.picture = newVal.picture;
    myProfileInfo.value.status = newVal.status;
  },
  { immediate: true, deep: true },
);

const handleSubService = async () => {
  if (disableSub.value) {
    return;
  }
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    await paymentSubscriptionsServices();
    $toast.success(t('payment.subscribe.success'));
    // update access filed
    if (authStore.isOrg) {
      await profileStore.getOrganizationDetail({
        organizationId: profileStore.myOrgProfileDetail.id,
      });
    }
    await authStore.getInfo();
    emits('success');
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
