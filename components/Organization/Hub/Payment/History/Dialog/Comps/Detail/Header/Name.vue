<template>
  <div class="flex flex-grow flex-col justify-center">
    <div class="flex items-center justify-between">
      <div
        class="max-w-56 cursor-pointer truncate text-base hover:text-white hover:underline"
        data-cy="full-name-profile-detail"
        @click="handleGotoProfile"
      >
        {{ detail.owner.owner.fullName || detail.owner.owner.name }}
      </div>
      <span class="text-xs text-[#707070]">
        <ProfileStatus :detail="props.detail.owner.owner" />
      </span>
    </div>
    <div
      class="max-w-[26.5625rem] truncate text-xs font-bold text-[#707070]"
      data-cy="full-name-profile-detail"
    >
      {{ detail.owner.owner.email }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const profileStore = useProfileStore();

function handleGotoProfile() {
  if (props.detail) {
    profileStore.gotoProfilePage({ id: props.detail.owner.owner.id });
  }
}
</script>
