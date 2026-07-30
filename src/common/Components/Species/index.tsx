import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Page, Header, useToast, device } from '@flumens';
import Occurrence from 'models/occurrence';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

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

  const { isIdentifying } = occurrence;
  const identifyButton = !!occurrence.media.length && (
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
      <Main occurrence={occurrence} />
    </Page>
  );
};

export default observer(EditSpecies);
