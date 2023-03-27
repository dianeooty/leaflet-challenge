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

// Create layer groups 
var tectonics = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Create baseMaps
var baseMaps = {
    "Earthquakes": street,
    "Topography": topo,

};

// Create overlays
var overlays = {
    "Tectonic Plates": tectonics,
    "Earthquakes": earthquakes
};

// Set the layer groups and add control to map
L.control
    .layers(baseMaps, overlays, { collapsed: false })
    .addTo(myMap);

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

    // Create function for color based on depth range
    function setColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    };

    // Create function for radius calculation for circle marker sizes
    function setRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    };

    // Create function for marker style
    function style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: setColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: setRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    // Use geoJson to filter data
    L.geoJson(data, {
        // Create circle markers using features with latitude and longitude
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Set the style for each circle marker using style function
        style: style,
        // Create popups for each circle markers with locations, magnitudes, depths and event times
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                `<h2>Location: </h2>`
                + `<h3>${feature.properties.place[0].toUpperCase() + feature.properties.place.substring(1)}</h3> <hr>`
                + `<h2>Magnitude: </h2>`
                + `<h3>${feature.properties.mag}</h3> <hr>`
                + `<h2>Depth: </h2>`
                + `<h3>${feature.geometry.coordinates[2]}</h3> <hr>`
                + `<h2>Time: </h2>`
                + `<h3>${new Date(feature.properties.time)}</h3> <hr>`
            );
        }
        // Add markers to earthquakes layer
    }).addTo(earthquakes);

    // Add earthquakes layer to map
    earthquakes.addTo(myMap);

    // Create legend, assign position and set control to map
    var legend = L.control({
        position: "bottomright"
    });

    // Create div add ons for legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        // Set depthRanges
        var depthRanges = [-10, 10, 30, 50, 70, 90];

        // Set colors
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"];

        // Iterate through depthRanges to create labels for each color and add to div container
        for (var i = 0; i < depthRanges.length; i++) {
            div.innerHTML += "<i style='background: "
                + colors[i]
                + "'></i> "
                + depthRanges[i]
                + (depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add legend map
    legend.addTo(myMap);

});



