<template>
  <div class="relative">
    <BaseAvatarNext
      :picture="pictureUrl"
      :show-online="false"
      :default-icon="defaultIcon"
      size="md"
    />
    <div class="absolute bottom-0 right-0 rounded-full bg-[#0A0A0A] p-0.5">
      <BaseCheckboxStyle :state="selected ? 'correctChecked' : 'unchecked'" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    pictureUrl: {
      type: String,
      default: '',
    },
    defaultIcon: {
      type: String,
      default: 'fa-solid fa-user text-base',
    },
  },
};
</script>
