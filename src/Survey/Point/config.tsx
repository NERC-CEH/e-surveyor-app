import * as Yup from 'yup';
import config from 'common/config';
import icon from 'common/images/pointIcon.svg';
import OccurrenceModel from 'models/occurrence';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
  attachClassifierResults,
  Survey,
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

    create({ Sample, Occurrence, photo }) {
      const sample = new Sample({
        metadata: {
          survey: survey.name,
          survey_id: survey.id,
        },

        attrs: {
          location: null,
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

      create({ Occurrence, photo }) {
        const occ = new Occurrence({
          attrs: {
            taxon: null,
          },
        });

        if (photo) {
          occ.media.push(photo);
        }

        return occ;
      },

      modifySubmission(submission: any, occ: OccurrenceModel) {
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

  create({ Sample }) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        name: new Date().toLocaleDateString('en-UK'),
        seedmix: '',
        seedmixgroup: '',
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
