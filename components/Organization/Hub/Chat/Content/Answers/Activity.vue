<template>
  <div
    class="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-white/60"
  >
    <div
      class="flex max-w-[80%] flex-1 items-center gap-1 truncate rounded-full bg-[#282828] px-3 py-1"
    >
      <div
        class="flex cursor-pointer items-center gap-0.5 underline-offset-2 hover:underline hover:brightness-90"
        data-cy="23b428ec61113429"
        @click.stop="visitProfile(activity.user)"
      >
        <BaseAvatarNext
          :picture="activity.user?.image"
          :show-online="false"
          size="sm"
        />
        <span>{{ activity.user?.fullName }}</span>
      </div>
      <span class="flex-shrink-0 truncate font-thin">
        {{ $t(activityDesc) }}
      </span>
      <div
        v-if="activity.targetUser && !isJoinBySelf"
        class="flex cursor-pointer items-center gap-0.5 truncate underline-offset-2 hover:underline hover:brightness-90"
        data-cy="b6bf8fbf07d1f464"
        @click.stop="visitProfile(activity.targetUser)"
      >
        <BaseAvatarNext
          :show-online="false"
          size="sm"
          :picture="activity.targetUser?.image"
        />
        <span class="truncate">{{ activity.targetUser?.fullName }}</span>
      </div>
      <div v-if="activity.targetMessage" class="flex gap-0.5 truncate">
        "
        <div
          style="word-break: break-all"
          class="truncate"
          v-html="activity.targetMessage?.content.replace(/<[^>]*>/g, '')"
        />
        "
      </div>
      <div
        v-if="activity.targetValue"
        class="truncate"
        style="word-break: break-all"
        v-html="activity.targetValue.replace(/<[^>]*>/g, '')"
      />
    </div>
    <div v-if="activity.targetImage" class="w-60">
      <img
        :src="activity.targetImage"
        class="h-full w-full rounded-5 object-fill"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activity: Object,
    isPopup: Boolean,
  },
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    return { profileStore, authStore };
  },
  data() {
    return {
      options: {
        'member-added': 'org.activity.member.invited',
        'member-removed': 'org.activity.member.removed',
        'image-updated': 'org.activity.updated.image',
        'name-updated': 'org.activity.updated.name',
        'description-updated': 'org.activity.updated.description',
        'message-pinned': 'org.activity.message.pinned',
        'user-left': 'org.activity.user.left',
        'ownership-updated': 'org.activity.updated.ownership',
      },
    };
  },
  computed: {
    activityDesc() {
      if (this.isJoinBySelf && this.activity.type === 'member-added') {
        return 'org.activity.member.added';
      }
      return this.options[this.activity.type];
    },
    userId() {
      return this.authStore.context;
    },
    isJoinBySelf() {
      return (
        this.activity.user?.id === this.activity.targetUser?.id &&
        this.activity.type === 'member-added'
      );
    },
  },
  methods: {
    visitProfile(item) {
      this.profileStore.gotoProfilePage(item);
    },
  },
};
</script>
