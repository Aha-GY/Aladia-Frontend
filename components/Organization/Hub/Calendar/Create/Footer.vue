<template>
  <div
    class="flex items-center rounded-b-5 bg-[#0c0c0c] p-3"
    :class="event.id ? 'justify-between' : 'justify-end'"
  >
    <el-popover
      v-if="event.id"
      :visible="open"
      trigger="click"
      width="200"
      :show-arrow="false"
    >
      <template #reference>
        <div
          class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
          data-cy="delete-event-confirm"
          @click="deleteConfirm"
        >
          <i
            v-if="deleting"
            class="fa-light fa-loader animate-spin text-base"
          />
          <i v-else class="fa-light fa-trash-can" />
          {{ $t('base.editor.delete') }}
        </div>
      </template>
      <div
        data-cy="calendar-event-footer-box-delete-confirm"
        class="flex flex-col gap-1 p-2"
      >
        <BaseCheckboxList
          v-for="item in deleteList"
          :key="item.type"
          :name="item.name"
          :data-cy="`${item.type}-delete-list`"
          :active="active === item.type"
          @change="active = item.type"
        />
        <div class="mt-2 flex items-center justify-end gap-2">
          <BaseButton
            label="$t:base.upload.cancel"
            type="secondary"
            data-cy="ea9f94fe9b61ca49"
            @click="open = false"
          />
          <BaseButton
            label="$t:base.upload.ok"
            data-cy="confirm-delete-event-button"
            @click="onDelect"
          />
        </div>
      </div>
    </el-popover>

    <el-popover
      :visible="saveOpen"
      trigger="click"
      width="200"
      :show-arrow="false"
    >
      <template #reference>
        <div
          class="flex items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 active:scale-95"
          :class="
            isSubmit
              ? 'cursor-pointer hover:bg-[#181818] hover:text-white'
              : 'cursor-not-allowed'
          "
          data-cy="calendar-event-save-confirm-button"
          @click="saveConfirm"
        >
          <i v-if="loading" class="fa-light fa-loader animate-spin text-base" />
          <i v-else class="fa-light fa-save text-base" />
          {{ $t('base.upload.save') }}
        </div>
      </template>
      <div
        data-cy="calendar-event-footer-box-save-confirm"
        class="flex flex-col gap-1 p-2"
      >
        <BaseCheckboxList
          v-for="item in deleteList"
          :key="item.type"
          :name="item.name"
          :data-cy="`${item.type}-delete-list`"
          :active="updateEventTarget === item.type"
          @change="event.updateEventTarget = item.type"
        />
        <div class="mt-2 flex items-center justify-end gap-2">
          <BaseButton
            label="$t:base.upload.cancel"
            type="secondary"
            data-cy="afec149212e9e9de"
            @click="saveOpen = false"
          />
          <BaseButton
            label="$t:base.upload.ok"
            data-cy="calendar-event-onSave-button"
            @click="onSave"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const hubEventStore = useHubEventStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubEventStore, hubCalendarStore };
  },
  data() {
    return {
      loading: false,
      deleting: false,
      open: false,
      deleteList: [
        {
          type: 'this',
          name: 'org.hub.analytics.event.this',
        },
        {
          type: 'cascade',
          name: 'org.hub.analytics.event.following',
        },
        {
          type: 'all',
          name: 'org.hub.analytics.event.all',
        },
      ],
      active: 'this',
      saveOpen: false,
    };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    dates() {
      return this.event.dates;
    },
    isRepeat() {
      return this.event.isRepeat;
    },
    isShared() {
      return this.event.isShared;
    },
    frequency() {
      return this.event.frequency;
    },
    updateEventTarget() {
      return this.event.updateEventTarget;
    },
    isPast() {
      const diff = dayjs(new Date(this.dates.endDate)).diff(
        dayjs(new Date(this.dates.startDate)),
        'minute',
      );
      const endDate =
        diff % 1440 === 0
          ? dayjs(new Date(this.event.dates?.endDate)).endOf('day')
          : dayjs(new Date(this.event.dates?.endDate));
      return this.event.id && dayjs().isAfter(endDate);
    },
    isSubmit() {
      return (
        !!this.event.name &&
        !this.hubEventStore.meetLoading &&
        !this.isPast &&
        this.event.calendarId
      );
    },
  },
  methods: {
    deleteConfirm() {
      if (this.isRepeat) {
        this.active = 'this';
        this.open = true;
      } else {
        this.onDelect();
      }
    },
    async onDelect() {
      if (this.deleting) {
        return;
      }
      this.deleting = true;
      try {
        await this.hubCalendarStore.deleteEvent({
          id: this.event.id,
          calendarId: this.event.calendarId,
          deleteTarget: this.active,
        });
        this.deleting = false;
        this.hubCalendarStore.createOpen = false;
      } catch (error) {
        this.deleting = false;
        this.$toast.error(error.message);
      }
    },
    saveConfirm() {
      if (!this.event.name) {
        return this.$toast.error('Please enter a title');
      }

      if (this.isPast) {
        return this.$toast.error('Please do not update to a past time');
      }

      if (!this.event.calendarId) {
        return this.$toast.error('Please select at least one calendar');
      }

      if (this.isRepeat) {
        this.event.updateEventTarget = 'this';
        this.saveOpen = true;
      } else {
        this.onSave();
      }
    },
    async onSave() {
      if (!this.isSubmit) {
        return;
      }

      if (
        this.frequency.type !== 'does-not-repeat' &&
        !this.frequency.endDate
      ) {
        this.$toast.error('Please Set End Date');
        return;
      }
      if (this.frequency.type === 'custom' && !this.frequency.counter) {
        this.$toast.error('Please Set Repeat Every');
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.isShared) {
        this.hubCalendarStore.shareOpen = true;
        this.loading = false;
        return;
      }
      const data = this.hubEventStore.getEvent(this.event);

      if (data.id) {
        try {
          // if (this.updateEventTarget !== 'this') {
          //   delete data.dates;
          // }
          await this.hubCalendarStore.updateEvent(
            {
              ...data,
            },
            true,
            !this.isRepeat,
          );
          this.hubCalendarStore.createOpen = false;
          this.loading = false;
        } catch (e) {
          console.log(e);
          this.loading = false;
        }
      } else {
        try {
          delete data.updateEventTarget;
          delete data.calendarsUpdateStrategy;
          await this.hubCalendarStore.createEvent(data, this.event.color);
          this.hubCalendarStore.createOpen = false;
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
    },
  },
};
</script>
