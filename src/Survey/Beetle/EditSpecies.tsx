import { FC } from 'react';
import { AttrPage } from 'common/flumens';
import Occurrence from 'models/occurrence';
import { beetleSpecies } from './config';

type Props = { occurrence: Occurrence };

const EditSpecies: FC<Props> = ({ occurrence }) => {
  const attrProps = {
    input: 'radio',
    inputProps: { options: beetleSpecies },
    set(warehouseId: number, model: Occurrence) {
      const byWarehouseId = (option: any) => option.value === warehouseId;
      const species = beetleSpecies.find(byWarehouseId);
      // eslint-disable-next-line no-param-reassign
      model.attrs.taxon = {
        score: 1,
        warehouseId,
        commonName: '',
        scientificName: species?.label as string,
      };
    },
    get() {
      return occurrence.attrs.taxon?.warehouseId;
    },
  };

  return <AttrPage model={occurrence} attr="taxon" attrProps={attrProps} />;
};

export default EditSpecies;
