import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import TaxonSearch from 'common/Components/TaxonSearch';
import { NavContext } from '@ionic/react';
import Occurrence, { MachineInvolvement } from 'models/occurrence';
import Sample from 'models/sample';

import { Page, Main, Header } from '@flumens';

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
    species: {
      commonNames: taxon.common_name ? [taxon.common_name] : [],
      scientificNameWithoutAuthor: taxon.scientific_name,
    },
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
      ...occ.attrs.taxon,
      ...transformUKSIToAppTaxon(taxon),
    };

    model.save();

    context.goBack();
  };

  return (
    <Page id="precise-area-count-edit-taxa">
      <Header title="Species" />
      <Main>
        <TaxonSearch onSpeciesSelected={onSpeciesSelected} />
      </Main>
    </Page>
  );
};

export default observer(Controller);
