import * as Yup from 'yup';
import icon from 'common/images/pointIcon.svg';
import {
  seedmixGroupAttr,
  seedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { Survey } from 'common/surveys';
import config from 'common/config';

const { POSSIBLE_THRESHOLD } = config;

const survey: Survey = {
  id: 626,
  name: 'point',
  label: 'Survey',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: {
      pageProps: {
        headerProps: { title: 'Survey Name' },
        attrProps: {
          input: 'textarea',
          info: 'You can change your survey name here.',
        },
      },
      remote: { id: 1531 },
    },

    seedmixgroup: seedmixGroupAttr,

    seedmix: seedmixAttr,
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,
    },

    create(AppSample, AppOccurrence, photo) {
      const sample = new AppSample({
        metadata: {
          survey: survey.name,
          survey_id: survey.id,
        },

        attrs: {
          location: null,
        },
      });

      sample.startGPS();

      const occurrence = survey.smp.occ.create(AppOccurrence, photo);
      sample.occurrences.push(occurrence);

      return sample;
    },

    occ: {
      attrs: {
        taxon: {
          id: 'taxa_taxon_list_id',
          values(taxon: any) {
            return taxon.warehouseId;
          },
        },
      },

      verify() {},

      create(AppOccurrence, photo) {
        const occ = new AppOccurrence({
          attrs: {
            taxon: null,
          },
        });

        if (photo) {
          occ.media.push(photo);
        }

        return occ;
      },

      modifySubmission(submission: any) {
        // for non-UK species
        if (!submission.values.taxa_taxon_list_id) {
          return null;
        }

        return submission;
      },
    },

    modifySubmission(submission: any) {
      // for non-UK species
      if (!submission.occurrences.length) {
        return null;
      }

      return submission;
    },
  },

  create(AppSample) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        name: new Date().toLocaleDateString('en-UK'),
        location: null,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(attrs, sample) {
    try {
      const isIdentifying = sample.isIdentifying();

      Yup.boolean()
        .oneOf([false], 'Some photos are still being identified.')
        .validateSync(isIdentifying, { abortEarly: false });

      let hasValidSpecies = false;
      const showReportIfScoreHigherThanThreshold = (subSample: any) => {
        const { score } = subSample.getSpecies();

        if (score > POSSIBLE_THRESHOLD) {
          hasValidSpecies = true;
        }
      };

      sample.samples.forEach(showReportIfScoreHigherThanThreshold);

      Yup.boolean()
        .oneOf([true], 'Please add some species.')
        .validateSync(hasValidSpecies, { abortEarly: false });

      const transectSchema = Yup.object().shape({
        location: verifyLocationSchema,
        seedmix: Yup.mixed().required('Please select your seed mix.'),
      });

      transectSchema.validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },

  modifySubmission(submission: any) {
    const subSamples = submission.samples;
    submission.samples = []; // eslint-disable-line

    const removeSubSamplesLayerIfNoLocation = (subSample: any) => {
      const locationIsMissing = !subSample.values.entered_sref;
      if (locationIsMissing) {
        submission.occurrences.push(subSample.occurrences[0]);
        return;
      }
      submission.samples.push(subSample);
    };

    subSamples.forEach(removeSubSamplesLayerIfNoLocation);

    return submission;
  },
};

export default survey;
