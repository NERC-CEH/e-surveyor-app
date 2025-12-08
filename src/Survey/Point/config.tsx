import { z } from 'zod';
import config from 'common/config';
import icon from 'common/images/pointIcon.svg';
import appModel from 'common/models/app';
import SampleModel from 'common/models/sample';
import OccurrenceModel from 'models/occurrence';
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
  { value: `Don't know`, id: 22179 },
];

const { POSSIBLE_THRESHOLD } = config;

const survey: Survey = {
  id: 626,
  name: 'point',
  label: 'Habitat',
  icon,

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
          set: (value: any, sample: SampleModel) => {
            sample.data.seeded = value; // eslint-disable-line
            sample.data.seedmixgroup = ''; // eslint-disable-line
            sample.data.seedmix = ''; // eslint-disable-line
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

    create({ Sample, Occurrence, photo }) {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          location: null,
          enteredSrefSystem: 4326,
        },
      });

      sample.startGPS();

      if (!Occurrence)
        throw new Error('Occurrence class is missing in subSample create');

      const occurrence = survey.smp!.occ!.create!({
        Occurrence,
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

      create({ Occurrence, photo }) {
        const occ = new Occurrence({
          data: { taxon: null },
        });

        if (photo) occ.media.push(photo);

        return occ;
      },

      modifySubmission(submission: any, occ: OccurrenceModel) {
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

  create({ Sample }) {
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

    sample.startGPS();

    return sample;
  },

  verify(attrs, sample) {
    try {
      // check if at least one species with possible score exists
      let hasValidSpecies = false;
      const showReportIfScoreHigherThanThreshold = (subSample: any) => {
        const { score } = subSample.getSpecies();
        if (score > POSSIBLE_THRESHOLD) hasValidSpecies = true;
      };
      sample.samples.forEach(showReportIfScoreHigherThanThreshold);

      z.boolean()
        .refine(val => val === true, {
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
        subSample.values.entered_sref = submission.values.entered_sref; // eslint-disable-line no-param-reassign
      }
    };

    submission.samples.forEach(setSubSampleLocationIfMissing);

    return submission;
  },
};

export default survey;
