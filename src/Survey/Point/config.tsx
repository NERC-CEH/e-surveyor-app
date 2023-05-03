import * as Yup from 'yup';
import config from 'common/config';
import icon from 'common/images/pointIcon.svg';
import { Survey } from 'common/surveys';
import Occurrence from 'models/occurrence';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
  attachClassifierResults,
} from 'Survey/common/config';

const { POSSIBLE_THRESHOLD } = config;

const survey: Survey = {
  id: 626,
  name: 'point',
  label: 'Survey',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: nameAttr,

    seedmixgroup: seedmixGroupAttr,

    seedmix: seedmixAttr,

    customSeedmix: customSeedmixAttr,
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
          remote: {
            id: 'taxa_taxon_list_id',
            values(taxon: any) {
              return taxon.warehouseId;
            },
          },
        },
      },

      verify(attrs) {
        try {
          Yup.object()
            .shape({
              taxon: Yup.object()
                .nullable()
                .required('Plant has not been identified'),
            })
            .validateSync(attrs, { abortEarly: false });
        } catch (attrError) {
          return attrError;
        }

        return null;
      },

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

      modifySubmission(submission: any, occ: Occurrence) {
        // for non-UK species
        if (!submission.values.taxa_taxon_list_id) {
          return null;
        }

        return attachClassifierResults(submission, occ);
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

      // const hasUnknownSpecies = sample.samples.some((subSample) => subSample.occure);

      // Yup.boolean()
      //   .oneOf([false], 'Some photos are still being identified.')
      //   .validateSync(isIdentifying, { abortEarly: false });

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
