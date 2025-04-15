<template>
  <div class="flex h-full w-full flex-row p-4">
    <div
      class="mr-[1.125rem] hidden w-[20.375rem] border-r-[1px] border-white/10 md:block"
    >
      <FluxesCreationTextStoryTool
        @create-text-story="(params) => $emit('createTextStory', params)"
        @back="$emit('back')"
      />
    </div>
    <div class="h-full w-[90vw] flex-1 md:w-[42rem]">
      <FluxesCreationTextStoryWrap />
    </div>
  </div>
</template>
