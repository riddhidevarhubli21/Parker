import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Text,
  Keyboard
} from 'react-native';
import * as Location from 'expo-location';
import Map from '../Map'
import Autocomplete from 'react-native-autocomplete-input';

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Index() {

  const [currentCoords, setCurrentCoords] = useState(null); // the user's current coordinates
  const [locationEnabled, setLocationEnabled] = useState(false); // whether user has allowed location services
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState(true);
  
  useEffect(() => {
    // prompt user for permission to allow location tracking 
    (async () => {
      let { status } = await  Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
        setLocationEnabled(false);
        return;
     } else {
       console.log('Access was granted.')
       setLocationEnabled(true)
     }

    if (status) {
      // subscribe to user location updates 
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setCurrentCoords(newLocation);
          setLoading(false);
        }
      );
    }
    // Cleanup subscription on unmount
    return () => subscription.remove();
    })();
  }, []);

  const fetchSuggestions = async (query) => {
    if(query.length < 3){
      setSuggestions([]);
      return;
    }
    try{
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_API_KEY}`);
      const data = await response.json();
      if(data.features){
        setSuggestions(data.features);
      }
    } catch(error){
      console.error("Error fetching suggestions :", error);
    }
  };

  const handleDestinationQueryChange = (text) => {
    setDestinationQuery(text);
    fetchSuggestions(text);
  }

  const handleSuggestionSelect = (item) => {
    setDestinationQuery(item.place_name);
    setSuggestions([]);
    const coords = item.center;
    const dest = { latitude: coords[1], longitude: coords[0]};
    setDestinationCoords(dest);
    if(originCoords) {
      fetchRoute(originCoords, dest);
    } 
    Keyboard.dismiss();
  };

  const handleSubmitDestination = () => {
    if(suggestions.length > 0){
      handleSuggestionSelect(suggestions[0]);
    } else {
      console.error('No suggestions available for this query');
    }
    Keyboard.dismiss();
  }
  // check if user has entered a valid destination 
  const handleSetDestination = async () => {
    Keyboard.dismiss();
    if (!destinationInput.trim()) return;
    try {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationInput)}.json?access_token=${MAPBOX_API_KEY}`
      );
      const data = await resp.json();

      if (data.features && data.features.length > 0) {
        const coords = data.features[0].center; // [longitude, latitude]
        const dest = { latitude: coords[1], longitude: coords[0] };
        setDestinationCoords(dest);
      } else {
        console.error('No destination found');
      }
    } catch (error) {
      console.error('Error getting destination:', error);
    }
  };

  if (loading || !currentCoords) {
    console.log("here")
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map currentCoords={currentCoords} dest={destinationCoords}/>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor="#888"
          value={destinationInput}
          onChangeText={setDestinationInput}
        />
      </View>
      <View style={styles.inputContainer}>
        <Autocomplete
          data={suggestions}
          defaultValue={destinationQuery}
          onChangeText={handleDestinationQueryChange}
          placeholder="Enter destination"
          placeholderTextColor="#888"
          onSubmitEditing={handleSubmitDestination} 
          flatListProps={{
            keyExtractor: (item) => item.id,
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
                <Text style={styles.itemText}>{item.place_name}</Text>
              </TouchableOpacity>
            ),
          }}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.autocompleteInputContainer}
          listStyle={styles.autocompleteList}
        />
      </View>
    </View>

    
  );
}
  
const styles = StyleSheet.create({
  container: {
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
  autocompleteContainer: {
    width: '100%', // Use the full available width
  },
  // Style for the input container (the text box itself)
  autocompleteInputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12, // Increase horizontal padding for more space
    height: 45, // Increase height for a larger text box
  },
  // Style for the suggestions list
  autocompleteList: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 200, // Limit maximum height so it doesn't extend too far
  },
  itemText: {
    padding: 10,
    fontSize: 16,
  }
});