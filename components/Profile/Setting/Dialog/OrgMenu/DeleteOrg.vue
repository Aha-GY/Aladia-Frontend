<template>
  <ProfileSettingDialogCompsBox>
    <div class="text-sm">
      {{ $t('calendar.organization.delete.content') }}
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <ProfileSettingDialogOrgMenuDeleteConfirm v-model="show">
        <BaseButton
          class="w-[fit-content]"
          type="error"
          label="$t:org.account.delete"
          data-cy="bd1f815cece4cd9c"
          @click="show = true"
        />
      </ProfileSettingDialogOrgMenuDeleteConfirm>
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
const show = ref(false);
</script>
