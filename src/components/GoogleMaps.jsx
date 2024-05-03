import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  Text,
  AsyncStorage,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';

const GoogleMaps = () => {
  const [region, setRegion] = useState({
    latitude: 34.742493070007484,
    longitude: 72.36002141933888,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const [searchAddress, setSearchAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async query => {
    const apiKey = 'AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    try {
      const response = await axios.get(url, {
        params: {
          input: query,
          components: 'country:PK', // Restrict to Pakistan
          key: apiKey,
        },
      });
      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching address suggestions', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchSuggestions(searchAddress);
  }, [searchAddress]);

  const handleSelectLocation = async newRegion => {
    setRegion(newRegion);
  };

  const handleSearchInputChange = text => {
    setSearchAddress(text);
    fetchSuggestions(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter address"
        value={searchAddress}
        onChangeText={handleSearchInputChange}
      />
      {suggestions.map((suggestion, index) => (
        <Text
          key={index}
          style={styles.suggestion}
          onPress={() => setSearchAddress(suggestion.description)}>
          {suggestion.description}
        </Text>
      ))}
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleSelectLocation}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          draggable
          onDragEnd={e => handleSelectLocation(e.nativeEvent.coordinate)}
          anchor={{x: 0.5, y: 0.5}}
        />
      </MapView>
      {distance && <Text>{`Distance: ${distance} km`}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  map: {
    flex: 1,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  suggestion: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default GoogleMaps;
