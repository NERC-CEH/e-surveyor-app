import { calendarOutline, clipboardOutline } from 'ionicons/icons';
import { z } from 'zod';
import {
  BlockT,
  dateFormat,
  MenuAttrItemFromModelMenuProps,
  PageProps,
  RemoteConfig,
} from '@flumens';
import {
  ChoiceInputConf,
  NumberInputConf,
} from '@flumens/tailwind/dist/Survey';
import { IonIcon } from '@ionic/react';
import config from 'common/config';
import seedmixData from 'common/data/cacheRemote/seedmix.json';
import SeedsIcon from 'common/images/seeds.svg?react';
import appModel, { SeedMix } from 'models/app';
import Media from 'models/image';
import Occurrence, { Suggestion, Taxon } from 'models/occurrence';
import Sample from 'models/sample';

const { possibleThreshold } = config;

const seedMixGroups = seedmixData
  .reduce(
    (a: any, m: any) => (a.includes(m.mixGroup) ? a : [...a, m.mixGroup]),
    []
  )
  .map((seedMixGroup: any) => ({ dataName: seedMixGroup }))
  .sort((v1: any, v2: any) => v1.dataName.localeCompare(v2.dataName));

export const CUSTOM_SEEDMIX_GROUP_VALUE = 'Custom';

const getSeedMixes = (seedmixgroup: any) => {
  if (seedmixgroup === CUSTOM_SEEDMIX_GROUP_VALUE) {
    const getSeedmixEntry = (seedmix: SeedMix) => ({
      dataName: seedmix.id,
      title: seedmix.name,
    });

    return appModel.data.seedmixes.map(getSeedmixEntry);
  }

  return seedmixData
    .filter((seedmix: any) => seedmix.mixGroup === seedmixgroup)
    .reduce(
      (a: any, m: any) => (a.includes(m.mixName) ? a : [...a, m.mixName]),
      []
    )
    .map((seedMixGroup: any) => ({ dataName: seedMixGroup }));
};

// export const seedmixGroupAttr = {
//   pageProps: {
//     headerProps: { title: 'Supplier' },
//     attrProps: {
//       input: 'radio',
//       info: 'Please indicate the supplier.',
//       inputProps: { options: getSeedMixGroups() },
//     },
//   },
// };

export const SEEDED_YES_VALUE = '22177';

export const seededAttr = {
  id: 'smpAttr:1868',
  type: 'choiceInput',
  title: 'Seeded',
  appearance: 'button',
  prefix: <SeedsIcon className="size-6" />,
  choices: [
    { title: 'Yes', dataName: SEEDED_YES_VALUE },
    { title: 'No', dataName: '22178' },
    { title: "Don't know", dataName: '22179' },
  ],
} as const satisfies ChoiceInputConf;

export const seedmixGroupAttr = {
  id: 'smpAttr:1529',
  type: 'choiceInput',
  title: 'Supplier',
  appearance: 'button',
  prefix: <SeedsIcon className="size-6" />,
  choices: [
    { dataName: '', title: 'Not recorded' },
    { dataName: CUSTOM_SEEDMIX_GROUP_VALUE, title: 'My Custom Seedmix' },
    ...seedMixGroups,
  ],
  visibility: [{ target: seededAttr.id, op: 'eq', value: SEEDED_YES_VALUE }],
} as const satisfies ChoiceInputConf;

export const SEEDMIX_ATTR_ID = 'smpAttr:1530';

export const seedmixAttr = (data: any) =>
  ({
    id: SEEDMIX_ATTR_ID,
    type: 'choiceInput',
    title: 'Mix',
    appearance: 'button',
    prefix: <SeedsIcon className="size-6" />,
    choices: [
      { dataName: '', title: 'Not recorded' },
      ...getSeedMixes(data[seedmixGroupAttr.id]),
    ],
    visibility: [
      { target: seedmixGroupAttr.id, op: 'ne', value: '' },
      { target: seedmixGroupAttr.id, op: 'ne', value: undefined as any },
    ],
  }) as const satisfies ChoiceInputConf;

export const customSeedmixAttr = { id: 'smpAttr:1647' } as const;

export const dateAttr = {
  id: 'date',
  menuProps: {
    icon: calendarOutline,
    parse: 'date',
  },
  pageProps: {
    attrProps: {
      input: 'date',
      inputProps: { max: () => new Date() },
    },
  },
  remote: { values: (date: string) => dateFormat.format(new Date(date)) },
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

export const occurrenceAbundanceAttr = {
  id: 'occAttr:1218',
  type: 'numberInput',
  title: 'Abundance',
  appearance: 'counter',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  step: 1,
  validation: { min: 1 },
} as const satisfies NumberInputConf;

export const locationSchema = z
  .object(
    {
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
    },
    { error: 'Location is missing.' }
  )
  .refine(
    (val: any) =>
      Number.isFinite(val.latitude) && Number.isFinite(val.longitude),
    'Location is missing.'
  );

export enum MachineInvolvement {
  /**
   * No involvement.
   */
  NONE = 0,
  /**
   * Human determined, machine suggestions were ignored.
   */
  HUMAN = 1,
  /**
   * Human chose a machine suggestion given a very low probability.
   */
  HUMAN_ACCEPTED_LESS_PREFERRED_LOW = 2,
  /**
   * Human chose a machine suggestion that was less-preferred.
   */
  HUMAN_ACCEPTED_LESS_PREFERRED = 3,
  /**
   * Human chose a machine suggestion that was the preferred choice.
   */
  HUMAN_ACCEPTED_PREFERRED = 4,
  /**
   * Machine determined with no human involvement.
   */
  MACHINE = 5,
}

export function attachClassifierResults(
  submission: any,
  occ: Occurrence,
  classifierID?: string | number
) {
  const taxon = occ.getSpecies();
  const classifierVersion = taxon?.version || '';

  const getMediaPath = (media: any) => media.values.queued;
  const mediaPaths = submission.media.map(getMediaPath);

  const getSuggestion = (
    { scientificName, warehouseId, ...other }: Suggestion,
    index: number
  ) => {
    const probability = other.probability || (other as any).score; // score for backward compatibility
    const topSpecies = index === 0;
    const classifierChosen =
      topSpecies && probability >= possibleThreshold ? 't' : 'f';

    const humanChosen = warehouseId === taxon?.warehouseId ? 't' : 'f';

    return {
      values: {
        /* eslint-disable @typescript-eslint/naming-convention */
        taxon_name_given: scientificName,
        probability_given: probability,
        taxa_taxon_list_id: warehouseId,
        classifier_chosen: classifierChosen,
        human_chosen: humanChosen,
        /* eslint-enable @typescript-eslint/naming-convention */
      },
    };
  };

  const classifierSuggestions =
    occ.getSpecies()?.suggestions?.map(getSuggestion) || [];

  const hasSuggestions = classifierSuggestions.length;
  if (!hasSuggestions) {
    // don't set anything yet because this requires below structure to be valid
    // submission.values.machine_involvement = MachineInvolvement.NONE;
    return submission;
  }

  if (Number.isFinite(taxon?.machineInvolvement)) {
    submission.values.machine_involvement = taxon?.machineInvolvement;
  }

  return {
    ...submission,

    /* eslint-disable @typescript-eslint/naming-convention */
    classification_event: {
      values: { created_by_id: null },
      classification_results: [
        {
          values: {
            classifier_id: classifierID || config.classifierID,
            classifier_version: classifierVersion,
          },
          classification_suggestions: classifierSuggestions,
          metaFields: { mediaPaths },
        },
      ],
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  };
}

type MenuProps = MenuAttrItemFromModelMenuProps;

export type AttrConfig = {
  menuProps?: MenuProps;
  pageProps?: Omit<PageProps, 'attr' | 'model'>;
  block?: BlockOrFn;
  remote?: RemoteConfig;
};

type Attrs = Record<string, AttrConfig>;

type OccurrenceCreateOptions = {
  taxon?: Taxon;
  photo?: Media;
};

type OccurrenceConfig = {
  render?: any[] | ((model: Occurrence) => any[]);
  attrs: Attrs;
  create?: (options: OccurrenceCreateOptions) => Occurrence;
  verify?: (data: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  /**
   * Set to true if multi-species surveys shouldn't auto-increment it to 1 when adding to lists.
   */
  skipAutoIncrement?: boolean;
};

type SampleCreateOptions = {
  taxon?: Taxon;
  surveySample?: Sample;
  photo?: Media;
  /**
   * For soil survey subsamples
   */
  name?: string;
};

export type SampleConfig = {
  render?: any[] | ((model: Sample) => any[]);
  attrs?: Attrs;
  create?: (options: SampleCreateOptions) => Sample;
  verify?: (data: any, model: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  smp?: Omit<SampleConfig, 'smp'>;
  occ?: OccurrenceConfig;
};

export type BlockOrFn = BlockT | ((record?: any) => BlockT);

type AttrType = Record<string, { block: BlockT | ((record?: any) => BlockT) }>;
export const blockToAttr = (blockOrFn: BlockOrFn): AttrType =>
  typeof blockOrFn === 'function'
    ? { [blockOrFn().id]: { block: blockOrFn } }
    : { [blockOrFn.id]: { block: blockOrFn } };

export type Survey = {
  /**
   * Remote warehouse survey ID.
   */
  id: number;
  /**
   * In-App survey code name.
   */
  name: 'soil' | 'beetle' | 'moth' | 'habitat-structured' | 'habitat-free';
  /**
   * Pretty survey name to show in the UI.
   */
  label?: string;
  deprecated?: boolean;
  /**
   * Base URL path for this survey's routes.
   */
  baseURL?: string;

  /**
   * Remote website survey edit page path.
   */
  webForm?: string;

  /**
   * The icon of the survey.
   */
  icon?: string;
} & SampleConfig;
