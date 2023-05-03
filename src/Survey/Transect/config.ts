import * as Yup from 'yup';
import { schemeHabitats } from 'common/data/habitats';
import icon from 'common/images/transectIcon.svg';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
  attachClassifierResults,
} from 'Survey/common/config';

export const getDetailsValidationSchema = () =>
  Yup.object().shape({
    location: verifyLocationSchema,
    quadratSize: Yup.number()
      .min(1)
      .required('Please select your quadrat size.'),
    steps: Yup.number()
      .min(1)
      .required('Please select the number of survey steps.'),

    habitat: Yup.mixed().when('type', {
      is: 'Custom',
      // then: do nothing
      otherwise: schema => schema.required('Please select habitat.'),
    }),
  });

const getHabitats = (name: any) => ({ value: name, id: name });
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
          set: (value: any, sample: Sample) => {
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
          info: ' This is the number of times that you will stop and search for plants on your transect. Please specify the number of quadrats you would like to survey.',
          inputProps: { min: 1 },
        },
      },
    },

    quadratSize: {
      pageProps: {
        headerProps: { title: 'Quadrat Size' },
        attrProps: {
          input: 'slider',
          info: 'This is the size of the area that you will search for plants in each step. Please specify the quadrat size in meters.',
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
          inputProps: (model: Sample) => ({
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

    customSeedmix: customSeedmixAttr,
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

      create(
        AppSample: typeof Sample,
        AppOccurrence: typeof Occurrence,
        photo: any
      ) {
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

      modifySubmission(submission: any) {
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
            values(taxon: any) {
              return taxon.warehouseId;
            },
          },
        },

        create(AppOccurrence: typeof Occurrence, photo: any) {
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

        modifySubmission(submission: any, occ: Occurrence) {
          // for non-UK species
          if (!submission.values.taxa_taxon_list_id) {
            return null;
          }

          return attachClassifierResults(submission, occ);
        },
      },
    },

    create(AppSample: typeof Sample) {
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

    modifySubmission(submission: any) {
      const subSamples = submission.samples;
      submission.samples = []; // eslint-disable-line

      const removeSubSamplesLayerIfNoLocation = (subSample: any) => {
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

    verify(attrs: any, sample: Sample) {
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

  create(AppSample: typeof Sample) {
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

  verify(attrs: any, sample: Sample) {
    try {
      const id = sample.isIdentifying();

      Yup.boolean()
        .oneOf([false], 'Is still identifying')
        .validateSync(id, { abortEarly: false });

      Yup.number()
        .oneOf([sample.attrs.steps], 'Please add more quadrats.')
        .validateSync(sample.samples.length, { abortEarly: false });

      getDetailsValidationSchema().validateSync(attrs, {
        abortEarly: false,
      });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
