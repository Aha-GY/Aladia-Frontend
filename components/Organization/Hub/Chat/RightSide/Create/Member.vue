<template>
  <div
    v-if="item.id !== userId"
    ref="member"
    class="group/item flex cursor-pointer items-center gap-1 rounded-5 py-0.5 transition-all hover:bg-[#252525]"
    :data-cy="`OrganizationHubChatRightSideCreateMember-${item.name || item.fullName || `${item.firstName} ${item.user.lastName}` || ''}`"
    @click.stop="$emit('create', item)"
  >
    <BaseAvatarNext
      :picture="item?.picture || null"
      :story="item?.story"
      :user-id="item?.id"
      :online="item?.online"
      :source="'chat_new_room'"
      :size="'md'"
    />

    <div class="flex w-0 flex-1 flex-col transition-all">
      <div class="truncate text-base" v-html="fullName" />
      <div class="text-xs text-white/50">
        <span v-if="item.entityType === 'organization'" class="capitalize">
          Organization
        </span>
        <span v-else class="capitalize">{{ item.type }}</span>
        ·
        <span>
          {{ item?.numberOf?.followers || 0 }} {{ $t('base.member.followers') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({
        numberOf: { followers: 0, followings: 0 },
      }),
    },
    title: String,
  },
  emits: ['create'],
  computed: {
    userId() {
      return this.$route.params.name;
    },
    fullName() {
      const name =
        this.item.name ||
        this.item.fullName ||
        `${this.item.firstName} ${item.user.lastName}` ||
        '';

      if (this.title) {
        return highlightKeywords(name || '', [this.title.trim()]);
      } else {
        return name;
      }
    },
  },
};
</script>
