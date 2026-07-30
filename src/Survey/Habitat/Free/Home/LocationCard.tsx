import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router-dom';
import { Badge } from '@flumens';
import { IonIcon, IonItem } from '@ionic/react';
import locations from 'models/collections/locations';
import Location from 'models/location';
import {
  habitatAttr,
  siteLengthAttr,
  siteSizeAttr,
  siteWidthAttr,
  Data,
} from 'Survey/Habitat/Location/config';

type Props = { locationId?: string };

const LocationCard = ({ locationId }: Props) => {
  const match = useRouteMatch();

  const location = locations.idMap.get(locationId!) as Location<Data>;
  const locationName = location?.data.name ? (
    <b>{location?.data.name}</b>
  ) : (
    <i>Select location</i>
  );

  const habitatValue = location?.data[habitatAttr.id];
  const habitatType =
    habitatAttr.choices.find(choice => choice.dataName === habitatValue)
      ?.title || 'Not selected';

  let areaOrDimensions = '';
  if (Number.isFinite(location?.data[siteSizeAttr.id])) {
    areaOrDimensions = `${location?.data[siteSizeAttr.id]} ha`;
  } else {
    const lengthValue = location?.data[siteLengthAttr.id];
    const widthValue = location?.data[siteWidthAttr.id];
    if (lengthValue || widthValue) {
      areaOrDimensions = `${lengthValue || '-'} m x ${widthValue || '-'} m`;
    }
  }

  const locationPhoto = !!location?.media.length && (
    <div className="list-avatar">
      <img
        src={location?.media[0]?.getURL()}
        className="size-full object-cover"
      />
    </div>
  );

  return (
    <IonItem
      routerLink={`${match.url}/location`}
      className="ion-no-border p-2 ps-ion-0 pe-ion-i-0"
    >
      <div className="flex w-full items-center gap-3">
        {locationPhoto}

        <div className="min-w-0">
          <div className="line-clamp-1 flex items-center">
            <IonIcon icon={locationOutline} className="mr-1 text-secondary" />
            {locationName}
          </div>
          {!!location && (
            <div className="mt-1">
              <Badge size="small">{habitatType}</Badge>
              {!!areaOrDimensions && (
                <Badge size="small">{areaOrDimensions}</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </IonItem>
  );
};

export default LocationCard;
