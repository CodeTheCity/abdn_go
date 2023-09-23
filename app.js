var map = L.map('map').setView([57.1477, -2.095], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

var restaurantsMarkers = [];
var cafesMarkers = [];
var attractionsMarkers = [];
var barsMarkers = []; // You had bars in your HTML, so I added it here too.

function fetchDataAndPlaceMarkers(category, targetArray) {
    var query;
    
    switch (category) {
        case 'restaurants':
            query = `
                [out:json][timeout:25];
                (
                    node["amenity"="restaurant"](around:1000,57.1477,-2.095);
                    way["amenity"="restaurant"](around:1000,57.1477,-2.095);
                );
                out body;
                >;
                out skel qt;
            `;
            break;
        case 'cafes':
            query = `
                [out:json][timeout:25];
                (
                    node["amenity"="cafe"](around:1000,57.1477,-2.095);
                    way["amenity"="cafe"](around:1000,57.1477,-2.095);
                );
                out body;
                >;
                out skel qt;
            `;
            break;
        case 'attractions':
            query = `
                [out:json][timeout:25];
                (
                    node["tourism"](around:1000,57.1477,-2.095);
                    way["tourism"](around:1000,57.1477,-2.095);
                );
                out body;
                >;
                out skel qt;
            `;
            break;
        case 'bars':
            query = `
                [out:json][timeout:25];
                (
                    node["amenity"="bar"](around:1000,57.1477,-2.095);
                    way["amenity"="bar"](around:1000,57.1477,-2.095);
                );
                out body;
                >;
                out skel qt;
            `;
            break;
    }

    var overpassURL = "https://overpass-api.de/api/interpreter";

    $.post(overpassURL, {
        data: query
    }, function(data) {
        data.elements.forEach(element => {
            if (element.type === "node") {
                var marker = L.marker([element.lat, element.lon]).bindPopup(element.tags.name || category);
                targetArray.push(marker);
                marker.addTo(map);
            }
        });
    });
}

function toggleMarkers(category) {
    if ($('#' + category).prop('checked')) {
        for (let i = 0; i < window[category + 'Markers'].length; i++) {
            window[category + 'Markers'][i].addTo(map);
        }
    } else {
        for (let i = 0; i < window[category + 'Markers'].length; i++) {
            map.removeLayer(window[category + 'Markers'][i]);
        }
    }
}

$('#restaurants').change(() => { toggleMarkers('restaurants'); });
$('#cafes').change(() => { toggleMarkers('cafes'); });
$('#attractions').change(() => { toggleMarkers('attractions'); });
$('#bars').change(() => { toggleMarkers('bars'); });

// Initial fetch from Overpass and placement of markers
fetchDataAndPlaceMarkers('restaurants', restaurantsMarkers);
fetchDataAndPlaceMarkers('cafes', cafesMarkers);
fetchDataAndPlaceMarkers('attractions', attractionsMarkers);
fetchDataAndPlaceMarkers('bars', barsMarkers);
