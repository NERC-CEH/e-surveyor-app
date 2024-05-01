import { chatboxOutline } from 'ionicons/icons';
import { z, object } from 'zod';
import { dateFormat, toISOTimezoneString } from '@flumens';
import icon from 'common/images/moth-inside-icon.svg';
import appModel from 'common/models/app';
import Occurrence from 'models/occurrence';
import {
  Survey,
  locationAttr,
  attachClassifierResults,
} from 'Survey/common/config';

export const habitatValues = [
  { value: 'Arable field margin', id: 22140 },
  { value: 'Rough ground', id: 22141 },
  { value: 'Other (please specify)', id: 22142 },
];

const commentAttr = {
  menuProps: { icon: chatboxOutline, skipValueTranslation: true },
  pageProps: {
    attrProps: {
      input: 'textarea',
      info: 'Please add any extra info about this record.',
    },
  },
};

// converts UTC time to local
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: 'numeric',
});

const classifierID = 20098;

const survey: Survey = {
  id: 763,
  name: 'moth',
  label: 'Moth-trap',
  icon,

  attrs: {
    location: locationAttr,

    surveyEndTime: {
      remote: {
        id: 1386,
        values: (date: number) => dateTimeFormat.format(new Date(date)),
      },
    },

    date: {
      remote: { values: (date: number) => dateFormat.format(new Date(date)) },
    },

    habitat: { remote: { id: 1866, values: habitatValues } },
    otherHabitat: { remote: { id: 1867 } },
    comment: commentAttr,
  },

  occ: {
    attrs: {
      taxon: {
        remote: {
          id: 'taxa_taxon_list_id',
          values: (taxon: any) => taxon.warehouseId,
        },
      },
    },

    verify: attrs =>
      object({
        taxon: object({}, { required_error: 'Moth has not been identified.' }),
        // @ts-expect-error ignore
      }).safeParse(attrs).error,

    create({ Occurrence: AppOccurrence, taxon, photo }) {
      const occ = new AppOccurrence({
        attrs: { taxon },
      });

      if (photo) occ.media.push(photo);

      return occ;
    },

    modifySubmission(submission: any, occ: Occurrence) {
      return attachClassifierResults(submission, occ, classifierID);
    },
  },

  verify: attrs =>
    object({
      location: object(
        { latitude: z.number(), longitude: z.number() },
        { invalid_type_error: 'Please select location.' }
      ),
      // @ts-expect-error ignore
    }).safeParse(attrs).error,

  create({ Sample }) {
    const sample = new Sample({
      metadata: {
        survey_id: survey.id,
        survey: survey.name,
      },
      attrs: {
        training: appModel.attrs.useTraining,
        surveyEndTime: toISOTimezoneString(new Date()),
        location: null,
        comment: null,
      },
    });

    sample.startGPS();

    return sample;
  },
};

export default survey;

export const UNKNOWN_SPECIES = {
  warehouseId: 538737,
  taxonGroup: 260,
  commonName: 'Unknown',
  preferredId: 538737,
  foundInName: 'commonName',
  score: 0,
};
