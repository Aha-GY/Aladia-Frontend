<template>
  <div class="flex items-center gap-4">
    <div class="flex w-5 justify-center">
      <i class="fa-light fa-user-lock ml-0.5 text-base text-white/20" />
    </div>
    <div
      class="group/input relative flex w-0 flex-1 items-center justify-between pb-1 pr-2 font-light"
    >
      <div
        class="flex w-0 flex-1 cursor-pointer text-white/50"
        data-cy="2bc60e0a330a31ee"
        @click="open = true"
      >
        <span class="max-w-[70%] truncate">{{ host.fullName }}</span>
        &nbsp;· {{ $t('meet.roles.host') }}
      </div>
      <BaseMemberPreview
        :members="members"
        width="1.75rem"
        :online="true"
        class="absolute -top-2 right-0"
      />
      <BaseLine />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    host() {
      return this.members[0] || {};
    },
    members() {
      return this.event.hostMembers;
    },
  },
};
</script>
