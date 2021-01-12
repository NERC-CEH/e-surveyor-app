import * as Yup from 'yup';
import icon from 'common/images/pointIcon.svg';
import {
  seedmixGroupAttr,
  seedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';

const survey = {
  id: 626,
  name: 'point',
  label: 'Survey',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    name: {
      label: 'Survey Name',
      type: 'textarea',
      info: 'You can change your survey name here.',
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
          values(taxon) {
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

      modifySubmission(submission) {
        // for non-UK species
        if (!submission.values.taxa_taxon_list_id) {
          return null;
        }

        return submission;
      },
    },

    modifySubmission(submission) {
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
        name: new Date().toLocaleDateString(),
        location: null,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(attrs, sample) {
    try {
      const id = sample.isIdentifying();

      Yup.boolean()
        .oneOf([false], 'Is still identifying')
        .validateSync(id, { abortEarly: false });

      const transectSchema = Yup.object().shape({
        location: verifyLocationSchema,
      });

      transectSchema.validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },

  modifySubmission(submission) {
    const subSamples = submission.samples;
    submission.samples = []; // eslint-disable-line

    const removeSubSamplesLayerIfNoLocation = subSample => {
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
