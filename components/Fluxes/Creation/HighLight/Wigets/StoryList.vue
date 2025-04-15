<template>
  <div class="w-full">
    <draggable
      :list="cardList"
      item-key="id"
      :animation="200"
      handle=".story-drag"
      tag="div"
      @end="onEnd"
    >
      <template #item="{ element, index }">
        <div
          :key="element.id"
          class="group my-1 flex items-center justify-between gap-2 rounded-[0.3125rem] p-[0.375rem] py-2 transition-all hover:bg-white/5"
          :class="{
            'bg-[#e2e2e208]': index === activeIndexComputed,
          }"
        >
          <div
            class="group/button flex h-[1.375rem] w-[1.375rem] cursor-pointer items-center justify-center rounded-5 p-[0.19rem] px-[3px] hover:bg-white/5"
            :class="{
              'story-drag': index === handleClass,
            }"
            @mouseenter="setHandleClass(index)"
            @mouseleave="removeHandleClass"
          >
            <i
              v-if="index === activeIndexComputed"
              class="fa-solid fa-grip-dots-vertical text-[#fafafa]"
            />
            <i
              v-else
              class="fa-solid fa-grip-dots-vertical text-[#e2e2e2]/30 opacity-0 group-hover/button:text-white group-hover:opacity-100"
            />
          </div>

          <div class="flex flex-1 items-center truncate">
            <div class="mx-2 w-[30px] shrink-0">
              <FluxesCreationHighLightWigetsNewCard :item="element" />
            </div>
            <p class="flex-1 truncate px-2 text-white">
              {{ $t('flux.highlight.story.singular') }} {{ index + 1 }}
            </p>
          </div>
          <BaseButton
            type="tertiary"
            data-cy="c678504c1aa4e73b"
            @click="handleEdit(element, index)"
          >
            <i
              class="fa-regular fa-pen-to-square"
              :class="{
                'text-white !text-opacity-100': index === activeIndexComputed,
              }"
            />
          </BaseButton>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  props: {
    cardList: {
      type: Array,
      default: () => [],
    },
    activeIndex: Number,
  },
  data() {
    return {
      handleClass: this.activeIndex,
      activeIndexComputed: this.activeIndex,
    };
  },
  watch: {
    activeIndex(newVal) {
      this.activeIndexComputed = newVal;
    },
  },
  methods: {
    async onEnd({ newIndex, oldIndex }) {
      if (newIndex === oldIndex) {
        return;
      }
      this.activeIndexComputed = newIndex;
      this.$emit('swap-end', { newIndex, oldIndex });
    },
    setHandleClass(index) {
      this.handleClass = index;
    },
    removeHandleClass() {
      this.handleClass = this.activeIndex;
    },
    handleEdit(item, index) {
      this.$emit('edit', { item, index });
      this.activeIndexComputed = index;
    },
  },
};
</script>
