<template>
  <div class="mb-4 bg-white/5 px-4 py-2">
    <div class="mb-4 font-medium">
      {{ $t('personal.friends.user.type') }}
    </div>
    <div
      class="mb-4 flex cursor-pointer items-center justify-between"
      data-cy="43dea0b646c2339d"
      @click="onUserClick"
    >
      <div class="text-sm text-white/60">
        {{ $t('personal.friends.user.label') }}
      </div>
      <BaseSwitcher :active="query.type === 'user' || query.type === ''" />
    </div>
    <div
      class="flex cursor-pointer items-center justify-between"
      data-cy="85b28a812fd24549"
      @click="onTeacherClick"
    >
      <div class="text-sm text-white/60">
        {{ $t('personal.friends.teacher.label') }}
      </div>
      <BaseSwitcher :active="query.type === 'teacher' || query.type === ''" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onUserClick() {
      this.query.type = this.query.type === 'user' ? '' : 'user';
    },
    onTeacherClick() {
      this.query.type = this.query.type === 'teacher' ? '' : 'teacher';
    },
  },
};
</script>
