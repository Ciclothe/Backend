import axios from 'axios';
import { env } from 'process';

export async function ltdAndLong(
  address: string,
  postalCode: string
): Promise<{ lat: number; lng: number }> {
  const encodedAddress = encodeURIComponent(`${address}, ${postalCode}`);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${env.MAPBOX_TOKEN}`;

  try {
    const response = await axios.get(url);

    if (
      response.data.features &&
      response.data.features.length > 0
    ) {
      const [lng, lat] = response.data.features[0].geometry.coordinates;
      return { lat, lng }; 
    } else {
      throw new Error('No se encontraron resultados para la dirección');
    }
  } catch (error) {
    throw new Error(`Error al geocodificar con Mapbox: ${error.message}`);
  }
}
