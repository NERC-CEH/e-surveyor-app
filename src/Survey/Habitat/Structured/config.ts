import { layersOutline } from 'ionicons/icons';
import { z } from 'zod';
import { schemeHabitats } from 'common/data/speciesHabitats';
import { updateModelLocation } from 'common/flumens';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  dateAttr,
  locationAttr,
  nameAttr,
  attachClassifierResults,
  Survey,
  locationSchema,
} from 'Survey/common/config';

export const getDetailsValidationSchema = () =>
  z.object({
    locationId: z.string({ error: 'Location is missing' }),
    quadratSize: z.number().min(1, 'Please select your quadrat size.'),
    steps: z.number().min(1, 'Please select the number of survey steps.'),
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
  name: 'habitat-structured',
  label: 'Habitat Structured',
  baseURL: '/survey/habitat/structured',
  icon: layersOutline,

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
            sample.data.type = value;

            sample.data.steps = 10;
            sample.data.quadratSize = 1;

            if (value === 'Common Standards') {
              sample.data.habitat = null;

              sample.data.steps = appModel.data.use10stepsForCommonStandard
                ? 10
                : 20;
              sample.data.quadratSize = 1;
            }

            if (value === 'Agri-environment') {
              sample.data.habitat = null;
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

      create({ photo }) {
        const sample = new Sample({
          data: {
            surveyId: survey.id,
            location: null,
            enteredSrefSystem: 4326,
          },
        });

        sample.startGPS(loc => updateModelLocation(sample, loc));

        const occurrence = survey.smp!.smp!.occ!.create!({ photo });
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

        create({ photo }) {
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

        modifySubmission(submission: any, occ: Occurrence) {
          // for non-UK species
          if (!submission.values.taxa_taxon_list_id) {
            return null;
          }

          return attachClassifierResults(submission, occ);
        },
      },
    },

    create() {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          location: null,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS(loc => updateModelLocation(sample, loc));

      return sample;
    },

    modifySubmission(submission: any) {
      const setSubSampleLocationIfMissing = (subSample: any) => {
        const locationIsMissing = !subSample.values.entered_sref;
        if (locationIsMissing) {
          subSample.values.entered_sref = submission.values.entered_sref;
        }
      };

      submission.samples.forEach(setSubSampleLocationIfMissing);

      return submission;
    },

    verify: (data: any, sample: Sample) =>
      z
        .object({
          location: locationSchema,
          photos: z.number().min(1, 'Please add a quadrat photo.'),
        })
        .safeParse({
          location: data.location,
          photos: sample.media.length,
        }).error,
  },

  create() {
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

    sample.startGPS(loc => updateModelLocation(sample, loc));

    return sample;
  },

  verify(data: any, sample: Sample) {
    try {
      z.boolean()
        .refine(val => !val, {
          message: 'Is still identifying',
        })
        .parse(sample.isIdentifying());

      z.number()
        .refine(val => val === sample.data.steps, {
          message: 'Please add more quadrats.',
        })
        .parse(sample.samples.length);

      getDetailsValidationSchema().parse(data);
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
