import { AttrPage, useSample } from 'common/flumens';
import Occurrence, { Taxon } from 'models/occurrence';
import Sample from 'models/sample';
import { beetleSpecies } from './config';

const EditSpecies = () => {
  const { occurrence } = useSample<Sample, Occurrence>();
  if (!occurrence) throw new Error('Occurrence is missing');

  const attrProps = {
    input: 'radio',
    inputProps: { options: beetleSpecies },
    set(warehouseId: number, model: Occurrence) {
      const byWarehouseId = (option: any) => option.value === warehouseId;
      const species = beetleSpecies.find(byWarehouseId);
      const taxon: Taxon = {
        probability: 1,
        warehouseId,
        commonName: species?.commonName || '',
        scientificName: species?.scientificName || species?.label || '',
        tvk: '',
      };
      model.data.taxon = taxon;
    },
    get() {
      return occurrence.data.taxon?.warehouseId;
    },
  };

  return <AttrPage model={occurrence} attr="taxon" attrProps={attrProps} />;
};

export default EditSpecies;
