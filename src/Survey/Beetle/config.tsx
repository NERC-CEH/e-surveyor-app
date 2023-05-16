import { clipboardOutline, locationOutline } from 'ionicons/icons';
import * as Yup from 'yup';
// import config from 'common/config';
import icon from 'common/images/pointIcon.svg';
import { Survey } from 'common/surveys';
// import Occurrence from 'models/occurrence';
import {
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';

export const getDetailsValidationSchema = Yup.object().shape({
  location: verifyLocationSchema,
});

const tillageTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Zero tillage', id: -1 },
  { value: 'Shallow tillage', id: -1 },
  { value: 'Mouldboard plough', id: -1 },
];

const cropTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Barley (spring)', id: -1 },
  { value: 'Barley (winter)', id: -1 },
  { value: 'Cover crop', id: -1 },
  { value: 'Field beans (spring)', id: -1 },
  { value: 'Field beans (winter)', id: -1 },
  { value: 'Leafy vegetables', id: -1 },
  { value: 'Linseed', id: -1 },
  { value: 'Oats (spring)', id: -1 },
  { value: 'Oats (winter)', id: -1 },
  { value: 'Oilseed rape (spring)', id: -1 },
  { value: 'Oilseed rape (winter)', id: -1 },
  { value: 'Peas', id: -1 },
  { value: 'Root vegetables', id: -1 },
  { value: 'Sugar beet', id: -1 },
  { value: 'Wheat (spring)', id: -1 },
  { value: 'Wheat (winter)', id: -1 },
];

const marginTypes = [
  { value: 2 },
  { value: 6 },
  { value: 12 },
  { value: 18 },
  { value: 24 },
];

const survey: Survey = {
  id: 727,
  name: 'beetle',
  label: 'Trap',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    farm: {
      menuProps: { icon: locationOutline, skipValueTranslation: true },
      pageProps: {
        attrProps: {
          input: 'textarea',
          inputProps: {
            placeholder: 'Enter the farm name here.',
          },
        },
      },
    },

    trapDays: {
      menuProps: { icon: locationOutline, skipValueTranslation: true },
      pageProps: {
        attrProps: {
          input: 'textarea',
          inputProps: {
            placeholder: 'Enter the farm name here.',
          },
        },
      },
    },

    fieldName: {
      menuProps: {
        icon: clipboardOutline,
        skipValueTranslation: true,
        label: 'Name',
      },
      pageProps: {
        headerProps: { title: 'Field' },
        attrProps: {
          input: 'textarea',
          inputProps: {
            placeholder: 'Enter the field name here.',
          },
        },
      },
    },
    fieldMargins: {
      menuProps: {
        icon: clipboardOutline,
        skipValueTranslation: true,
        label: 'Margins',
      },
      pageProps: {
        headerProps: { title: 'Margins' },
        attrProps: [
          {
            input: 'slider',
            info: 'What are the field margins?',
            // inputProps: { max: 100 },
          },
          {
            input: 'radio',
            inputProps: { options: marginTypes },
          },
        ],
      },
    },

    fieldCrop: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Crop',
      },
      pageProps: {
        headerProps: { title: 'Crop' },
        attrProps: {
          input: 'radio',
          inputProps: { options: cropTypes },
        },
      },
      remote: { id: -1, values: cropTypes },
    },

    fieldTillage: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Tillage',
      },
      pageProps: {
        headerProps: { title: 'Tillage' },
        attrProps: {
          input: 'radio',
          inputProps: { options: tillageTypes },
        },
      },
      remote: { id: -1, values: tillageTypes },
    },

    fieldInsecticides: {
      menuProps: {
        label: 'Insecticides use',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: -1 },
    },

    fieldHerbicides: {
      menuProps: {
        label: 'Herbicides use',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: -1 },
    },

    fieldUndersowing: {
      menuProps: {
        label: 'Undersowing',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: -1 },
    },
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,

      // margin distance

      comment: {
        menuProps: {
          label: 'Notes',
          icon: clipboardOutline,
          skipValueTranslation: true,
        },
        pageProps: {
          headerProps: {
            title: 'Notes',
          },
          attrProps: {
            input: 'textarea',
            info: 'Please add any extra info about this record.',
          },
        },
      },
    },

    create(AppSample, _, photo) {
      const sample = new AppSample({
        metadata: {
          survey: survey.name,
          survey_id: survey.id,
        },

        attrs: {
          location: null,
          margin: 'Edge',
        },
      });

      if (photo) {
        sample.media.push(photo);
      }

      sample.startGPS();

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

      // verify(attrs) {
      //   try {
      //     Yup.object()
      //       .shape({
      //         taxon: Yup.object()
      //           .nullable()
      //           .required('Plant has not been identified'),
      //       })
      //       .validateSync(attrs, { abortEarly: false });
      //   } catch (attrError) {
      //     return attrError;
      //   }

      //   return null;
      // },

      create(AppOccurrence, photo) {
        const occ = new AppOccurrence({
          attrs: { taxon: null },
        });

        if (photo) {
          occ.media.push(photo);
        }

        return occ;
      },

      // modifySubmission(submission: any, occ: Occurrence) {
      //   // for non-UK species
      //   if (!submission.values.taxa_taxon_list_id) {
      //     return null;
      //   }

      //   return attachClassifierResults(submission, occ);
      // },
    },

    // modifySubmission(submission: any) {
    //   // for non-UK species
    //   if (!submission.occurrences.length) {
    //     return null;
    //   }

    //   return submission;
    // },
  },

  create(AppSample) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: { location: null, trapDays: 1 },
    });

    sample.startGPS();

    return sample;
  },

  // verify(attrs, sample) {
  //   try {
  //     const isIdentifying = sample.isIdentifying();

  //     Yup.boolean()
  //       .oneOf([false], 'Some photos are still being identified.')
  //       .validateSync(isIdentifying, { abortEarly: false });

  //     // const hasUnknownSpecies = sample.samples.some((subSample) => subSample.occure);

  //     // Yup.boolean()
  //     //   .oneOf([false], 'Some photos are still being identified.')
  //     //   .validateSync(isIdentifying, { abortEarly: false });

  //     let hasValidSpecies = false;
  //     const showReportIfScoreHigherThanThreshold = (subSample: any) => {
  //       const { score } = subSample.getSpecies();

  //       if (score > POSSIBLE_THRESHOLD) {
  //         hasValidSpecies = true;
  //       }
  //     };

  //     sample.samples.forEach(showReportIfScoreHigherThanThreshold);

  //     Yup.boolean()
  //       .oneOf([true], 'Please add some species.')
  //       .validateSync(hasValidSpecies, { abortEarly: false });

  //     const transectSchema = Yup.object().shape({
  //       location: verifyLocationSchema,
  //     });

  //     transectSchema.validateSync(attrs, { abortEarly: false });
  //   } catch (attrError) {
  //     return attrError;
  //   }

  //   return null;
  // },

  // modifySubmission(submission: any) {
  //   const subSamples = submission.samples;
  //   submission.samples = []; // eslint-disable-line

  //   const removeSubSamplesLayerIfNoLocation = (subSample: any) => {
  //     const locationIsMissing = !subSample.values.entered_sref;
  //     if (locationIsMissing) {
  //       submission.occurrences.push(subSample.occurrences[0]);
  //       return;
  //     }
  //     submission.samples.push(subSample);
  //   };

  //   subSamples.forEach(removeSubSamplesLayerIfNoLocation);

  //   return submission;
  // },
};

export default survey;
