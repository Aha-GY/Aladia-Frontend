<template>
  <div class="mb-2 flex h-6 items-center justify-between gap-2">
    <div class="flex w-0 flex-1 items-center gap-1 truncate text-sm">
      <span v-if="viewing">
        {{ $t('index.version.viewing') }}
      </span>
      <span :class="viewing ? $t('event.underline') : ''">
        {{
          restored
            ? `${$t('index.version.restored')} ${item.title}`
            : item.title
        }}
      </span>
    </div>
    <OrganizationHubSidebarVersionItemHeaderStatusBadges
      :published="published"
      :current="current"
      :verifying="verifying"
      :viewing="viewing"
      :rejected="rejected"
    />
    <OrganizationHubSidebarVersionItemHeaderActionMenu
      :current="current"
      :viewing="viewing"
      :restored="restored"
      :published="published"
      @view-open="$emit('view-open')"
      @view-exit="$emit('view-exit')"
      @edit="$emit('edit')"
      @restore="$emit('restore')"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    current: {
      type: Boolean,
      default: false,
    },
    restored: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    viewing: {
      type: Boolean,
      default: false,
    },
    verifying: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['view-open', 'view-exit', 'edit', 'restore'],
};
</script>
