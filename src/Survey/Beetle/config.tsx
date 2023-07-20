import { clipboardOutline, locationOutline } from 'ionicons/icons';
import * as Yup from 'yup';
import { Option } from '@flumens/ionic/dist/components/RadioInput';
import icon from 'common/images/beetle.svg';
import {
  Survey,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';

export const getDetailsValidationSchema = Yup.object().shape({
  location: verifyLocationSchema,
});

// https://warehouse1.indicia.org.uk/index.php/taxon_list/edit/280?tab=taxa
export const beetleSpecies: Option[] = [
  { label: 'This is not a beetle', value: '617322' },
  { label: 'Unknown beetle', value: '617383' },

  { isPlaceholder: true, value: '' },
  { isPlaceholder: true, value: 'Species' },
  { label: 'Abax parallelepipedus', value: '617294' },
  { label: 'Amara', value: '617295' },
  { label: 'Anchomenus dorsalis', value: '617296' },
  { label: 'Badister bullatus', value: '617297' },
  { label: 'Bembidion', value: '617298' },
  { label: 'Brachinus crepitans', value: '617299' },
  { label: 'Bradycellus', value: '617300' },
  { label: 'Calathus fuscipes', value: '617301' },
  { label: 'Calathus melanocephalus/cinctus', value: '617302' },
  { label: 'Carabus', value: '617303' },
  { label: 'Carbidae (smaller than 5mm)', value: '617304' },
  { label: 'Harpalus affinis', value: '617305' },
  { label: 'Harpalus rufipes', value: '617306' },
  { label: 'Harpalus tardus', value: '617307' },
  { label: 'Leistus ferrugineus', value: '617308' },
  { label: 'Leistus fulvibarbis', value: '617309' },
  { label: 'Leistus spinibarbis', value: '617310' },
  { label: 'Loricera pilicornis', value: '617311' },
  { label: 'Nebria brevicollis/salina', value: '617312' },
  { label: 'Notiophilus', value: '617313' },
  { label: 'Ophonus', value: '617314' },
  { label: 'Poecilus cupreus/versicolor', value: '617315' },
  { label: 'Pterostichus madidus', value: '617316' },
  { label: 'Pterostichus melanarius', value: '617317' },
  { label: 'Pterostichus niger', value: '617318' },
  { label: 'Pterostichus nigrita', value: '617319' },
  { label: 'Pterostichus strenuus', value: '617320' },
  { label: 'Pterostichus vernalis', value: '617321' },
];

const tillageTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Zero tillage', id: 21781 },
  { value: 'Shallow tillage', id: 21782 },
  { value: 'Mouldboard plough', id: 21783 },
];

const cropTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Barley (spring)', id: 21764 },
  { value: 'Barley (winter)', id: 21765 },
  { value: 'Cover crop', id: 21766 },
  { value: 'Field beans (spring)', id: 21767 },
  { value: 'Field beans (winter)', id: 21768 },
  { value: 'Leafy vegetables', id: 21769 },
  { value: 'Linseed', id: 21770 },
  { value: 'Oats (spring)', id: 21771 },
  { value: 'Oats (winter)', id: 21772 },
  { value: 'Oilseed rape (spring)', id: 21773 },
  { value: 'Oilseed rape (winter)', id: 21774 },
  { value: 'Pasture/grassland', id: 21775 },
  { value: 'Peas', id: 21776 },
  { value: 'Root vegetables', id: 21777 },
  { value: 'Sugar beet', id: 21778 },
  { value: 'Wheat (spring)', id: 21779 },
  { value: 'Wheat (winter)', id: 21780 },
];

const marginTypes = [
  { value: 2 },
  { value: 6 },
  { value: 12 },
  { value: 18 },
  { value: 24 },
];

export const marginOptions = [
  { value: 'Edge', id: 21784 },
  { value: '5 meters in', id: 21785 },
  { value: 'Centre', id: 21786 },
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
      remote: { id: 'location_name' },
    },

    trapDays: {
      remote: { id: 1778 },
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
      remote: { id: 1779 },
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
            info: 'What is the field margin width?',
            inputProps: { min: 1, max: 24 },
          },
          {
            input: 'radio',
            inputProps: { options: marginTypes },
          },
        ],
      },
      remote: { id: 1780 },
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
      remote: { id: 1781, values: cropTypes },
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
      remote: { id: 1782, values: tillageTypes },
    },

    fieldInsecticides: {
      menuProps: {
        label: 'Insecticides used',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: 1783 },
    },

    fieldHerbicides: {
      menuProps: {
        label: 'Herbicides used',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: 1784 },
    },

    fieldUndersowing: {
      menuProps: {
        label: 'Undersowing',
        icon: clipboardOutline,
        type: 'toggle',
      },
      remote: { id: 1785 },
    },
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,

      margin: {
        remote: { id: 1786, values: marginOptions },
      },

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

    create({ Sample, photo, surveySample }) {
      const sample = new Sample({
        metadata: {
          survey: survey.name,
          survey_id: survey.id,
        },

        attrs: {
          date: surveySample!.attrs.date,
          sample_method_id: 24, // Pitfall trap
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

    verify(attrs) {
      try {
        Yup.object()
          .shape({
            location: verifyLocationSchema,
          })
          .validateSync(attrs, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
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

      verify(attrs) {
        try {
          Yup.object()
            .shape({
              taxon: Yup.object()
                .nullable()
                .required('Beetle has not been identified'),
            })
            .validateSync(attrs, { abortEarly: false });
        } catch (attrError) {
          return attrError;
        }

        return null;
      },

      create({ Occurrence, photo }) {
        const occ = new Occurrence({
          attrs: { taxon: null },
        });

        if (photo) {
          occ.media.push(photo);
        }

        return occ;
      },
    },
  },

  create({ Sample }) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        sample_method_id: 2424, // Parent sample
        location: null,
        trapDays: 1,
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

      Yup.array()
        .min(1, 'Please add at least one trap.')
        .validateSync(sample.samples, { abortEarly: false });

      Yup.object()
        .shape({
          location: verifyLocationSchema,
        })
        .validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
