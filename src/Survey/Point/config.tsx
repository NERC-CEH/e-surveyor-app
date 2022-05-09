import * as Yup from 'yup';
import icon from 'common/images/pointIcon.svg';
import {
  seedmixGroupAttr,
  seedmixAttr,
  customSeedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
  nameAttr,
} from 'Survey/common/config';
import { Survey } from 'common/surveys';
import Occurrence, { MachineInvolvement } from 'models/occurrence';
import config from 'common/config';
import { ResultWithWarehouseID } from 'common/services/plantNet';

const { POSSIBLE_THRESHOLD } = config;

function attachClassifierResults(submission: any, occ: Occurrence) {
  const { taxon } = occ.attrs;
  const classifierVersion = taxon?.version || '';

  const getMediaPath = (media: any) => media.values.queued;
  const mediaPaths = submission.media.map(getMediaPath);

  const getSuggestion = (
    { score, species, warehouseId }: ResultWithWarehouseID,
    index: number
  ) => {
    const topSpecies = index === 0;
    const classifierChosen =
      topSpecies && score >= POSSIBLE_THRESHOLD ? 't' : 'f';

    const humanChosen = warehouseId === taxon?.warehouseId ? 't' : 'f';

    return {
      values: {
        taxon_name_given: species.scientificNameWithoutAuthor,
        probability_given: score,
        taxa_taxon_list_id: warehouseId,
        classifier_chosen: classifierChosen,
        human_chosen: humanChosen,
      },
    };
  };

  const classifierSuggestions =
    occ.attrs.taxon?.suggestions?.map(getSuggestion) || [];

  const hasSuggestions = classifierSuggestions.length;
  if (!hasSuggestions) {
    // eslint-disable-next-line no-param-reassign
    submission.values.machine_involvement = MachineInvolvement.NONE;
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
            classifier_id: config.classifierID,
            classifier_version: classifierVersion,
          },
          classification_suggestions: classifierSuggestions,
          metaFields: { mediaPaths },
        },
      ],
    },
  };
}

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
