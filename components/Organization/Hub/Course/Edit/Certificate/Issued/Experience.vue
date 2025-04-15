<template>
  <div class="flex min-h-36 w-80 flex-col rounded border border-white/10">
    <div class="flex h-10 items-center rounded-t bg-white/5 pl-2 text-sm">
      Certificate Experience Info
    </div>
    <div class="flex flex-col gap-3 p-3">
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-briefcase text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Certificate Name</div>
          <div class="text-white">{{ course.title }}</div>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-building text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Issuing Organization</div>
          <div class="text-white">
            {{ profileStore.myProfileDetail.fullName }}
          </div>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-arrow-up-right-from-square text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Credential URL</div>
          <div class="text-white">laernify.com</div>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-align-left text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Skills</div>
          <div class="text-white">
            <div class="flex flex-wrap gap-1">
              <div
                v-for="(skill, index) in skills"
                :key="skill"
                :class="{
                  'bg-[#D8B4FE] text-[#3B0764]': index % 2 === 0,
                  'bg-[#3B0764] text-[#E9D5FF]': index % 2 === 1,
                }"
                class="rounded px-2 py-1 text-xs font-medium leading-none"
              >
                {{ skill }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-calendar text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Issued Date</div>
          <div class="flex items-center text-white">
            <div class="w-36">March</div>
            <div>2020</div>
          </div>
        </div>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-5 items-center justify-center pb-1">
          <i class="fa-regular fa-calendar text-xs" />
        </div>
        <div class="text-xs">
          <div class="mb-1 text-white/50">Expiration Date</div>
          <div class="flex items-center text-white">
            <div class="w-36">April</div>
            <div>2034</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <div class="flex size-5 items-center justify-center pt-7">
          <i class="fa-regular fa-align-left text-xs" />
        </div>
        <div class="flex-1 text-xs">
          <div class="mb-1 text-white/50">Description</div>
          <div class="h-24 overflow-y-auto rounded bg-white/5 p-2 text-white">
            1234
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const profileStore = useProfileStore();
    return { hubCourse, profileStore };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    skills() {
      return ['Skill 1', 'Skill 2', 'Skill 3'];
    },
  },
};
</script>
