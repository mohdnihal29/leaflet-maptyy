'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
// const containerWorkouts =;

class Workouts {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workouts {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workouts {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

// const run1 = new Running([-33, 141], 10, 4, 10);
// const cycling1 = new Cycling([-33, 141], 50, 11, 10);

// console.log(run1);
// console.log(cycling1);

const inputType = document.querySelector('.form__input');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #data = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('could not get location');
        }
      );
  }

  _loadMap(position) {
    console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},13.99z`);
    const coordinates = [latitude, longitude];

    this.#map = L.map('map').setView(coordinates, 15);
    console.log(map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const input = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    const isFinite = (...input) => input.every(el => Number.isFinite(el));

    const isPositive = (...input) => input.every(el => el > 0);

    // add running data
    if (input === 'running') {
      const cadence = +inputCadence.value;
      if (
        !isFinite(distance, duration, cadence) ||
        !isPositive(distance, duration, cadence)
      )
        alert('Put a proper value bitch');
      workout = new Running([lat, lng], distance, duration, cadence);
      this.#data.push(workout);
      console.log(workout);
    }

    // Add cycling data

    if (input === 'cycling') {
      const elevationG = +inputElevation.value;
      if (
        !isFinite(distance, duration, elevationG) ||
        !isPositive(distance, duration)
      )
        alert('Put a proper value bitch');
      workout = new Cycling([lat, lng], distance, duration, elevationG);
      this.#data.push(workout);
      console.log(workout);
    }
    // render workout on map as marker

    this._displayMarker(workout);

    // render workout on the list

    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
  }
  _displayMarker(data) {
    L.marker(data.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${data.type}-popup`,
        })
      )
      .setPopupContent('workout')
      .openPopup();
  }
}

const app = new App();
console.log();
