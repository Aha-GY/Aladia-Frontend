<template>
  <div class="flex gap-2 p-[0.3125rem]">
    <BaseSkeleton
      class="h-12 w-12 [&_div]:rounded-[0.3125rem]"
      :length="1"
      height="3rem"
    />
    <div class="flex flex-1 flex-col py-2">
      <BaseSkeleton class="mb-2 h-3 w-full" :length="1" />
      <BaseSkeleton class="h-2 w-full" :length="1" />
    </div>
  </div>
</template>
