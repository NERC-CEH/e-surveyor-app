import { observer } from 'mobx-react';
import { Block, Main, Button } from '@flumens';
import { IonItem, IonList } from '@ionic/react';
import Doughnut from 'common/Components/Doughnut';
import Occurrence from 'models/occurrence';
import { occurrenceAbundanceAttr } from 'Survey/common/config';

type Props = {
  occurrence: Occurrence;
  isDisabled: boolean;
  onDelete: () => void;
};

const OccurrenceMain = ({ occurrence, isDisabled, onDelete }: Props) => {
  const species = occurrence.getSpecies();

  const recordAttrs = { isDisabled, record: occurrence.data };

  const image = occurrence.media[0]?.getURL();

  return (
    <Main className="relative">
      <div className="mt-2 flex flex-col pb-5">
        <IonList lines="full">
          <div className="rounded-list">
            <IonItem className="[--padding-start:2px] [--inner-padding-end:2px]">
              <div className="flex gap-2 w-full items-center">
                <div className="list-avatar m-1">
                  <img src={image} alt="" className="size-full object-cover" />
                </div>

                <div className="flex flex-col w-full">
                  {species?.commonName && (
                    <div className="font-semibold line-clamp-1">
                      {species?.commonName}
                    </div>
                  )}
                  <div className="italic line-clamp-1">
                    {species?.scientificName}
                  </div>
                </div>

                <Doughnut probability={species?.probability} />
              </div>
            </IonItem>

            <Block block={occurrenceAbundanceAttr} {...recordAttrs} />
          </div>
        </IonList>

        {!isDisabled && (
          <Button
            color="danger"
            className="mx-auto mt-4 w-fit px-5 absolute bottom-10 left-1/2 -translate-x-1/2 shadow-md"
            onPress={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </Main>
  );
};

export default observer(OccurrenceMain);
