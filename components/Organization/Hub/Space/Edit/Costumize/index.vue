<template>
  <OrganizationHubSpaceSidebar
    type="costumize"
    title="space.columns.setting"
    @close="hubSpaces.editCostumize = false"
  >
    <div class="flex h-full flex-col">
      <div class="text-sm">{{ $t('space.columns.edit') }}</div>
      <div class="mb-4 text-13 text-white/50">
        {{ $t('space.columns.reorder') }}
      </div>
      <div
        class="hide-scrollbar h-0 w-full flex-1 overflow-y-auto overflow-x-hidden py-1 pr-1"
      >
        <draggable
          :list="columns"
          item-key="id"
          :animation="200"
          ghost-class="ghost"
          handle=".column-handle"
          @start="onStart"
          @end="onEnd"
        >
          <template #item="{ element }">
            <OrganizationHubSpaceEditCostumizeItem :item="element" />
          </template>
        </draggable>
      </div>
      <OrganizationHubSpaceSidebarSave />
    </div>
  </OrganizationHubSpaceSidebar>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      drag: false,
      columns: [
        {
          id: 'Categories',
          name: 'space.columns.elements.categories',
        },
        {
          id: 'Type',
          name: 'space.columns.elements.type',
        },
        {
          id: 'Status',
          name: 'space.columns.elements.status',
        },
        {
          id: 'Language',
          name: 'space.columns.elements.language',
        },
        {
          id: 'Visibility',
          name: 'space.columns.elements.visibility',
        },
        {
          id: 'Teachers',
          name: 'space.columns.elements.teachers',
        },
        {
          id: 'Attendants',
          name: 'space.columns.elements.attendants',
        },
        {
          id: 'Time',
          name: 'space.columns.elements.time',
        },
        {
          id: 'Duration',
          name: 'space.columns.elements.duration',
        },
        {
          id: 'Payment Model',
          name: 'space.columns.elements.payment.model',
        },
        {
          id: 'Availability',
          name: 'space.columns.elements.availability',
        },
        {
          id: 'Total Price',
          name: 'space.columns.elements.price.total',
        },
        {
          id: 'Subscription Fee',
          name: 'space.columns.elements.subscription.fee',
        },
        {
          id: 'Remaining Amount',
          name: 'space.columns.elements.amount.remaining',
        },
        {
          id: 'Payment Frequency',
          name: 'space.columns.elements.payment.frequency',
        },
        {
          id: 'Numbers Of Billings',
          name: 'space.columns.elements.billingN',
        },
        {
          id: 'Single Billing Amount',
          name: 'space.columns.elements.amount.single',
        },
        {
          id: 'Licences',
          name: 'space.columns.elements.licenses',
        },
      ],
    };
  },
  methods: {
    onStart() {
      this.drag = true;
      document.body.classList.add('select-none');
    },
    onEnd() {
      this.drag = false;
      document.body.classList.remove('select-none');
    },
  },
};
</script>
