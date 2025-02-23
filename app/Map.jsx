import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps'; 
import parkingRestrictionsData from "./data/Street_Parking_Restrictions.json";
import FiltersContext from './FiltersContext';
// import { Gyroscope } from 'react-native-sensors';

const MAPBOX_API_KEY = 'pk.eyJ1IjoicmhlYW5hZ29yaSIsImEiOiJjbTdnbXpsencwMDZqMnBxNnJyeWdqbXRkIn0.AYSfmpmLZujFXHct0IEOlA';

export default function Map( {currentCoords, dest} ) {
  const [routeCoords, setRouteCoords] = useState([]); // represents segments along route path 
  const {filters, setFilters} = useContext(FiltersContext);

  // fetches route directions from Mapbox API
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

  // recalculate best route when dest or current location changes
  useEffect(() => {
    if (dest && currentCoords) {
      fetchRoute(currentCoords, dest);
    }
  }, [currentCoords, dest])

  const generateColor = (index) => {
    const colors = [
      "#0000FF", "#FFD700", "#FF8C00", "#8B008B", "#800080",
      "#006400", "#013220", "#8B0000", "#555555", "#222222",
      "#FF4500", "#1E90FF", "#32CD32", "#FF1493", "#00CED1",
    ];
    return colors[index % colors.length]; 
  };

  const parkingTypeColors = {};
  let colorIndex = 0;

  // TODO: app crashes when plotting too many features at once, load 2000 for now
  const parkingRestrictionsLines = parkingRestrictionsData.features
  .slice(0, 2000)
  .map((feature, index) => {
    if (!feature.properties || !feature.geometry || !feature.geometry.coordinates) return null;

    const coordinates = feature.geometry.coordinates.map(coord => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    const restrictionType = feature.properties.Type || "Unknown";
    const restrictionText = feature.properties.Restr_txt_full || "No Info Available"; 

    if (!parkingTypeColors[restrictionType]) {
      parkingTypeColors[restrictionType] = generateColor(colorIndex++);
    }

    const color = parkingTypeColors[restrictionType];

    if (!filters.showNoParking && restrictionType.includes("No Parking")) return null;
    if (!filters.showLoadingZone && restrictionType.includes("LZ")) return null;
    if (!filters.showTwoHour && restrictionType.includes("2HR")) return null;
    if (!filters.showDIS_VET && restrictionType.includes("DIS/VET")) return null;

    const midPointIndex = Math.floor(coordinates.length / 2);
    const midPoint = coordinates[midPointIndex] || coordinates[0];

    return (
      <View key={index}>
        <Polyline
          key={`line-${index}`}
          coordinates={coordinates}
          strokeColor={color}
          strokeWidth={4} 
          zIndex={100} 
        />
        <Marker
          key={`marker-${index}`}
          coordinate={midPoint}
          title={restrictionText}
          pinColor = {color}
        />
      </View>
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
        {dest && <Marker coordinate={dest} title="Destination" pinColor="white" />}
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


