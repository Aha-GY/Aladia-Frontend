<template>
  <el-popover
    placement="right"
    :show-arrow="true"
    width="auto"
    trigger="hover"
    popper-class=" !border-white/10 !p-2"
  >
    <template #reference>
      <BaseAvatarNext
        :picture="message.authorFrom?.image || message.createdBy?.image"
        :show-online="false"
        size="sm"
      />
    </template>
    <div class="flex items-center gap-1">
      <BaseAvatarNext
        :picture="message.authorFrom?.image || message.createdBy?.image"
        :show-online="false"
        size="sm"
      />
      <div
        v-if="message.authorFrom"
        class="cursor-pointer underline-offset-2 hover:underline"
        @click.stop="visitProfile(message.authorFrom)"
      >
        {{ message.authorFrom?.fullname }}
      </div>
      <div
        v-else
        class="cursor-pointer underline-offset-2 hover:underline"
        @click.stop="visitProfile(message.createdBy)"
      >
        {{ message.createdBy.fullname }}
      </div>
    </div>
  </el-popover>
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
      this.profileStore.gotoProfilePage({
        ...message,
        entityType: message.type,
      });
    },
  },
};
</script>
