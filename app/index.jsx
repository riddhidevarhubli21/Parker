import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator 
} from 'react-native';
import { useFonts } from 'expo-font';


export default function Index() {
  // Load both the regular and italic versions of the DMSerifDisplay font
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Regular': require('../assets/fonts/DMSerifDisplay-Regular.ttf'),
    'DMSerifDisplay-Italic': require('../assets/fonts/DMSerifDisplay-Italic.ttf'),
  });

  // While fonts are loading, show a spinner on the same background color
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Subtitle or main header */}
      <Text style={styles.subtitle}>Find the nearest parking spot</Text>
      

      {/* TextInput for location */}
      <TextInput
        style={styles.input}
        placeholder="Enter your location:"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your destination:"
        placeholderTextColor="#888"
      />

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map will be here!</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Full-screen container with your custom background
  container: {
    flex: 1,
    backgroundColor: '#EAE7EA',
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#EAE7EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'DMSerifDisplay-Italic',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    fontFamily: 'DMSerifDisplay-Regular',
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 18,
  },
});
