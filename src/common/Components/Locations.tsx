import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { IonPage, NavContext } from '@ionic/react';
import MainLocations from 'common/Components/MapList';
import { device, Header, useLoader, useSample, useToast } from 'common/flumens';
import Sample from 'common/models/sample';
import { useUserStatusCheck } from 'common/models/user';
import locations from 'models/collections/locations';
import Location from 'models/location';
import HeaderButton from 'Survey/common/Components/HeaderButton';

const LocationsController = () => {
  const { navigate, goBack } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

  const { sample } = useSample<Sample>();
  const isPartOfSurvey = !!sample;

  const alphabeticallyByName = (a: Location, b: Location) =>
    a.data.name?.localeCompare(b.data.name ?? '');

  const sortedLocations = [...locations].sort(alphabeticallyByName);

  const onCreateLocation = () => navigate('/survey/habitat/location');

  const addButton = !isPartOfSurvey && (
    <HeaderButton onClick={onCreateLocation}>Add</HeaderButton>
  );

  const onSelectLocation = (loc?: Location) => {
    if (!isPartOfSurvey) {
      navigate(`/survey/habitat/location/${loc?.cid}/location`);
      return;
    }

    sample.data.locationId = loc?.id;
    sample.save();
    goBack();
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
      await locations.fetchRemote();
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  useEffect(() => {
    refreshLocations();
  }, []);

  const pendingLocations = !isPartOfSurvey
    ? sortedLocations.filter(loc => !loc.isUploaded)
    : undefined;
  const uploadedLocations = sortedLocations.filter(loc => loc.isUploaded);

  return (
    <IonPage id="locations">
      <Header title="Locations" rightSlot={addButton} />
      <MainLocations
        pendingLocations={pendingLocations}
        uploadedLocations={uploadedLocations}
        onSelectLocation={onSelectLocation}
        onDeleteLocation={onDeleteLocation}
        selectedLocationId={sample?.data.locationId}
        isFetchingLocations={locations.isSynchronising}
      />
    </IonPage>
  );
};

export default observer(LocationsController);
