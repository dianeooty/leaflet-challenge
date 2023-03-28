# leaflet-challenge
This is my Module 15 Challenge for my Data Analytics and Visualization Boot Camp.  The assigned task is to create a visualization for the earthquakes and tectonic plates datasets.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)


## General Information
In the first half of this challenge, a visualization for the earthquake data was created. To start, the map object and tile layers were added.  Then using d3.json, the url was passed to pull the earthquake data for analysis.  Using geoJson, the markers and popups for each earthquake were added using functions to set up the colors based on depths, radius size based on magnitude and styling for circle markers.  Then, the layers were created and added to the map sllowing for base layer and overlay changes. Next, the legend was added by updating the CSS and HTML.  The second half of the project was to add the tectonic data to reflect the location of the plates on the map. I extracted the tectonic data with d3.json and then geoJson to add the desired style for the linestrings. When viewing both the earthquake and tectonic overlays on the map, it is clear that there is a strong correlation between the earthquake locations and tectonic plates. The occurences are mostly clustered along the borders of the tectonic plates.


## Technologies Used
- Javascript
- HTML
- CSS
- JSON
- D3
- Leaflet


## Features
- Map base layer options: Basic, Topography and Satellite
- Map group layer options: Tectonics and Earthquakes
- Map legend of colors for depth ranges


## Screenshots
![1](https://user-images.githubusercontent.com/117790100/228356544-43efd545-0452-4aec-8c4a-40fe92c3100e.png)
![2](https://user-images.githubusercontent.com/117790100/228028326-f75e5d39-bf06-4a1d-a032-88118211bdea.png)
![3](https://user-images.githubusercontent.com/117790100/228357109-cefc3fa5-8f00-49d5-8e54-c6f1d43cc967.png)
![4](https://user-images.githubusercontent.com/117790100/228357119-8cfaf7d4-0b36-4e83-aa42-40e67b4a0d6b.png)
![6](https://user-images.githubusercontent.com/117790100/228357123-3ce05641-fefb-4c22-a090-91409aa8200b.png)


## Setup
All files used for this project can be found in the folders above. Including the js, HTML and CSS. 

## Usage
Visit the site at https://dianeooty.github.io/leaflet-challenge/ to view the different maps that reflects all the earthquake locations that occurred in the past 7 days and the tectonic plate locations.  Each marker reflects the location, magnitude, depth and date&time of the earthquake.  The data pulls from "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" which updates every 5 minutes and the second data pulls from "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json".

```
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

var basic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Tile layer referenced from "https://developers.google.com/maps/documentation/ios-sdk/tiles"
var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});


// Add satellite tile layer to map
satellite.addTo(myMap);

// Create layer groups 
var tectonics = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Create baseMaps
var baseMaps = {
    Basic: basic,
    Topography: topo,
    Satellite: satellite

};

// Create overlays
var overlays = {
    "Tectonic Plates": tectonics,
    "Earthquakes": earthquakes
};

// Set control with layer groups to map
L.control
    .layers(baseMaps, overlays, { collapsed: false })
    .addTo(myMap);

// Create a variable for url. Dataset for "All earthquakes from the Past 7 days".
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
    console.log("Features:", features);

    // Iterate through data features to extract values
    for (let i = 0; i < features.length; i++) {

        let coord = features[i].geometry.coordinates.slice(0, 2).reverse();
        let depth = features[i].geometry.coordinates[2];
        let mag = features[i].properties.mag;

        // Push extracted values to empty lists
        coords.push(coord);
        depths.push(depth);
        mags.push(mag);
    };

    // Display values in console and validate data 
    console.log("Coordinates:", coords);
    console.log("Depths:", depths);
    console.log("Magnitudes:", mags);

    // Create function using switch statements to return color based on depth range
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

    // Use geoJson to add circle markers locations/style and popups with earthquake information
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
                `<h3>Location: </h3>`
                + `<h5>${feature.properties.place[0].toUpperCase() + feature.properties.place.substring(1)}</h5> <hr>`
                + `<h3>Magnitude: </h3>`
                + `<h5>${feature.properties.mag}</h5> <hr>`
                + `<h3>Depth: </h3>`
                + `<h5>${feature.geometry.coordinates[2]}</h5> <hr>`
                + `<h3>Date & Time: </h3>`
                + `<h5>${new Date(feature.properties.time)}</h5> <hr>`
            );
        }
        // Add markers to earthquakes layer
    }).addTo(earthquakes);

    // Add earthquakes layer to map
    earthquakes.addTo(myMap);

    // Create control for legend and pass a position
    var legend = L.control({
        position: "bottomright"
    });

    // Create div add ons for legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        // Set depth ranges for each label
        var depthRanges = [-10, 10, 30, 50, 70, 90];

        // Set colors for label squares
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

// Assign tectonic url to a variable
var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(url2).then(function (tectonicData) {
    console.log("Tectonic Data:", tectonicData);

    // Create function for tectonic marker style
    function style(feature) {
        return {
            color: "orange",
            weight: 2.5
        };
    };

    // Use geoJson to set style for linestrings and add to tectonics layer
    L.geoJson(tectonicData, {
        style: style
    })
        .addTo(tectonics);

    // Add tectonics layer to map
    tectonics.addTo(myMap);
});

```


## Project Status
Project is complete and no longer being worked on.


## Acknowledgements
- Many thanks to my instructional team and tutor, David Chao.


## Contact
Created by Diane Guzman

