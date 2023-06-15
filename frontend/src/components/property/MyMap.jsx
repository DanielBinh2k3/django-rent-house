import React, { useEffect } from 'react';
import L from 'leaflet';
import { useSelector } from 'react-redux';

const MapComponent = () => {
  const myAPIKey = "8c3effce14cf42138616e217e61d9e74";
  const listingDetails = useSelector((state) => state.listingDetails);
	const { error, loading, listing } = listingDetails;
  useEffect(() => {
    console.log(listing.listing.address)
    // Create the Leaflet map object
    const map = L.map('my-map').setView([48.1500327, 11.5753989], 10);

    // Retina displays require different map tile URLs
    const isRetina = L.Browser.retina;

    const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`;
    const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    // Add map tile layer
    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
      maxZoom: 20,
      id: 'osm-bright',
    }).addTo(map);

    // Fetch place data using Geoapify Geocoding API
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${listing.listing.address}&apiKey=${myAPIKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data, listing)
        if (data.features.length > 0) {
          const place = data.features[0];

          // Generate a custom marker icon using Geoapify Marker Icon API
          const iconUrl = `https://api.geoapify.com/v1/icon?size=medium&type=awesome&color=%233e9cfe&icon=paw&apiKey=${myAPIKey}`;
          const iconSize = [31, 46];
          const iconAnchor = [15.5, 42];
          const popupAnchor = [0, -45];

          const markerIcon = L.icon({
            iconUrl,
            iconSize,
            iconAnchor,
            popupAnchor
          });

          // Add a marker to the place coordinates
          const marker = L.marker([place.properties.lat, place.properties.lon], { icon: markerIcon }).addTo(map);

          // Create a popup with the place name
          const popup = L.popup().setContent(place.properties.formatted);
          marker.bindPopup(popup).openPopup();
        }
      });

    return () => {
      map.remove(); // Clean up the map instance when the component unmounts
    };
  }, []);

  return <div id="my-map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;
