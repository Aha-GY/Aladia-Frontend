<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 hover:bg-white/10"
    @click="onChecked"
  >
    <div class="flex flex-1 items-center gap-2">
      <div class="relative">
        <BaseAvatarNext
          :user-id="member.id"
          :story="member?.story"
          :picture="member?.picture"
          :source="'profile'"
          :size="'md'"
          :show-online="false"
          :checked="checked"
          :show-check="true"
          @change="onChecked"
        />
      </div>
      <div class="w-0 flex-1">
        <div class="truncate text-sm text-white">{{ member.fullName }}</div>
        <div class="flex items-center gap-1 text-11">
          <div v-if="online" class="text-white/50">
            {{ $t('base.member.online') }}
          </div>
          <div v-else class="w-32 truncate text-white/50">
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
        </div>
      </div>
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
  },
  setup() {
    const hubSubject = useHubSubjectStore();
    return { hubSubject };
  },
  computed: {
    online() {
      return this.member.online;
    },
    selecteds() {
      return this.hubSubject.selectedTeachers;
    },
    checked() {
      return !!this.selecteds.find(
        (selected) => selected.id === this.member.id,
      );
    },
  },
  methods: {
    onChecked() {
      if (this.checked) {
        this.hubSubject.selectedTeachers = this.selecteds.filter(
          (selected) => selected.id !== this.member.id,
        );
        this.member.checked = false;
      } else {
        this.hubSubject.selectedTeachers = [...this.selecteds, this.member];
        this.member.checked = true;
      }
    },
  },
};
</script>
