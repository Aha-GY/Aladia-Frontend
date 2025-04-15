<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 hover:bg-white/10"
    @click="onChecked"
  >
    <div class="flex flex-1 items-center gap-2">
      <div class="relative">
        <BaseAvatarNext
          data-cy="bdb6070950b1a0a6"
          :picture="member.picture"
          :user-id="member.id"
          :story="member?.story"
          :source="'profile'"
          :size="'md'"
          :show-online="false"
          :checked="checked"
          :show-check="true"
          @change="onChecked"
        />
      </div>
      <div>
        <div class="max-w-36 truncate text-sm text-white" v-html="fullName" />
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
    <el-select
      v-model="member.role"
      style="width: 8rem"
      placeholder="Role"
      @click.stop
      @change="onChange"
    >
      <el-option
        v-for="role in roles"
        :key="role.value"
        :label="$t(role.label)"
        :value="role.value"
      >
        {{ $t(role.label) }}
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { SPACE_ROLES, COURSE_ROLES, CALENDAR_ROLES } from '~/constant/roles';

export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
    query: {
      type: String,
      default: '',
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  computed: {
    online() {
      return this.member.online;
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    selecteds() {
      return this.hubSidebar.invite.selecteds;
    },
    checked() {
      return !!this.selecteds.find(
        (selected) => selected.id === this.member.id,
      );
    },
    type() {
      return this.hubSidebar.invite.type;
    },
    roles() {
      if (this.type === 'course') {
        return COURSE_ROLES;
      }

      if (this.type === 'space') {
        return SPACE_ROLES;
      }

      if (this.type === 'room') {
        return [
          {
            value: 'chat-room-admin',
            label: 'calendar.role.adminL',
          },
          {
            value: 'chat-room-member',
            label: 'calendar.role.member',
          },
        ];
      }

      if (this.type === 'calendar') {
        return CALENDAR_ROLES;
      }

      return [];
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
  methods: {
    onChecked() {
      if (this.checked) {
        this.hubSidebar.invite.selecteds = this.selecteds.filter(
          (selected) => selected.id !== this.member.id,
        );
        this.member.checked = false;
        this.$emit('change', false, this.member);
      } else {
        this.hubSidebar.invite.selecteds = [...this.selecteds, this.member];
        this.member.checked = true;
        this.member.role = this.member.role || this.roles.at(-1).value;
        this.$emit('change', true, this.member);
      }
    },
    onChange() {
      if (!this.checked) {
        this.hubSidebar.invite.selecteds = [...this.selecteds, this.member];
        this.member.checked = true;
        this.$emit('change', true, this.member);
      }
    },
  },
};
</script>
