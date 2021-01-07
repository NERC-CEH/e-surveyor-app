import * as Yup from 'yup';
import icon from 'common/images/transectIcon.svg';
import {
  seedmixGroupAttr,
  seedmixAttr,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import appModel from 'appModel';

const survey = {
  id: 598, // -1 this is dev still
  name: 'transect',
  label: 'Transect',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    type: {
      label: 'Type',
      type: 'radio',
      set: (value, { sample }) => {
        sample.attrs.type = value; // eslint-disable-line

        sample.attrs.steps = 10; // eslint-disable-line
        sample.attrs.quadratSize = 1; // eslint-disable-line

        if (value === 'Common Standards') {
          // eslint-disable-next-line
          sample.attrs.steps = appModel.attrs.use10stepsForCommonStandard
            ? 10
            : 20;
          sample.attrs.quadratSize = 1; // eslint-disable-line
        }
      },
      values: [
        { value: 'Agri-environment', id: -1 },
        { value: 'Common Standards', id: -1 },
        { value: 'Custom', id: -1 },
      ],
    },

    steps: {
      label: 'Steps',
      info: 'Please specify the number of quadrats you would like to survey.',
      type: 'slider',
    },

    quadratSize: {
      label: 'Quadrat Size',
      info: 'Please specify the quadrat size in meters.',
      type: 'slider',
    },

    seedmixgroup: seedmixGroupAttr,

    seedmix: seedmixAttr,
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,
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

        const occurrence = survey.smp.smp.occ.create(AppOccurrence, photo);
        sample.occurrences.push(occurrence);

        return sample;
      },

      modifySubmission(submission) {
        // for non-UK species
        if (!submission.occurrences.length) {
          return null;
        }

        return submission;
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
    },

    create(AppSample) {
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

      return sample;
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
  },

  create(AppSample) {
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
};

export default survey;
