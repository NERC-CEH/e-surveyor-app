import * as Yup from 'yup';
import { date } from '@apps';
import seedmixData from 'common/data/cacheRemote/seedmix.json';

const getSeedMixGroups = () => {
  const addValueToObject = seedMixGroup => {
    return { value: seedMixGroup };
  };

  const getUniqueValues = (unique, item) => {
    return unique.includes(item.mix_group)
      ? unique
      : [...unique, item.mix_group];
  };

  const seedMixGroups = seedmixData
    .reduce(getUniqueValues, [])
    .map(addValueToObject);

  const notRecorded = {
    value: null,
    isDefault: true,
    label: 'Not recorded',
  };

  return [notRecorded, ...seedMixGroups];
};

const getSeedMix = modal => {
  const { seedmixgroup } = modal.attrs;

  const addValueToObject = seedMix => {
    return { value: seedMix };
  };

  const bySeedmixGroups = data => data.mix_group === seedmixgroup;

  const getUniqueValues = (unique, item) => {
    return unique.includes(item.mix_name) ? unique : [...unique, item.mix_name];
  };

  const seedMixes = seedmixData
    .filter(bySeedmixGroups)
    .reduce(getUniqueValues, [])
    .map(addValueToObject);

  const notRecorded = {
    value: null,
    isDefault: true,
    label: 'Not recorded',
  };

  return [notRecorded, ...seedMixes];
};

export const seedmixGroupAttr = {
  label: 'Seedmix Producer',
  type: 'radio',
  info: 'Please indicate the seedmix producer.',
  set: (value, { sample }) => {
    if (sample.attrs.seedmixgroup !== value) {
      sample.attrs.seedmixgroup = value; // eslint-disable-line
      sample.attrs.seedmix = null; // eslint-disable-line
    }
  },
  options: getSeedMixGroups(),
  remote: { id: 1529 },
};

export const seedmixAttr = {
  label: 'Seedmix',
  type: 'radio',
  info: 'Please indicate the seedmix you have used.',
  options: getSeedMix,
  remote: { id: 1530 },
};

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
});

const validateLocation = val => {
  if (!val) {
    return false;
  }
  fixedLocationSchema.validateSync(val);
  return true;
};

export const verifyLocationSchema = Yup.mixed().test(
  'location',
  'Please select your location.',
  validateLocation
);

export const dateAttr = {
  type: 'date',
  isValid: val => val && val.toString() !== 'Invalid Date',
  max: () => new Date(),
  remote: {
    id: 'date',
    values: d => date.print(d),
  },
};

export const locationAttr = {
  remote: {
    id: 'entered_sref',
    values(location) {
      return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
        location.longitude
      ).toFixed(7)}`;
    },
  },
};
