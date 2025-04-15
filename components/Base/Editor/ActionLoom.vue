<template>
  <div
    v-if="!withActionToolTip"
    ref="loom"
    class="flex cursor-pointer items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
    data-cy="e053862168a9d5ec"
    @click="handleClickLoom"
  >
    <i class="fa-regular fa-bahai w-4" />
    Loom
  </div>
  <BaseEditorActionItem
    v-else
    :has-gif="hasGif"
    :tool-tip-content="toolTipContent"
  >
    <template #main>
      <div
        ref="loom"
        class="flex cursor-pointer items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
        data-cy="e053862168a9d5ec"
        @click="handleClickLoom"
      >
        <i class="fa-regular fa-bahai w-4" />
        Loom
      </div>
    </template>
    <template #button>
      <i class="fa-regular fa-bahai w-4" />
      Loom
    </template>
  </BaseEditorActionItem>
</template>

<script>
import LoomService from '~/utils/loom';

export default {
  props: {
    withActionToolTip: {
      type: Boolean,
      default: false,
    },
    hasGif: {
      type: Boolean,
      default: false,
    },
    toolTipContent: {
      type: String,
      default: '',
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  mounted() {
    this.initLoom();
  },
  methods: {
    async initLoom() {
      const loomService = await LoomService.getInstance();
      this.$nextTick(() => {
        if (typeof loomService !== 'string') {
          loomService &&
            loomService.trigger(this.$refs.loom, async (video) => {
              if (!this.$refs.loom) {
                this.$toast.error(this.$t('base.editor.error'));
              }
              this.$emit('loom', video);
            });
        }
      });
    },
    async handleClickLoom() {
      if (this.globalStore.editorLoading) {
        return;
      }
      const loomService = await LoomService.getInstance();
      if (loomService === 'nosupport') {
        return this.$toast.error(this.$t('base.editor.device.notSupported'));
      }
    },
  },
};
</script>
