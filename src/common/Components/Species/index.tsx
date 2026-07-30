import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Page, Header, useToast, device } from '@flumens';
import Sample from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

type Props = {
  subSample: Sample;
  subSubSample: Sample;
};

const EditSpecies = ({ subSample, subSubSample }: Props) => {
  const toast = useToast();
  const sample = subSubSample || subSample;
  const [occ] = sample.occurrences;

  const identifySpecies = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    try {
      await occ.identify();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    }
  };

  const { isIdentifying } = occ;
  const identifyButton = !!occ.media.length && (
    <HeaderButton
      onClick={identifySpecies}
      className={clsx('bg-secondary-600', isIdentifying ? 'opacity-30' : '')}
      color="secondary"
    >
      Reidentify
    </HeaderButton>
  );

  return (
    <Page id="species-profile">
      <Header title="Species" rightSlot={identifyButton} />
      <Main occurrence={occ} />
    </Page>
  );
};

export default observer(EditSpecies);
