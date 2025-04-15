<template>
  <div class="p-4">
    <div class="text-xs text-[#555555]">
      {{ $t('personal.key.token') }}
      <span class="text-yellow-400">{{ $t('personal.key.team') }}</span>
      {{ $t('personal.key.api') }}
    </div>

    <div class="mt-1.5 rounded bg-[#E5E5E505] p-4">
      <div class="flex items-center justify-between">
        <div ref="newKeyPopupTriggerRef" class="flex-1 text-xs text-[#B0B0B0]">
          {{ $t('personal.key.usage') }}
        </div>
        <BaseButton
          icon="fa-solid fa-plus"
          label="$t:personal.account.apiKey.new"
          data-cy="new-api-access-token-button"
          @click="handleClickAddNewKey"
        />
      </div>
      <div>
        <div v-if="loading" class="flex items-center justify-center">
          <i class="fa-solid fa-spinner animate-spin text-xs text-[white]" />
        </div>
        <BaseNoData
          v-else-if="!dataList.length"
          data-cy="no-api-key"
          class="py-3"
        />
        <ProfileSettingDialogCompsNewKeyItem
          v-for="item in dataList"
          v-else
          :key="item.id"
          :key-name="item.name"
          :key-value="item.hashedToken"
          :key-id="item.id"
          :expire-date="item.expiresIn"
          @edit-key="handleClickAddNewKey"
        />
      </div>
    </div>

    <div class="mt-5 flex items-center">
      <i class="fa-solid fa-circle-question text-xs text-[#D9D9D9]" />
      <a class="ml-2 cursor-pointer underline underline-offset-2">
        {{ $t('personal.key.doc') }}
      </a>
    </div>
  </div>

  <ProfileSettingDialogCompsNewKeyPopup
    :popup-open="!!newKeyPopupOpen"
    :button-ref="newKeyPopupTriggerRef"
    :close-popup="handleCloseAddNewPopUp"
    :edit-key-item="editKeyItem"
  />
</template>
<script setup>
const autoStore = useAuthStore();

const loading = ref(false);
const newKeyPopupOpen = ref(false);
const editKeyItem = ref(null);
const newKeyPopupTriggerRef = ref(null);
const dataList = computed(() => autoStore.apiKeysData);

onBeforeMount(() => {
  handInitAPIKeys();
});

async function handInitAPIKeys() {
  loading.value = true;
  await autoStore.listAllToken();
  loading.value = false;
}

function handleClickAddNewKey(id) {
  newKeyPopupOpen.value = true;
  if (id) {
    editKeyItem.value = dataList.value.find((item) => item.id === id);
  } else {
    editKeyItem.value = null;
  }
}

function handleCloseAddNewPopUp() {
  newKeyPopupOpen.value = false;
  editKeyItem.value = null;
}
</script>
