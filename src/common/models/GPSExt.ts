import { observable } from 'mobx';
import type { Location } from '@flumens';
import GPS from 'helpers/GPS';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

export type GPSExtension = {
  gps: { locating: string | null };
  startGPS: (
    setLocation: (location: Location) => void,
    accuracyLimit?: number
  ) => Promise<void>;
  stopGPS: () => void;
  isGPSRunning: () => boolean;
};

const extension = (): GPSExtension => ({
  gps: observable({ locating: '' }),

  async startGPS(
    setLocation: (newLocation: Location) => void,
    accuracyLimit = DEFAULT_ACCURACY_LIMIT
  ) {
    const that = this;
    const options = {
      accuracyLimit,

      callback(error: Error | null, location?: Location) {
        if (error) {
          that.stopGPS();
          return;
        }
        if (!location) return;

        if ((location.accuracy ?? Infinity) <= options.accuracyLimit) {
          that.stopGPS();
        }

        setLocation(location);
      },
    };

    this.gps.locating = await GPS.start(options);
  },

  stopGPS() {
    if (!this.gps.locating) return;

    GPS.stop(this.gps.locating);
    this.gps.locating = '';
  },

  isGPSRunning() {
    return !!this.gps.locating;
  },
});

export default extension;
