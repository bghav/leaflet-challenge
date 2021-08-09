// We create the tile layer that will be the background of our map.
console.log("Step 1 working");

// Define streetmap layer
  var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
  {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }
  );

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });

  // Then we add our 'graymap' tile layer to the map.
graymap.addTo(myMap);

// Perform a GET request to the query URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) 
{
  
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

function getColor(depth) {
  switch (true){
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
}

function getRadius(magnitude){
  if (magnitude === 0){
    return 1;
  }
    return magnitude * 4;
};

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
  // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
  
    onEachFeature: function (feature, layer) {
    layer.bindPopup(
    "Magnitude: "
    + feature.properties.mag
    + "<br>Depth: "
    + feature.geometry.coordinates[2]
    + "<br>Location: "
    + feature.properties.place
    );
  }
}).addTo(myMap);

// Here we create a legend control object.
var legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
  
    var grades= [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
      ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

legend.addTo(myMap);
});