<template>
  <div ref="mapContainer" class="map-container" />
</template>

<script setup>
import { mapStyles, pinSvgString } from '~/components/Base/GoogleMaps/constant';

const props = defineProps({
  center: {
    type: Object,
    required: true,
    validator: (value) =>
      value.hasOwnProperty('lat') && value.hasOwnProperty('lng'),
  },
  zoom: {
    type: Number,
    default: 12,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
});

const mapContainer = ref(null);
let map = null;
let marker = null;

const initMap = async () => {
  if (window.google && mapContainer.value) {
    const { Map } = await google.maps.importLibrary('maps');

    map = new Map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom,
      styles: mapStyles,
      disableDefaultUI: true,
      streetViewControl: false,
      keyboardShortcuts: false,
      draggable: props.draggable,
      clickableIcons: false,
    });

    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvgString)}`,
      scaledSize: new google.maps.Size(22, 29),
      anchor: new google.maps.Point(11, 29),
    };

    marker = new google.maps.Marker({
      map,
      position: props.center,
      icon,
      title: '',
    });

    marker.addListener('click', () => {
      window.open(
        `https://www.google.com/maps?q=${props.center.lat},${props.center.lng}`,
        '_blank',
      );
    });
  }
};

const updateMap = () => {
  if (map) {
    map.panTo(props.center);
    marker.setPosition(props.center);
  }
};

onMounted(() => {
  initMap();
});

watch(
  () => props.center,
  () => {
    if (map) {
      updateMap();
    }
  },
  { deep: true },
);

watch(
  () => props.zoom,
  () => {
    if (map) {
      map.setZoom(props.zoom);
    }
  },
);
</script>

<style>
.map-container {
  width: 100%;
  height: 400px; /* 可以根据需要调整 */
}
</style>
