import {
  businessOutline,
  clipboardOutline,
  locationOutline,
  timeOutline,
} from 'ionicons/icons';
import { object, z } from 'zod';
import { RadioOption } from '@flumens';
import {
  ChoiceInputConf,
  NumberInputConf,
  TextInputConf,
  YesNoInputConf,
} from '@flumens/tailwind/dist/Survey';
import { IonIcon } from '@ionic/react';
import icon from 'common/images/beetle.svg';
import appModel from 'common/models/app';
import { Survey, dateAttr, locationSchema } from 'Survey/common/config';

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

export const trapDaysAttr = {
  id: 'smpAttr:1778',
  type: 'numberInput',
  title: 'Trapping period',
  appearance: 'counter',
  prefix: (<IonIcon src={timeOutline} className="size-6" />) as any,
  suffix: 'day(s)',
  step: 1,
  validation: { min: 1 },
} as const satisfies NumberInputConf;

export const SBIAttr = {
  id: 'smpAttr:2018',
  type: 'numberInput',
  title: 'Single Business Identifier (SBI)',
  prefix: (<IonIcon src={businessOutline} className="size-6" />) as any,
} as const satisfies NumberInputConf;

export const farmNameAttr = {
  id: 'location_name',
  type: 'textInput',
  title: 'Farm name',
  prefix: (<IonIcon src={locationOutline} className="size-6" />) as any,
} as const satisfies TextInputConf;

export const fieldNameAttr = {
  id: 'smpAttr:1779',
  type: 'textInput',
  title: 'Name',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies TextInputConf;

export const fieldMarginsAttr = {
  id: 'smpAttr:1780',
  type: 'choiceInput',
  title: 'Margins',
  appearance: 'button',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  choices: [
    { title: 'No margin', dataName: '0' },
    { title: '2m', dataName: '2' },
    { title: '6m', dataName: '6' },
    { title: '12m', dataName: '12' },
    { title: '18m', dataName: '18' },
    { title: '24m', dataName: '24' },
  ],
} as const satisfies ChoiceInputConf;

export const fieldCropOtherValue = '21826';

export const fieldCropAttr = {
  id: 'smpAttr:1781',
  type: 'choiceInput',
  title: 'Crop',
  appearance: 'button',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  choices: [
    { title: 'Not Recorded', dataName: '' },
    { title: 'Bare stubble/cultivated', dataName: '21825' },
    { title: 'Barley (spring)', dataName: '21764' },
    { title: 'Barley (winter)', dataName: '21765' },
    { title: 'Cover crop', dataName: '21766' },
    { title: 'Field beans (spring)', dataName: '21767' },
    { title: 'Field beans (winter)', dataName: '21768' },
    { title: 'Leafy vegetables', dataName: '21769' },
    { title: 'Linseed', dataName: '21770' },
    { title: 'Oats (spring)', dataName: '21771' },
    { title: 'Oats (winter)', dataName: '21772' },
    { title: 'Oilseed rape (spring)', dataName: '21773' },
    { title: 'Oilseed rape (winter)', dataName: '21774' },
    { title: 'Pasture/grassland', dataName: '21775' },
    { title: 'Peas', dataName: '21776' },
    { title: 'Root vegetables', dataName: '21777' },
    { title: 'Sugar beet', dataName: '21778' },
    { title: 'Wheat (spring)', dataName: '21779' },
    { title: 'Wheat (winter)', dataName: '21780' },
    { title: 'Other', dataName: fieldCropOtherValue },
  ],
} as const satisfies ChoiceInputConf;

export const fieldCropOtherAttr = {
  id: 'smpAttr:1789',
  type: 'textInput',
  title: 'Crop Other',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies TextInputConf;

export const fieldTillageOtherValue = '21827';

export const fieldTillageAttr = {
  id: 'smpAttr:1782',
  type: 'choiceInput',
  title: 'Tillage',
  appearance: 'button',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  choices: [
    { title: 'Not Recorded', dataName: '' },
    { title: 'Zero tillage', dataName: '21781' },
    { title: 'Shallow tillage', dataName: '21782' },
    { title: 'Mouldboard plough', dataName: '21783' },
    { title: 'Other', dataName: fieldTillageOtherValue },
  ],
} as const satisfies ChoiceInputConf;

export const fieldTillageOtherAttr = {
  id: 'smpAttr:1788',
  type: 'textInput',
  title: 'Tillage Other',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies TextInputConf;

export const fieldNonCropHabitatsOtherValue = '21838';

export const fieldNonCropHabitatsAttr = {
  id: 'smpAttr:1793',
  type: 'choiceInput',
  title: 'Non-crop habitats',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  container: 'page',
  multiple: true,
  choices: [
    { title: 'Bird food/cover', dataName: '21833' },
    { title: 'Beetle banks', dataName: '21834' },
    { title: 'In-field strips', dataName: '21835' },
    { title: 'Agroforestry', dataName: '21836' },
    { title: 'Herbal/grass ley', dataName: '21837' },
    { title: 'Other', dataName: fieldNonCropHabitatsOtherValue },
  ],
} as const satisfies ChoiceInputConf;

export const fieldNonCropHabitatsOtherAttr = {
  id: 'smpAttr:1794',
  type: 'textInput',
  title: 'Other non-crop habitat',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies TextInputConf;

export const fieldMarginsHabitatAttr = {
  id: 'smpAttr:1792',
  type: 'choiceInput',
  title: 'Margins Habitat',
  appearance: 'button',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
  choices: [
    { title: 'Not Recorded', dataName: '' },
    { title: 'Arable margins sown with tussocky grasses', dataName: '21829' },
    {
      title: 'Arable margins sown with wild flowers or a pollen and nectar mix',
      dataName: '21830',
    },
    {
      title: 'Arable margins cultivated annually with an annual flora',
      dataName: '21831',
    },
    { title: 'Game bird mix strips and corners', dataName: '21832' },
  ],
} as const satisfies ChoiceInputConf;

export const fieldInsecticidesAttr = {
  id: 'smpAttr:1783',
  type: 'yesNoInput',
  title: 'Insecticides used',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies YesNoInputConf;

export const fieldHerbicidesAttr = {
  id: 'smpAttr:1784',
  type: 'yesNoInput',
  title: 'Herbicides used',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies YesNoInputConf;

export const fieldUndersowingAttr = {
  id: 'smpAttr:1785',
  type: 'yesNoInput',
  title: 'Undersowing',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies YesNoInputConf;

export const fieldCompanionCroppingAttr = {
  id: 'smpAttr:1790',
  type: 'yesNoInput',
  title: 'Companion cropping',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies YesNoInputConf;

export const fieldIntercroppingAttr = {
  id: 'smpAttr:1791',
  type: 'yesNoInput',
  title: 'Intercropping',
  prefix: (<IonIcon src={clipboardOutline} className="size-6" />) as any,
} as const satisfies YesNoInputConf;

const edgeMarginValue = '21784';
export const trapMarginAttr = {
  id: 'smpAttr:1786',
  type: 'choiceInput',
  title: 'Position',
  appearance: 'button',
  prefix: <IonIcon icon={locationOutline} className="size-6" />,
  choices: [
    { title: 'Edge', dataName: edgeMarginValue },
    { title: '5 meters in', dataName: '21785' },
    { title: 'Centre', dataName: '21786' },
  ],
} as const satisfies ChoiceInputConf;

export const trapCommentAttr = {
  id: 'comment',
  type: 'textInput',
  title: 'Notes',
  appearance: 'multiline',
} as const satisfies TextInputConf;

export const taxonAttr = {
  id: 'taxa_taxon_list_id',
};

const survey: Survey = {
  id: 727,
  name: 'beetle',
  label: 'Beetle trap',
  icon,

  attrs: {
    date: dateAttr,
    // location: locationAttr,
    // farm: farmAttr,
    // trapDays: trapDaysAttr,
    // fieldName: fieldNameAttr,
    // fieldMargins: fieldMarginsAttr,
    // fieldCrop: fieldCropAttr,
    // fieldCropOther: fieldCropOtherAttr,
    // fieldTillage: fieldTillageAttr,
    // fieldTillageOther: fieldTillageOtherAttr,
    // fieldNonCropHabitats: fieldNonCropHabitatsAttr,
    // fieldNonCropHabitatsOther: fieldNonCropHabitatsOtherAttr,
    // fieldMarginsHabitat: fieldMarginsHabitatAttr,
    // fieldInsecticides: fieldInsecticidesAttr,
    // fieldHerbicides: fieldHerbicidesAttr,
    // fieldUndersowing: fieldUndersowingAttr,
    // fieldCompanionCropping: fieldCompanionCroppingAttr,
    // fieldIntercropping: fieldIntercroppingAttr,
  },

  smp: {
    attrs: {
      // date: dateAttr,
      // location: locationAttr,
      // margin: marginAttr,
    },

    create({ Sample, photo, surveySample }) {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          sampleMethodId: 24, // Pitfall trap
          enteredSrefSystem: 4326,
          [dateAttr.id]: surveySample!.data[dateAttr.id],
          [trapMarginAttr.id]: edgeMarginValue,
        },
      });

      if (photo) {
        sample.media.push(photo);
      }

      sample.startGPS();

      return sample;
    },

    verify: attrs =>
      object({ location: locationSchema }).safeParse(attrs).error,

    occ: {
      attrs: {
        // taxon: taxonAttr,
      },

      verify: attrs =>
        object({
          taxon: z
            .object({})
            .nullable()
            .refine(val => val !== null, {
              message: 'Beetle has not been identified',
            }),
        }).safeParse(attrs).error,

      create({ Occurrence, photo }) {
        const occ = new Occurrence({
          data: { taxon: null },
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
      data: {
        surveyId: survey.id,
        enteredSrefSystem: 4326,
        sampleMethodId: 2424, // Parent sample
        training: appModel.data.useTraining,
        [dateAttr.id]: new Date().toISOString(),
        [trapDaysAttr.id]: 1,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(attrs, sample) {
    try {
      z.boolean()
        .refine(val => val === false, {
          message: 'Some photos are still being identified.',
        })
        .parse(sample.isIdentifying());

      z.array(z.any())
        .min(1, 'Please add at least one trap.')
        .parse(sample.samples);

      z.object({
        location: locationSchema,
      }).parse(attrs);
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
