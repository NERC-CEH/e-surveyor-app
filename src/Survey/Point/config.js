import { date } from '@apps';
import * as Yup from 'yup';
import seedmixData from 'common/data/remote/seedmix';
import icon from 'common/images/pointIcon.svg';

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

const dateAttr = {
  type: 'date',
  isValid: val => val && val.toString() !== 'Invalid Date',
  max: () => new Date(),
  remote: {
    id: 'date',
    values: d => date.print(d),
  },
};

const locationAttr = {
  remote: {
    id: 'entered_sref',
    values(location) {
      return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
        location.longitude
      ).toFixed(7)}`;
    },
  },
};

const survey = {
  id: 597, // -1 this is dev still
  name: 'point',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: {
      label: 'Survey Name',
      type: 'textarea',
      info: 'You can change your survey name here.',
      remote: { id: 1505 },
    },

    seedmixgroup: {
      label: 'Seedmix Producer',
      type: 'radio',
      info: 'Please indicate the seedmix producer.',
      set: (value, sample) => {
        if (sample.sample.attrs.seedmixgroup !== value) {
          sample.sample.attrs.seedmixgroup = value; // eslint-disable-line
          sample.sample.attrs.seedmix = null; // eslint-disable-line
        }
      },
      options: getSeedMixGroups(),
      remote: { id: 1503 },
    },

    seedmix: {
      label: 'Seedmix',
      type: 'radio',
      info: 'Please indicate the seedmix you have used.',
      options: getSeedMix,
      remote: { id: 1504 },
    },
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,
    },

    create(AppSample, AppOccurrence, photo) {
      const sample = new AppSample({
        metadata: {
          survey: survey.name,
          survey_id: survey.id,
        },

        attrs: {
          location: null,
        },
      });

      sample.startGPS();

      const occurrence = survey.smp.occ.create(AppOccurrence, photo);
      sample.occurrences.push(occurrence);

      return sample;
    },

    occ: {
      attrs: {
        taxon: {
          id: 'taxa_taxon_list_id',
          values(taxon) {
            return taxon.warehouseId;
          },
        },
      },

      verify() {},

      create(AppOccurrence, photo) {
        const occ = new AppOccurrence({
          attrs: {
            taxon: null,
          },
        });

        if (photo) {
          occ.media.push(photo);
        }

        return occ;
      },

      modifySubmission(submission) {
        // for non-UK species
        if (!submission.values.taxa_taxon_list_id) {
          return null;
        }

        return submission;
      },
    },

    modifySubmission(submission) {
      // for non-UK species
      if (!submission.occurrences.length) {
        return null;
      }

      return submission;
    },
  },

  create(AppSample) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        name: new Date().toLocaleDateString(),
        location: null,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(attrs, sample) {
    try {
      const id = sample.isIdentifying();

      Yup.boolean()
        .oneOf([false], 'Is still identifying')
        .validateSync(id, { abortEarly: false });

      const transectSchema = Yup.object().shape({
        location: verifyLocationSchema,
      });

      transectSchema.validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },

  modifySubmission(submission) {
    const subSamples = submission.samples;
    submission.samples = []; // eslint-disable-line

    const removeSubSamplesLayerIfNoLocation = subSample => {
      const locationIsMissing = !subSample.values.entered_sref;
      if (locationIsMissing) {
        submission.occurrences.push(subSample.occurrences[0]);
        return;
      }
      submission.samples.push(subSample);
    };

    subSamples.forEach(removeSubSamplesLayerIfNoLocation);

    return submission;
  },
};

export default survey;
