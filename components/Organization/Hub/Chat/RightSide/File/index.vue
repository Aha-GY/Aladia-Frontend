<template>
  <div class="relative flex h-full flex-col">
    <OrganizationHubChatRightSideMediaHeader
      type="file"
      @select="onSelect"
      @select-all="onSelectAll"
      @filter-member="openFilterMember"
      @filter-type="onFilterType"
      @filter-date="onFilterDate"
    />
    <OrganizationHubChatRightSideMediaFrom
      v-if="owner"
      :members="filterMembers"
      @remove="onRemove"
    />
    <div
      v-if="dataList.length || loading"
      v-infinite-scroll="load"
      class="hide-scrollbar relative flex-1 overflow-y-auto overscroll-contain px-2 text-white/80"
      :infinite-scroll-disabled="loading || !next"
    >
      <div v-for="key in Object.keys(groupDataList)" :key="key">
        <div class="px-3 py-2 text-xs">{{ key }}</div>
        <div class="flex flex-col gap-1 px-2">
          <OrganizationHubChatRightSideFileItem
            v-for="item in groupDataList[key]"
            :key="item.id"
            :item="item"
            :right-id="rightId"
            :is-select="isSelect"
            :on-preview="onPreview"
            :on-check="onCheck"
            :on-right="onRight"
            :checked-ids="checkedIds"
            :on-select="onSelect"
            :on-delete="onReadyDelete"
            :on-cancel="onCancelCheck"
            :on-forward="onForward"
            @locate-message="$emit('locate-message', $event)"
          />
        </div>
      </div>

      <div v-show="loading" class="flex flex-col gap-1 px-2 py-1">
        <BaseSkeleton
          v-for="i in 6"
          :key="i"
          class="rounded-5"
          height="3rem"
          :length="1"
        />
      </div>
    </div>
    <div v-else class="flex flex-1 items-center">
      <BaseNoData />
    </div>
    <OrganizationHubChatRightSideMediaFloat
      :on-cancel="onCancelCheck"
      :checked-ids="checkedIds"
      :on-delete="onReadyDelete"
      :on-forward="onForward"
    />
    <OrganizationHubChatRightSideMediaDelete
      :show-delete="showDelete"
      :on-delete="onDelete"
      :on-cancel="() => (showDelete = false)"
    />
    <OrganizationHubChatRightSideMediaFilterMember
      :show="showFilterMember"
      @cancel="onCancelFilter"
      @filter="onFilterMember"
    />
  </div>
</template>
<script>
export default {
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      dataList: [],
      loading: false,
      timer: null,
      next: null,
      isSelect: false,
      checkedIds: [],
      deleteLoading: false,
      rightId: '',
      showFilterMember: false,
      owner: null,
      filterMembers: [],
      filterTypes: [],
      showDelete: false,
      readyDeleteId: null,
    };
  },
  computed: {
    groupDataList() {
      return this.dataList.reduce((acc, item) => {
        const date = isToday(item.createdAt)
          ? this.$t('nav.header.update.today')
          : isYesterday(item.createdAt)
            ? this.$t('nav.header.update.yesterday')
            : formatDate(item.createdAt, 'DD MMMM');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.searchRoomFiles({
        roomId: this.hubChatStore.roomId,
        next: this.next,
        limit: 40,
        query: this.name,
        owner: this.owner,
        types: this.filterTypes?.length ? this.filterTypes.join(',') : null,
        date: this.date,
      });
      this.dataList = [...this.dataList, ...data];
      this.next = next;
      this.loading = false;
    },
    search() {
      this.dataList = [];
      this.next = null;
      this.load();
    },
    onPreview(id) {
      this.hubChatStore.previewId = id;
      this.hubChatStore.previewData = this.dataList;
      this.hubChatStore.isPreview = true;
    },
    onSelect(id) {
      this.isSelect = !this.isSelect;
      if (id) {
        this.isSelect = true;
        this.checkedIds = [id];
      } else {
        this.checkedIds = [];
      }
      this.showFilterMember = false;
    },
    onSelectAll() {
      const allIds = this.dataList.map((item) => item.id);
      if (!this.isSelect) {
        this.checkedIds = [];
        this.isSelect = true;
      } else if (this.isSelect && allIds.length > this.checkedIds.length) {
        this.isSelect = true;
        this.checkedIds = allIds;
      } else {
        this.checkedIds = [];
        this.isSelect = false;
      }
      this.showFilterMember = false;
    },
    onCheck(id) {
      this.checkedIds.includes(id)
        ? this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
        : this.checkedIds.push(id);
    },
    onCancelCheck() {
      this.isSelect = false;
      this.checkedIds = [];
      this.readyDeleteId = null;
    },
    onReadyDelete(id) {
      if (id) {
        this.readyDeleteId = id;
      }
      this.showDelete = true;
    },
    async onDelete(deleteForAll) {
      this.deleteLoading = true;
      const ids = !this.readyDeleteId ? this.checkedIds : [this.readyDeleteId];
      await this.hubChatStore.deleteRoomAttachment({
        attachmentIds: ids,
        deleteForAll,
      });
      this.dataList = this.dataList.filter((item) => !ids.includes(item.id));
      this.checkedIds = [];
      this.readyDeleteId = null;
      this.showDelete = false;
      this.isSelect = false;
      this.deleteLoading = false;
    },
    onRight(id) {
      this.rightId = id;
    },
    openFilterMember() {
      this.showFilterMember = !this.showFilterMember;
      this.isSelect = false;
      this.checkedIds = [];
    },
    onFilterMember(members) {
      this.showFilterMember = false;
      this.owner = members[0].id;
      this.filterMembers = members;
      this.search();
    },
    onCancelFilter() {
      this.showFilterMember = false;
      this.owner = null;
      this.filterMembers = [];
    },
    onRemove(member) {
      this.filterMembers = this.filterMembers.filter((m) => m.id !== member.id);
      this.owner = this.filterMembers[0]?.id;
      this.search();
    },
    onFilterType(types) {
      this.isSelect = false;
      this.checkedIds = [];
      this.filterTypes = types;
      this.search();
    },
    onFilterDate(date) {
      this.isSelect = false;
      this.checkedIds = [];
      this.date = date;
      this.search();
    },
    onForward(id) {
      this.hubChatStore.showForward = true;
      let messages = [];
      if (id) {
        messages = this.dataList
          .filter((item) => item.id === id)
          .map((item) => ({ id: item.messageId }));
      } else {
        messages = this.dataList
          .filter((item) => this.checkedIds.includes(item.id))
          .map((item) => ({ id: item.messageId }));
      }
      this.hubChatStore.forwardData = {
        roomId: this.hubChatStore.roomId,
        messages,
      };
    },
  },
};
</script>
