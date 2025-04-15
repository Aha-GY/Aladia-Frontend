export const MapId = 'eba22c4c54654063';
export const ApiKey = 'AIzaSyDNBgUDsAUMibxR5JLqbiSxjl1QTmWOYpU';

export const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1b1b1b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#373737' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#4e4e4e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

export const pinSvgString =
  '<svg width="22" height="29" viewBox="0 0 22 29" xmlns="http://www.w3.org/2000/svg">' +
  '<path style="fill:#CFA200; fill-opacity:1;" d="M12.2578 27.8438C11.6016 28.6641 10.3438 28.6641 9.6875 27.8438C6.89844 24.2891 0.5 15.8125 0.5 11C0.5 5.20312 5.20312 0.5 11 0.5C16.7969 0.5 21.5 5.20312 21.5 11C21.5 15.8125 15.1016 24.2891 12.2578 27.8438ZM11 7.5C9.74219 7.5 8.59375 8.21094 7.9375 9.25C7.33594 10.3438 7.33594 11.7109 7.9375 12.75C8.59375 13.8438 9.74219 14.5 11 14.5C12.2031 14.5 13.3516 13.8438 14.0078 12.75C14.6094 11.7109 14.6094 10.3438 14.0078 9.25C13.3516 8.21094 12.2031 7.5 11 7.5Z"></path>' +
  '</svg>';
