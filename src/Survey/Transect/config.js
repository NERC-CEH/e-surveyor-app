import * as Yup from 'yup';
import icon from 'common/images/transectIcon.svg';
import {
  seedmixGroupAttr,
  seedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
} from 'Survey/common/config';
import appModel from 'models/app';
import { schemeHabitats } from 'common/data/habitats';

export const getDetailsValidationSchema = sample =>
  Yup.object().shape({
    location: verifyLocationSchema,
    quadratSize: Yup.number()
      .min(1)
      .required('Please select your quadrat size.'),
    steps: Yup.number()
      .min(1)
      .required('Please select the number of survey steps.'),
    habitat:
      sample.attrs.type !== 'Custom' &&
      Yup.mixed().required('Please select habitat.'),
  });

const getHabitats = name => ({ value: name, id: name });
const agriEnvironmentHabitats = schemeHabitats.AES.sort().map(getHabitats);
const commonStandardsHabitats = schemeHabitats.CSM.sort().map(getHabitats);

const surveyTypes = [
  { value: 'Agri-environment', id: 17955 },
  { value: 'Common Standards', id: 17956 },
  { value: 'Custom', id: 17957 },
];

const survey = {
  id: 627,
  name: 'transect',
  label: 'Transect',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: nameAttr,

    type: {
      pageProps: {
        attrProps: {
          input: 'radio',
          info: 'You can change your survey name here.',
          inputProps: { options: surveyTypes },
          set: (value, sample) => {
            sample.attrs.type = value; // eslint-disable-line

            sample.attrs.steps = 10; // eslint-disable-line
            sample.attrs.quadratSize = 1; // eslint-disable-line

            if (value === 'Common Standards') {
              sample.attrs.habitat = null; // eslint-disable-line
              // eslint-disable-next-line
              sample.attrs.steps = appModel.attrs.use10stepsForCommonStandard
                ? 10
                : 20;
              sample.attrs.quadratSize = 1; // eslint-disable-line
            }

            if (value === 'Agri-environment') {
              sample.attrs.habitat = null; // eslint-disable-line
            }
          },
        },
      },
      remote: { id: 1533, values: surveyTypes },
    },

    steps: {
      pageProps: {
        attrProps: {
          input: 'slider',
          info: 'Please specify the number of quadrats you would like to survey.',
          inputProps: { min: 1 },
        },
      },
    },

    quadratSize: {
      pageProps: {
        headerProps: { title: 'Quadrat Size' },
        attrProps: {
          input: 'slider',
          info: 'Please specify the quadrat size in meters.',
          inputProps: { min: 1 },
        },
      },
      remote: {
        id: 1534,
      },
    },

    habitat: {
      pageProps: {
        attrProps: {
          input: 'radio',
          inputProps: model => ({
            options:
              model.attrs.type === 'Agri-environment'
                ? agriEnvironmentHabitats
                : commonStandardsHabitats,
          }),
        },
      },
      remote: {
        id: 1532,
        values: [...agriEnvironmentHabitats, ...commonStandardsHabitats],
      },
    },

    seedmixgroup: seedmixGroupAttr,

    seedmix: seedmixAttr,
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,
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

        const occurrence = survey.smp.smp.occ.create(AppOccurrence, photo);
        sample.occurrences.push(occurrence);

        return sample;
      },

      modifySubmission(submission) {
        // for non-UK species
        if (!submission.occurrences.length) {
          return null;
        }

        return submission;
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
    },

    create(AppSample) {
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

      return sample;
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

    verify(attrs, sample) {
      try {
        Yup.number()
          .min(1, 'Please add a quadrat photo.')
          .validateSync(sample.media.length, { abortEarly: false });

        const transectSchema = Yup.object().shape({
          location: verifyLocationSchema,
        });

        transectSchema.validateSync(attrs, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
    },
  },

  create(AppSample) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        name: new Date().toLocaleDateString('en-UK'),
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

      Yup.number()
        .oneOf([sample.attrs.steps], 'Please add more quadrats.')
        .validateSync(sample.samples.length, { abortEarly: false });

      getDetailsValidationSchema(sample).validateSync(attrs, {
        abortEarly: false,
      });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
