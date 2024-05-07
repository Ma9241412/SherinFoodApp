import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const originRegion = {
  latitude: 34.742493070007484,
  longitude: 72.36002141933888,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
};

const GoogleMaps = ({navigation}) => {
  const [region, setRegion] = useState(originRegion);
  const [markerPosition, setMarkerPosition] = useState(originRegion);
  const [searchAddress, setSearchAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [addressSelected, setAddressSelected] = useState(false);
  const [pathCoordinates, setPathCoordinates] = useState([]);

  const onMarkerDragEnd = e => {
    const newPosition = e.nativeEvent.coordinate;
    setMarkerPosition(newPosition);
    setRegion(newPosition);
    calculateAndStoreDistance(newPosition);
  };

  useEffect(() => {
    if (searchAddress === '') {
      setRegion(originRegion);
      setMarkerPosition(originRegion);
      setPathCoordinates([]);
    } else {
      fetchSuggestions(searchAddress);
    }
  }, [searchAddress]);

  const fetchSuggestions = async query => {
    const apiKey = 'AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    try {
      const response = await axios.get(url, {
        params: {
          input: query,
          components: 'country:PK',
          key: apiKey,
        },
      });
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching address suggestions', error);
    }
  };

  const calculateRegion = (point1, point2) => {
    const latitude = (point1.latitude + point2.latitude) / 2;
    const longitude = (point1.longitude + point2.longitude) / 2;

    const latitudeDelta = Math.abs(point1.latitude - point2.latitude) * 2; // multiply by 2 for some padding
    const longitudeDelta = Math.abs(point1.longitude - point2.longitude) * 2; // multiply by 2 for some padding

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
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
      const newRegion = calculateRegion(originRegion, {
        latitude: location.lat,
        longitude: location.lng,
      });

      setRegion(newRegion);
      setSearchAddress(suggestion.description); // Set search address before calculating distance
      setAddressSelected(true); // Mark address as selected
      setSuggestions([]); // Clear suggestions
      setPathCoordinates([
        {latitude: originRegion.latitude, longitude: originRegion.longitude},
        {latitude: location.lat, longitude: location.lng},
      ]);
      calculateAndStoreDistance(newRegion); // Call this after updating the region and address
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
          coordinate={markerPosition}
          onDragEnd={onMarkerDragEnd}
          draggable
        />
        {pathCoordinates.length > 0 && (
          <Polyline
            coordinates={pathCoordinates}
            strokeColor="#FF0000"
            strokeWidth={6}
          />
        )}
      </MapView>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}>
        {searchAddress && <Text>{`Address: ${searchAddress}`}</Text>}
        {distance && <Text>{`Distance: ${distance.toFixed(2)} km`}</Text>}
        <TouchableOpacity
          style={[styles.Button, !addressSelected && styles.disabledButton]}
          onPress={() => {
            if (addressSelected) {
              navigation.navigate('Home');
            } else {
              Alert.alert('Validation', 'Please select an address first.');
            }
          }}
          disabled={!addressSelected}>
          <Text style={styles.ButtonText}>Confirm Address</Text>
        </TouchableOpacity>
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
  Button: {
    backgroundColor: '#FEC919',
    paddingVertical: 13,
    borderRadius: 5,
  },
  ButtonText: {
    textAlign: 'center',
    color: 'white',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  suggestion: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#CDCDCD',
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
