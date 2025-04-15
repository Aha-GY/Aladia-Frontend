<template>
  <div
    class="flex-1 items-center truncate text-xs text-[#545454]"
    v-html="preview"
  />
</template>
<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const profileStore = useProfileStore();
    return {
      profileStore,
    };
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
    userId() {
      return this.profileStore.myProfileDetail.id;
    },
    activity() {
      return this.item.lastActivity;
    },
    isOwner() {
      return this.activity.user?.id === this.userId;
    },
    preview() {
      let desc = this.isOwner
        ? this.$t('org.activity.message.you')
        : this.activity.user?.fullName;
      if (this.isJoinBySelf && this.activity.type === 'member-added') {
        desc += ` ${this.$t('org.activity.member.added')}`;
      }
      desc += ` ${this.$t(this.options[this.activity.type])}`;
      if (this.activity.targetUser && !this.isJoinBySelf) {
        desc += ` ${this.activity.targetUser?.fullName}`;
      }
      if (this.activity.targetMessage) {
        desc += ` "${this.activity.targetMessage?.content.replace(/<[^>]*>/g, '')}"`;
      }
      if (this.activity.targetValue) {
        desc += ` ${this.activity.targetValue.replace(/<[^>]*>/g, '')}`;
      }
      return desc;
    },
    isJoinBySelf() {
      return (
        this.activity.user?.id === this.activity.targetUser?.id &&
        this.activity.type === 'member-added'
      );
    },
  },
};
</script>
