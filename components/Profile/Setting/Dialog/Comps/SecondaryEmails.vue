<template>
  <ProfileSettingDialogCompsBox>
    <template #title>
      <div class="mb-[1.125rem] flex w-full items-center justify-between">
        <div class="text-[1.125rem]">Secondary Email</div>
        <ProfileSettingDialogCompsEditEmailConfirm
          is-secondary
          is-add-secondary
          @confirm="getSecondaryEmails"
        >
          <BaseButton type="tertiary" icon="fa-solid fa-plus">
            {{ $t('base.add') }}
          </BaseButton>
        </ProfileSettingDialogCompsEditEmailConfirm>
      </div>
    </template>
    <div>
      <div
        v-for="(item, index) in secondaryEmails"
        :key="index"
        class="mb-3 flex flex-row"
      >
        <div
          class="mr-1.5 flex h-auto w-full items-center border-b border-[#fff]/5"
        >
          <i class="fa-regular fa-envelope" />
          <span class="ml-3 cursor-default">
            {{ item }}
          </span>
        </div>
        <el-popover
          :teleported="false"
          trigger="click"
          :show-arrow="false"
          placement="bottom-end"
          popper-class="!border-none !w-[6rem]"
        >
          <template #reference>
            <BaseButton type="tertiary" icon="fa-solid fa-ellipsis" />
          </template>
          <div>
            <BaseButton
              type="tertiary"
              label="Remove"
              :loading="btnLoading"
              icon="fa-solid fa-trash"
              @click="handleRemove(item)"
            />
          </div>
        </el-popover>
      </div>
      <BaseNoData v-if="secondaryEmails?.length === 0 && !loading" />
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
import { useToast } from 'vue-toastification';

import { secondaryEmailList, deleteSecondaryEmail } from '@/api/v2/auth.js';

const $toast = useToast();

const secondaryEmails = ref([]);

const loading = ref(true);
const btnLoading = ref(false);
const getSecondaryEmails = async () => {
  try {
    loading.value = true;
    const res = await secondaryEmailList();
    secondaryEmails.value = res.secondaryEmails;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const handleRemove = async (item) => {
  if (btnLoading.value) {
    return false;
  }
  btnLoading.value = true;
  try {
    const { deleted } = await deleteSecondaryEmail({ email: item });
    if (deleted) {
      $toast.success('Successfully removed');
      await getSecondaryEmails();
    }
  } finally {
    btnLoading.value = false;
  }
};

getSecondaryEmails();
</script>
