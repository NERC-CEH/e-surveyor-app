import { observer } from 'mobx-react';
import { Button, device, Main, useToast } from '@flumens';
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import Occurrence from 'models/occurrence';
import SpeciesList from 'Components/SpeciesList';
import IdentificationModal from '../IdentificationModal';

type Props = {
  occurrence?: Occurrence;
  onClose: () => void;
};

const MothProfile = ({ occurrence, onClose }: Props) => {
  const toast = useToast();

  const identifyMoth = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.", { position: 'bottom' });
      return;
    }

    if (!occurrence) return;

    try {
      await occurrence.identify('moth');
    } catch (error) {
      toast.error(error, { position: 'bottom' });
    }
  };

  return (
    <IdentificationModal
      isOpen={!!occurrence}
      onClose={onClose}
      title="Identify moth"
    >
      {!!occurrence && (
        <Main>
          <div className="flex flex-col gap-4 m-3">
            <div className="max-w-xl rounded-list">
              <PhotoPicker model={occurrence} allowToCrop />
            </div>

            <Button
              onPress={identifyMoth}
              color="secondary"
              preventDefault
              isDisabled={occurrence.isIdentifying}
              className="px-2 py-1 text-sm mx-auto my-3 w-fit bg-secondary-600"
            >
              Reidentify
            </Button>
            <SpeciesList
              isIdentifying={occurrence.isIdentifying}
              taxon={occurrence.data.taxon}
            />
          </div>
        </Main>
      )}
    </IdentificationModal>
  );
};

export default observer(MothProfile);
