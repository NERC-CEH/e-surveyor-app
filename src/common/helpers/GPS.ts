import { Geolocation, Position } from '@capacitor/geolocation';
import type { Location } from '@flumens';

type Options = {
  callback: (error: Error | null, location?: Location) => void;
  onUpdate?: (location: Location) => void;
  accuracyLimit?: number;
};

const GPS_ACCURACY_LIMIT = 100; // meters

const API = {
  running: false,

  start({ callback, onUpdate, accuracyLimit = GPS_ACCURACY_LIMIT }: Options) {
    // geolocation config
    const GPSoptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 60000,
    };

    const onPosition = (position: Position | null, err?: Error) => {
      if (err) {
        callback?.(new Error(err.message));
        return;
      }

      if (!position) return;

      const location = {
        latitude: Number(position.coords.latitude.toFixed(8)),
        longitude: Number(position.coords.longitude.toFixed(8)),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
      };

      if (location.accuracy <= accuracyLimit) {
        callback?.(null, location);
      } else {
        onUpdate?.(location);
      }
    };

    return Geolocation.watchPosition(GPSoptions, onPosition);
  },

  stop(id: string) {
    Geolocation.clearWatch({ id });
  },
};

export default API;
