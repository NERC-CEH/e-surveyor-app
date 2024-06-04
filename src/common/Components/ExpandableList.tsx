import { FC, useState } from 'react';
import { Trans as T } from 'react-i18next';
import { IonItem, IonLabel } from '@ionic/react';

const MAX_ITEMS = 5;

const ExpandableList: FC<any> = ({
  children: itemsProp,
  maxItems = MAX_ITEMS,
}: any) => {
  const [showMore, setShowMore] = useState(false);
  const items = itemsProp.slice(0, maxItems);
  const restItems = itemsProp.slice(maxItems, itemsProp.length);

  const hidingMoreThanTwo = restItems.length >= 2;

  return (
    <div className="flex flex-col">
      {items}

      {hidingMoreThanTwo && !showMore && (
        <IonItem
          className="[--border-style:none]"
          onClick={() => setShowMore(true)}
        >
          <IonLabel className="!m-0 text-center opacity-80">
            <T>Show more</T>
          </IonLabel>
        </IonItem>
      )}

      {!showMore && !hidingMoreThanTwo && restItems}

      {showMore && restItems}

      {hidingMoreThanTwo && showMore && (
        <IonItem
          className="[--border-style:none]"
          onClick={() => setShowMore(false)}
        >
          <IonLabel className="!m-0 text-center opacity-80">
            <T>Show less</T>
          </IonLabel>
        </IonItem>
      )}
    </div>
  );
};

export default ExpandableList;
