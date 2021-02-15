/*eslint-disable*/

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiaGFycmlzMjIyMyIsImEiOiJja2w1eWhrd2QxMzJpMm5tZ2FsZjAxYnIyIn0.b7Kj3qj9zg8TrXersgjDbg';

    var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
});
