import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
// Mapping imports 
import MapView, { Polyline, Marker } from 'react-native-maps'; // Native platform map 
import parkingRestrictionsData from "./data/Street_Parking_Restrictions.json";

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Map( {currentCoords, dest} ) {
  console.log(dest)

  const [routeCoords, setRouteCoords] = useState([]); // represents segments along route path 

  // Function to fetch route directions from Mapbox Directions API
  const fetchRoute = async (currentCoords, dest) => {
    try {
      // fetch route from Mapbox
      const resp = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentCoords.longitude},${currentCoords.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`
      );
      // read data
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        // parse route segments into latitude/longitude coords
        const coords = data.routes[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoords(coords);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  useEffect(() => {
    if (dest && currentCoords) {
      fetchRoute(currentCoords, dest);
    }
  }, [currentCoords, dest])

  // TODO: app crashes when plotting too many lines at once
  const parkingRestrictionsLines = parkingRestrictionsData.features.slice(0, 2000).map((feature, index) => {
    const coordinates = feature.geometry.coordinates.map(coord => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    return (
      <Polyline key={index} coordinates={coordinates} strokeColor="red" strokeWidth={3} />
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{...currentCoords, latitudeDelta: 0.01, longitudeDelta: 0.01}}
        showsUserLocation={true}
      >
        {parkingRestrictionsLines}
        {dest && <Marker coordinate={dest} title="Destination" pinColor="blue" />}
        {routeCoords.length > 0 && 
          <Polyline // traces line over route
            coordinates={routeCoords} 
            strokeColor="yellow"  
            strokeWidth={4} 
          />
        }
      </MapView>
    </View>
  );
}


