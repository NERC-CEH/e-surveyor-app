import seedmixData from 'common/data/remote/seedmix';

const getSeedMixGroups = () => {
  const addValueToObject = seedMixGroup => {
    return { value: seedMixGroup };
  };

  const getUniqueValues = (unique, item) => {
    return unique.includes(item.mix_group)
      ? unique
      : [...unique, item.mix_group];
  };

  const seedMixGroups = seedmixData
    .reduce(getUniqueValues, [])
    .map(addValueToObject);

  const notRecorded = {
    value: null,
    isDefault: true,
    label: 'Not recorded',
  };

  return [notRecorded, ...seedMixGroups];
};

const getSeedMix = modal => {
  const { seedmixgroup } = modal.attrs;

  const addValueToObject = seedMix => {
    return { value: seedMix };
  };

  const bySeedmixGroups = data => data.mix_group === seedmixgroup;

  const getUniqueValues = (unique, item) => {
    return unique.includes(item.mix_name) ? unique : [...unique, item.mix_name];
  };

  const seedMixes = seedmixData
    .filter(bySeedmixGroups)
    .reduce(getUniqueValues, [])
    .map(addValueToObject);

  const notRecorded = {
    value: null,
    isDefault: true,
    label: 'Not recorded',
  };

  return [notRecorded, ...seedMixes];
};

const survey = {
  id: -1,
  name: 'point', // transects will be 'trail'
  label: 'Point',

  attrs: {
    name: {
      label: 'Survey Name',
      type: 'textarea',
      info: 'You can change your survey name here.',
      get: modal => modal.sample.metadata.created_on.toLocaleDateString(),
    },

    seedmixgroup: {
      label: 'Seedmix Producer',
      type: 'radio',
      info: 'Please indicate the seedmix producer.',
      options: getSeedMixGroups(),
    },

    seedmix: {
      label: 'Seedmix',
      type: 'radio',
      info: 'Please indicate the seedmix you have used.',
      options: getSeedMix,
    },
  },

  verify() {},

  create(Sample) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        saved: false,
      },
    });

    return sample;
  },
};

export default survey;
