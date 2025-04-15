<template>
  <div
    class="relative flex w-full flex-col"
    :class="{
      [height]: !usePopover || openSlider,
    }"
  >
    <div class="px-2">
      <BaseInput
        v-model="username"
        search
        clear
        fixed
        class="mb-3 text-sm"
        :placeholder="placeholder"
        @focus="openSlider = true"
        @enter="onEnter"
      />
      <BaseMemberInviteSelected :selecteds="selecteds" @remove="onRemove" />
    </div>
    <div
      :class="{
        'flex-1': !usePopover || openSlider,
        'h-0': usePopover && !openSlider,
      }"
      class="-mx-2 -mb-2 flex flex-col overflow-hidden transition-all duration-300"
    >
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar flex-1 overflow-y-auto px-2 pb-2"
      >
        <BaseMemberInviteItem
          v-for="member in suggestionMembers"
          :key="member.id"
          source="profile"
          :member="member"
          :params="params"
          :from="from"
          :selecteds="selecteds"
          :search-value="username"
          type="invite"
          @change="onChange"
        />
        <BaseSkeleton v-if="loading" :length="20" height="2.5rem" />
        <div v-if="!loading && suggestionMembers.length === 0">
          <BaseMemberInviteEmpty
            v-if="username.length"
            :is-email="isEmail && isEnter"
          />
          <BaseNoData v-else />
        </div>
      </div>
      <div
        class="flex shrink-0 items-center justify-between bg-white/5 px-4 py-2"
      >
        <BaseButton
          icon="fa-arrow-turn-left"
          label="$t:base.dialog.close"
          type="red-cancel"
          data-cy="e76032251c18e45f"
          @click="onClose"
        />
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 text-sm font-light text-white/50 transition-all duration-300 hover:text-white active:scale-95"
          data-cy="c11b17283bb5578e"
          @click="onSave"
        >
          <i
            v-if="inviteLoading"
            class="fa-solid fa-spinner animate-spin text-sm"
          />
          <i
            v-else
            class="fa-light text-sm"
            :class="isEnter ? 'fa-paper-plane-top' : 'fa-plus'"
          />
          {{
            submitText ||
            (isEnter
              ? $t('post.iam.members.invite')
              : $t('post.iam.members.insert'))
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { organizationsMembers } from '~/api/v2/org';

export default {
  props: {
    usePopover: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    submitText: {
      type: String,
      default: '',
    },
    clear: {
      type: Boolean,
      default: false,
    },
    actives: {
      type: Array,
      default: () => [],
    },
    exclude: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: 'h-full',
    },
    type: {
      type: String,
      default: 'global',
    },
    from: {
      type: String,
      default: '',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    isEnter: {
      type: Boolean,
      default: true,
    },
    onlyEnterEmail: {
      type: Boolean,
      default: false,
    },
    inviteLoading: {
      type: Boolean,
      default: false,
    },
    notSaveWhenRemoveUser: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    const hubPayment = useHubPaymentStore();
    return { globalStore, hubSpaces, hubCourse, fluxesStore, hubPayment };
  },
  data() {
    return {
      username: '',
      next: null,
      loading: false,
      timer: null,
      selecteds: [],
      originalSelecteds: [],
      openSlider: false,
      suggestionMembers: [],
    };
  },
  computed: {
    isEmail() {
      return checkMail(this.username.trim());
    },
  },
  watch: {
    actives: {
      handler() {
        this.originalSelecteds = [...this.actives];
        this.selecteds = [...this.actives];
      },
      immediate: true,
    },
    username: {
      handler() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.init();
        }, 500);
      },
      // immediate: true,
    },
    openSlider: {
      handler(open) {
        if (this.usePopover) {
          if (open) {
            this.init();
          } else {
            clearTimeout(this.timer);
            this.loading = false;
            this.next = null;
            this.suggestionMembers = [];
          }
        }
      },
    },
  },
  created() {
    if (!this.usePopover) {
      this.init();
      // this.placeholder = this.$t('base.member.invite.placeholder');
    }
  },
  methods: {
    async init() {
      this.next = null;
      this.suggestionMembers = [];
      this.load();
    },
    async load() {
      try {
        this.loading = true;
        const api = {
          global: this.globalStore.searchProfile,
          space: this.hubSpaces.searchPotentialMembers,
          group: organizationsMembers,
          paymentSupplier: this.hubPayment.paymentSuppliersSearch,
          paymentCustomer: this.hubPayment.paymentCustomersSearch,
        }[this.type];
        const {
          data,
          cursor: { next },
        } = await api({
          limit: 20,
          next: this.next || undefined,
          text: this.username || undefined,
          ...this.params,
        });
        this.next = next;
        const resData =
          this.type === 'group'
            ? data.map((item) => ({
                ...item.profile,
                email: item.email || item.profile?.email,
                story: item.story,
                fullName: item.profile?.id
                  ? `${item.profile?.firstName} ${item.profile?.lastName}`
                  : item.email,
              }))
            : data;
        this.suggestionMembers = [...this.suggestionMembers, ...resData].filter(
          (item) => !this.exclude.includes(item.id),
        );
      } finally {
        this.loading = false;
      }
    },
    onClose() {
      this.openSlider = false;
      this.selecteds = [...this.originalSelecteds];
      this.$emit('close', this.selecteds);
    },
    onSave() {
      this.openSlider = false;

      this.$emit(
        'save',
        this.selecteds.filter((r) => !r.isInput || (r.isInput && r.isEmail)),
      );
    },
    onChange(member) {
      member.invited = true;
      const index = this.selecteds.findIndex((s) => s.id === member.id);
      if (index !== -1) {
        this.selecteds = this.selecteds.filter((s) => s.id !== member.id);
      } else {
        this.selecteds = [...this.selecteds, member];
      }
    },
    onEnter() {
      if (!this.isEnter) {
        return;
      }
      if (this.onlyEnterEmail && !this.isEmail) {
        return;
      }
      const input = this.username.trim();
      if (!this.selecteds.find((s) => s.email === input)) {
        this.selecteds.push({
          id: input,
          isInput: true,
          isEmail: this.isEmail,
          email: input,
          invited: true,
        });
        this.username = '';
      }
    },
    onRemove(member) {
      this.selecteds.splice(
        this.selecteds.findIndex((m) => m.id === member.id),
        1,
      );
      if (!this.openSlider && !this.notSaveWhenRemoveUser) {
        this.onSave();
      }
    },
  },
};
</script>
