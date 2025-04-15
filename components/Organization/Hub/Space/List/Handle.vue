<template>
  <div
    class="flex cursor-move touch-none items-center justify-center transition-all"
    @pointerdown="onMouseDown"
    @pointerup="onMouseUp"
  >
    <i class="fa-regular fa-grip-dots-vertical text-xs" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      isMouseUp: false,
    };
  },
  computed: {
    checked() {
      return this.item._state === 'checked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
  },
  mounted() {
    document.addEventListener('pointerup', this.onMouseUp);
  },
  beforeUnmount() {
    document.removeEventListener('pointerup', this.onMouseUp);
  },
  methods: {
    async onMouseDown(event) {
      if (event.button !== 0) {
        return;
      }
      this.hubSpaces.isDraging = true;
      this.hubSpaces.dragLeft = `${event.x}px`;
      this.hubSpaces.dragTop = `${event.y}px`;
      if (this.hubSpaces.checkeds.length === 0) {
        this.hubSpaces.isTmpCheck = true;
        this.hubSpaces.uncheck();
      }
      this.item._state = 'checked';

      if (this.item._type === 'course') {
        //
      }
    },
    onMouseUp() {
      //
    },
  },
};
</script>
