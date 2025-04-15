<template>
  <div class="flex h-full flex-col overflow-hidden bg-[#060606] bg-opacity-60">
    <div class="flex justify-between px-4 pb-3 pt-4 text-center text-white">
      <div>
        <span>{{ $t('flux.story.reactions') }}</span>
        <span v-if="allCount" class="ml-2">{{ allCount }}</span>
      </div>
      <BaseIconClose
        class="!size-6 !text-[#fafafa] hover:!bg-transparent"
        data-cy="bcaa1e5ec656ffb"
        @click="handleClose"
      />
    </div>

    <div class="flex items-center py-3">
      <div
        class="hide-scrollbar relative flex items-center justify-between overflow-y-auto"
      >
        <div class="flex items-center justify-between px-4 text-xs">
          <div
            class="mr-2 flex cursor-pointer items-center justify-center gap-[0.25rem] rounded-5 p-1 text-[#707070] transition-all hover:bg-white/5 active:scale-95 2xl:gap-2 2xl:p-2"
            :class="currReaction === 'all' ? 'bg-[#e2e2e2]/[0.03]' : ''"
            data-cy="3d0fa217cd87988e"
            @click="currReaction = 'all'"
          >
            <i class="fa-solid fa-eye text-base text-white" />
            <span v-if="allCount">{{ allCount }}</span>
          </div>
          <div
            v-for="react in reactions"
            :key="react.reaction"
            class="mr-2 flex cursor-pointer items-center justify-center gap-[0.25rem] rounded-5 p-1 text-[#707070] transition-all hover:bg-white/5 active:scale-95 2xl:gap-2 2xl:p-2"
            :class="
              currReaction === react.reaction ? 'bg-[#e2e2e2]/[0.03]' : ''
            "
            data-cy="69005fd05b061de1"
            @click="currReaction = react.reaction"
          >
            <BaseReactionItem
              class="size-4 shrink-0"
              :name="react.reaction"
              :is-image="true"
              :size="4"
            />
            {{ react.count }}
          </div>
        </div>
      </div>
    </div>

    <SocialReactionList
      class="flex-1"
      :item-id="item.id"
      :item="item"
      :curr-reaction="currReaction"
      :type="type"
      @total="allCount = $event"
      @user-click="(user) => $emit('user-click', user)"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allCount: 0,
      tabIndex: 'all',
      currReaction: 'all',
    };
  },
  computed: {
    reactions() {
      if (!this.item?.numberOf?.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.numberOf.reactions) {
        const count = this.item.numberOf.reactions[key];
        reactions.push({
          reaction: key,
          count: this.reactCountFormat(count),
        });
      }
      return reactions;
    },
  },
  methods: {
    reactCountFormat(val) {
      const number = ~~val;
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
    handleClose() {
      this.$emit('close', false);
    },
  },
  onMounted() {
    if (this.open) {
      this.$emit('open', true);
    }
  },
};
</script>
