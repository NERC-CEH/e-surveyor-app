import { observer } from 'mobx-react';
import { IonContent } from '@ionic/react';
import HabitatIdentification from 'common/Components/HabitatIdentification';
import Location from 'common/models/location';
import IdentificationModal from '../IdentificationModal';

type Props = {
  location?: Location;
  onClose: () => void;
};

const HabitatProfile = ({ location, onClose }: Props) => (
  <IdentificationModal
    isOpen={!!location}
    onClose={onClose}
    title="Identify habitat"
  >
    {!!location && (
      <IonContent>
        <div className="p-3">
          <HabitatIdentification location={location} fetchOnLoad />
        </div>
      </IonContent>
    )}
  </IdentificationModal>
);

export default observer(HabitatProfile);
