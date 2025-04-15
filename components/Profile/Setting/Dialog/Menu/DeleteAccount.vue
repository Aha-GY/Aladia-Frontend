<template>
  <ProfileSettingDialogCompsBox>
    <div class="text-sm">
      {{ $t('personal.account.remove.info') }}
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <ProfileSettingDialogCompsDeleteConfirm v-model="show">
        <BaseButton
          class="w-[fit-content]"
          type="error"
          label="$t:personal.account.delete"
          data-cy="delete-account-button"
          @click="show = true"
        />
      </ProfileSettingDialogCompsDeleteConfirm>
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
const show = ref(false);
</script>
