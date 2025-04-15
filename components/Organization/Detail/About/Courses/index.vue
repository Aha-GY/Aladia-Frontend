<template>
  <div class="rounded-md bg-[#060606] p-4">
    <div class="flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('org.about.course.publish') }}
      </div>
      <ProfileViewMore data-cy="c21039d409b54d8c" @click="$emit('goTab', 3)" />
    </div>
    <OrganizationDetailAboutCoursesVideo />
  </div>
</template>

<script setup></script>
