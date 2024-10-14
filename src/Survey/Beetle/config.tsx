import { clipboardOutline } from 'ionicons/icons';
import * as Yup from 'yup';
import { RadioOption } from '@flumens';
import icon from 'common/images/beetle.svg';
import appModel from 'common/models/app';
import {
  Survey,
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';

export const getDetailsValidationSchema = Yup.object().shape({
  location: verifyLocationSchema,
});

type ExtendedOption = RadioOption & {
  label?: string;
  commonName?: string;
  scientificName?: string;
};

const addLabels = (option: any) => {
  if (option.label || option.isPlaceholder) return option;

  if (option.commonName) {
    option.label = // eslint-disable-line no-param-reassign
      (
        <div className="flex flex-col">
          <div className="font-semibold">{option.commonName}</div>
          <div className="italic">{option.scientificName}</div>
        </div>
      );
    return option;
  }

  // eslint-disable-next-line no-param-reassign
  option.label = <i>{option.scientificName}</i>;
  return option;
};

// https://warehouse1.indicia.org.uk/index.php/taxon_list/edit/280?tab=taxa
export const beetleSpecies: ExtendedOption[] = [
  { label: 'This is not a beetle', value: '617322' },
  { label: 'Unknown beetle', value: '617383' },

  { isPlaceholder: true, value: '' },
  { isPlaceholder: true, value: 'Species' },
  {
    commonName: 'Common Shoulderblade',
    scientificName: 'Abax parallelepipedus',
    value: '617294',
  },
  {
    commonName: 'Sunshiners and moonshiners',
    scientificName: 'Amara',
    value: '617295',
  },
  {
    commonName: 'Copper club-back',
    scientificName: 'Anchomenus dorsalis',
    value: '617296',
  },
  {
    scientificName: 'Badister bullatus',
    value: '617297',
  },
  {
    commonName: 'Pin-palps',
    scientificName: 'Bembidion',
    value: '617298',
  },
  {
    commonName: 'Bombardier beetle',
    scientificName: 'Brachinus crepitans',
    value: '617299',
  },
  {
    scientificName: 'Bradycellus',
    value: '617300',
  },
  {
    commonName: 'Sawfoot ground beetle',
    scientificName: 'Calathus fuscipes',
    value: '617301',
  },
  {
    commonName: 'Saddled sawfoot ground beetle',
    scientificName: 'Calathus melanocephalus/cinctus',
    value: '617302',
  },
  {
    commonName: 'Violet ground beetle',
    scientificName: 'Carabus violaceus',
    value: '617420',
  },
  {
    scientificName: 'Carabus',
    value: '617303',
  },
  {
    scientificName: 'Carbidae (smaller than 5mm)',
    value: '617304',
  },
  {
    commonName: 'Copper seed eater',
    scientificName: 'Harpalus affinis',
    value: '617305',
  },
  {
    commonName: 'Strawberry seed beetle',
    scientificName: 'Harpalus rufipes',
    value: '617306',
  },
  {
    commonName: 'Seed-eater',
    scientificName: 'Harpalus tardus',
    value: '617307',
  },
  {
    commonName: 'Plate jaw',
    scientificName: 'Leistus ferrugineus',
    value: '617308',
  },
  {
    commonName: 'Plate jaw',
    scientificName: 'Leistus fulvibarbis',
    value: '617309',
  },
  {
    commonName: 'Prussian plate-jaw',
    scientificName: 'Leistus spinibarbis',
    value: '617310',
  },
  {
    commonName: 'Hair-trap ground beetle',
    scientificName: 'Loricera pilicornis',
    value: '617311',
  },
  {
    commonName: 'Heartshield ground beetle',
    scientificName: 'Nebria brevicollis/salina',
    value: '617312',
  },
  {
    commonName: 'Big-eyed beetle',
    scientificName: 'Notiophilus',
    value: '617313',
  },
  {
    scientificName: 'Ophonus',
    value: '617314',
  },
  {
    commonName: 'Copper greenclock',
    scientificName: 'Poecilus cupreus/versicolor',
    value: '617315',
  },
  {
    commonName: 'Common blackclock',
    scientificName: 'Pterostichus madidus',
    value: '617316',
  },
  {
    commonName: 'Rainbeetle blackclock',
    scientificName: 'Pterostichus melanarius',
    value: '617317',
  },
  {
    commonName: 'Great Blackclock',
    scientificName: 'Pterostichus niger',
    value: '617318',
  },
  {
    scientificName: 'Pterostichus nigrita',
    value: '617319',
  },
  {
    scientificName: 'Pterostichus strenuus',
    value: '617320',
  },
  {
    scientificName: 'Pterostichus vernalis',
    value: '617321',
  },
  {
    commonName: 'Longjaw ground beetle',
    scientificName: 'Stomis pumicatus',
    value: '617419',
  },
  {
    commonName: 'Sienna flat beetle',
    scientificName: 'Trechus quadristriatus',
    value: '617418',
  },
].map(addLabels);

const tillageTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Zero tillage', id: 21781 },
  { value: 'Shallow tillage', id: 21782 },
  { value: 'Mouldboard plough', id: 21783 },
  { value: 'Other', id: 21827 },
];

const nonCropHabitatTypes = [
  { value: 'Bird food/cover', id: 21833 },
  { value: 'Beetle banks', id: 21834 },
  { value: 'In-field strips', id: 21835 },
  { value: 'Agroforestry', id: 21836 },
  { value: 'Herbal/grass ley', id: 21837 },
  { value: 'Other', id: 21838 },
];

const cropTypes = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Bare stubble/cultivated', id: 21825 },
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
  { value: 'Other', id: 21826 },
];

const marginTypes = [
  { value: 0, label: 'No margin' },
  { value: 2 },
  { value: 6 },
  { value: 12 },
  { value: 18 },
  { value: 24 },
];

const marginsHabitats = [
  { value: 'Arable margins sown with tussocky grasses', id: 21829 },
  {
    value: 'Arable margins sown with wild flowers or a pollen and nectar mix',
    id: 21830,
  },
  {
    value: 'Arable margins cultivated annually with an annual flora',
    id: 21831,
  },
  { value: 'Game bird mix strips and corners', id: 21832 },
];

export const marginOptions = [
  { value: 'Edge', id: 21784 },
  { value: '5 meters in', id: 21785 },
  { value: 'Centre', id: 21786 },
];

const survey: Survey = {
  id: 727,
  name: 'beetle',
  label: 'Beetle trap',
  icon,

  attrs: {
    date: dateAttr,

    location: locationAttr,

    farm: {
      remote: { id: 'location_name' },
    },

    trapDays: {
      remote: { id: 1778 },
    },

    fieldName: {
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

    fieldCropOther: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Crop Other',
      },
      pageProps: {
        headerProps: { title: 'Crop Other' },
        attrProps: {
          input: 'input',
        },
      },
      remote: { id: 1789 },
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

    fieldTillageOther: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Tillage Other',
      },
      pageProps: {
        headerProps: { title: 'Tillage Other' },
        attrProps: {
          input: 'input',
        },
      },
      remote: { id: 1788 },
    },

    fieldNonCropHabitats: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Non-crop habitats',
      },
      pageProps: {
        headerProps: { title: 'Non-crop habitats' },
        attrProps: {
          input: 'checkbox',
          inputProps: { options: nonCropHabitatTypes },
        },
      },
      remote: { id: 1793, values: nonCropHabitatTypes },
    },

    fieldNonCropHabitatsOther: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Other non-crop habitat',
      },
      pageProps: {
        headerProps: { title: 'Other non-crop habitat' },
        attrProps: {
          input: 'input',
        },
      },
      remote: { id: 1794 },
    },

    fieldMarginsHabitat: {
      menuProps: {
        icon: clipboardOutline,
        label: 'Margins Habitat',
      },
      pageProps: {
        headerProps: { title: 'Margins Habitat' },
        attrProps: {
          input: 'radio',
          inputProps: { options: marginsHabitats },
        },
      },
      remote: { id: 1792, values: marginsHabitats },
    },

    fieldInsecticides: {
      remote: { id: 1783 },
    },

    fieldHerbicides: {
      remote: { id: 1784 },
    },

    fieldUndersowing: {
      remote: { id: 1785 },
    },

    fieldCompanionCropping: {
      remote: { id: 1790 },
    },

    fieldIntercropping: {
      remote: { id: 1791 },
    },
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: locationAttr,

      margin: {
        remote: { id: 1786, values: marginOptions },
      },
    },

    create({ Sample, photo, surveySample }) {
      const sample = new Sample({
        attrs: {
          surveyId: survey.id,
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
      attrs: {
        surveyId: survey.id,
        training: appModel.attrs.useTraining,
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
