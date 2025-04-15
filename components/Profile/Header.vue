<template>
  <div
    class="fixed left-0 z-[65] hidden w-[100vw] bg-[#060606] pl-[4.375rem] transition-all md:block"
    :class="{
      'top-[6rem]': isHeader,
      'top-[3.5rem]': !isHeader && isMe,
      'top-[5.5rem]': !isHeader && !isMe,
    }"
  >
    <div
      class="relative left-1/2 flex max-w-[75rem] -translate-x-1/2 items-center gap-2 py-5 transition-all"
    >
      <div class="flex w-0 flex-1 items-center gap-2 pl-5">
        <div class="h-12 w-12">
          <img
            v-if="detail.picture"
            :src="detail.picture"
            class="h-full w-full rounded-full object-cover"
            alt=""
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1C1C1C] pt-4"
          >
            <i
              class="fa-solid text-[#505050]"
              :class="
                detail.entityType === 'organization'
                  ? 'fa-building-ngo text-[1.8rem]'
                  : 'fa-user text-[2.5rem]'
              "
            />
          </div>
        </div>
        <div class="bold ml-1.5 max-w-[26.5625rem] truncate text-xl">
          {{ detail.fullName || detail.name }}
        </div>
        <ProfileStatus :detail="detail" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isHeader: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const profileStore = useProfileStore();
const isMe = computed(
  () => profileStore.myProfileDetail.id === props.detail.id,
);
</script>
