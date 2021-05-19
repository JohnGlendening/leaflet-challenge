var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var geojson;

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

function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}