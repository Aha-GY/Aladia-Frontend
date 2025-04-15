export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export function getCurrentAdress() {
  return new Promise(async (resolve, reject) => {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const geocoder = new google.maps.Geocoder();

    const latlng = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject('No results found');
        }
      } else {
        reject(`Geocoder failed due to: ${status}`);
      }
    });
  });
}
