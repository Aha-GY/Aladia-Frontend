<template>
  <div class="__avatar-switch-visibility flex items-center gap-3 bg-[#070706]">
    <BaseAvatarSwitch right-offset="2px" bottom-offset="2px" />
    <div class="flex flex-col overflow-hidden">
      <div class="truncate text-sm font-medium text-[#D9D9D9]">
        {{ profileStore.myProfileDetail.fullName }}
      </div>
      <div class="max-w-[8rem] pt-1">
        <PostsCreationVisibility
          :active="visbility"
          @select="handleSelectVisible"
        />
      </div>
    </div>
  </div>
  <SocialContextSwitch />
</template>

<script setup>
defineProps({
  visbility: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['select']);
const profileStore = useProfileStore();
const handleSelectVisible = (menu) => {
  emit('select', menu); // Correct usage of emit
};
</script>
