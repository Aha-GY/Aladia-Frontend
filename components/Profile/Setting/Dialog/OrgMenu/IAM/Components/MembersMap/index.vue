<template>
  <div class="flex h-full w-full overflow-hidden rounded-5 bg-[#000]">
    <div class="relative flex-1">
      <div ref="iamMapContainer" class="h-full w-full overflow-hidden" />
      <div v-if="!isLeftDrawer" class="absolute right-8 top-4 z-20 flex">
        <BaseButton
          v-for="item in typeOptions"
          :key="item.label"
          class="active:!scale-100"
          :class="[item.class, !item.show ? '!bg-[#9C802D]' : '']"
          @click="handlerTypeShowOnMap(item)"
        >
          <i :class="item.iconClass" />
          <span class="capitalize">{{ item.label }}</span>
          <i
            class="fa-regular"
            :class="item.show ? 'fa-eye' : 'fa-eye-slash'"
          />
        </BaseButton>
      </div>
      <div
        class="absolute bottom-4 flex flex-col rounded-5 p-1"
        :class="isLeftDrawer ? 'right-1 scale-[0.9]' : 'right-8'"
      >
        <BaseButton
          v-for="(item, index) in zoomButtons"
          :key="index"
          :icon="`${item.icon} `"
          :class="`${item.class} `"
          @click="handlerMapZoom(item.type)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import mapPinSvg from '~/assets/images/map-pin.svg';
import mapPinSvg1 from '~/assets/images/map-pin1.svg';
import { MapId } from '~/components/Base/GoogleMaps/constant';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  initType: {
    type: String,
    default: '',
  },
});
const { $eventBus } = useNuxtApp();
let map = null;
let markerCluster = null;
const i18nCookie = useCookie('i18n_redirected');
const orgStore = useOrgStore();
const profileStore = useProfileStore();
const iamMapContainer = ref(null);
const zoom = ref(props.isLeftDrawer ? 1 : 2);
const center = ref({ lat: 18, lng: 0 });
const typeOptions = ref([
  {
    label: 'locations',
    class: 'rounded-e-none',
    iconClass: 'fa-regular fa-buildings',
    show: true,
  },
  {
    label: 'members',
    class: 'rounded-s-none',
    iconClass: 'fa-regular fa-user-group',
    show: true,
  },
]);
const zoomButtons = ref([
  {
    icon: 'fa-solid fa-globe',
    class: 'rounded-b-none',
    type: 'reset',
  },
  {
    icon: 'fa-regular fa-plus',
    class: 'rounded-none',
    type: 'upsize',
  },
  {
    icon: 'fa-regular fa-minus',
    class: 'rounded-t-none',
    type: 'downsize',
  },
]);
const locations = ref([]);

const getMembersMapData = async () => {
  await orgStore.getMembersMap({
    organizationId: profileStore.myProfileDetail.id,
  });
  initMap();
};

const handlerTypeShowOnMap = (item) => {
  typeOptions.value = typeOptions.value.map((ele) => {
    if (ele.label === item.label) {
      ele.show = !ele.show;
    }
    return ele;
  });
  const keys = typeOptions.value
    .filter((ele) => ele.show)
    .map((ele) => (ele.label === 'locations' ? 'sites' : ele.label));
  initLocations(keys);
};

const handlerMapZoom = (type) => {
  const currentZoom = map.getZoom();
  if (type === 'reset') {
    map.panTo(center.value);
    map.setZoom(zoom.value);
  } else if (type === 'upsize') {
    map.setZoom(currentZoom + 1 >= 21 ? 21 : currentZoom + 1);
  } else if (type === 'downsize') {
    map.setZoom(currentZoom - 1 <= zoom.value ? zoom.value : currentZoom - 1);
  }
};
const initMap = async () => {
  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(iamMapContainer.value, {
    mapId: MapId,
    zoom: zoom.value,
    minZoom: zoom.value,
    center: center.value,
    disableDefaultUI: true,
    streetViewControl: false,
    keyboardShortcuts: false,
    clickableIcons: false,
  });
  if (props.initType) {
    initLocations([props.initType]);
  } else {
    initLocations();
  }
  return map;
};

const initLocations = (keys = ['members', 'sites']) => {
  locations.value = [];
  keys.forEach((key) => {
    const ele = orgStore.membersMapData[key];
    ele?.forEach((item, index) => {
      if (item.location) {
        locations.value.push({
          lat: locations.value.some((ele) => ele.lat === +item.location?.lat)
            ? +item.location?.lat + (0.0001 * index) / 10
            : +item.location?.lat,
          lng: locations.value.some((ele) => ele.lng === +item.location?.lng)
            ? +item.location?.lng + (0.0001 * index) / 10
            : +item.location?.lng,
          type: key,
          ...item,
        });
      }
    });
  });
  renderLocationsMarker(locations.value);
};

const renderPinElement = (data) => {
  const content = document.createElement('div');
  content.className = `relative w-[1.68rem] h-[2.25rem]`;
  const bgSvg = document.createElement('img');
  bgSvg.src = data.type === 'sites' ? mapPinSvg1 : mapPinSvg;
  bgSvg.className = `absolute top-0 left-0`;
  content.appendChild(bgSvg);

  if (data.picture) {
    const img = document.createElement('img');
    img.className =
      'w-[1.25rem] h-[1.25rem] rounded-full absolute top-[0.25rem] left-[0.187rem] z-10';
    img.src = data.picture;
    content.appendChild(img);
  } else {
    const iconwrap = document.createElement('div');
    iconwrap.className = `w-[1.25rem] h-[1.25rem] rounded-full absolute top-[0.25rem] left-[0.187rem] z-10 ${data.type === 'sites' ? 'bg-transparent' : 'bg-[#2c2c2c]'} flex justify-center items-center`;
    const icon = document.createElement('i');
    if (data.type === 'sites') {
      icon.className = `fa-light fa-buildings text-[#fff] text-xs`;
    } else {
      icon.className = `fa-solid fa-user text-[#b0b0b0] text-xs`;
    }
    iconwrap.appendChild(icon);
    content.appendChild(iconwrap);
  }
  return content;
};

const renderLocationsMarker = async (data) => {
  markerCluster?.clearMarkers();
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
  // const { InfoWindow } = await google.maps.importLibrary('maps');
  // const infoWindow = new InfoWindow({
  //   content: '',
  //   disableAutoPan: true,
  //   ariaLabel: 'info window',
  // });
  const markers = data.map((position) => {
    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: +position.lat, lng: +position.lng },
      content: renderPinElement(position),
    });
    marker.addListener('click', () => {
      onClickItem(position);
      // infoWindow.setContent(
      //   `
      //   <div class='text-[#060606] font-medium pt-2'>
      //     <div class='w-full flex justify-end cursor-pointer'>X</div>
      //     <div>${position.name}</div>
      //   </div>
      //   `,
      // );
      // infoWindow.open(map, marker);
    });
    return marker;
  });
  markerCluster = new MarkerClusterer({
    map,
    markers,
    renderer: {
      render: ({ count, position }) =>
        new google.maps.Marker({
          position,
          icon: {
            url: mapPinSvg,
          },
          label: {
            text: String(count),
            color: '#fff',
            fontSize: '1.125rem',
            fontWeight: '500',
          },
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        }),
    },
  });
};

const onClickItem = (marker) => {
  const { location } = marker;
  console.log('--------------↓↓↓↓↓---------------------');
  console.log(marker);
  console.log(location);
  console.log('--------------↑↑↑↑↑---------------------');
  // if (location) {
  //   map.panTo({ lat: +location.lat, lng: +location.lng });
  //   map.setZoom(10);
  // }
};

const showUserOnMap = (data) => {
  map.panTo({ lat: +data.lat, lng: +data.lng });
  map.setZoom(10);
};

onMounted(async () => {
  getMembersMapData();
  $eventBus.on(profileEvent.SHOW_USER_ON_MAP, showUserOnMap);
});

onBeforeUnmount(() => {
  $eventBus.off(profileEvent.SHOW_USER_ON_MAP, showUserOnMap);
});
watch(
  () => i18nCookie.value,
  () => {},
);
defineExpose({
  getMembersMapData,
});
</script>
<style lang="scss">
.gm-style-iw-chr {
  display: none !important;
}
</style>
