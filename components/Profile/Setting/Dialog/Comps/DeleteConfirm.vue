<template>
  <BaseDialog
    v-model="open"
    :title="$t('base.editor.delete')"
    title-class="!text-xl !text-[#EB4937]"
    class="!w-[90%] md:!w-[630px]"
    @close="onCancel"
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
        {{ $t('auth.hint.confirmPassword') }}
      </div>
      <div class="rounded-md border-l border-[#EB4937] bg-white/5 p-3 text-xs">
        {{ $t('personal.account.close.content') }}
      </div>
      <div>
        {{ $t('personal.account.remove.warning') }}
      </div>
      <ProfileSettingDialogCompsPasswordWithSwitch
        v-model="password"
        data-cy="delete-account-password"
        :placeholder="$t('personal.account.enter.password')"
      />
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:personal.account.keep"
        data-cy="046dba1ca3ae9c63"
        @click="onCancel"
      />
      <BaseButton
        class="ml-3"
        type="error"
        label="$t:personal.account.delete"
        :disabled="!password"
        :loading="loading"
        data-cy="delete-account-confirm-button"
        @click="confirm"
      />
    </div>
  </BaseDialog>
  <slot />
</template>
<script setup>
import { deleteUser, confirmPassword } from '@/api/v2/auth.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['update:modelValue']);

const authStore = useAuthStore();
const loading = ref(false);
const open = ref(false);
const password = ref('');

watch(
  () => props.modelValue,
  (newVal) => {
    open.value = newVal;
  },
  { immediate: true },
);

const onCancel = () => {
  open.value = false;
  loading.value = false;
  password.value = '';
  emits('update:modelValue', false);
};
const confirm = async () => {
  try {
    if (!password.value || loading.value) {
      return false;
    }
    loading.value = true;
    await confirmPassword({
      password: password.value,
    });
    await deleteUser();
    onCancel();
    authStore.logout({ noLogoutApi: true });
  } finally {
    loading.value = false;
  }
};
</script>
