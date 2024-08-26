import { useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
  accuracy: 'high' | 'low';
}

interface UseLocationResult {
  location: Location | null;
  error: string | null;
  loading: boolean;
}

const getBrowserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        // Attempt to get location from browser's Geolocation API
        const position = await getBrowserLocation();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: 'high',
        });
      } catch (geolocationError) {
        // If Geolocation fails, fall back to IP-based location
        try {
          const response = await axios.get('http://ip-api.com/json');
          setLocation({
            latitude: response.data.lat,
            longitude: response.data.lon,
            city: response.data.city,
            region: response.data.region,
            country: response.data.country,
            accuracy: 'low',
          });
        } catch (ipApiError) {
          setError('Unable to retrieve location.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, error, loading };
};
