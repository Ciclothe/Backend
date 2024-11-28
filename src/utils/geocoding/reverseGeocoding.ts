import axios from "axios";


export async function reverseGeocoding(lat: number, lng: number) { 
    console.log(lat, lng);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_TOKEN}`;
    
    try {
        const response = await axios.get(url);
    
        if (
        response.data.features &&
        response.data.features.length > 0
        ) {
        const { place_name } = response.data.features[0];
        console.log(place_name);
        return place_name;
        } else {
        throw new Error('Results not found for the address');
        }
    } catch (error) {
        throw new Error(`Mapbox error: ${error.message}`);
    }
}
