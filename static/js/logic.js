// Create the map object
var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
});

// Add the tile layers
var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'", {
    attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add street tile layer to map
street.addTo(myMap);


// Create a variable for url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Assign variable to empty list/string
let coords = [];
let depths = [];
let mags = [];
let color = "";

// Use D3 to pull the data from url and display with console.log
d3.json(url).then(function (data) {
    console.log("Data:", data);

    // Assign data to variable for console view
    x = data;

    // Assign variable for data features
    let features = data.features;

    // Display data features using console.log
    console.log(features);

    // Iterate through data features to extract values
    for (let i = 0; i < features.length; i++) {

        let coord = features[i].geometry.coordinates.slice(0, 2).reverse();
        let depth = features[i].geometry.coordinates[2];
        let mag = features[i].properties.mag;

        // Push extracted to values to empty lists
        coords.push(coord);
        depths.push(depth);
        mags.push(mag);
    };

    // Display values in console and validate data 
    console.log("Coordinates:", coords);
    console.log("Depths:", depths);
    console.log("Magnitudes:", mags);

});