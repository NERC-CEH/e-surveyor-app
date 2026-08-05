import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';
import { Page, Main, Header, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import TaxonSearch from 'common/Components/TaxonSearch';
import { Taxon } from 'models/occurrence';
import Sample from 'models/sample';
import { MachineInvolvement } from 'Survey/common/config';

type Match = {
  occId?: string;
};

const Controller = () => {
  const { sample, subSample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const { params } = useRouteMatch<Match>();

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

    const occurrence = params.occId
      ? model.occurrences.find(occ => occ.cid === params.occId)
      : model.occurrences[0];

    if (params.occId && !occurrence) {
      throw new Error('Occurrence is missing');
    }

    if (!occurrence) {
      const modelSurvey = model.getSurvey();
      const newTaxon = transformUKSIToAppTaxon(taxon);

      const newOccurrence = modelSurvey.occ!.create!({ taxon: newTaxon });
      newOccurrence.data.taxon = newTaxon;
      model.occurrences.push(newOccurrence);

      model.save();
      context.goBack();
      return;
    }

    const newTaxon = {
      ...occurrence.getSpecies(),
      ...transformUKSIToAppTaxon(taxon),
    };
    occurrence.data.taxon = newTaxon;

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
