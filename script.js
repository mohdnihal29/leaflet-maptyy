'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const form = ;
// const containerWorkouts =;
// const inputType = ;
// const inputDistance = ;
// const inputDuration = ;
// const inputCadence =;
// const inputElevation = ;

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},13.99z`
      );
      const coordinates = [latitude, longitude];

      const map = L.map('map').setView(coordinates, 15);
      console.log(map);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coordinates)
        .addTo(map)
        .bindPopup('Nihals leaflet work :D')
        .openPopup();
    },
    function () {
      alert('could not get location');
    }
  );
