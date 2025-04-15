<template>
  <div class="group/item px-3 py-0.5">
    <div
      class="flex cursor-pointer gap-1.5 rounded-md px-2 py-0.5 transition-all group-hover/item:bg-[#292929]"
    >
      <div class="flex h-5 w-5 shrink-0 items-center justify-center">
        <img
          v-if="item.profilePicture"
          :src="item.profilePicture"
          alt=""
          class="rounded-sm object-cover"
        />
        <div
          v-else
          class="h-4 w-4 rounded-sm"
          :style="{ background: `${item.color}` }"
        />
      </div>
      <div
        class="flex-1 truncate text-xs leading-5 text-[#707070] transition-all group-hover/item:text-[#f1f1f1]"
        data-cy="eca9983ace482f70"
        @click.stop="$emit('onChange', item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
};
</script>
