/*eslint-disable*/
export const displayMap = (locations) => {
	mapboxgl.accessToken =
		'pk.eyJ1IjoiaGFycmlzMjIyMyIsImEiOiJja2w1eWhrd2QxMzJpMm5tZ2FsZjAxYnIyIn0.b7Kj3qj9zg8TrXersgjDbg';

		var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/harris2223/ckl66c0ly3sir17khikmosvxf',
		center: [120.8943, 31.9802],
		zoom: 10,
	});

	const bounds = new mapboxgl.LngLatBounds();
	if(locations.length !== 0) {
		locations.forEach(loc => {
			//Create marker
			const el = document.createElement('div');
			el.className = 'marker fas fa-map-pin';
			const coordinates = [loc.lon, loc.lat]
			// Add marker
			new mapboxgl.Marker({
				element: el,
				anchor: 'bottom'
			}).setLngLat(coordinates).addTo(map)
	
			// Add Popup
			// new mapboxgl.Popup({
			// 	offset: 30
			// })
			// 	.setLngLat(coordinates)
			// 	.setHTML(`<p>${loc.country}/${loc.regionName}/${loc.city}</p>`)
			// 	.addTo(map)
			// Extend map bounds to include current location
			bounds.extend(coordinates )
		});
		map.fitBounds(bounds,{
			padding: {
				top: 30,
				bottom: 30,
				left: 20,
				right: 20 
			}
		})
	}


	
}

