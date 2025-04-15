<template>
  <div
    class="flex cursor-pointer items-center justify-between rounded p-1 pr-3 hover:bg-white/10"
  >
    <div class="flex items-center gap-2">
      <BaseAvatarNext
        :picture="member.picture"
        :user-id="member.id"
        :story="member.story"
        :source="'profile'"
        :size="'md'"
        :show-online="false"
        :checked="checked"
        :show-check="!member.assigned"
        @change="$emit('change')"
      />
      <div>
        <div
          class="w-40 truncate text-sm text-white"
          v-html="member.fullName"
        />
        <div class="flex items-center gap-1 text-sm">
          <div v-if="member.online" class="text-white/50">
            {{ $t('base.member.online') }}
          </div>
          <div v-else class="text-white/50">
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="checked || member.assigned"
      class="flex items-center justify-end gap-1 rounded border border-white/20 bg-white/10 px-1 py-0.5 text-xs"
    >
      <i class="fa-light fa-close" />
      1
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
    selected: {
      type: Array,
      default: () => [],
    },
    query: {
      type: String,
      default: '',
    },
  },
  computed: {
    checked() {
      return !!this.selected.find((item) => item.id === this.member.id);
    },
    fullName() {
      if (this.query) {
        return highlightKeywords(this.member.fullName || '', [
          this.query.trim(),
        ]);
      } else {
        return this.member.fullName;
      }
    },
  },
};
</script>
