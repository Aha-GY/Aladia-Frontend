<template>
  <div class="flex items-start items-center gap-3 self-stretch">
    <BaseAvatarNext
      :picture="profile.picture"
      :has-story="profile.hasActiveStory"
      :user-id="profile.id"
      :online="online"
      :story="profile.story"
      :size="'md'"
    />
    <div class="w-0 flex-1 text-xs">
      <div class="flex items-start gap-2">
        <template v-if="profile.name.length > 24">
          <el-tooltip
            :content="profile.name"
            effect="light"
            placement="top"
            popper-class="w-auto max-w-64"
            :offset="5"
          >
            <span
              class="cursor-pointer text-[#f1f1f1] hover:underline"
              @click="onProfileClick(profile.id)"
            >
              {{ truncateString(profile.name, 24) }}
            </span>
          </el-tooltip>
        </template>
        <template v-else>
          <span
            class="cursor-pointer text-[#f1f1f1] hover:underline"
            @click="onProfileClick(profile.id)"
          >
            {{ profile.name }}
          </span>
        </template>
        <div class="text-white/50">
          {{ formatDate(createdAt, 'DD-MM-YYYY HH:mm') }}
        </div>
      </div>
      <div class="max-w-72 truncate text-white/50">
        {{ description || $t('index.description.empty') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: [String, Date],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  methods: {
    onProfileClick(profileId) {
      this.$router.push(`/profile/${profileId}`);
    },
  },
};
</script>
