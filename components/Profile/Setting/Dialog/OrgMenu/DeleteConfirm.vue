<template>
  <BaseDialog
    v-model="open"
    :title="$t('base.editor.delete')"
    destroy-on-close
    title-class="!text-xl !text-[#EB4937]"
    class="!w-[90%] md:!w-[630px]"
    @close="onCancel('close')"
  >
    <template #titleIcon>
      <i
        class="fa-solid fa-triangle-exclamation pr-1.5 text-base !font-normal !text-[#EB4937]"
      />
    </template>

    <div
      class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0] md:p-[31px_29px_31px_29px]"
    >
      <div class="text-[1.125rem] font-medium leading-[1.125rem]">
        {{ $t('calendar.organization.confirm.name') }}
      </div>
      <div class="rounded-md border-l border-[#EB4937] bg-white/5 p-3 text-xs">
        {{ $t('calendar.organization.confirm.delete.warning1') }}
      </div>
      <div class="text-[#B0B0B0]">
        {{ $t('calendar.organization.confirm.content') }}
        <span class="whitespace-nowrap font-semibold text-[#D9D9D9]">
          {{ validateName }},
        </span>
        {{ $t('calendar.organization.confirm.delete.warning2') }}
      </div>
      <BaseInput
        v-model="name"
        :title="$t('calendar.organization.confirm.enter')"
        class="mt-3"
      />
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:org.account.keepAccount"
        data-cy="42ea994ed5c5bef6"
        @click="onCancel('keep-account')"
      />
      <BaseButton
        class="ml-3"
        type="error"
        label="$t:org.account.deleteAccount"
        :disabled="!name"
        :loading="loading"
        data-cy="83fffa34cc9a40dd"
        @click="confirm"
      />
    </div>
  </BaseDialog>
  <slot />
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { deleteOrganizations } from '@/api/v2/org.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  confirmName: {
    type: String,
  },
});
const emits = defineEmits(['update:modelValue', 'cancel']);
const { t } = useI18n();
const $toast = useToast();

const authStore = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();
const paymentStore = usePaymentStore();

const loading = ref(false);
const open = ref(false);
const name = ref('');
const validateName = computed(
  () => props.confirmName || profileStore.myOrgProfileDetail.name,
);

watch(
  () => props.modelValue,
  (newVal) => {
    open.value = newVal;
  },
  { immediate: true },
);

const onCancel = (type) => {
  open.value = false;
  loading.value = false;
  name.value = '';
  emits('update:modelValue', false);
  if (type === 'keep-account') {
    emits('cancel');
  }
};
const confirm = async () => {
  const { activeUserRole, id, name: orgName } = profileStore.myOrgProfileDetail;
  try {
    if (!name.value || loading.value) {
      return false;
    }
    if (name.value !== validateName.value) {
      $toast.error(t('calendar.organization.mismatch.name'));
      return false;
    }
    if (activeUserRole !== 'organization-owner') {
      $toast.error(t('org.deleteOrg'));
      return false;
    }
    loading.value = true;
    await authStore.switchContext({ id: authStore.user.id });
    await deleteOrganizations({
      organizationId: id,
      name: orgName,
    });
    profileStore.openSettingDialog = false;
    $toast.success(t('calendar.organization.delete.success'));
    await sleep(100);
    router.replace(`/user/hub/${authStore.user.id}/profile`);
    paymentStore.setServiceDialog(false);
    onCancel('delete');
  } finally {
    loading.value = false;
  }
};
</script>
