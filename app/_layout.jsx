// app/_layout.jsx
import React from 'react';
import { Stack } from 'expo-router/stack';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Italic': require('../assets/fonts/DMSerifDisplay-Italic.ttf'),
    'DMSerifDisplay-Regular': require('../assets/fonts/DMSerifDisplay-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        // This sets the header title for every screen in this layout
        headerTitle: 'PARKER.',
        headerTitleStyle: {
          fontFamily: 'DMSerifDisplay-Italic',
          fontSize: 40,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#EAE7EA',
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

