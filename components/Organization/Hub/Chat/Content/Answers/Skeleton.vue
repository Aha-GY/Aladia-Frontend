<template>
  <div class="my-1 flex w-full gap-2 rounded-md p-2">
    <BaseSkeleton
      class="mt-2 h-8 w-8 [&_div]:rounded-full"
      :length="1"
      height="2rem"
    />
    <div class="flex-1 rounded bg-black/80 p-2">
      <BaseSkeleton class="mb-3 h-3 w-48 rounded" :length="1" height="2rem" />
      <BaseSkeleton class="mb-1 h-2 w-[50%]" :length="1" height="2rem" />
      <div class="flex justify-between">
        <BaseSkeleton
          class="mb-2 h-2 w-[70%] rounded"
          :length="1"
          height="2rem"
        />
        <BaseSkeleton
          class="mb-2 h-2 w-8 animate-pulse"
          :length="1"
          height="2rem"
        />
      </div>
    </div>
  </div>
</template>
