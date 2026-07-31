import { leafOutline } from 'ionicons/icons';
import { z } from 'zod';
import {
  dateFormatISO,
  inferAttrConfigTypes,
  SampleData,
} from 'common/flumens';
import appModel from 'common/models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  attachClassifierResults,
  Survey,
  seedmixGroupAttr,
  SEEDMIX_ATTR_ID,
} from 'Survey/common/config';

export {
  seedmixGroupAttr,
  SEEDED_YES_VALUE,
  seededAttr,
} from 'Survey/common/config';

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
      const occ = new Occurrence({});

      if (photo) occ.media.push(photo);

      return occ;
    },

    modifySubmission(submission: any, occ: Occurrence) {
      // for non-UK species
      if (!submission.values.taxa_taxon_list_id) return null;
      return attachClassifierResults(submission, occ);
    },
  },

  create() {
    const sample = new Sample({
      data: {
        surveyId: SURVEY_ID,
        training: appModel.data.useTraining,
        date: dateFormatISO.format(new Date()),
      },
    });

    return sample;
  },

  verify(data) {
    try {
      z.object({
        locationId: z.string({ error: 'Location is missing' }),
      }).parse(data);
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
} as const satisfies Survey;

export type Data = SampleData &
  inferAttrConfigTypes<typeof attrs> & {
    [SEEDMIX_ATTR_ID]: any;
  };

export default survey;
