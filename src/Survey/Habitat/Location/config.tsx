import { locationOutline } from 'ionicons/icons';
import {
  BlockT,
  ChoiceInputConf,
  inferBlockType,
  LocationData,
  TextInputConf,
  NumberInputConf,
  LocationType,
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
  id: 'smpAttr:length',
  type: 'numberInput',
  placeholder: 'Length',
  suffix: 'm',
} as const satisfies NumberInputConf;

export const siteWidthAttr = {
  id: 'smpAttr:width',
  type: 'numberInput',
  placeholder: 'Width',
  suffix: 'm',
} as const satisfies NumberInputConf;

export const siteSizeAttr = {
  id: 'smpAttr:size',
  type: 'numberInput',
  placeholder: 'Area size',
  suffix: 'ha',
  step: 0.01,
  validation: { min: 0 },
} as const satisfies NumberInputConf;

export const activitiesAttr = {
  id: 'smpAttr:activities',
  type: 'choiceInput',
  multiple: true,
  choices: [
    { title: 'Reseeded', dataName: '-1' },
    { title: 'Fertilised', dataName: '-2' },
    { title: 'Mown / cut', dataName: '-3' },
    { title: 'Herbicide / Pesticide', dataName: '-4' },
    { title: 'Scrub clearance', dataName: '-5' },
    { title: 'No known management', dataName: '-6' },
    { title: 'Unknown', dataName: '-7' },
  ],
} as const satisfies ChoiceInputConf;

export const habitatAttr = {
  id: 'smpAttr:habitat',
  type: 'choiceInput',
  choices: levelThreeHabitats.map(({ name, id }) => ({
    title: name,
    dataName: id,
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

/**
 * utility type that transforms a record of block configurations
 * into a record of their corresponding value types
 *
 * @example
 * type Config = {
 *   'smpAttr:123': { block: NumberInputConf };
 *   'smpAttr:456': { block: TextInputConf };
 *   'other': { something: string }; // returns unknown
 * };
 * type Result = inferAttrConfigTypes<Config>;
 * // Result = { 'smpAttr:123': number; 'smpAttr:456': string; 'other': unknown }
 */
type inferAttrConfigTypes<T extends Record<string, unknown>> = {
  -readonly [K in keyof T]: T[K] extends { block: infer B extends BlockT }
    ? inferBlockType<B>
    : unknown;
};

export type Data = LocationData &
  inferAttrConfigTypes<typeof attrs> & { location?: LocationOld };

export default survey;
