import { observer } from 'mobx-react';
import { Page, Header, useToast, device, Main, Button, Block } from '@flumens';
import Occurrence, { Suggestion, Taxon } from 'models/occurrence';
import PhotoPicker from 'Components/PhotoPickers/PhotoPicker';
import SpeciesList from 'Components/SpeciesList';
import { MachineInvolvement } from 'Survey/common/config';
import { countAttr, coverAttr } from './config';

type Props = {
  occurrence: Occurrence;
};

const EditSpecies = ({ occurrence }: Props) => {
  const toast = useToast();

  const identifySpecies = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    try {
      await occurrence.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const onSelect = ({ commonNames, ...suggestion }: Suggestion) => {
    const suggestions = occurrence.data.taxon?.suggestions;
    const topSuggestion = suggestions?.[0];
    const isTopSuggestion =
      topSuggestion?.scientificName === suggestion.scientificName;

    const machineInvolvement = isTopSuggestion
      ? MachineInvolvement.HUMAN_ACCEPTED_PREFERRED
      : MachineInvolvement.HUMAN_ACCEPTED_LESS_PREFERRED;

    const newTaxon: Taxon = {
      ...JSON.parse(JSON.stringify(suggestion)),
      suggestions,
      commonName: commonNames?.[0],
      machineInvolvement,
      probability: 1,
    };
    occurrence.data.taxon = newTaxon;
    occurrence.save();
  };

  const recordAttrs = {
    record: occurrence.data,
    isDisabled: occurrence.isDisabled,
  };

  return (
    <Page id="species-profile">
      <Header title="Species" />
      <Main id="edit-species">
        <div className="max-w-xl rounded-list m-2">
          <Block block={countAttr} {...recordAttrs} />
          <Block block={coverAttr} {...recordAttrs} />
        </div>

        <div className="max-w-xl rounded-list m-2">
          <PhotoPicker model={occurrence} allowToCrop />
        </div>

        <Button
          onPress={identifySpecies}
          className="px-2 py-1 text-sm mx-auto my-3"
          isDisabled={occurrence.isIdentifying || occurrence.isDisabled}
        >
          Reidentify
        </Button>

        <SpeciesList
          isDisabled={occurrence.isDisabled}
          isIdentifying={occurrence.isIdentifying}
          taxon={occurrence.data.taxon}
          onSelect={onSelect}
        />
      </Main>
    </Page>
  );
};

export default observer(EditSpecies);
