<template>
  <div
    v-if="status === 'published' && purchased"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#B475F0] backdrop-blur"
  >
    <i class="fa-light fa-cart-shopping text-xs" />
    <span>Bought</span>
  </div>
  <div
    v-else-if="status === 'published'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#6EEA84] backdrop-blur"
  >
    <i class="fa-light fa-check text-xs" />
    <span>Published</span>
  </div>
  <div
    v-else-if="status === 'verifying' || status === 'published-verifying'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#E0B92C] backdrop-blur"
  >
    <i class="fa-light fa-clock text-xs" />
    <span>Pending</span>
  </div>
  <div
    v-else-if="status === 'rejected'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#EF4444] backdrop-blur"
  >
    <i class="fa-light fa-xmark text-xs" />
    <span>Rejected</span>
  </div>
  <div
    v-else-if="status === 'draft'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#D1D1D1] backdrop-blur"
  >
    <i class="fa-light fa-edit text-xs" />
    <span>Draft</span>
  </div>
  <div
    v-else-if="status === 'generating'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#6EEA84] backdrop-blur"
  >
    <i class="fa-light fa-check text-xs" />
    <span>Generating</span>
  </div>

  <div
    v-if="type === 'on-demand'"
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#D1D1D1]"
  >
    <i class="fa-light fa-circle-play text-xs" />
    <span>On Demand</span>
  </div>
  <div
    v-else
    class="badge flex items-center gap-1 rounded-5 bg-black/85 px-1 py-0.5 text-xs font-light text-[#EB4937]"
  >
    <i class="fa-light fa-circle text-xs" />
    <span>Live</span>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.badge {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
}
</style>
