import { layersOutline, readerOutline } from 'ionicons/icons';
import { z } from 'zod';
import { IonIcon } from '@ionic/react';
import { schemeHabitats } from 'common/data/speciesHabitats';
import {
  ChoiceInputConf,
  NumberInputConf,
  updateModelLocation,
} from 'common/flumens';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  locationAttr,
  attachClassifierResults,
  Survey,
  locationSchema,
} from 'Survey/common/config';

export const getDetailsValidationSchema = () =>
  z.object({
    locationId: z.string({ error: 'Location is missing' }),
    quadratSize: z.number().min(1, 'Please select your quadrat size.'),
    quadrats: z.number().min(1, 'Please select the number of survey quadrats.'),
  });

const getHabitats = (name: any) => ({ value: name, id: name });
const agriEnvironmentHabitats = schemeHabitats.AES.sort().map(getHabitats);
const commonStandardsHabitats = schemeHabitats.CSM.sort().map(getHabitats);

export const CUSTOM_PROTOCOL_VALUE = '17957';
export const COMMON_STANDARDS_PROTOCOL_VALUE = '17956';
export const surveyProtocolAttr = {
  id: 'smpAttr:1533',
  type: 'choiceInput',
  title: 'Protocol',
  appearance: 'button',
  prefix: <IonIcon icon={readerOutline} className="size-6" />,
  choices: [
    { title: 'Agri-environment', dataName: '17955' },
    { title: 'Common Standards', dataName: COMMON_STANDARDS_PROTOCOL_VALUE },
    { title: 'Custom', dataName: CUSTOM_PROTOCOL_VALUE },
  ],
} as const satisfies ChoiceInputConf;

// export const quadratsAttr = {
//   id: 'smpAttr:347',
//   type: 'numberInput',
//   title: 'Arable fallow',
//   appearance: 'counter',
//   placeholder: '0',
//   validation: { min: 0, max: 100 },
// } as const satisfies NumberInputConf;

export const vegetationCompAttr = {
  id: 'smpAttr:-1',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Vegetation (live plants)',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const bareGroundAttr = {
  id: 'smpAttr:-2',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Bare ground',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const litterThatchAttr = {
  id: 'smpAttr:-3',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Litter / thatch',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const mossLiverwortAttr = {
  id: 'smpAttr:-4',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Moss / liverwort',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const deadWoodAttr = {
  id: 'smpAttr:-5',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Dead wood',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const standingWaterAttr = {
  id: 'smpAttr:-6',
  type: 'numberInput',
  appearance: 'slider',
  title: 'Standing water',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

const SURVEY_ID = 627;

const survey = {
  id: SURVEY_ID,
  name: 'habitat-structured',
  label: 'Habitat Structured',
  baseURL: '/survey/habitat/structured',
  icon: layersOutline,

  attrs: {
    quadrats: {
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
          info: 'This is the size of the area that you will search for plants in each step. Please specify the quadrat size in m².',
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
      location: locationAttr,
    },

    smp: {
      attrs: {
        location: locationAttr,
      },

      create({ photo }) {
        const sample = new Sample({
          data: {
            surveyId: SURVEY_ID,
            enteredSrefSystem: 4326,
          },
        });

        sample.startGPS(loc => updateModelLocation(sample, loc));

        const occurrence = survey.smp.smp.occ.create({ photo });
        sample.occurrences.push(occurrence);

        return sample;
      },

      modifySubmission(submission: any) {
        // for non-UK species
        if (!submission.occurrences.length) return null;
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
          surveyId: SURVEY_ID,
          enteredSrefSystem: 4326,
        },
      });

      // sample.startGPS(loc => updateModelLocation(sample, loc));

      return sample;
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
        surveyId: SURVEY_ID,
        training: appModel.data.useTraining,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
      },
    });

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
        .refine(val => val === sample.data.quadrats, {
          message: 'Please add more quadrats.',
        })
        .parse(sample.samples.length);

      getDetailsValidationSchema().parse(data);
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
} as const satisfies Survey;

export default survey;
