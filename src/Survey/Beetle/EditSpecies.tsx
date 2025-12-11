import { AttrPage } from 'common/flumens';
import Occurrence, { Taxon } from 'models/occurrence';
import { beetleSpecies } from './config';

type Props = { occurrence: Occurrence };

const EditSpecies = ({ occurrence }: Props) => {
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

      // eslint-disable-next-line no-param-reassign
      model.data.taxon = taxon;
    },
    get() {
      return occurrence.data.taxon?.warehouseId;
    },
  };

  return <AttrPage model={occurrence} attr="taxon" attrProps={attrProps} />;
};

export default EditSpecies;
