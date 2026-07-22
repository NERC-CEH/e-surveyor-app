import { calendarOutline, leafOutline } from 'ionicons/icons';
import { z } from 'zod';
import { IonIcon } from '@ionic/react';
import config from 'common/config';
import {
  dateFormatISO,
  inferAttrConfigTypes,
  SampleData,
  updateModelLocation,
} from 'common/flumens';
import appModel from 'common/models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  attachClassifierResults,
  SEEDED_YES_VALUE,
  Survey,
  locationSchema,
  seededAttr,
  seedmixGroupAttr,
  SEEDMIX_ATTR_ID,
} from 'Survey/common/config';

export {
  seedmixGroupAttr,
  SEEDED_YES_VALUE,
  seededAttr,
} from 'Survey/common/config';

const currentYear = new Date().getFullYear();
const last8Years = Array.from({ length: 8 }, (_, index) => ({
  dataName: String(currentYear - index),
  title: String(currentYear - index),
}));
export const yearSownAttr = {
  id: 'smpAttr:-10',
  type: 'choiceInput',
  title: 'Year sown',
  appearance: 'button',
  prefix: (<IonIcon src={calendarOutline} className="size-6" />) as any,
  choices: last8Years,
  visibility: [{ target: seededAttr.id, op: 'eq', value: SEEDED_YES_VALUE }],
} as const;

const { possibleThreshold } = config;

const attrs = {
  seedmixGroup: { block: seedmixGroupAttr },
} as const;

const SURVEY_ID = 626;

const survey = {
  id: SURVEY_ID,
  name: 'habitat-free',
  label: 'Habitat Free',
  baseURL: '/survey/habitat/free',
  icon: leafOutline,

  attrs,

  smp: {
    attrs: {},

    create({ photo }) {
      const sample = new Sample({
        data: {
          surveyId: SURVEY_ID,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS(loc => updateModelLocation(sample, loc));

      const occurrence = survey.smp.occ.create({ photo });
      sample.occurrences.push(occurrence);

      return sample;
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

      verify: data =>
        z
          .object({})
          .nullable()
          .refine(val => val !== null, {
            message: 'Plant has not been identified',
          })
          .safeParse(data.taxon).error,

      create({ photo }) {
        const occ = new Occurrence({
          data: { taxon: null },
        });

        if (photo) occ.media.push(photo);

        return occ;
      },

      modifySubmission(submission: any, occ: Occurrence) {
        // for non-UK species
        if (!submission.values.taxa_taxon_list_id) return null;
        return attachClassifierResults(submission, occ);
      },
    },

    modifySubmission(submission: any) {
      // for non-UK species
      if (!submission.occurrences.length) return null;
      return submission;
    },
  },

  create() {
    const sample = new Sample({
      data: {
        surveyId: SURVEY_ID,
        training: appModel.data.useTraining,
        date: dateFormatISO.format(new Date()),
        enteredSrefSystem: 4326,
      },
    });

    sample.startGPS(loc => updateModelLocation(sample, loc));

    return sample;
  },

  verify(data, sample) {
    try {
      // check if at least one species with possible score exists
      let hasValidSpecies = false;
      const showReportIfScoreHigherThanThreshold = (subSample: Sample) => {
        const { probability } = subSample.getSpecies();
        if (probability > possibleThreshold) hasValidSpecies = true;
      };
      sample.samples.forEach(showReportIfScoreHigherThanThreshold);

      z.boolean()
        .refine(val => val, {
          message: 'Please add some species.',
        })
        .parse(hasValidSpecies);

      z.object({ location: locationSchema }).parse(data);
    } catch (attrError) {
      return attrError;
    }

    return null;
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
} as const satisfies Survey;

export type Data = SampleData &
  inferAttrConfigTypes<typeof attrs> & {
    [SEEDMIX_ATTR_ID]: any;
  };

export default survey;
