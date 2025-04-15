<template>
  <div class="chat-preview flex h-[100vh] flex-col">
    <OrganizationHubChatPreviewHeader :view-only="viewOnly" />
    <OrganizationHubChatPreviewCarousel ref="carousel" :data-list="dataList" />
    <OrganizationHubChatPreviewOptions @operate="operate($event)" />
    <OrganizationHubChatPreviewThumbnail />
  </div>
</template>
<script>
export default {
  props: {
    // 是否为只读模式
    // 只有 “非” Chat 场景才会用到只读模式
    // TODO: 当 Chat 以外的场景不再使用此组件时，这个 prop 可以删除
    viewOnly: Boolean,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    dataList() {
      return this.hubChatStore.previewData;
    },
  },
  methods: {
    operate(type) {
      this.$refs.carousel.operate(type);
    },
  },
};
</script>
