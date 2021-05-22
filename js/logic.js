const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(link).then((data) => {
    createFeatures(data.features);
    console.log(data.features);
});

function createMap(earthquakes) {
    const satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    const grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    const outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });

    const baseMap = {
        'Satellite': satellite,
        'Grayscale': grayscale,
        'Outdoors': outdoors
    };

    const overlayMap = {
        Earthquakes: earthquakes
    };

    const myMap = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    function getColor(d) {
        return d > 5 ? 'darkred' :
            d > 4 ? 'red' :
            d > 3 ? 'orange' :
            d > 2 ? 'yellow' :
            d > 1 ? 'limegreen' :
            'cyan';
    }

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        const labels = []

        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);

}

function createFeatures(eqdata) {
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>Magnitude: ' + feature.properties.mag + '</h4><h4>USGS Event Page: <a href=' + feature.properties.url + " target='_blank'>Click here</a></h4>", { maxWidth: 400 })
    }

    const layerToMap = L.geoJSON(eqdata, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4.5;

            if (feature.properties.mag > 5) {
                fillcolor = 'darkred';
            } else if (feature.properties.mag >= 4) {
                fillcolor = 'red';
            } else if (feature.properties.mag >= 3) {
                fillcolor = 'orange';
            } else if (feature.properties.mag >= 2) {
                fillcolor = 'yellow';
            } else if (feature.properties.mag >= 1) {
                fillcolor = 'limegreen';
            } else fillcolor = 'cyan';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });
        }
    });
    createMap(layerToMap);
}