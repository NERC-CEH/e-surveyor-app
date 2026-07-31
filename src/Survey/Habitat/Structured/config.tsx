import { appsOutline, layersOutline, readerOutline } from 'ionicons/icons';
import { z } from 'zod';
import { IonIcon } from '@ionic/react';
import { schemeHabitats } from 'common/data/speciesHabitats';
import { ChoiceInputConf, NumberInputConf } from 'common/flumens';
import squareIcon from 'common/images/square.svg';
import transectIcon from 'common/images/transect.svg';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  locationAttr,
  attachClassifierResults,
  Survey,
  locationSchema,
} from 'Survey/common/config';

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

export const countAttr = {
  id: 'occAttr:1268',
  type: 'numberInput',
  title: 'Total individuals',
  appearance: 'counter',
  validation: { min: 0, max: 1000 },
} as const satisfies NumberInputConf;

export const coverAttr = {
  id: 'occAttr:1269',
  type: 'numberInput',
  title: 'Estimated cover',
  appearance: 'counter',
  suffix: '%',
  placeholder: '0',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const vegetationCompAttr = {
  id: 'smpAttr:2090',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const bareGroundAttr = {
  id: 'smpAttr:2091',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const litterThatchAttr = {
  id: 'smpAttr:2092',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const mossLiverwortAttr = {
  id: 'smpAttr:2093',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const deadWoodAttr = {
  id: 'smpAttr:2094',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const standingWaterAttr = {
  id: 'smpAttr:2095',
  type: 'numberInput',
  appearance: 'slider',
  suffix: '%',
  validation: { min: 0, max: 100 },
} as const satisfies NumberInputConf;

export const quadratSizeAttr = {
  id: 'smpAttr:1534',
  type: 'numberInput',
  title: 'Quadrat Size',
  appearance: 'counter',
  placeholder: '0',
  prefix: <IonIcon icon={squareIcon} className="size-6" />,
  suffix: 'm²',
  validation: { min: 1, max: 30 },
} as const satisfies NumberInputConf;

export const transectLengthAttr = {
  id: 'smpAttr:2096',
  type: 'numberInput',
  title: 'Transect Length',
  appearance: 'counter',
  placeholder: '0',
  prefix: <IonIcon icon={transectIcon} className="size-6" />,
  suffix: 'm',
  validation: { min: 1, max: 200 },
} as const satisfies NumberInputConf;

export const PLACEMENT_RANDOM_VALUE = '24835';
export const quadratPlacementAttr = {
  id: 'smpAttr:2097',
  type: 'choiceInput',
  title: 'Quadrat Placement',
  appearance: 'button',
  prefix: <IonIcon icon={appsOutline} className="size-6" />,
  choices: [
    { title: 'Randomly', dataName: PLACEMENT_RANDOM_VALUE },
    { title: 'Evenly spaced', dataName: '24836' },
    { title: 'Existing permanent quadrats', dataName: '24837' },
  ],
} as const satisfies ChoiceInputConf;

export const getDetailsValidationSchema = () =>
  z.object({
    locationId: z.string({ error: 'Location is missing' }),
    [surveyProtocolAttr.id]: z.string({ error: 'Survey protocol.' }),
    quadrats: z.number({ error: 'Survey quadrats.' }).min(1),
    [quadratSizeAttr.id]: z.number({ error: 'Quadrat size.' }).min(1),
    [transectLengthAttr.id]: z.number({ error: 'Transect length.' }).min(1),
    [quadratPlacementAttr.id]: z.string({ error: 'Quadrat placement.' }),
  });

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
            [countAttr.id]: 1,
          },
        });

        if (photo) occ.media.push(photo);

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
        .refine(val => !val, { message: 'Is still identifying' })
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
