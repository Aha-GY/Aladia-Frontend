<template>
  <div class="relative cursor-pointer">
    <div v-if="showButton" class="mb-2 flex h-[2rem] w-full items-center gap-2">
      <span v-if="onlyView && showButton">
        {{ currIndex + 1 }}
      </span>
      <template v-else-if="showButton">
        <el-popover
          v-model:visible="showPosPopover"
          trigger="click"
          :show-arrow="false"
          placement="bottom-start"
          :popper-style="{
            width: 'fit-content',
            'min-width': '3rem !important',
          }"
        >
          <template #reference>
            <span class="cursor-pointer rounded-5 px-2 py-1 hover:bg-white/10">
              <i class="fa-solid fa-chevron-down" />
              <span class="ml-2 text-base font-medium">
                {{ currIndex + 1 }}
              </span>
            </span>
          </template>
          <FluxesCreationHighLightWigetsOrder
            :list-count="listCount"
            @select="handleSetPos"
          />
        </el-popover>
        <div
          class="cursor-pointer rounded-5 px-2 py-1 text-base hover:bg-white/10"
          data-cy="f906454be1af34f9"
          @click="$emit('duplicate', { item: card, index: currIndex })"
        >
          <i class="fa-regular fa-copy" />
        </div>
      </template>
    </div>
    <div
      class="group relative flex w-full flex-none items-center justify-center text-xl text-white/50"
    >
      <div
        v-if="!onlyView"
        class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-5 bg-black/20"
      >
        <div class="flex flex-col gap-4 text-center">
          <BaseButton
            type="secondary"
            class="!bg-[#060606]/86 z-[1] text-[#FFF] hover:!bg-[#060606]"
            label="$t:base.editor.edit"
            icon="fa-regular fa-pen-to-square"
            data-cy="14b250c624f08ddd"
            @click="$emit('edit', { item: card, index: currIndex })"
          />
          <BaseButton
            type="error"
            label="$t:base.editor.delete"
            icon="fa-trash"
            class="z-[1] text-[#FFF]"
            data-cy="3893ba66dc8d90b8"
            @click="handleDeleteCard"
          />
        </div>
      </div>

      <FluxesCreationHighLightWigetsNewCard :item="card" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
    currIndex: {
      type: Number,
      required: true,
    },
    listCount: {
      type: Number,
      required: true,
    },
    onlyView: {
      type: Boolean,
      default: false,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select', 'duplicate', 'edit'],
  setup() {
    const fluxesStore = useFluxesStore();

    return { fluxesStore };
  },
  data() {
    return {
      showPosPopover: false,
    };
  },
  methods: {
    handleDeleteCard() {
      this.fluxesStore.deleteStory.item = this.card;
      this.fluxesStore.deleteStory.visible = true;
    },
    handleSetPos(index) {
      this.$emit('select', {
        target: index,
        currIndex: this.currIndex,
      });
      this.showPosPopover = false;
    },
  },
};
</script>
