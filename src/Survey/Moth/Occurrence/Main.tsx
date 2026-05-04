import { observer } from 'mobx-react';
import { Block, Main } from '@flumens';
import { IonItem, IonList } from '@ionic/react';
import Occurrence from 'models/occurrence';
import { occurrenceAbundanceAttr } from 'Survey/common/config';

type Props = {
  occurrence: Occurrence;
  isDisabled: boolean;
};

const OccurrenceMain = ({ occurrence, isDisabled }: Props) => {
  const species = occurrence.getSpecies();

  const recordAttrs = { isDisabled, record: occurrence.data };

  const image = occurrence.media[0].getURL();

  return (
    <Main>
      <div className="mt-2 flex flex-col pb-5">
        <IonList lines="full">
          <div className="rounded-list">
            <IonItem className="[--padding-start:2px]">
              <div className="list-avatar m-1 mr-5">
                <img src={image} alt="" className="size-full object-cover" />
              </div>
              <div>Species</div>
              <div slot="end">
                <div className="flex flex-col">
                  {species?.commonName && (
                    <div className="font-semibold line-clamp-1">
                      {species?.commonName}
                    </div>
                  )}
                  <div className="italic line-clamp-1">
                    {species?.scientificName}
                  </div>
                </div>
              </div>
            </IonItem>

            <Block block={occurrenceAbundanceAttr} {...recordAttrs} />
          </div>
        </IonList>
      </div>
    </Main>
  );
};

export default observer(OccurrenceMain);
