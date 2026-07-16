import { leafOutline } from 'ionicons/icons';
import { z } from 'zod';
import config from 'common/config';
import { updateModelLocation } from 'common/flumens';
import appModel from 'common/models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  nameAttr,
  attachClassifierResults,
  Survey,
  locationSchema,
} from 'Survey/common/config';

const seededValues = [
  { value: 'Yes', id: 22177 },
  { value: 'No', id: 22178 },
  { value: "Don't know", id: 22179 },
];

const { possibleThreshold } = config;

const survey: Survey = {
  id: 626,
  name: 'habitat-free',
  label: 'Habitat Free',
  baseURL: '/survey/habitat/free',
  icon: leafOutline,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: nameAttr,

    seeded: {
      pageProps: {
        headerProps: { title: 'Seeded' },
        attrProps: {
          input: 'radio',
          info: 'Has the survey area been seeded?',
          inputProps: { options: seededValues },
          set: (value: any, sample: Sample) => {
            sample.data.seeded = value;
            sample.data.seedmixgroup = '';
            sample.data.seedmix = '';
          },
        },
      },
      remote: { id: 1868, values: seededValues },
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

    create({ photo }) {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          location: null,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS(loc => updateModelLocation(sample, loc));

      const occurrence = survey.smp!.occ!.create!({
        photo,
      });
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

      verify: attrs =>
        z
          .object({})
          .nullable()
          .refine(val => val !== null, {
            message: 'Plant has not been identified',
          })
          .safeParse(attrs.taxon).error,

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
        surveyId: survey.id,
        training: appModel.data.useTraining,
        date: new Date().toISOString(),
        name: new Date().toLocaleDateString('en-UK'),
        seedmix: '',
        seedmixgroup: '',
        location: null,
        enteredSrefSystem: 4326,
      },
    });

    sample.startGPS(loc => updateModelLocation(sample, loc));

    return sample;
  },

  verify(attrs, sample) {
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

      z.object({ location: locationSchema }).parse(attrs);
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
};

export default survey;
