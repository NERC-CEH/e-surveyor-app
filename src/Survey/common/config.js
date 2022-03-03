import * as Yup from 'yup';
import { date } from '@flumens';
import seedmixData from 'common/data/cacheRemote/seedmix.json';

const getSeedMixGroups = () => {
  const addValueToObject = seedMixGroup => ({ value: seedMixGroup });

  const getUniqueValues = (unique, item) => {
    return unique.includes(item.mix_group)
      ? unique
      : [...unique, item.mix_group];
  };

  const alphabetically = (v1, v2) => v1.value.localeCompare(v2.value);

  const seedMixGroups = seedmixData
    .reduce(getUniqueValues, [])
    .map(addValueToObject)
    .sort(alphabetically);

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
  pageProps: {
    headerProps: { label: 'Supplier' },
    attrProps: {
      input: 'radio',
      info: 'Please indicate the supplier.',
      inputProps: { options: getSeedMixGroups() },
      set: (value, sample) => {
        if (sample.attrs.seedmixgroup !== value) {
          sample.attrs.seedmixgroup = value; // eslint-disable-line
          sample.attrs.seedmix = null; // eslint-disable-line
        }
      },
    },
  },
  remote: { id: 1529 },
};

export const seedmixAttr = {
  pageProps: {
    headerProps: { label: 'Seed mix' },
    attrProps: {
      input: 'radio',
      info: 'Please indicate the seed mix you have used.',
      inputProps: smp => ({ options: getSeedMix(smp) }),
    },
  },
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
  'Please select location.',
  validateLocation
);

export const dateAttr = {
  pageProps: {
    attrProps: {
      input: 'date',
      inputProps: { max: () => new Date() },
    },
  },
  remote: { values: d => date.print(d, false) },
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

export const nameAttr = {
  pageProps: {
    headerProps: { title: 'Survey Name' },
    attrProps: {
      input: 'textarea',
      info: 'You can change your survey name here.',
    },
  },
  remote: { id: 1531 },
};
