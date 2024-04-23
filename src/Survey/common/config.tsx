import { calendarOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
  dateFormat,
  MenuAttrItemFromModelMenuProps,
  PageProps,
  RemoteConfig,
} from '@flumens';
import config from 'common/config';
import seedmixData from 'common/data/cacheRemote/seedmix.json';
import { SeedmixSpecies } from 'common/data/seedmix';
import appModel, { SeedMix } from 'models/app';
import Media from 'models/image';
import Occurrence, { Suggestion, Taxon } from 'models/occurrence';
import Sample from 'models/sample';

const { POSSIBLE_THRESHOLD } = config;

const getSeedMixGroups = () => {
  const addValueToObject = (seedMixGroup: any) => ({ value: seedMixGroup });

  const getUniqueValues = (unique: any, item: any) => {
    return unique.includes(item.mixGroup) ? unique : [...unique, item.mixGroup];
  };

  const alphabetically = (v1: any, v2: any) => v1.value.localeCompare(v2.value);

  const seedMixGroups = seedmixData
    .reduce(getUniqueValues, [])
    .map(addValueToObject)
    .sort(alphabetically);

  const notRecorded = {
    value: '',
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

  const bySeedmixGroups = (seedmix: any) => seedmix.mixGroup === seedmixgroup;

  const getUniqueValues = (unique: any, item: any) => {
    return unique.includes(item.mixName) ? unique : [...unique, item.mixName];
  };

  const seedMixes = seedmixData
    .filter(bySeedmixGroups)
    .reduce(getUniqueValues, [])
    .map(addValueToObject);

  const notRecorded = {
    value: '',
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
    headerProps: { title: 'Supplier' },
    attrProps: {
      input: 'radio',
      info: 'Please indicate the supplier.',
      inputProps: { options: getSeedMixGroups() },
      set: (value: any, sample: Sample) => {
        if (sample.attrs.seedmixgroup !== value) {
          sample.attrs.seedmixgroup = value; // eslint-disable-line
          sample.attrs.seedmix = ''; // eslint-disable-line
        }
      },
    },
  },
  remote: { id: 1529 },
};

export const seedmixAttr = {
  pageProps: {
    headerProps: { title: 'Seed mix' },
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
      const getWarehouseId = (sp: SeedmixSpecies) => sp.warehouseId;

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
    { score, scientificName, warehouseId }: Suggestion,
    index: number
  ) => {
    const topSpecies = index === 0;
    const classifierChosen =
      topSpecies && score >= POSSIBLE_THRESHOLD ? 't' : 'f';

    const humanChosen = warehouseId === taxon?.warehouseId ? 't' : 'f';

    return {
      values: {
        taxon_name_given: scientificName,
        probability_given: score,
        taxa_taxon_list_id: warehouseId,
        classifier_chosen: classifierChosen,
        human_chosen: humanChosen,
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
    // eslint-disable-next-line no-param-reassign
    submission.values.machine_involvement = taxon?.machineInvolvement;
  }

  return {
    ...submission,

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
  };
}

type MenuProps = MenuAttrItemFromModelMenuProps;

export type AttrConfig = {
  menuProps?: MenuProps;
  pageProps?: Omit<PageProps, 'attr' | 'model'>;
  remote?: RemoteConfig;
};

interface Attrs {
  [key: string]: AttrConfig;
}

type OccurrenceCreateOptions = {
  Occurrence: typeof Occurrence;
  taxon?: Taxon;
  photo?: Media;
};

type OccurrenceConfig = {
  render?: any[] | ((model: Occurrence) => any[]);
  attrs: Attrs;
  create?: (options: OccurrenceCreateOptions) => Occurrence;
  verify?: (attrs: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  /**
   * Set to true if multi-species surveys shouldn't auto-increment it to 1 when adding to lists.
   */
  skipAutoIncrement?: boolean;
};

type SampleCreateOptions = {
  Sample: typeof Sample;
  Occurrence?: typeof Occurrence;
  taxon?: Taxon;
  surveySample?: Sample;
  photo?: Media;
};

export type SampleConfig = {
  render?: any[] | ((model: Sample) => any[]);
  attrs?: Attrs;
  create?: (options: SampleCreateOptions) => Sample;
  verify?: (attrs: any, model: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  smp?: SampleConfig;
  occ?: OccurrenceConfig;
};

export interface Survey extends SampleConfig {
  /**
   * Remote warehouse survey ID.
   */
  id: number;
  /**
   * In-App survey code name.
   */
  name: string;
  /**
   * Pretty survey name to show in the UI.
   */
  label?: string;
  deprecated?: boolean;
  /**
   * Remote website survey edit page path.
   */
  webForm?: string;

  /**
   * The icon of the survey.
   */
  icon?: string;
}
