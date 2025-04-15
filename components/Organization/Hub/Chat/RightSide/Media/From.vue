<template>
  <div class="flex items-center gap-1 px-4 text-sm text-white/60">
    {{ $t('org.activity.chat.forward.from') }}
    <div
      v-for="member in members"
      :key="member.id"
      class="flex max-w-[18.75rem] items-center gap-2 rounded-full bg-white/5 p-1 px-2 text-white/80 hover:bg-white/10"
    >
      <BaseAvatarNext
        :picture="member.image"
        :user-id="member.id"
        :story="member?.story"
        size="sm"
        :show-online="false"
      />
      <div class="flex-1 truncate">{{ member.fullName }}</div>
      <div
        class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
        @click="$emit('remove', member)"
      >
        <i class="fa-solid fa-close text-xs" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
