<template>
  <div
    class="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-5 border border-white/10 bg-[#060606] text-[#D9D9D9]"
  >
    <div class="flex h-14 items-center gap-2 bg-[#0C0C0C] pl-5 pr-3">
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-sitemap text-[#FAFAFA]" />
      </div>
      <span class="w-0 flex-1 text-base">
        {{ $t('admin.role.title') }}
      </span>
      <BaseIconClose @click="hubSidebar.invite.infoState = false" />
    </div>
    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-2"
    >
      <div
        v-for="item in dataList"
        :key="item.id"
        class="flex flex-col gap-1 rounded-5 border border-white/5 bg-[#0C0C0C] p-4"
      >
        <div class="-mx-1.5 flex h-6 items-center gap-2 text-sm">
          <div class="flex h-6 w-6 items-center justify-center">
            <i :class="item.icon" />
          </div>
          <span>{{ item.name }}</span>
        </div>

        <div class="flex flex-col gap-4">
          <div v-for="(sup, n) in item.list" :key="n" class="text-xs">
            <div class="font-medium">{{ sup.title }}</div>
            <div class="font-light">{{ sup.description }}</div>
            <div v-if="sup.description2" class="font-light">
              {{ sup.description2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  data() {
    return {
      dataList: [
        {
          id: 1,
          icon: 'fa-regular fa-building',
          name: this.$t('admin.role.org.title'),
          list: [
            {
              title: this.$t('admin.role.org.admin.title'),
              description: this.$t('admin.role.org.admin.description'),
            },
            {
              title: this.$t('admin.role.org.member.title'),
              description: this.$t('admin.role.org.member.description'),
            },
          ],
        },
        {
          id: 2,
          icon: 'fa-regular fa-solar-system',
          name: this.$t('admin.role.space.title'),
          list: [
            {
              title: this.$t('admin.role.space.supervisor.title'),
              description: this.$t('admin.role.space.supervisor.description'),
            },
            {
              title: this.$t('admin.role.space.coordinator.title'),
              description: this.$t('admin.role.space.coordinator.description'),
              description2: this.$t(
                'admin.role.space.coordinator.description2',
              ),
            },
            {
              title: this.$t('admin.role.space.member.title'),
              description: this.$t('admin.role.space.member.description'),
            },
          ],
        },
        {
          id: 3,
          icon: 'fa-regular fa-books',
          name: this.$t('admin.role.course.title'),
          list: [
            {
              title: this.$t('admin.role.course.observer.title'),
              description: this.$t('admin.role.course.observer.description'),
            },
            {
              title: this.$t('admin.role.course.teacher.title'),
              description: this.$t('admin.role.course.teacher.description'),
            },
            {
              title: this.$t('admin.role.course.attendant.title'),
              description: this.$t('admin.role.course.attendant.description'),
            },
            {
              title: this.$t('admin.role.course.owner.title'),
              description: this.$t('admin.role.course.owner.description'),
            },
          ],
        },
        {
          id: 4,
          icon: 'fa-regular fa-calendar',
          name: this.$t('admin.role.calendar.title'),
          list: [
            {
              title: this.$t('admin.role.calendar.participant.title'),
              description: this.$t(
                'admin.role.calendar.participant.description',
              ),
              description2: this.$t(
                'admin.role.calendar.participant.description2',
              ),
            },
            {
              title: this.$t('admin.role.calendar.scheduler.title'),
              description: this.$t('admin.role.calendar.scheduler.description'),
              description2: this.$t(
                'admin.role.calendar.scheduler.description2',
              ),
            },
            {
              title: this.$t('admin.role.calendar.organizer.title'),
              description: this.$t('admin.role.calendar.organizer.description'),
              description2: this.$t(
                'admin.role.calendar.organizer.description2',
              ),
            },
          ],
        },
        {
          id: 5,
          icon: 'fa-solid fa-bullseye',
          name: this.$t('admin.role.event.title'),
          list: [
            {
              title: this.$t('admin.role.event.guest.title'),
              description: this.$t('admin.role.event.guest.description'),
            },
            {
              title: this.$t('admin.role.event.host.title'),
              description: this.$t('admin.role.event.host.description'),
            },
            {
              title: this.$t('admin.role.event.host.title'),
              description: this.$t('admin.role.event.host.description'),
            },
          ],
        },
      ],
    };
  },
};
</script>
