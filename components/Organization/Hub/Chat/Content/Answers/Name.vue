<template>
  <template v-if="isOwner">
    <div
      v-if="message.author?.type === 'profile'"
      class="text-sm font-bold text-white/70 underline-offset-4"
    >
      {{ $t('meet.you') }}
    </div>
    <div v-else class="flex items-center gap-2 truncate text-sm text-white/70">
      <span class="truncate" :style="`color:${message.author?.color}`">
        {{ message.author?.fullname }}
      </span>
    </div>
  </template>
  <div v-else class="flex truncate">
    <div
      v-if="message.author.type === 'profile' && !message.authorFrom"
      class="cursor-pointer truncate text-sm font-bold text-white/70 underline-offset-2 hover:underline hover:brightness-75"
      :style="`color:${message.author.color}`"
      data-cy="b125fe407be2911f"
      @click.stop="visitProfile(message.author)"
    >
      {{ message.author?.fullname }}
    </div>
    <template v-else>
      <div
        class="cursor-pointer truncate text-sm font-bold text-white/70 underline-offset-2 hover:underline hover:brightness-75"
        :style="`color:${message.author.color}`"
        data-cy="f7d4822eb93dcb38"
        @click.stop="visitProfile(message.author)"
      >
        {{ message?.author?.fullname }}
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    message: Object,
    isOwner: Boolean,
  },
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  methods: {
    visitProfile(message) {
      this.profileStore.gotoProfilePage(message);
    },
  },
};
</script>
