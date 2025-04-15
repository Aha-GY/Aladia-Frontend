<template>
  <div class="mb-2 flex items-center justify-between pl-3 pr-5 text-xs">
    <div class="flex items-center gap-1">
      <div class="mr-2 flex size-8 items-center justify-center">
        <i class="fa-solid fa-users" />
      </div>
      <div class="text-sm">
        {{ $t('org.options.selected', { count: total || 0 }) }}
      </div>
      <el-tooltip effect="light" content="Info" placement="bottom">
        <i
          class="fa-light fa-circle-info cursor-pointer text-10 text-[#565656] hover:text-[#E2E2E2]"
          @click="invite.infoState = true"
        />
      </el-tooltip>
    </div>

    <div class="flex items-center gap-2">
      <el-popover :width="180" trigger="click" placement="bottom-end">
        <template #reference>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-white/5"
          >
            <i class="fa-solid fa-filter" />
          </div>
        </template>
        <div class="flex flex-col gap-1 p-1">
          <div
            v-for="role in roles"
            :key="role.value"
            class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm hover:bg-white/10"
            data-cy="53a01d560a35fa84"
            @click="onCheck(role)"
          >
            <div class="flex items-center gap-1.5">
              <div class="flex size-5 items-center">
                <i :class="role.icon" />
              </div>
              {{ $t(role.label) }}
            </div>
            <BaseCheckbox :active="filter.includes(role.value)" />
          </div>
        </div>
      </el-popover>
      <!-- <OrganizationHubSidebarPermission :permission="info" /> -->
      <div
        :data-if="!disableAdd"
        class="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-white/5"
        data-cy="bca3668ba77631f5"
        @click="onInvite"
      >
        <i class="fa-solid fa-user-plus" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'space',
    },
    filter: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
    permissions: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  data() {
    return {
      timer: null,
      rule: false,
    };
  },
  computed: {
    info() {
      return this.hubSidebar.permission.state;
    },
    invite() {
      return this.hubSidebar.invite;
    },
    disableAdd() {
      return !this.permissions.includes('add');
    },
  },
  methods: {
    onInvite() {
      this.hubSidebar.invite.type = this.type;
      this.hubSidebar.invite.state = true;
    },
    onCheck(role) {
      const index = this.filter.indexOf(role.value);
      if (index === -1) {
        this.filter.push(role.value);
      } else {
        if (this.filter.length === 1) {
          return;
        }
        this.filter.splice(index, 1);
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('init');
      }, 1000);
    },
    onClick() {
      if (this.hubSidebar.member.state) {
        return;
      }
      this.hubSidebar.member.state = true;
      this.hubSidebar.member.type = this.type;
    },
    openModal() {
      this.hubSidebar.permission.state = true;
    },
  },
};
</script>
