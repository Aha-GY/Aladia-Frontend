<template>
  <div class="flex items-center justify-center gap-2">
    <BaseCheckboxStyle
      :state="checked ? 'checked' : 'unchecked'"
      data-cy="61c2c356606afad4"
      @click.stop="onClick"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const hubPaymentStore = useHubPaymentStore();
const checked = computed(() =>
  hubPaymentStore.usersSelect.includes(props.item.id),
);

function onClick() {
  hubPaymentStore.handleCheckbox({
    titleCheckbox: false,
    rowId: props.item.id,
  });
}
</script>
