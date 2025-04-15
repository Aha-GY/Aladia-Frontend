<template>
  <div
    class="relative flex flex-col overflow-hidden rounded bg-black/50 px-4 text-13 transition-all duration-300"
    :class="expand ? 'mb-6 max-h-[1024rem] py-2' : 'mb-0 max-h-0 py-0'"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <BaseCalendar
          v-if="dates.length"
          :dates="dates"
          shortcut="Month to date"
          @change="onDatesChange"
        />
        <div class="rounded bg-white/5 px-2 py-0.5 uppercase">
          {{ spaceId ? space?.name : $t('space.all') }}
        </div>
      </div>
      <div v-if="date" class="flex items-center gap-2">
        <div class="text-white/60">
          {{ $t('space.price.next.billing.date') }}
        </div>
        <div>{{ formatDate(date, 'DD MMM YYYY') }}</div>
      </div>
    </div>
    <div class="relative flex w-full items-end gap-4">
      <div
        class="flex flex-1 flex-col gap-2 transition-all duration-300"
        :class="expand ? 'pt-0' : 'pt-1'"
      >
        <div
          class="w-full flex-1 transition-all duration-300"
          :class="expand ? 'opacity-100' : 'opacity-0'"
        >
          <OrganizationHubSpaceOverviewChart />
        </div>
      </div>
      <div
        class="flex w-full shrink-0 flex-col items-center gap-4 md:w-auto md:flex-row"
      >
        <OrganizationHubSpaceOverviewItem
          title="space.item.storage"
          icon="fa-hard-drive"
          :value="`${moneyFormat(storage.total)} Gb`"
          :increase="storage.increase"
          color="#39816d"
          :percentage="billings.storage?.freeTierPercentage || 0"
          :tip="`Consumed <span class='text-[#39816d] font-semibold'>${(billings.storage?.freeTierPercentage || 0).toFixed(2)}%</span> of ${billings.storage?.freeUsageLimit || 0} free Gb`"
          :price="`${moneyFormat(billings.storage?.unitPrice || 0, 3)} / Gb`"
          :amount="`${moneyFormat(billings.storage?.amount || 0, 3)}`"
          :date="billings.storage?.billingDate"
          :currency="billings.storage?.currency"
        />
        <div class="h-[1px] w-full bg-white/20 md:h-52 md:w-[1px]" />
        <OrganizationHubSpaceOverviewItem
          title="space.item.streaming"
          icon="fa-film"
          :value="`${moneyFormat(streaming.total)} Min`"
          :increase="streaming.increase"
          color="#6f147e"
          :percentage="billings.streaming?.freeTierPercentage || 0"
          :tip="`Consumed <span class='text-[#6f147e] font-semibold'>${(billings.streaming?.freeTierPercentage || 0).toFixed(2)}%</span> of ${billings.streaming?.freeUsageLimit || 0} free Min`"
          :price="`${moneyFormat(billings.streaming?.unitPrice || 0, 3)} / Min`"
          :amount="`${moneyFormat(billings.streaming?.amount || 0, 3)}`"
          :date="billings.streaming?.billingDate"
          :currency="billings.streaming?.currency"
        />
        <div class="h-[1px] w-full bg-white/20 md:h-52 md:w-[1px]" />
        <OrganizationHubSpaceOverviewItem
          title="space.item.ai"
          icon="fa-robot"
          :value="`${moneyFormat(ai.total, 0)} Token`"
          :increase="ai.increase"
          color="#eacb5b"
          :percentage="billings.tokens?.freeTierPercentage || 0"
          :tip="`Consumed <span class='text-[#eacb5b] font-semibold'>${(billings.tokens?.freeTierPercentage || 0).toFixed(2)}%</span> of ${billings.tokens?.freeUsageLimit || 0} free Token`"
          :price="`${moneyFormat(billings.tokens?.unitPrice || 0, 3)} / Token`"
          :amount="`${moneyFormat(billings.tokens?.amount || 0, 3)}`"
          :date="billings.tokens?.billingDate"
          :currency="billings.tokens?.currency"
        />
      </div>
    </div>
    <div
      v-if="showLock"
      class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <i class="fa-regular fa-lock text-5xl text-white/50" />
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const profileStore = useProfileStore();
    return { hubSpaces, authStore, profileStore };
  },
  data() {
    return {
      loading: false,
      dates: [],
    };
  },
  computed: {
    expand() {
      return this.hubSpaces.statistics.expand;
    },
    view() {
      return this.$route.query.view || 'grid';
    },
    spaceId() {
      return this.view === 'grid' ? this.$route.query.space : undefined;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    storage() {
      return this.hubSpaces.statistics.storage;
    },
    streaming() {
      return this.hubSpaces.statistics.streaming;
    },
    ai() {
      return this.hubSpaces.statistics.ai;
    },
    date() {
      return this.billings.storage?.billingDate;
    },
    billings() {
      const result = {};
      const billings = this.hubSpaces.statistics.billings;
      for (let index = 0; index < billings.length; index++) {
        const billing = billings[index];
        result[billing.type] = billing;
      }
      return result;
    },
    showLock() {
      if (this.authStore.isOrg) {
        return (
          this.profileStore.myOrgProfileDetail.stripeConnectOnboard !==
          'completed'
        );
      }
      return !this.authStore.finishedTeacherSignup;
    },
  },
  watch: {
    spaceId() {
      this.load();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 默认当前月1号开始
      const defaultStart = dayjs().startOf('month').toDate();
      const defaultEnd = dayjs().toDate();
      this.hubSpaces.statistics.startDate = getZeroTimeZone(defaultStart);
      this.hubSpaces.statistics.endDate = getZeroTimeZone(defaultEnd);
      this.dates = [defaultStart, defaultEnd];
      this.load();
    },
    onDatesChange({ days }) {
      const currentTime = dayjs().format('HH:mm');
      const startDate = dayjs(`${days[0]} ${currentTime}`);
      const endDate = dayjs(`${days[1]} ${currentTime}`);
      this.hubSpaces.statistics.startDate = startDate.toISOString();
      this.hubSpaces.statistics.endDate = endDate.toISOString();
      this.load();
    },
    async load() {
      if (this.loading) {
        return;
      }
      if (this.showLock) {
        return;
      }
      this.loading = true;
      await this.hubSpaces.getSpaceOverview({
        spaceId: this.spaceId || undefined,
      });
      this.loading = false;
    },
  },
};
</script>
