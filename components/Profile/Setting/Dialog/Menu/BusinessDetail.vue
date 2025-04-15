<template>
  <ProfileSettingDialogCompsBox>
    <div class="flex justify-between">
      <div class="mt-3 text-xs text-[#B0B0B0]">
        {{ $t('personal.profile.business.label') }}
      </div>
      <BaseButton
        label="$t:base.editor.edit"
        :icon="
          editLoading ? 'fa-spinner animate-spin' : 'fa-solid fa-pen-to-square'
        "
        data-cy="24e05f46f6a28af7"
        @click="handleClickEdit"
      />
    </div>
  </ProfileSettingDialogCompsBox>
  <ProfileSettingDialogCompsBox>
    <div class="flex items-center justify-between">
      {{ $t('personal.profile.business.bank') }}
    </div>
    <div v-if="loading" class="flex justify-center">
      <i class="fa-solid fa-spinner animate-spin" />
    </div>
    <div v-else class="mt-3 pt-1">
      <BaseNoData v-if="bankList.length === 0" />
      <OrganizationHubPaymentWidgetsPaymentBankItem
        v-for="bank in bankList"
        :key="bank.id"
        class="w-full"
        :bank="bank"
      />
    </div>
  </ProfileSettingDialogCompsBox>
</template>

<script setup>
const paymentStore = usePaymentStore();
const editLoading = ref(false);
const loading = ref(false);
const bankList = computed(() => paymentStore.bankList);

async function getData() {
  loading.value = true;
  await paymentStore.getBankAccounts();
  loading.value = false;
}
getData();

async function handleClickEdit() {
  editLoading.value = true;
  const res = await paymentStore.createAccountLink(true);
  window.open(res.onboardUrl);
  editLoading.value = false;
}
const visibility = useDocumentVisibility();
watch(
  () => visibility.value,
  (val) => {
    if (val === 'visible') {
      getData();
    }
  },
);
</script>
