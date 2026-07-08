import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { IonPage, NavContext } from '@ionic/react';
import MainLocations from 'common/Components/MapList';
import { Button, device, Header, useLoader, useToast } from 'common/flumens';
import { useUserStatusCheck } from 'common/models/user';
import locations from 'models/collections/locations';
import Location from 'models/location';

const LocationsController = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

  // const { sample } = useSample<Sample>();

  const alphabeticallyByName = (a: Location, b: Location) =>
    a.data.name?.localeCompare(b.data.name ?? '');

  const sortedLocations = [...locations].sort(alphabeticallyByName);

  const onCreateLocation = () => navigate('/survey/habitat/location');

  const addButton = (
    <Button
      onPress={onCreateLocation}
      color="secondary"
      className="max-w-28 whitespace-nowrap px-4 py-1 text-sm"
    >
      Add
    </Button>
  );

  const onSelectLocation = (loc?: Location) => {
    navigate(`/survey/habitat/location/${loc?.cid}/location`);

    // sample!.data.locationId = loc?.id;
    // sample!.save();
    // goBack();
  };

  const onDeleteLocation = async (loc: Location) => {
    locations.remove(loc);
    await loc.destroy();
  };

  const refreshLocations = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    await loader.show('Please wait...');

    try {
      // await locations.fetchRemote(); // TODO:
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  useEffect(() => {
    refreshLocations();
  }, []);

  return (
    <IonPage id="locations">
      <Header title="Locations" rightSlot={addButton} />
      <MainLocations
        pendingLocations={sortedLocations.filter(loc => !loc.isUploaded)}
        uploadedLocations={sortedLocations.filter(loc => loc.isUploaded)}
        onSelectLocation={onSelectLocation}
        onDeleteLocation={onDeleteLocation}
        // selectedLocationId={sample?.data.locationId}
        isFetchingLocations={locations.isSynchronising}
      />
    </IonPage>
  );
};

export default observer(LocationsController);
