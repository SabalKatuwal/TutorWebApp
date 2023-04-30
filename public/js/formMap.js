
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiYWxrYXR1d2FsIiwiYSI6ImNsMnVrbjNkNTAyeHozcHN0Mmk5ZjlycGIifQ.847aKWKCAbIYS4cc9xMaww';

let coords;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const markers = [];

const marker = new mapboxgl.Marker({
        color: "#FFFFFF",
        draggable: true
    }).setLngLat([30.5, 50.5])
    .addTo(map);

map.on('click',(e) => {
    const coordinates = e.lngLat;
   
    if(markers.length === 0){
        const m =  new mapboxgl.Marker()
            .setLngLat(coordinates)
            // .setPopup(
            // new mapboxgl.Popup({ offset: 25 }) // add popups
            // .setHTML(
            // `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            // )
            // )
        markers.push(m);
    }else{
        markers.pop().remove();
        const m =  new mapboxgl.Marker()
        .setLngLat(coordinates)
        // .setPopup(
        // new mapboxgl.Popup({ offset: 25 }) // add popups
        // .setHTML(
        // `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        // )
        // )
        markers.push(m);
    }

    markers[0].addTo(map);
    coords = coordinates;
    console.log(coords)
})

const geocoder = new MapboxGeocoder({
    // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false // Do not use the default marker style
  });
  
  // Add the geocoder to the map
  map.addControl(geocoder);

  


// form submission logic

const form = document.querySelector('#form');


form.addEventListener('submit',(e) => {
    e.preventDefault();
    let formData = new FormData(form);
    formData.append('lat',coords.lat);
    formData.append('lng',coords.lng);

    fetch('/place_upload',{
        method  : "POST",
        body : formData,
        headers: {
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
    }).then(res => res.json())
        .then(data => {
            if(data.success) window.location = '/';
        })
        .catch(err => console.log(err));
    
})





