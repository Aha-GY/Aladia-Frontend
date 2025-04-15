<template>
  <div
    v-if="checkeds.length && hubSpaces.isDraging"
    class="pointer-events-none fixed z-[80] -ml-4 -mt-4 w-72 touch-none select-none text-sm"
    :style="{ left: hubSpaces.dragLeft, top: hubSpaces.dragTop }"
  >
    <div
      v-for="(item, index) in checkedsSlice"
      :key="index"
      class="absolute flex w-full items-center gap-2 rounded border border-[#eab308] bg-black p-2"
      :style="{
        zIndex: -index,
        left: `${index * 5}px`,
        top: `${index * 5}px`,
      }"
    >
      <BaseIconFolder v-if="item._type === 'folder'" :open="true" class="h-6" />
      <BaseCourseThumbnail v-else class="h-6" :url="item.thumbnail?.url" />
      <div class="max-w-60 truncate">
        {{ item.name || item.title || '----' }}
      </div>
    </div>
    <div
      class="absolute -right-3 -top-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-white text-black"
    >
      {{ checkeds.length }}
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    checkeds() {
      return this.hubSpaces.checkedsClear;
    },
    checkedsSlice() {
      return this.checkeds.slice(0, 3);
    },
  },
};
</script>
