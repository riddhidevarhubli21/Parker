import React, { useState, useEffect } from 'react';
import Map from './Map'
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  ActivityIndicator, 
  Text
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Index() {
  const [originInput, setOriginInput] = useState(''); // Holds user-entered origin text
  const [destinationInput, setDestinationInput] = useState(''); // Holds user-entered destination text
  const [originCoords, setOriginCoords] = useState(null); // Stores geocoded origin coordinates
  const [destinationCoords, setDestinationCoords] = useState(null); // Stores geocoded destination coordinates
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Array for the route path
  const [loading, setLoading] = useState(false);
  
  // Get user's current location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      // Start watching the user's location for live updates
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setOriginCoords(newLocation);
          // If destination is set, update the route as you move
          if (destinationCoords) {
            fetchRoute(newLocation, destinationCoords);
          }
          setLoading(false);
        }
      );
      // Cleanup subscription on unmount
      return () => subscription.remove();
    })();
  }, [originCoords, destinationCoords]);
  /*
  // Function to handle manual entry for both origin and destination
  const handleSetLocations = async () => {
    if (!originInput.trim() || !destinationInput.trim()) return;
    setLoading(true);
    try {
      // Geocode the origin using Mapbox's API
      const originResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(originInput)}.json?access_token=${MAPBOX_API_KEY}`
      );
      const originData = await originResponse.json();
      let originCoord = null;
      if (originData.features && originData.features.length > 0) {
        const coords = originData.features[0].center; // [longitude, latitude]
        originCoord = { latitude: coords[1], longitude: coords[0] };
        setOriginCoords(originCoord);
      } else {
        console.error('No origin location found');
      }

      // Geocode the destination using Mapbox's API
      const destResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationInput)}.json?access_token=${MAPBOX_API_KEY}`
      );
      const destData = await destResponse.json();
      let destCoord = null;
      if (destData.features && destData.features.length > 0) {
        const coords = destData.features[0].center;
        destCoord = { latitude: coords[1], longitude: coords[0] };
        setDestinationCoords(destCoord);
      } else {
        console.error('No destination location found');
      }

      // Fetch the route if both coordinates are available
      if (originCoord && destCoord) {
        await fetchRoute(originCoord, destCoord);
      }
    } catch (error) {
      console.error('Error in geocoding:', error);
    }
    setLoading(false);
  };
  */

  // Function to fetch route directions from Mapbox Directions API
  const fetchRoute = async (origin, dest) => {
    try {
      const dirResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`
      );
      const dirData = await dirResponse.json();
      if (dirData.routes && dirData.routes.length > 0) {
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
    // Function to geocode the destination entered by the user
    const handleSetDestination = async () => {
      if (!destinationInput.trim()) return;
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationInput)}.json?access_token=${MAPBOX_API_KEY}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const coords = data.features[0].center; // [longitude, latitude]
          const dest = { latitude: coords[1], longitude: coords[0] };
          setDestinationCoords(dest);
          // If origin is available, fetch the route immediately
          if (originCoords) {
            fetchRoute(originCoords, dest);
          }
        } else {
          console.error('No destination found');
        }
      } catch (error) {
        console.error('Error geocoding destination:', error);
      }
    };

    if (loading || !originCoords) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Loading location...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            ...originCoords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {destinationCoords && (
            <Marker coordinate={destinationCoords} title="Destination" pinColor="blue" />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline 
              coordinates={routeCoordinates} 
              strokeColor="yellow"  // Yellow path for the route
              strokeWidth={4} 
            />
          )}
        </MapView>
  
        {/* Input container to enter destination */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            placeholderTextColor="#888"
            value={destinationInput}
            onChangeText={setDestinationInput}
          />
          <Button title="Set Destination" onPress={handleSetDestination} />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    inputContainer: {
      position: 'absolute',
      top: 50,
      left: 10,
      right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});