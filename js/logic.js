// Creating map object
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 3,
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// variable to keep geojson layer
var geojson;

// functions to style the circle marker
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// function to get the correct radius of the circle marker
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

// function to change color according to depth
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "red";
        case depth > 70:
            return "orange";
        case depth > 50:
            return "yellow";
        case depth > 30:
            return "green";
        case depth > 10:
            return "cyan";
        default:
            return "blue";
    }
}

d3.json(queryURL, function(data) {
    console.log(data)

    //Create a GeoJSON layer containing the features
    geojson = L.geoJson(data, {
        // turn each feature into a circleMarker on the map
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // set the style for each circleMarker using our styleInfo function
        style: styleInfo,
        // create a popup for each marker 
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "Magnitude: " +
                feature.properties.mag +
                "<br>Depth: " +
                feature.geometry.coordinates[2] +
                "<br>Location: " +
                feature.properties.place
            );
        }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {

        var div = L.DomUtil.create("div", "info legend");
        var depth = [0, 10, 30, 50, 70, 90];

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style = "background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
});