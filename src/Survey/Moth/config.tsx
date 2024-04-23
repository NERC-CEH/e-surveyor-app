import { when } from 'mobx';
import { chatboxOutline } from 'ionicons/icons';
import SunCalc from 'suncalc';
import { z, object } from 'zod';
import { dateFormat, isValidLocation } from '@flumens';
import icon from 'common/images/moth-inside-icon.svg';
import appModel from 'common/models/app';
import Occurrence from 'models/occurrence';
import AppSample from 'models/sample';
import {
  Survey,
  locationAttr,
  attachClassifierResults,
} from 'Survey/common/config';

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

const getSetDefaultTime = (sample: AppSample) => () => {
  const { surveyStartTime } = sample.attrs;
  if (surveyStartTime) return;

  const { location } = sample.attrs;
  if (!isValidLocation(location)) return;
  // debugger;
  // end time
  const date = new Date(sample.attrs.date);
  const { sunrise } = SunCalc.getTimes(
    date,
    location.latitude,
    location.longitude
  );
  // eslint-disable-next-line no-param-reassign
  sample.attrs.surveyEndTime = new Date(sunrise).toISOString(); // UTC time

  // start time
  const oneDayBefore = new Date(date.setDate(date.getDate() - 1));
  const { sunset } = SunCalc.getTimes(
    oneDayBefore,
    location.latitude,
    location.longitude
  );
  // eslint-disable-next-line no-param-reassign
  sample.attrs.surveyStartTime = new Date(sunset).toISOString(); // UTC time
  sample.save();
};

const classifierID = 20098;

const survey: Survey = {
  id: 763,
  name: 'moth',
  label: 'Moth-trap',
  icon,

  attrs: {
    location: locationAttr,

    surveyStartTime: {
      remote: {
        id: 1385,
        values: (date: number) => dateTimeFormat.format(new Date(date)),
      },
    },

    surveyEndTime: {
      remote: {
        id: 1386,
        values: (date: number) => dateTimeFormat.format(new Date(date)),
      },
    },

    date: {
      remote: { values: (date: number) => dateFormat.format(new Date(date)) },
    },

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
        location: null,
        comment: null,
      },
    });

    sample.startGPS();

    when(() => !!sample.attrs.location, getSetDefaultTime(sample));

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
};
