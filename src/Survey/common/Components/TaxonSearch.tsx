import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Main, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import TaxonSearch from 'common/Components/TaxonSearch';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import { MachineInvolvement } from 'Survey/common/config';

type Props = {
  sample: Sample;
  subSample?: Sample;
  subSubSample?: Sample;
};

type Taxon = {
  scientific_name: string;
  common_name?: string;
  warehouse_id: number;
};

const Controller: FC<Props> = ({ sample, subSample, subSubSample }) => {
  const context = useContext(NavContext);

  const transformUKSIToAppTaxon = (taxon: Taxon) => ({
    commonName: taxon.common_name || '',
    scientificName: taxon.scientific_name,
    warehouseId: taxon.warehouse_id,
    machineInvolvement: MachineInvolvement.HUMAN,
    images: [],
    score: 1,
  });

  const onSpeciesSelected = async (taxon: Taxon) => {
    const survey = sample.getSurvey();

    const model: Sample =
      survey.name === 'point' ? sample : (subSample as Sample);
    const subModel = survey.name === 'point' ? subSample : subSubSample;

    if (!subModel) {
      const modelSurvey = model.getSurvey();
      const newSubSample: Sample = modelSurvey.smp.create(Sample, Occurrence);

      model.samples.push(newSubSample);

      newSubSample.occurrences[0].attrs.taxon = transformUKSIToAppTaxon(taxon);

      model.save();
      context.goBack();
      return;
    }

    const [occ] = subModel.occurrences;
    occ.attrs.taxon = {
      ...occ.getSpecies(),
      ...transformUKSIToAppTaxon(taxon),
    };

    model.save();

    context.goBack();
  };

  return (
    <Page id="taxon-search">
      <Header title="Species" />
      <Main>
        <TaxonSearch onSpeciesSelected={onSpeciesSelected} />
      </Main>
    </Page>
  );
};

export default observer(Controller);
