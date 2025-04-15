<template>
  <div
    class="flex items-center gap-4 bg-[#060606]"
    :class="open ? 'sticky top-0 z-20 -my-4 py-4' : ''"
  >
    <div class="flex w-5 justify-center">
      <i class="fa-light ml-0.5 text-base text-white/20" :class="icon" />
    </div>
    <div
      ref="buttonRef"
      class="group/input relative flex flex-1 items-center justify-between font-light"
    >
      <div
        class="flex h-6 cursor-pointer items-center gap-1.5 rounded-5 bg-white/5 px-1.5 text-xs text-[#FAFAFA] hover:bg-white/10"
        data-cy="8efe95074d10bab9"
        @click="total && (open = !open)"
      >
        {{ total }}
        <span class="capitalize">{{ $t(name) }}</span>
        <i
          v-if="total"
          class="fa-light fa-chevron-down transition-all"
          :class="open ? 'rotate-180' : ''"
        />
      </div>
      <BaseMemberPreview
        :open="add"
        :members="members"
        :total="total"
        :add="false"
        :remove="false"
        width="1.5rem"
        gap="0.5rem"
        @open="add = true"
        @remove="onRemoveClick"
      />
      <!-- <BaseLine :active="open" /> -->
    </div>
  </div>
  <!-- <div
    class="pointer-events-none absolute left-0 top-[3.25rem] h-[calc(100%-3.25rem)] w-full overflow-hidden transition-all duration-300"
    :class="add ? 'z-40' : '-z-10'"
  >
    <Transition
      :name="add ? 'slide-fade-left' : 'slide-fade-right'"
      mode="out-in"
    >
      <div
        v-if="add"
        class="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-b-5 bg-[#060606] px-2"
      >
        <div class="flex items-center gap-1 pb-2 pt-3">
          <div
            class="flex size-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            @click="add = false"
          >
            <i class="fa-light fa-arrow-left text-base text-[#FAFAFA]" />
          </div>
          <div class="text-sm">Invite</div>
        </div>
        <div class="h-0 flex-1 py-2">
          <BaseMember
            type="course"
            :params="params"
            :actives="actives"
            @close="add = false"
            @on-change="onChange"
          />
        </div>
      </div>
    </Transition>
  </div> -->
  <!-- <el-popover
    popper-class="!inset-auto"
    :visible="open"
    :virtual-ref="buttonRef"
    :show-arrow="false"
    :width="$device.isMobile ? 346 : 420"
    virtual-triggering
    :persistent="false"
    :teleported="false"
    placement="top-end"
    @close="open = false"
  >
    <div ref="popupRef" class="h-96 p-2">
      <BaseMember
        v-if="!isCalendar"
        type="course"
        :params="params"
        :actives="actives"
        @close="open = false"
        @on-change="onChange"
      />
      <BaseMemberInviteList
        v-else
        :params="listParams"
        :type="event.id && event.calendarId ? 'event' : ''"
        :is-add="false"
        :is-remove="false"
        @close="open = false"
      />
    </div>
  </el-popover> -->
  <BaseMemberInviteList
    v-if="open && total"
    :params="listParams"
    :type="event.id && event.calendarId ? 'event' : ''"
    :is-footer="false"
    :is-add="false"
    :is-remove="false"
    @close="open = false"
  />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  setup() {
    const open = ref(false);
    const add = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);
    const hubEvent = useHubEventStore();

    // onClickOutside(
    //   buttonRef,
    //   () => {
    //     open.value = false;
    //   },
    //   {
    //     ignore: [popupRef],
    //   },
    // );

    return { hubEvent, open, add, buttonRef, popupRef };
  },
  data() {
    return {
      params: {
        roles: `course-${this.type}`,
      },
    };
  },
  computed: {
    isCalendar() {
      // return this.$route.name.endsWith('hub-name-calendar');
      return !this.lecture.id; // 没有讲座信息说明不在空间讲座里面
    },
    // course() {
    //   return this.hubEvent.detail;
    // },
    icon() {
      return {
        observer: 'fa-user-lock',
        teacher: 'fa-user-gear',
        attendant: 'fa-user',
      }[this.type];
    },
    name() {
      return {
        observer: 'meet.roles.host',
        teacher: 'meet.roles.coHost',
        attendant: 'meet.roles.guest',
      }[this.type];
    },
    event() {
      return this.hubEvent.event;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    target() {
      return this.isCalendar ? this.event : this.lecture;
    },
    members() {
      return this.event[`${this.type}s`] || [];
    },
    total() {
      const types = {
        observer: this.event.courseObserverNumber || 0,
        teacher: this.event.courseTeacherNumber || 0,
        attendant: this.event.courseAttendantNumber || 0,
      };
      return Math.max(0, types[this.type]);
      // return this.isCalendar ? types[this.type] : this.members.length;
    },
    actives() {
      return this.members.map((item) => item.id);
    },
    listParams() {
      return this.event.id && this.event.calendarId
        ? {
            roles: `course-${this.type}`,
            calendarId: this.event.calendarId,
            eventId: this.event.id,
          }
        : {};
    },
  },
  methods: {
    onRemoveClick(member) {
      if (this.isCalendar) {
        return;
      }
      this.onChange(false, member);
    },
    onChange(state, member) {
      if (state) {
        this.members.push(member);
      } else {
        const index = this.members.findIndex((item) => item.id === member.id);
        this.members.splice(index, 1);
      }
    },
  },
};
</script>
