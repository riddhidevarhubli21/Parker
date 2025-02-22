import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Index() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user's current location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // Handle destination search
  const handleSetDestination = async () => {
    if (!destination.trim()) return;
    setLoading(true);
    try {
      // Use Mapbox Geocoding API to convert destination to coordinates
      const geoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          destination
        )}.json?access_token=${pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA}`
      );
      const geoData = await geoResponse.json();
      if (geoData.features && geoData.features.length > 0) {
        const coords = geoData.features[0].center; // [longitude, latitude]
        const dest = { latitude: coords[1], longitude: coords[0] };
        setDestinationCoords(dest);
        // Once destination is set, fetch route directions
        await fetchRoute(currentLocation, dest);
      } else {
        console.error('No location found');
      }
    } catch (error) {
      console.error('Error in geocoding:', error);
    }
    setLoading(false);
  };

  // Fetch route using Mapbox Directions API
  const fetchRoute = async (origin, dest) => {
    if (!origin || !dest) return;
    try {
      const dirResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`
      );
      const dirData = await dirResponse.json();
      if (dirData.routes && dirData.routes.length > 0) {
        // Convert the coordinates from [longitude, latitude] to { latitude, longitude }
        const coords = dirData.routes[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoordinates(coords);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Component */}
      <MapView style={styles.map} initialRegion={currentLocation}>
        <Marker coordinate={currentLocation} title="You are here" />
        {destinationCoords && (
          <Marker coordinate={destinationCoords} title="Destination" pinColor="blue" />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeColor="red" strokeWidth={3} />
        )}
      </MapView>

      {/* Search and Navigation Controls */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor="#888"
          onChangeText={setDestination}
          value={destination}
        />
        <Button title="Go" onPress={handleSetDestination} />
      </View>
      {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#000" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAE7EA', // Custom background color
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
  },
});
