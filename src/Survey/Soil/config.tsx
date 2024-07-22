/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable no-param-reassign */
import { listOutline, locationOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Survey, blockToAttr, locationAttr } from 'Survey/common/config';
import field from './field.svg';
import soilIcon from './soil.svg';

const fieldIcon = (<IonIcon src={field} className="size-6" />) as any;

const locationOutlineIcon = (
  <IonIcon src={locationOutline} className="size-6" />
) as any;

const listOutlineIcon = (
  <IonIcon src={listOutline} className="size-6" />
) as any;

export const farmNameAttr = {
  id: 'farmName-1',
  type: 'text_input',
  title: 'Farm name',
  prefix: locationOutlineIcon,
  validations: { required: true },
} as const;

export const fieldNameAttr = {
  id: 'fieldName-1',
  type: 'text_input',
  title: 'Field name',
  prefix: locationOutlineIcon,
  validations: { required: true },
} as const;

export const LAND_USE_OTHER_VALUE = 'other-1';
const LAND_USE_ARABLE_VALUE = 'Arable-1';
const LAND_USE_PASTURE_VALUE = 'Pasture-1';
export const landUseAttr = {
  id: 'landUse-1',
  type: 'choice_input',
  title: 'Land use',
  prefix: listOutlineIcon,
  container: 'page',
  choices: [
    { title: 'Arable (cropland)', data_name: LAND_USE_ARABLE_VALUE },
    { title: 'Pasture (grazing land)', data_name: LAND_USE_PASTURE_VALUE },
    { title: 'Woodland', data_name: 'Woodland-1' },
    { title: 'Fallow land', data_name: 'Fallow-1' },
    { title: 'Other', data_name: LAND_USE_OTHER_VALUE },
  ],
  onChange(newValue: any, _: any, { record }: any) {
    // eslint-disable-next-line no-param-reassign
    record[landUseAttr.id] = newValue;
    delete record[cropAttr().id];
    delete record[prevCrop1Attr().id];
    delete record[prevCrop2Attr().id];
    delete record[prevCrop3Attr().id];
    return newValue;
  },
} as const;

export const landUseOtherAttr = {
  id: 'landUseOther-1',
  type: 'text_input',
  title: 'Other land use',
  appearance: 'multiline',
} as const;

export const CROP_OTHER_VALUE = 'Other-1';
const cropChoices = {
  [LAND_USE_ARABLE_VALUE]: [
    { title: 'Wheat', data_name: 'Wheat-1' },
    { title: 'Barley', data_name: 'Barley-1' },
    { title: 'Oats', data_name: 'Oats-1' },
    { title: 'Oilseed rape', data_name: 'Oilseed-1' },
    { title: 'Sugar beet', data_name: 'Sugar-1' },
    { title: 'Field peas', data_name: 'Peas-1' },
    { title: 'Field beans', data_name: 'Field-1' },
    { title: 'Fresh vegetables', data_name: 'Fresh-1' },
    { title: 'Plants and flowers', data_name: 'Plants-1' },
    { title: 'Potatoes', data_name: 'Potatoes-1' },
    { title: 'Fresh fruit', data_name: 'Fresh-1' },
    { title: 'Linseed', data_name: 'Linseed-1' },
    { title: 'Other', data_name: CROP_OTHER_VALUE },
  ],
  [LAND_USE_PASTURE_VALUE]: [
    { title: 'Permanent improved grassland', data_name: 'improved-1' },
    { title: 'Permanent unimproved grassland', data_name: 'unimproved-1' },
    { title: 'Temporary grassland', data_name: 'temporary-1' },
  ],
} as const;

export const cropAttr = (attrs?: any) => {
  const landUse = attrs?.[landUseAttr.id] as keyof typeof cropChoices;
  return {
    id: 'crop-1',
    type: 'choice_input',
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
    type: 'choice_input',
    title: 'Previous crop 1',
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
    type: 'choice_input',
    title: 'Previous crop 2',
    hidden: !attrs || !cropChoices[landUse],
    prefix: listOutlineIcon,
    container: 'page',
    choices: attrs ? cropChoices[landUse] || [] : [],
  } as const;
};

export const prevCrop3Attr = (attrs?: any) => {
  const landUse = attrs?.[landUseAttr.id] as keyof typeof cropChoices;
  return {
    id: 'prev-crop-3',
    type: 'choice_input',
    title: 'Previous crop 3',
    hidden: !attrs || !cropChoices[landUse],
    prefix: listOutlineIcon,
    container: 'page',
    choices: attrs ? cropChoices[landUse] || [] : [],
  } as const;
};

export const cropOtherAttr = {
  id: 'cropOther-1',
  type: 'text_input',
  title: 'Other crop',
  appearance: 'multiline',
} as const;

export const tillageAttr = {
  id: 'tillage-1',
  type: 'choice_input',
  title: 'Tillage practices',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Conventional Tillage', data_name: 'Tillage-1' },
    { title: 'Minimal/conservation tillage', data_name: 'Minimal-1' },
    { title: 'No-till', data_name: 'No-till-1' },
  ],
} as const;

const COVER_CROP_OTHER_VALUE = 'Other-1';
export const coverCropAttr = {
  id: 'coverCrop-1',
  type: 'choice_input',
  title: 'Cover crop',
  prefix: listOutlineIcon,
  container: 'page',
  choices: [
    { title: 'Field Beans', data_name: 'Field-1' },
    { title: 'Peas', data_name: 'Peas-1' },
    { title: 'Clover', data_name: 'Clover-1' },
    { title: 'Mustard', data_name: 'Mustard-1' },
    { title: 'Kale', data_name: 'Kale-1' },
    { title: 'Winter Rye', data_name: 'Winter-1' },
    { title: 'Oats', data_name: 'Oats-1' },
    { title: 'Barley', data_name: 'Barley-1' },
    { title: 'Straw  ', data_name: 'Straw-1' },
    { title: 'Other', data_name: COVER_CROP_OTHER_VALUE },
  ],
} as const;

export const coverCropOtherAttr = {
  id: 'coverCropOther-1',
  type: 'text_input',
  title: 'Other cover crop',
  appearance: 'multiline',
} as const;

export const SOMIDAttr = {
  id: 'SOMID-1',
  type: 'text_input',
  prefix: listOutlineIcon,
  title: 'Sample ID',
} as const;

export const soilTypeAttr = {
  id: 'soil-1',
  type: 'choice_input',
  title: 'Broad soil type',
  prefix: fieldIcon,
  container: 'page',
  choices: [
    { title: 'Heavy clay soils with poor drainage', data_name: 'Heavy-1' },
    { title: 'Light soils with free drainage', data_name: 'Light-1' },
    {
      title: 'Light soils with moderate & poor drainage',
      data_name: 'Light-m-1',
    },
    { title: 'Medium soils with free drainage', data_name: 'free-1' },
    { title: 'Medium soils with moderate drainage', data_name: 'moderate-1' },
    { title: 'Medium with soils poor drainage', data_name: 'poor-1' },
    { title: 'Peat', data_name: 'Peat-1' },
    { title: 'Organic soils with poor drainage', data_name: 'Organic-poor-1' },
    { title: 'Organic soils with free drainage', data_name: 'Organic-1' },
    { title: 'Man-made soils', data_name: 'Man-1' },
    { title: 'Alluvial and coastal soils', data_name: 'Alluvial-1' },
    { title: 'Shallow soils', data_name: 'Shallow-1' },
  ],
} as const;

export const soilSurfaceAttr = {
  id: 'soilsurface-1',
  type: 'choice_input',
  title: 'Soil surface condition',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Strong', data_name: 'Strong-1' },
    { title: 'Moderate', data_name: 'Moderate-1' },
    { title: 'Weak', data_name: 'Weak-1' },
  ],
} as const;

export const aggregateSizeAttr = {
  id: 'aggregates-1',
  type: 'choice_input',
  title: 'Size of aggregates',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Small rounded', data_name: 'Small-1' },
    { title: 'Some medium/angular', data_name: 'some-1' },
    { title: 'Large/no aggregates', data_name: 'large-1' },
  ],
} as const;

export const soilStrengthAttr = {
  id: 'strength-1',
  type: 'choice_input',
  title: 'Soil strength',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Friable', data_name: 'Friable-1' },
    { title: 'Firm', data_name: 'Firm-1' },
    { title: 'Compact', data_name: 'Compact-1' },
  ],
} as const;

export const rootsAttr = {
  id: 'roots-1',
  type: 'choice_input',
  title: 'Visible roots',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: 'Abundant roots', data_name: 'Abundant-1' },
    { title: 'Roots confined to pores/fissures', data_name: 'Roots-1' },
    { title: 'Without or few roots', data_name: 'Without-1' },
  ],
} as const;

export const SOMPatternAttr = {
  id: 'som-pattern-1',
  type: 'choice_input',
  title: 'Pattern',
  prefix: listOutlineIcon,
  appearance: 'button',
  choices: [
    { title: '‘W’ pattern', data_name: 'w-1' },
    { title: 'Whole field', data_name: 'field-1' },
  ],
} as const;

export const SOMDepthAttr = {
  id: 'som-depth-1',
  type: 'number_input',
  title: 'Depth',
  prefix: listOutlineIcon,
  suffix: 'cm',
  appearance: 'counter',
  validations: { min: 0, max: 200 },
} as const;

export const SOMDiameterAttr = {
  id: 'som-diameter-1',
  type: 'number_input',
  title: 'Auger diameter',
  prefix: listOutlineIcon,
  suffix: 'cm',
  appearance: 'counter',
  validations: { min: 0, max: 20 },
} as const;

export const SOMStonesAttr = {
  id: 'som-stones-1',
  type: 'number_input',
  title: 'Stones',
  prefix: listOutlineIcon,
  suffix: '%',
  appearance: 'counter',
  validations: { min: 0, max: 100 },
} as const;

export const wormCountAttr = {
  id: 'worm-count-1',
  type: 'number_input',
  title: 'Worm count',
  prefix: listOutlineIcon,
  appearance: 'counter',
  validations: { required: true, min: 0 },
} as const;

const survey: Survey = {
  id: -1,
  name: 'soil',
  label: 'Soil survey',
  icon: soilIcon,

  attrs: {
    location: locationAttr,
    ...blockToAttr(landUseAttr),
    ...blockToAttr(cropAttr),
    ...blockToAttr(coverCropAttr),
    ...blockToAttr(prevCrop1Attr),
    ...blockToAttr(prevCrop2Attr),
    ...blockToAttr(prevCrop3Attr),
  },

  smp: {
    attrs: {
      ...blockToAttr(soilTypeAttr),
      ...blockToAttr(aggregateSizeAttr),
      ...blockToAttr(soilStrengthAttr),
    },

    create({ Sample, type }) {
      const sample = new Sample({
        metadata: {
          survey: survey.name,
          type,
        },
        attrs: {},
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
        surveyId: survey.id,
      },
    });

    sample.startGPS();

    return sample;
  },
};

export default survey;
