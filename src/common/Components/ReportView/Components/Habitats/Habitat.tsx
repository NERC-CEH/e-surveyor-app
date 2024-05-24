import { useRef, useState } from 'react';
import { openOutline } from 'ionicons/icons';
import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonIcon,
} from '@ionic/react';
import { Badge, Main, useAlert, useToast } from 'common/flumens';
import flowerIcon from 'common/images/flowerIcon.svg';
import { BroadHabitat } from 'common/services/habitats';
import InfoButtonPopover from 'Components/InfoButton';

const useNVCAlert = () => {
  const toast = useToast();
  const alert = useAlert();

  const showAlert = () =>
    new Promise(resolve => {
      alert({
        header: 'NVC',
        skipTranslation: true,
        message:
          'Have you collected an exhaustive plant list for your survey area?',
        buttons: [
          {
            text: 'No',
            handler() {
              resolve(false);
              toast.warn('Please add more plants to your survey.');
            },
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler() {
              resolve(true);
            },
          },
        ],
      });
    });

  return showAlert;
};

type Props = { habitat: BroadHabitat };

const Habitat = ({ habitat }: Props) => {
  const segmentRef = useRef<any>();
  const [segment, setSegment] = useState<'details' | 'nvc'>('details');

  const showNVCAlert = useNVCAlert();

  const onSegmentChange = async (e: any) => {
    const newSegment = e.detail.value;

    if (newSegment === 'nvc') {
      setSegment('details');
      const proceed = await showNVCAlert();
      if (!proceed) {
        segmentRef.current?.children[0].click(); // For some reason state doesn't change the segment otherwise
        return;
      }
      setSegment('nvc');
      return;
    }

    setSegment(newSegment);
  };

  const getSpeciesItem = (species: BroadHabitat['typicalSpecies'][0]) => (
    <IonItem
      className="[--padding-start:0]"
      href={`https://plantatlas2020.org/atlas/${species.bsbiid}`}
      detailIcon={openOutline}
      detail
      key={species.bsbiid}
    >
      <div className="flex w-full flex-nowrap items-center gap-2 py-1.5 pl-2 pr-4">
        <div className="list-avatar relative">
          <img
            src={`https://atlasimages.bsbi.org/processed/${species.bsbiid}/${species.bsbiid}-${species.bsbiphotoindex}/${species.bsbiid}-${species.bsbiphotoindex}-192w.webp`}
            onError={(e: any) => (e.target.style.display = 'none')} // eslint-disable-line
            className="absolute h-full w-full object-cover"
          />
          <IonIcon src={flowerIcon} className="size-6 opacity-40" />
        </div>
        <div className="flex w-full flex-col">
          <div className="line-clamp-1 font-semibold">{species.commonName}</div>
          <div className="line-clamp-1 italic opacity-80">
            {species.scientificName}
          </div>
        </div>
      </div>
    </IonItem>
  );

  return (
    <Main>
      <IonToolbar className="text-black [--ion-toolbar-background:transparent]">
        <IonSegment
          value={segment}
          onIonChange={onSegmentChange}
          ref={segmentRef}
        >
          <IonSegmentButton value="details">
            <IonLabel>Details</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="nvc">
            <IonLabel>NVC</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>

      {segment === 'details' && (
        <div className="px-2">
          <h3 className="list-title">
            Match:
            <Badge className="mx-2 bg-white ring-neutral-500/20">{`${habitat.matchingCoefficient}%`}</Badge>
            <InfoButtonPopover className="p-0">
              <div className="font-light">
                This indicates how strongly your plant list is associated with
                the habitat type. The more plants you record within the
                associated habitat type the higher the percentage match.
              </div>
            </InfoButtonPopover>
          </h3>

          <h3 className="list-title">Description</h3>
          <div className=" rounded-md bg-white p-4">{habitat.description}</div>

          <h3 className="list-title">Typical species</h3>
          <div className="rounded-list">
            {habitat.typicalSpecies.map(getSpeciesItem)}
          </div>
        </div>
      )}

      {segment === 'nvc' && (
        <div className=" text-center">
          <span className="p-3">Work in progress...</span>
          <img
            src="https://i.giphy.com/FJsQLdUv23CdhPzSxx.webp"
            className="mx-auto"
          />
        </div>
      )}
    </Main>
  );
};

export default Habitat;
