import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function Filters() {
  const [filters, setFilters] = useState({
    showTwoHour: true,
    showLoadingZone: true,
    showNoParking: true,
    showDIS_VET: true,
  });

  const toggleSwitch = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Text style={styles.label}>Show 2 Hour Parking Zones</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={filters.showTwoHour ? 'white' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('showTwoHour')}
          value={filters.showTwoHour}
        />
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.label}>Show Loading Zones</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={filters.showLoadingZone ? 'white' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('showLoadingZone')}
          value={filters.showLoadingZone}
        />
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.label}>Show No Parking Zones</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={filters.showNoParking ? 'white' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('showNoParking')}
          value={filters.showNoParking}
        />
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.label}>Show Disabled/Veteran Zones</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={filters.showDIS_VET ? 'white' : '#f4f3f4'}
          onValueChange={() => toggleSwitch('showDIS_VET')}
          value={filters.showDIS_VET}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 18,
  },
});