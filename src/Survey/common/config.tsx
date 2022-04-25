import React from 'react';
import * as Yup from 'yup';
import { date } from '@flumens';
import Sample from 'models/sample';
import appModel, { SeedMix } from 'models/app';
import { SeedmixSpecies } from 'common/data/seedmix';
import seedmixData from 'common/data/cacheRemote/seedmix.json';
import { Link } from 'react-router-dom';

const getSeedMixGroups = () => {
  const addValueToObject = (seedMixGroup: any) => ({ value: seedMixGroup });

  const getUniqueValues = (unique: any, item: any) => {
    return unique.includes(item.mix_group)
      ? unique
      : [...unique, item.mix_group];
  };

  const alphabetically = (v1: any, v2: any) => v1.value.localeCompare(v2.value);

  const seedMixGroups = seedmixData
    .reduce(getUniqueValues, [])
    .map(addValueToObject)
    .sort(alphabetically);

  const notRecorded = {
    value: null,
    isDefault: true,
    label: 'Not recorded',
  };

  const userCustom = {
    value: 'Custom',
    label: 'My Custom Seedmix',
  };

  return [notRecorded, userCustom, ...seedMixGroups];
};

export const CUSTOM_SEEDMIX_NAME = 'Custom';

const getSeedMix = (model: Sample) => {
  const { seedmixgroup } = model.attrs;

  const addValueToObject = (seedMix: any) => {
    return { value: seedMix };
  };

  const bySeedmixGroups = (seedmix: any) => seedmix.mix_group === seedmixgroup;

  const getUniqueValues = (unique: any, item: any) => {
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

  let userCustom: any = [];
  if (seedmixgroup === CUSTOM_SEEDMIX_NAME) {
    const getSeedmixEntry = (seedmix: SeedMix) => ({
      value: seedmix.id,
      label: seedmix.name,
    });

    userCustom = appModel.attrs.seedmixes.map(getSeedmixEntry);
  }

  return [notRecorded, ...userCustom, ...seedMixes];
};

export const seedmixGroupAttr = {
  pageProps: {
    headerProps: { label: 'Supplier' },
    attrProps: {
      input: 'radio',
      info: 'Please indicate the supplier.',
      inputProps: { options: getSeedMixGroups() },
      set: (value: any, sample: Sample) => {
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
      info: (smp: Sample) => {
        if (smp.attrs.seedmixgroup === CUSTOM_SEEDMIX_NAME) {
          return (
            <div>
              Please indicate the seed mix you have used.
              <p>
                You can define your own seedmixes{' '}
                <Link to="/settings/seedmixes">here</Link>.
              </p>
            </div>
          );
        }
        return <div>Please indicate the seed mix you have used.</div>;
      },
      inputProps: (smp: Sample) => ({ options: getSeedMix(smp) }),
      set: (value: any, sample: Sample) => {
        if (sample.attrs.seedmix !== value) {
          if (sample.attrs.seedmixgroup === CUSTOM_SEEDMIX_NAME) {
            const byId = (seedmix: SeedMix) => seedmix.id === value;
            const selectedSeedmix = appModel.attrs.seedmixes.find(byId);
            sample.attrs.seedmix = selectedSeedmix?.name; // eslint-disable-line
            sample.attrs.customSeedmix = selectedSeedmix?.species || []; // eslint-disable-line
            return;
          }

          // eslint-disable-next-line no-param-reassign
          sample.attrs.seedmix = value;
        }
      },
    },
  },
  remote: { id: 1530 },
};

export const customSeedmixAttr = {
  remote: {
    id: 1647,
    values: (values: SeedmixSpecies[]) => {
      const getWarehouseId = (sp: SeedmixSpecies) => sp.warehouse_id;

      return values.map(getWarehouseId).join(','); // eslint-disable-line
    },
  },
};

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
});

const validateLocation = (val: any) => {
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
  remote: { values: (d: any) => date.print(d, false) },
};

export const locationAttr = {
  remote: {
    id: 'entered_sref',
    values(location: any) {
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
