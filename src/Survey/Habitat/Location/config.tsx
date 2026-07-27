import { locationOutline } from 'ionicons/icons';
import {
  ChoiceInputConf,
  LocationData,
  TextInputConf,
  NumberInputConf,
  LocationType,
  inferAttrConfigTypes,
} from '@flumens';
import { Location as LocationOld } from '@flumens/utils/dist/location';
import habitats from 'common/data/ukhab';
import Location from 'models/location';

const levelThreeHabitats = habitats.filter(h => h.level === 3);

export const siteNameAttr = {
  id: 'name',
  type: 'textInput',
  title: 'Site name',
  description:
    'This name will be used to group surveys from the same location.',
  placeholder: 'e.g. North meadow, Top field margin...',
} as const satisfies TextInputConf;

export const siteLengthAttr = {
  id: 'locAttr:439',
  type: 'numberInput',
  placeholder: 'Length',
  suffix: 'm',
} as const satisfies NumberInputConf;

export const siteWidthAttr = {
  id: 'locAttr:440',
  type: 'numberInput',
  placeholder: 'Width',
  suffix: 'm',
} as const satisfies NumberInputConf;

export const siteSizeAttr = {
  id: 'locAttr:441',
  type: 'numberInput',
  placeholder: 'Area size',
  suffix: 'ha',
  step: 0.01,
  validation: { min: 0 },
} as const satisfies NumberInputConf;

export const activitiesAttr = {
  id: 'locAttr:442',
  type: 'choiceInput',
  multiple: true,
  choices: [
    { title: 'Reseeded', dataName: '24806' },
    { title: 'Fertilised', dataName: '24807' },
    { title: 'Mown / cut', dataName: '24808' },
    { title: 'Herbicide / Pesticide', dataName: '24809' },
    { title: 'Scrub clearance', dataName: '24810' },
    { title: 'No known management', dataName: '24811' },
    { title: 'Unknown', dataName: '24812' },
  ],
} as const satisfies ChoiceInputConf;

export const HABITAT_ID = 443;
export const habitatAttr = {
  id: `locAttr:${HABITAT_ID}`,
  type: 'choiceInput',
  choices: levelThreeHabitats.map(({ name, warehouseId }) => ({
    title: name,
    dataName: warehouseId,
  })),
} as const satisfies ChoiceInputConf;

export const locationCommentAttr = {
  id: 'comment',
  type: 'textInput',
  title: 'Notes',
  appearance: 'multiline',
  placeholder:
    'Optional notes (e.g. grazing intensity, timing, recent changes)',
} as const satisfies TextInputConf;

const attrs = {
  [siteSizeAttr.id]: siteSizeAttr,
  [siteLengthAttr.id]: siteLengthAttr,
  [siteWidthAttr.id]: siteWidthAttr,
  [activitiesAttr.id]: activitiesAttr,
  [habitatAttr.id]: habitatAttr,
};

const survey = {
  label: 'Habitat',
  baseURL: '/survey/habitat/location',
  icon: locationOutline,

  attrs,

  create() {
    const location = new Location({
      data: {
        surveyId: '626', // Hardcoded, so that we bypass any site-wide mandatory location attributes. Discussed on 23/07/2026 with John.
        locationTypeId: LocationType.Site,
        name: '',
        boundaryGeom: '',
        lat: '',
        lon: '',
        centroidSref: '',
        centroidSrefSystem: '4326',
      },
    });

    // location.startGPS(); we allow the user to draw boundary by default, so we don't start GPS automatically

    return location;
  },
} as const;

export type Data = LocationData &
  inferAttrConfigTypes<typeof attrs> & { location?: LocationOld };

export default survey;
