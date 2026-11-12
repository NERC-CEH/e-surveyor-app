import { isValidLocation, type Location } from '@flumens';

// eslint-disable-next-line import-x/prefer-default-export
export const hasCoordinates = (
  location?: Partial<Location> | null
): location is Location => isValidLocation(location as Location);
