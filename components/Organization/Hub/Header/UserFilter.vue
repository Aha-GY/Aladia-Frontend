<template>
  <div class="flex flex-col gap-6 px-3 py-2">
    <div class="flex items-center justify-between">
      <div class="text-base font-medium text-[#D9D9D9]/80">
        {{ $t('base.users.label') }}
      </div>
      <BaseInput
        v-model="name"
        fixed
        search
        clear
        class="!w-80"
        :placeholder="$t('flux.search.user')"
      />
    </div>
    <div
      v-infinite-scroll="load"
      class="flex h-64 flex-col gap-2 overflow-y-auto"
      :infinite-scroll-disabled="loading || isEnd"
      :infinite-scroll-distance="10"
    >
      <div
        v-for="item in members"
        :key="item.id"
        class="flex items-center gap-2 rounded-md p-2 hover:bg-white/5"
      >
        <BaseCheckboxStyle
          :state="actions.includes(item.id) ? 'checked' : 'unchecked'"
          data-cy="706e2864a2262a40"
          @click="onClick(item.id)"
        />
        <div class="h-7 w-7 rounded-full">
          <img
            :src="item.profilePicture"
            class="h-full w-full rounded-full"
            alt=""
          />
        </div>
        <div class="w-0 flex-1 truncate text-xs text-[#D9D9D9]/80">
          {{ item.nameSurname }}
        </div>
      </div>
      <BaseSkeleton v-show="loading" height="2.5rem" />
    </div>

    <div class="flex items-center justify-end gap-3">
      <BaseButton
        type="secondary"
        class="px-4"
        label="$t:base.upload.cancel"
        data-cy="27efb27b2a57b163"
        @click="$emit('close')"
      />
      <BaseButton
        icon="fa-solid fa-circle-check"
        class="px-4"
        label="$t:base.upload.apply"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      members: [],
      pageNumber: 1,
      loading: false,
      isEnd: false,
      timer: null,
      actions: [],
    };
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.isEnd = false;
      this.pageNumber = 1;
      this.members = [];
      this.load();
    },
    async load() {
      //
    },
    onClick(id) {
      if (this.actions.includes(id)) {
        this.actions = this.actions.filter((item) => item !== id);
      } else {
        this.actions.push(id);
      }
    },
  },
};
</script>
