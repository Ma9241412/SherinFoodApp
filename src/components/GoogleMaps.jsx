import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Button, TextInput, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const originRegion = {
  latitude: 34.742493070007484,
  longitude: 72.36002141933888,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};
const GoogleMaps = () => {
  const [region, setRegion] = useState(originRegion);
  const [searchAddress, setSearchAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions(searchAddress);
  }, [searchAddress]);

  const fetchSuggestions = async query => {
    const apiKey = 'AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0'; // Make sure to replace this with your actual API key
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    try {
      const response = await axios.get(url, {
        params: {
          input: query,
          components: 'country:PK', // Restrict to Pakistan
          key: apiKey,
        },
      });
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching address suggestions', error);
    }
  };

  const handleSelectSuggestion = async suggestion => {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
    try {
      const detailsResponse = await axios.get(placesUrl, {
        params: {
          place_id: suggestion.place_id,
          key: 'AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0',
        },
      });
      const location = detailsResponse.data.result.geometry.location;
      const newRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      };
      setRegion(newRegion);
      setSearchAddress(suggestion.description);
      calculateAndStoreDistance(newRegion);
    } catch (error) {
      console.error('Error fetching place details', error);
    }
  };

  const calculateAndStoreDistance = newRegion => {
    const dist = getDistanceFromLatLonInKm(
      region.latitude,
      region.longitude,
      newRegion.latitude,
      newRegion.longitude,
    );
    setRegion(newRegion);
    setDistance(dist);
    saveData(newRegion, dist);
  };

  const saveData = async (newRegion, dist) => {
    try {
      const jsonData = JSON.stringify({
        address: searchAddress,
        distance: dist,
        coordinates: newRegion,
      });
      console.log('Saving to AsyncStorage:', jsonData);
      await AsyncStorage.setItem('selectedAddress', jsonData);
    } catch (error) {
      console.error('Error saving data to local storage', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter address"
        value={searchAddress}
        onChangeText={setSearchAddress}
      />
      {suggestions.map((suggestion, index) => (
        <Text
          key={index}
          style={styles.suggestion}
          onPress={() => handleSelectSuggestion(suggestion)}>
          {suggestion.description}
        </Text>
      ))}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          draggable
        />
      </MapView>
      <View>
        {searchAddress && <Text>{`Address: ${searchAddress} `}</Text>}
        {distance && <Text>{`Distance: ${distance.toFixed(2)} km`}</Text>}
        <Button
          title="Confirm Address"
          onPress={() => console.log('Address confirmed')}
        />
      </View>
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

// Haversine formula function to calculate distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export default GoogleMaps;
