<template>
  <svg
    :height="height"
    :width="40"
    :viewBox="`0 0 20 ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="pr-6"
    preserveAspectRatio="none"
  >
    <g>
      <!-- Main vertical line -->
      <line
        x1="0.5"
        :y1="getStartY()"
        x2="0.5"
        :y2="getEndY()"
        stroke="#3A3A3A"
        :stroke-width="2"
      />

      <!-- Horizontal connector for expanded view -->
      <path
        v-if="fieldsLength > 3"
        :d="getConnectorPath()"
        stroke="#3A3A3A"
        :stroke-width="2"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
    fieldsLength: {
      type: Number,
      required: true,
    },
    isLastItem: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    offset() {
      return (this.fieldsLength - 3) * 24;
    },
  },
  methods: {
    getStartY() {
      // Start from the top of the avatar
      return -10;
    },
    getEndY() {
      if (this.isLastItem) {
        // For last item, end the line shortly after the last field
        return this.height - 20;
      }
      // For non-last items, extend to connect with next avatar
      return this.height + 10;
    },
    getConnectorPath() {
      const baseY = -12;
      const baseV = 44;
      const baseC = 50.6274;
      const baseEnd = 56;

      if (!this.isExpanded) {
        return `M0.5 ${baseY}V${baseV}C0.5 ${baseC} 5.87258 ${baseEnd} 12.5 ${baseEnd}H19.5`;
      }

      return `M0.5 ${baseY + this.offset}V${baseV + this.offset}C0.5 ${baseC + this.offset} 5.87258 ${baseEnd + this.offset} 12.5 ${baseEnd + this.offset}H19.5`;
    },
  },
};
</script>
