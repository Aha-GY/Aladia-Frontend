<template>
  <div
    class="group/item flex cursor-pointer items-center gap-2 rounded p-1"
    data-cy="8b789a56ec480539"
    @click.stop="onChange(item)"
  >
    <div class="flex h-6 w-6 items-center justify-center">
      <i class="fa-solid fa-calendar text-xs" :style="{ color: item.color }" />
    </div>
    <div
      class="w-0 flex-1 truncate text-base text-[#909090] group-hover/item:text-[#FAFAFA]"
      :data-cy="`${dataCy}-name`"
      v-html="name"
    />
    <div
      ref="buttonRef"
      class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
      :data-cy="`${dataCy}-three-dots`"
      @click.stop="open = !open"
    >
      <i class="fa-light fa-ellipsis text-xs text-[#FAFAFA]" />
    </div>
    <div class="flex h-6 w-6 items-center justify-center">
      <BaseCheckboxStyle
        :state="selectedIds.includes(item.id) ? 'checked' : 'unchecked'"
      />
    </div>
  </div>
  <BasePopup
    :open="open"
    :store="hubCalendarStore"
    :button-ref="buttonRef"
    :arrow="false"
    :width="167"
    placement="bottom-end"
    @close="open = false"
  >
    <div
      class="flex cursor-pointer flex-col gap-1.5 p-2 text-xs font-medium text-[#E5E5E5]"
    >
      <div
        class="flex items-center gap-2 rounded-5 p-1 hover:bg-white/5"
        data-cy="calendar-edit-popup-button"
        @click="onEdit(item)"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-edit" />
        </div>
        {{ $t('base.editor.edit') }}
      </div>
      <div
        v-if="!isOwner"
        class="flex items-center gap-2 rounded-5 p-1 hover:bg-white/5"
        data-cy="89d33964b06adf87"
        @click="onLeave(item)"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-arrow-right-from-bracket" />
        </div>
        {{ $t('org.events.leave') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 bg-[#961D1D26] p-1 hover:bg-white/5"
        data-cy="calendar-remove-popup-button"
        @click="onDelete(item)"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-trash" />
        </div>
        {{ $t('base.member.invite.remove') }}
      </div>
    </div>
  </BasePopup>
</template>

<script>
export default {
  props: {
    item: Object,
    dataCy: {
      type: String,
      default: '',
    },
    query: {
      type: String,
      default: '',
    },
  },
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: ['.el-popper'],
      },
    );
    const hubCalendarStore = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    const authStore = useAuthStore();
    return { hubCalendarStore, open, buttonRef, hubSidebar, authStore };
  },
  computed: {
    selectedIds() {
      return this.hubCalendarStore.selectedCalendars.map((r) => r.id);
    },
    calendar() {
      return this.hubSidebar.calendar;
    },
    calendarList() {
      return this.hubCalendarStore.calendarList;
    },
    isOwner() {
      return this.item?.owner?.id === this.authStore.user.id;
    },
    name() {
      if (this.query) {
        return highlightKeywords(this.item.name || '', [this.query]);
      } else {
        return this.item.name;
      }
    },
    calendarId() {
      return this.$route.query.calendarId;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const queryKeysCount = Object.keys(this.$route.query).length;
      if (queryKeysCount === 1 && this.calendarId) {
        const item = this.calendarList.find((r) => r.id === this.calendarId);
        this.onEdit(item);
      }
    },
    async onChange(item) {
      if (!this.selectedIds.includes(item.id)) {
        this.hubCalendarStore.selectedCalendars.push(item);
        await this.hubCalendarStore.selectedCalendar(
          { calendarIds: [item.id] },
          [item.color],
        );
      } else {
        this.hubCalendarStore.selectedCalendars =
          this.hubCalendarStore.selectedCalendars.filter(
            (calendar) => calendar.id !== item.id,
          );
        await this.hubCalendarStore.deleteSelectedCalendar({
          calendarIds: [item.id],
        });
      }
    },
    async onEdit(item) {
      if (!this.selectedIds.includes(item.id)) {
        this.onChange(item);
      }
      this.hubSidebar.state = false;
      this.calendar.state = false;
      await this.$nextTick();
      this.hubSidebar.state = true;
      this.calendar.state = true;
      this.calendar.data = item;
      // this.calendar.data.id = item.id;
      this.hubCalendarStore.dateTypeIndex = 1;
      this.open = false;
    },
    onLeave(item) {
      this.hubCalendarStore.leaveCalendar({ calendarId: item.id });
      this.hubCalendarStore.calendarList =
        this.hubCalendarStore.calendarList.filter((r) => r.id !== item.id);
      this.open = false;
    },
    async onDelete(item) {
      // this.hubCalendarStore.deleteCalendar({ id: item.id });
      this.open = false;
      this.hubCalendarStore.delete.state = true;
      this.hubCalendarStore.delete.data = item;
    },
  },
};
</script>
