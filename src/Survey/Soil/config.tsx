/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable no-param-reassign */
import { listOutline, locationOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Survey, blockToAttr, locationAttr } from 'Survey/common/config';
import field from './common/field.svg';
import soil from './common/soil.svg';

const fieldIcon = (<IonIcon src={field} className="size-6" />) as any;
const soilIcon = (<IonIcon src={soil} className="size-6" />) as any;

const locationOutlineIcon = (
  <IonIcon src={locationOutline} className="size-6" />
) as any;

const listOutlineIcon = (
  <IonIcon src={listOutline} className="size-6" />
) as any;

export const farmNameAttr = {
  id: 'farmName-1',
  type: 'textInput',
  title: 'Farm name',
  prefix: locationOutlineIcon,
  validations: { required: true },
} as const;

export const fieldNameAttr = {
  id: 'fieldName-1',
  type: 'textInput',
  title: 'Field name',
  prefix: locationOutlineIcon,
  validations: { required: true },
} as const;

export const LAND_USE_OTHER_VALUE = 'other-1';
const LAND_USE_ARABLE_VALUE = 'Arable-1';
const LAND_USE_GRASSLAND_VALUE = 'Grassland-1';
const LAND_USE_ARABLE_LEY_VALUE = 'Arable-Ley-1';

export const landUseAttr = {
  id: 'landUse-1',
  type: 'choiceInput',
  title: 'Land use',
  prefix: listOutlineIcon,
  container: 'page',
  choices: [
    { title: 'Arable', dataName: LAND_USE_ARABLE_VALUE },
    { title: 'Arable-Ley', dataName: LAND_USE_ARABLE_LEY_VALUE },
    { title: 'Grassland', dataName: LAND_USE_GRASSLAND_VALUE },
    { title: 'Perennial Fruit', dataName: 'Perennial-1' },
    { title: 'Woodland', dataName: 'Woodland-1' },
    { title: 'Fallow', dataName: 'Fallow-1' },
    { title: 'Other', dataName: LAND_USE_OTHER_VALUE },
  ],
  onChange(newValue: any, _: any, { record }: any) {
    // eslint-disable-next-line no-param-reassign
    record[landUseAttr.id] = newValue;
    delete record[cropAttr().id];
    delete record[prevCrop1Attr().id];
    delete record[prevCrop2Attr().id];
    return newValue;
  },
} as const;

export const landUseOtherAttr = {
  id: 'landUseOther-1',
  type: 'textInput',
  title: 'Other land use',
  appearance: 'multiline',
} as const;

export const CROP_OTHER_VALUE = 'Other-1';
const ARABLE_LAND_USE_OPTIONS = [
  { title: 'Wheat', dataName: 'Wheat-1' },
  { title: 'Barley', dataName: 'Barley-1' },
  { title: 'Oats', dataName: 'Oats-1' },
  { title: 'Oilseed rape', dataName: 'Oilseed-1' },
  { title: 'Sugar beet', dataName: 'Sugar-1' },
  { title: 'Field peas', dataName: 'Peas-1' },
  { title: 'Field beans', dataName: 'Field-1' },
  { title: 'Fresh vegetables', dataName: 'Fresh-1' },
  { title: 'Plants and flowers', dataName: 'Plants-1' },
  { title: 'Potatoes', dataName: 'Potatoes-1' },
  { title: 'Fresh fruit', dataName: 'Fresh-1' },
  { title: 'Linseed', dataName: 'Linseed-1' },
  { title: 'Other', dataName: CROP_OTHER_VALUE },
];
const GRASSLAND_LAND_USE_OPTIONS = [
  { title: 'Permanent improved grassland', dataName: 'improved-1' },
  { title: 'Permanent unimproved grassland', dataName: 'unimproved-1' },
  { title: 'Temporary Grassland - conventional', dataName: 'temporary-1' },
  {
    title: 'Temporary Grassland - grass-clover ley',
    dataName: 'temporary-32',
  },
  {
    title: 'Temporary Grassland - Lucerne',
    dataName: 'temporary-22',
  },
  {
    title: 'Temporary Grassland - Herbal Ley',
    dataName: 'temporary-12',
  },
  {
    title: 'Temporary Grassland - Fodder Crop',
    dataName: 'temporary-02',
  },
];
const cropChoices = {
  [LAND_USE_ARABLE_VALUE]: ARABLE_LAND_USE_OPTIONS,
  [LAND_USE_GRASSLAND_VALUE]: GRASSLAND_LAND_USE_OPTIONS,
  [LAND_USE_ARABLE_LEY_VALUE]: [
    ...GRASSLAND_LAND_USE_OPTIONS,
    ...ARABLE_LAND_USE_OPTIONS,
  ],
} as const;

export const cropAttr = (attrs?: any) => {
  const landUse = attrs?.[landUseAttr.id] as keyof typeof cropChoices;
  return {
    id: 'crop-1',
    type: 'choiceInput',
    title: 'Current crop',
    hidden: !attrs || !cropChoices[landUse],
    prefix: listOutlineIcon,
    container: 'page',
    choices: attrs ? cropChoices[landUse] || [] : [],
  } as const;
};

export const prevCrop1Attr = (attrs?: any) => {
  const landUse = attrs?.[landUseAttr.id] as keyof typeof cropChoices;
  return {
    id: 'prev-crop-1',
    type: 'choiceInput',
    title: 'Most recent cropping',
    hidden: !attrs || !cropChoices[landUse],
    prefix: listOutlineIcon,
    container: 'page',
    choices: attrs ? cropChoices[landUse] || [] : [],
  } as const;
};

export const prevCrop2Attr = (attrs?: any) => {
  const landUse = attrs?.[landUseAttr.id] as keyof typeof cropChoices;
  return {
    id: 'prev-crop-2',
    type: 'choiceInput',
    title: 'Previous cropping',
    hidden: !attrs || !cropChoices[landUse],
    prefix: listOutlineIcon,
    container: 'page',
    choices: attrs ? cropChoices[landUse] || [] : [],
  } as const;
};

export const cropOtherAttr = {
  id: 'cropOther-1',
  type: 'textInput',
  title: 'Other crop',
  appearance: 'multiline',
} as const;

export const tillageAttr = {
  id: 'tillage-1',
  type: 'choiceInput',
  title: 'Tillage practices',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Conventional - Plough', dataName: 'Tillage-1' },
    { title: 'Conventional - Top Down', dataName: 'Tillage-2' },
    { title: 'Minimal/conservation tillage', dataName: 'Minimal-1' },
    { title: 'No-till', dataName: 'No-till-1' },
  ],
} as const;

const COVER_CROP_OTHER_VALUE = 'Other-1';
export const coverCropAttr = {
  id: 'coverCrop-1',
  type: 'choiceInput',
  title: 'Current cover or catch crop',
  prefix: listOutlineIcon,
  container: 'page',
  multiple: true,
  choices: [
    { title: 'Barley', dataName: 'Barley-1' },
    { title: 'Clover', dataName: 'Clover-1' },
    { title: 'Field Beans', dataName: 'Field-1' },
    { title: 'Forage Rape', dataName: 'Rap-1' },
    { title: 'Kale', dataName: 'Kale-1' },
    { title: 'Mustard', dataName: 'Mustard-1' },
    { title: 'Oats', dataName: 'Oats-1' },
    { title: 'Peas', dataName: 'Peas-1' },
    { title: 'Phacelia', dataName: 'Phaceli-1' },
    { title: 'Radish', dataName: 'Radis-1' },
    { title: 'Straw  ', dataName: 'Straw-1' },
    { title: 'Stubble Turnips', dataName: 'Turnip-1' },
    { title: 'Vetch', dataName: 'Vetc-1' },
    { title: 'Westerwolds Ryegrass', dataName: 'Westerwolds-1' },
    { title: 'Winter Rye', dataName: 'Winter-1' },
    { title: 'Other', dataName: COVER_CROP_OTHER_VALUE },
  ],
} as const;

export const prevCoverCropAttr = {
  id: 'prec-coverCrop-1',
  type: 'choiceInput',
  title: 'Preceding cover or catch crop',
  prefix: listOutlineIcon,
  container: 'page',
  multiple: true,
  choices: [
    { title: 'Field Beans', dataName: 'Field-1' },
    { title: 'Peas', dataName: 'Peas-1' },
    { title: 'Clover', dataName: 'Clover-1' },
    { title: 'Mustard', dataName: 'Mustard-1' },
    { title: 'Kale', dataName: 'Kale-1' },
    { title: 'Winter Rye', dataName: 'Winter-1' },
    { title: 'Oats', dataName: 'Oats-1' },
    { title: 'Barley', dataName: 'Barley-1' },
    { title: 'Straw  ', dataName: 'Straw-1' },
    { title: 'Other', dataName: COVER_CROP_OTHER_VALUE },
  ],
} as const;

export const coverCropOtherAttr = {
  id: 'coverCropOther-1',
  type: 'textInput',
  title: 'Other current cover crop',
  appearance: 'multiline',
} as const;

export const prevOverCropOtherAttr = {
  id: 'prev-coverCropOther-1',
  type: 'textInput',
  title: 'Other preceding cover crop',
  appearance: 'multiline',
} as const;

export const SOMIDAttr = {
  id: 'SOMID-1',
  type: 'textInput',
  prefix: listOutlineIcon,
  title: 'Sample ID',
} as const;

export const soilTypeAttr = {
  id: 'soil-1',
  type: 'choiceInput',
  title: 'Broad soil type',
  prefix: fieldIcon,
  container: 'page',
  choices: [
    { title: 'Heavy clay soils with poor drainage', dataName: 'Heavy-1' },
    { title: 'Light soils with free drainage', dataName: 'Light-1' },
    {
      title: 'Light soils with moderate & poor drainage',
      dataName: 'Light-m-1',
    },
    { title: 'Medium soils with free drainage', dataName: 'free-1' },
    { title: 'Medium soils with moderate drainage', dataName: 'moderate-1' },
    { title: 'Medium with soils poor drainage', dataName: 'poor-1' },
    { title: 'Peat', dataName: 'Peat-1' },
    { title: 'Organic soils with poor drainage', dataName: 'Organic-poor-1' },
    { title: 'Organic soils with free drainage', dataName: 'Organic-1' },
    { title: 'Man-made soils', dataName: 'Man-1' },
    { title: 'Alluvial and coastal soils', dataName: 'Alluvial-1' },
    { title: 'Shallow soils', dataName: 'Shallow-1' },
  ],
} as const;

export const soilSurfaceAttr = {
  id: 'soilsurface-1',
  type: 'choiceInput',
  title: 'Soil surface condition',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Strong', dataName: 'Strong-1' },
    { title: 'Moderate', dataName: 'Moderate-1' },
    { title: 'Weak', dataName: 'Weak-1' },
  ],
} as const;

export const aggregateSizeAttr = {
  id: 'aggregates-1',
  type: 'choiceInput',
  title: 'Size of aggregates',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Small rounded', dataName: 'Small-1' },
    { title: 'Some medium/angular', dataName: 'some-1' },
    { title: 'Large/no aggregates', dataName: 'large-1' },
  ],
} as const;

export const soilStrengthAttr = {
  id: 'strength-1',
  type: 'choiceInput',
  title: 'Soil strength',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Friable', dataName: 'Friable-1' },
    { title: 'Firm', dataName: 'Firm-1' },
    { title: 'Compact', dataName: 'Compact-1' },
  ],
} as const;

export const rootsAttr = {
  id: 'roots-1',
  type: 'choiceInput',
  title: 'Visible roots',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Abundant roots', dataName: 'Abundant-1' },
    { title: 'Roots confined to pores/fissures', dataName: 'Roots-1' },
    { title: 'Without or few roots', dataName: 'Without-1' },
  ],
} as const;

export const SOMPatternAttr = {
  id: 'som-pattern-1',
  type: 'choiceInput',
  title: 'Pattern',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: '‘W’ pattern', dataName: 'w-1' },
    { title: 'Whole field', dataName: 'field-1' },
  ],
} as const;

export const SOMDepthAttr = {
  id: 'som-depth-1',
  type: 'numberInput',
  title: 'Depth',
  prefix: listOutlineIcon,
  suffix: 'cm',
  appearance: 'counter',
  validations: { min: 0, max: 200 },
} as const;

export const SOMDiameterAttr = {
  id: 'som-diameter-1',
  type: 'numberInput',
  title: 'Auger diameter',
  prefix: listOutlineIcon,
  suffix: 'cm',
  appearance: 'counter',
  validations: { min: 1.3, max: 20 },
} as const;

export const labNameAttr = {
  id: 'lab-name-1',
  type: 'textInput',
  title: 'Lab name',
  prefix: listOutlineIcon,
} as const;

export const labTOCAttr = {
  id: 'som-TOC-Carbonate-1',
  type: 'numberInput',
  title: 'Total Organic Carbon',
  prefix: listOutlineIcon,
  step: 0.01,
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const labSOMAttr = {
  id: 'som-SOM-Carbonate-1',
  type: 'numberInput',
  title: 'Soil Organic Matter (TOC x 1.72)',
  prefix: listOutlineIcon,
  step: 0.1,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labLOIAttr = {
  id: 'som-LOI-Carbonate-1',
  type: 'numberInput',
  title: 'Loss on Ignition',
  prefix: listOutlineIcon,
  step: 0.1,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labCalciumCarbonateAttr = {
  id: 'som-Calcium-Carbonate-1',
  type: 'numberInput',
  title: 'Calcium Carbonate',
  prefix: listOutlineIcon,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labNitrogenAttr = {
  id: 'som-Nitrogen-1',
  type: 'numberInput',
  title: 'Total Nitrogen',
  prefix: listOutlineIcon,
  suffix: '%',
  step: 0.01,
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labCationAttr = {
  id: 'som-Cation-1',
  type: 'numberInput',
  title: 'Cation Exchange Capacity',
  prefix: listOutlineIcon,
  suffix: 'meq/l',
  step: 0.1,
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const labSandAttr = {
  id: 'som-Sand-1',
  type: 'numberInput',
  title: 'Sand',
  prefix: listOutlineIcon,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labSiltAttr = {
  id: 'som-Silt-1',
  type: 'numberInput',
  title: 'Silt',
  prefix: listOutlineIcon,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labClayAttr = {
  id: 'som-Clay-1',
  type: 'numberInput',
  title: 'Clay',
  prefix: listOutlineIcon,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const labNRMAttr = {
  id: 'som-NRM-1',
  type: 'numberInput',
  title: 'NRM scoop density',
  prefix: listOutlineIcon,
  suffix: 'g/cm3',
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const labTypeAttr = {
  id: 'som-type-1',
  type: 'choiceInput',
  title: 'Method',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Full (pipette)', dataName: 'full-1' },
    { title: 'Quick (Laser)', dataName: 'quick-1' },
  ],
} as const;

export const labPHAttr = {
  id: 'som-pH-1',
  type: 'numberInput',
  title: 'pH',
  prefix: listOutlineIcon,
  appearance: 'counter',
  validations: { min: 0, max: 14 },
} as const;

export const labKAttr = {
  id: 'som-k-1',
  type: 'numberInput',
  title: 'K',
  prefix: listOutlineIcon,
  suffix: 'mg/l',
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const labPAttr = {
  id: 'som-p-1',
  type: 'numberInput',
  title: 'P',
  prefix: listOutlineIcon,
  suffix: 'mg/l',
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const labMgAttr = {
  id: 'som-Mg-1',
  type: 'numberInput',
  title: 'Mg',
  prefix: listOutlineIcon,
  suffix: 'mg/l',
  appearance: 'counter',
  validations: { min: 0 },
} as const;

export const wormCountAttr = {
  id: 'worm-count-1',
  type: 'numberInput',
  title: 'Worm count',
  prefix: listOutlineIcon,
  appearance: 'counter',
  validations: { required: true, min: 0 },
} as const;

export const sampleNameAttr = {
  id: 'location_name',
  type: 'textInput',
  title: 'Sample name',
  prefix: locationOutlineIcon,
  validations: { required: true },
} as const;

export const somAttr = {
  id: 'som-1',
  type: 'yesNoInput',
  title: 'Soil Organic Matter (SOM)',
  prefix: soilIcon,
  validations: { required: true },
} as const;

const survey: Survey = {
  id: -1,
  name: 'soil',
  label: 'Soil survey',
  icon: soil,

  attrs: {
    location: locationAttr,
    ...blockToAttr(landUseAttr),
    ...blockToAttr(cropAttr),
    ...blockToAttr(prevCrop1Attr),
    ...blockToAttr(prevCrop2Attr),
    ...blockToAttr(coverCropAttr),
    ...blockToAttr(prevCoverCropAttr),
  },

  smp: {
    attrs: {
      ...blockToAttr(soilTypeAttr),
      ...blockToAttr(aggregateSizeAttr),
      ...blockToAttr(soilStrengthAttr),
    },

    create({ Sample, name }) {
      const sample = new Sample({
        metadata: {
          survey: survey.name,
        },
        attrs: {
          [sampleNameAttr.id]: name,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS();

      return sample;
    },
  },

  // verify: attrs =>
  //   object({
  //     location: object(
  //       { latitude: z.number(), longitude: z.number() },
  //       { invalid_type_error: 'Please select location.' }
  //     ),
  //     // @ts-expect-error ignore
  //   }).safeParse(attrs).error,

  create({ Sample }) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
      },
      attrs: {
        [farmNameAttr.id]: '', // TODO: copy over previous
        [fieldNameAttr.id]: '', // TODO: copy over previous
        [SOMDiameterAttr.id]: 1.3,
        surveyId: survey.id,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
      },
    });

    sample.startGPS();

    return sample;
  },
};

export default survey;
