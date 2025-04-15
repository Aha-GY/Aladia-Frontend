<template>
  <div
    ref="itemHeader"
    class="relative flex bg-black px-5 py-4"
    data-cy="e08b01c84df1e1a5"
    @click="handleUserClick"
  >
    <BaseAvatarNext
      :show-online="false"
      size="sm"
      data-action="toProfile"
      :picture="item?.owner?.picture"
      class="size-6 cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
    />
    <div class="ml-2 flex flex-col justify-around">
      <div class="flex items-center text-sm font-semibold">
        <span
          data-action="toProfile"
          class="cursor-pointer underline-offset-2 transition-all hover:underline"
        >
          {{
            authStore?.user?.id === item?.owner?.id
              ? 'You'
              : `${item?.owner?.name}`
          }}
        </span>
        <el-popover
          trigger="click"
          :show-arrow="false"
          placement="bottom-start"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
          }"
          @show="socialStore.optionId = item.id"
          @hide="socialStore.optionId = null"
        >
          <template #reference>
            <div
              class="group relative z-10 ml-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-[#565656] bg-[#0B0B0B] transition-all hover:border-2 hover:border-[#f1f1f1] active:scale-95"
              :class="
                socialStore.optionId === item.id
                  ? 'border-2 border-[#f1f1f1]'
                  : 'border-[#565656]'
              "
            >
              <img
                v-if="socialStore.optionId === item.id"
                src="~/assets/social/option-close.svg"
                class="h-2.5 w-2.5 transition-all duration-300 group-hover:rotate-90"
                alt=""
              />
              <i v-else class="fa-solid fa-ellipsis z-10 h-3" />
            </div>
          </template>
          <SocialItemOption :item="item" />
        </el-popover>
      </div>
      <div
        class="flex cursor-pointer items-center text-xs text-[#565656]"
        data-action="toProfile"
      >
        {{ formatDate(item?.createdAt, 'DD MMM YYYY') }}
        <!-- <SocialItemPeople
          class="ml-2"
          :data="[1, 2, 3, 4]"
          v-if="item.type && item.type  !==0"
        /> -->
        <slot name="reply" />
      </div>
    </div>

    <slot />

    <div class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { socialStore, authStore, profileStore };
  },
  data() {
    return {
      optionShow: false,
    };
  },
  methods: {
    show(value) {
      console.log(value);
    },
    handleUserClick(event) {
      const parent = this.$refs.itemHeader;
      let target = event.target;

      // Traverse up the DOM tree to find the closest element with data-action attribute
      while (target && target !== parent && !target.dataset.action) {
        target = target.parentElement;
      }

      if (target && target.dataset.action === 'toProfile') {
        this.profileStore.gotoProfilePage(this.item.owner);
      }
    },
  },
};
</script>
