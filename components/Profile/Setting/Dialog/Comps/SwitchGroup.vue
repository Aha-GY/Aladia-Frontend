<template>
  <ProfileSettingDialogCompsBox>
    <div
      class="mb-2 flex items-end justify-between border-b-[1px] border-[#707070] py-2"
    >
      <span class="font-[500]">
        {{
          $t('personal.profile.notification.allow', {
            label: LabelReflect[props.id],
          })
        }}
      </span>
      <BaseSwitcher
        :active="open"
        data-cy="748e4de3b0977aae"
        @click="onClick"
      />
    </div>
    <div
      v-for="(key, index) in keys"
      :key="index"
      class="flex justify-between py-1.5"
    >
      <span class="text-xs font-[400] text-[#B0B0B0]">
        {{ handleLabel(key) }}
      </span>
      <BaseSwitcher
        :active="data[key]"
        data-cy="91c35edde304367a"
        @click="data[key] = !data[key]"
      />
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
const props = defineProps({
  id: String,
});

const LabelReflect = {
  posts: 'post',
  courses: 'course',
  follows: 'follow',
  messages: 'messaging',
  updates: 'update',
};

const notificationStore = useNotificationStore();

const data = computed(() => notificationStore.notification[props.id] || []);
const keys = computed(() =>
  Object.keys(notificationStore.notification[props.id] || {}),
);

const open = ref(
  Object?.values(data.value).findIndex((item) => item === false) === -1,
);
const onClick = () => {
  const o = !open.value;
  open.value = o;
  keys.value.forEach((key) => (data.value[key] = o));
};

// commentsAndReactions -> Comments and reactions
const handleLabel = (str) => {
  const [first, ...other] = str
    .split(/(?=[A-Z])/)
    .map((k) => k.toLocaleLowerCase());
  const First = `${first.slice(0, 1).toLocaleUpperCase()}${first.slice(1)}`;
  return [First, ...other].join(' ');
};
</script>
