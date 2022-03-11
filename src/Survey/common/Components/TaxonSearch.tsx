import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import TaxonSearch from 'common/Components/TaxonSearch';
import { NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';
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

  const transformUKSIToAppTaxon = (taxon: Taxon) => {
    const newDataFormat = {
      species: {
        commonNames: taxon.common_name ? [taxon.common_name] : [],
        scientificNameWithoutAuthor: taxon.scientific_name,
      },
      warehouseId: taxon.warehouse_id,
      score: 1,
    };

    return newDataFormat;
  };

  const onSpeciesSelected = async (taxon: Taxon) => {
    const survey = sample.getSurvey();

    const model: Sample =
      survey.name === 'point' ? sample : (subSample as Sample);
    const subModel = survey.name === 'point' ? subSample : subSubSample;

    if (!subModel) {
      const modelSurvey = model.getSurvey();
      const newSubSample = modelSurvey.smp.create(Sample, Occurrence);

      model.samples.push(newSubSample);

      newSubSample.setSpecies(transformUKSIToAppTaxon(taxon));

      model.save();
      context.goBack();
      return;
    }

    subModel.setSpecies(transformUKSIToAppTaxon(taxon));
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
