import { AttrPage, useSample } from 'common/flumens';
import type Occurrence from 'models/occurrence';
import type { Taxon } from 'models/occurrence';
import type Sample from 'models/sample';
import { beetleSpecies } from './config';

const EditSpecies = () => {
  const { occurrence } = useSample<Sample, Occurrence>();
  if (!occurrence) throw new Error('Occurrence is missing');

  const attrProps = {
    input: 'radio',
    inputProps: { options: beetleSpecies },
    set(warehouseId: string, model: Occurrence) {
      const byWarehouseId = (option: (typeof beetleSpecies)[number]) =>
        option.value === warehouseId;
      const species = beetleSpecies.find(byWarehouseId);
      const taxon: Taxon = {
        probability: 1,
        warehouseId: Number(warehouseId),
        commonName: species?.commonName || '',
        scientificName:
          species?.scientificName ||
          (typeof species?.label === 'string' ? species.label : ''),
        tvk: '',
      };
      model.data.taxon = taxon;
    },
    get() {
      return occurrence.data.taxon?.warehouseId.toString();
    },
  };

  return <AttrPage model={occurrence} attr="taxon" attrProps={attrProps} />;
};

export default EditSpecies;
