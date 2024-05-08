export const fetchSuggestions = async query => {
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
