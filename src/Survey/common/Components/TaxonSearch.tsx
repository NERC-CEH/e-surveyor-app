import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Main, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import TaxonSearch from 'common/Components/TaxonSearch';
import { Taxon } from 'models/occurrence';
import Sample from 'models/sample';
import { MachineInvolvement } from 'Survey/common/config';

type Props = {
  sample: Sample;
  subSample?: Sample;
};

const Controller = ({ sample, subSample }: Props) => {
  const context = useContext(NavContext);

  const transformUKSIToAppTaxon = (taxon: Taxon): Taxon => ({
    commonName: taxon.commonName || '',
    scientificName: taxon.scientificName,
    warehouseId: taxon.warehouseId,
    machineInvolvement: MachineInvolvement.HUMAN,
    images: [],
    probability: 1,
    tvk: taxon.tvk,
  });

  const onSpeciesSelected = async (taxon: Taxon) => {
    const model = subSample || sample;
    const [occ] = model.occurrences;
    if (!occ) {
      const modelSurvey = model.getSurvey();

      const newOccurrence = modelSurvey.occ!.create!({
        taxon: transformUKSIToAppTaxon(taxon),
      });
      model.occurrences.push(newOccurrence);

      model.save();
      context.goBack();
      return;
    }

    const newTaxon = {
      ...occ.getSpecies(),
      ...transformUKSIToAppTaxon(taxon),
    };
    occ.data.taxon = newTaxon;

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
