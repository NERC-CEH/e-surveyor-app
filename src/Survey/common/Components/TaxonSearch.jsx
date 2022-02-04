import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import TaxonSearch from 'common/Components/TaxonSearch';
import { NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

import { Page, Main, Header } from '@flumens';

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    sample: PropTypes.object.isRequired,
    subSample: PropTypes.object,
    subSubSample: PropTypes.object,
  };

  transformUKSIToAppTaxon = taxon => {
    const newDataFormat = {
      species: {
        commonNames: [taxon.common_name],
        scientificNameWithoutAuthor: taxon.scientific_name,
      },
      warehouseId: taxon.warehouse_id,
      score: 1,
    };

    return newDataFormat;
  };

  onSpeciesSelected = async taxon => {
    const { sample, subSample, subSubSample } = this.props;
    const survey = sample.getSurvey();

    const model = survey.name === 'point' ? sample : subSample;
    const subModel = survey.name === 'point' ? subSample : subSubSample;

    if (!subModel) {
      const modelSurvey = model.getSurvey();
      const newSubSample = modelSurvey.smp.create(Sample, Occurrence);

      model.samples.push(newSubSample);

      newSubSample.setSpecies(this.transformUKSIToAppTaxon(taxon));

      model.save();
      this.context.goBack();
      return;
    }

    subModel.setSpecies(this.transformUKSIToAppTaxon(taxon));
    model.save();

    this.context.goBack();
  };

  render() {
    return (
      <Page id="precise-area-count-edit-taxa">
        <Header title="Species" />
        <Main>
          <TaxonSearch onSpeciesSelected={this.onSpeciesSelected} />
        </Main>
      </Page>
    );
  }
}

export default Controller;
