import * as Yup from 'yup';
import { schemeHabitats } from 'common/data/habitats';
import icon from 'common/images/transectIconBlack.svg';
import appModel from 'models/app';
import OccurrenceModel from 'models/occurrence';
import SampleModel from 'models/sample';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
  attachClassifierResults,
  Survey,
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

const survey: Survey = {
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
          set: (value: any, sample: SampleModel) => {
            sample.data.type = value; // eslint-disable-line

            sample.data.steps = 10; // eslint-disable-line
            sample.data.quadratSize = 1; // eslint-disable-line

            if (value === 'Common Standards') {
              sample.data.habitat = null; // eslint-disable-line
              // eslint-disable-next-line
              sample.data.steps = appModel.data.use10stepsForCommonStandard
                ? 10
                : 20;
              sample.data.quadratSize = 1; // eslint-disable-line
            }

            if (value === 'Agri-environment') {
              sample.data.habitat = null; // eslint-disable-line
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
          inputProps: (model: SampleModel) => ({
            options:
              model.data.type === 'Agri-environment'
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

      create({ Sample, Occurrence, photo }) {
        const sample = new Sample({
          data: {
            surveyId: survey.id,
            location: null,
            enteredSrefSystem: 4326,
          },
        });

        sample.startGPS();

        if (!Occurrence)
          throw new Error('Occurrence class is missing in subSubSample create');

        const occurrence = survey.smp!.smp!.occ!.create!({ Occurrence, photo });
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
            remote: {
              id: 'taxa_taxon_list_id',
              values(taxon: any) {
                return taxon.warehouseId;
              },
            },
          },
        },

        create({ Occurrence, photo }) {
          const occ = new Occurrence({
            data: {
              taxon: null,
            },
          });

          if (photo) {
            occ.media.push(photo);
          }

          return occ;
        },

        modifySubmission(submission: any, occ: OccurrenceModel) {
          // for non-UK species
          if (!submission.values.taxa_taxon_list_id) {
            return null;
          }

          return attachClassifierResults(submission, occ);
        },
      },
    },

    create({ Sample }) {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          location: null,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS();

      return sample;
    },

    modifySubmission(submission: any) {
      const setSubSampleLocationIfMissing = (subSample: any) => {
        const locationIsMissing = !subSample.values.entered_sref;
        if (locationIsMissing) {
          subSample.values.entered_sref = submission.values.entered_sref; // eslint-disable-line no-param-reassign
        }
      };

      submission.samples.forEach(setSubSampleLocationIfMissing);

      return submission;
    },

    verify(data: any, sample: SampleModel) {
      try {
        Yup.number()
          .min(1, 'Please add a quadrat photo.')
          .validateSync(sample.media.length, { abortEarly: false });

        const transectSchema = Yup.object().shape({
          location: verifyLocationSchema,
        });

        transectSchema.validateSync(data, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
    },
  },

  create({ Sample }) {
    const sample = new Sample({
      data: {
        surveyId: survey.id,
        training: appModel.data.useTraining,
        date: new Date().toISOString(),
        name: new Date().toLocaleDateString('en-UK'),
        location: null,
        enteredSrefSystem: 4326,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(data: any, sample: SampleModel) {
    try {
      const id = sample.isIdentifying();

      Yup.boolean()
        .oneOf([false], 'Is still identifying')
        .validateSync(id, { abortEarly: false });

      Yup.number()
        .oneOf([sample.data.steps], 'Please add more quadrats.')
        .validateSync(sample.samples.length, { abortEarly: false });

      getDetailsValidationSchema().validateSync(data, {
        abortEarly: false,
      });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
