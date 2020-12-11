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
    },

    location: {
      id: 'entered_sref',
      values(location) {
        return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
          location.longitude
        ).toFixed(7)}`;
      },
    },

    seedmixgroup: {
      label: 'Seedmix Producer',
      type: 'radio',
      info: 'Please indicate the seedmix producer.',
      set: (value, sample) => {
        if (sample.sample.attrs.seedmixgroup !== value) {
          sample.sample.attrs.seedmixgroup = value; // eslint-disable-line
          sample.sample.attrs.seedmix = null; // eslint-disable-line
        }
      },
      options: getSeedMixGroups(),
    },

    seedmix: {
      label: 'Seedmix',
      type: 'radio',
      info: 'Please indicate the seedmix you have used.',
      options: getSeedMix,
    },
  },

  smp: {
    attrs: {
      location: {
        id: 'entered_sref',
        values(location) {
          return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
            location.longitude
          ).toFixed(7)}`;
        },
      },
    },

    create(AppSample, Occurrence, photo) {
      const sample = new AppSample({
        metadata: {
          survey: survey.name,
        },

        attrs: {
          location: null,
        },
      });

      sample.startGPS();

      const occurrence = survey.smp.occ.create(Occurrence, photo);
      sample.occurrences.push(occurrence);

      return sample;
    },

    occ: {
      attrs: {
        taxon: null,
      },

      verify() {},

      create(Occurrence, photo) {
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
    },
  },

  create(Sample) {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
        saved: false,
      },

      attrs: {
        name: new Date().toLocaleDateString(),
        location: null,
      },
    });

    sample.startGPS();

    return sample;
  },
};

export default survey;
