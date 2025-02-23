import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import FiltersContext from "../FiltersContext";
import { useState } from "react";

export default function TabLayout() {
  const [filters, setFilters] = useState({
      showTwoHour: true,
      showLoadingZone: true,
      showNoParking: false,
      showDIS_VET: true,
  });

  return (
    <FiltersContext.Provider value={{filters, setFilters}}>
      <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'blue', 
        headerTitle:"Parker", 
        headerShown: false
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="filters"
          options={{
            title: 'Filters',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs>
    </FiltersContext.Provider>
  );
}