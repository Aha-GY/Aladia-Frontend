<template>
  <div
    v-if="checked"
    class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 hover:bg-white/10"
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
    <div class="flex items-center gap-2">
      <div class="rounded-sm bg-white/10 px-3 py-1 text-sm">
        {{ $t(role.label) }}
      </div>

      <div class="relative flex">
        <div
          class="flex size-6 cursor-pointer items-center justify-center rounded text-xs hover:bg-white/10"
          @click="open = !open"
        >
          <i class="fa-solid fa-ellipsis" />
        </div>
        <div
          ref="focus"
          :class="open ? 'flex' : 'hidden'"
          class="absolute -bottom-8 right-3 flex-col gap-1 rounded-md border border-white/20 bg-black p-1"
        >
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-white/10"
            @click="onChecked"
          >
            <div class="flex size-4 items-center justify-center text-xs">
              <i class="fa-solid fa-trash" />
            </div>
            Remove
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { COURSE_ROLES } from '~/constant/roles';

export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const open = ref(false);
    const focus = ref(null);
    const hubSubject = useHubSubjectStore();

    onClickOutside(focus, () => {
      open.value = false;
    });

    return { hubSubject, open, focus };
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
    roles() {
      return cloneDeep(COURSE_ROLES);
    },
    role() {
      return this.roles.find((role) => role.value === this.member.role);
    },
  },
  methods: {
    onChecked() {
      this.open = false;
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
