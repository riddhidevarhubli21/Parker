import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

// Mapping imports 
import MapView, { Polyline } from 'react-native-maps'; // Native platform map 
import parkingRestrictionsData from "./data/Street_Parking_Restrictions.json";

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 43.0736, 
    longitude: -89.3929,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

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
        initialRegion={currentLocation}
      >
        {parkingRestrictionsLines}
      </MapView>
    </View>
  );
}


