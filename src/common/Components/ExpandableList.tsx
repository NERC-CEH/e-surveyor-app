import { Children, type ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Trans as T } from 'react-i18next';
import { IonItem, IonLabel } from '@ionic/react';

const MAX_ITEMS = 5;

type Props = {
  children: ReactNode;
  maxItems?: number;
  className?: string;
};

const ExpandableList = ({
  children,
  maxItems = MAX_ITEMS,
  className,
}: Props) => {
  const [showMore, setShowMore] = useState(false);
  const itemsProp = Children.toArray(children);
  const items = itemsProp.slice(0, maxItems);
  const restItems = itemsProp.slice(maxItems, itemsProp.length);

  const hidingMoreThanTwo = restItems.length >= 2;

  return (
    <div className={clsx('flex flex-col', className)}>
      {items}

      {hidingMoreThanTwo && !showMore && (
        <IonItem className="ion-no-border" onClick={() => setShowMore(true)}>
          <IonLabel className="!m-0 text-center opacity-80">
            <T>Show more</T>
          </IonLabel>
        </IonItem>
      )}

      {!showMore && !hidingMoreThanTwo && restItems}

      {showMore && restItems}

      {hidingMoreThanTwo && showMore && (
        <IonItem className="ion-no-border" onClick={() => setShowMore(false)}>
          <IonLabel className="!m-0 text-center opacity-80">
            <T>Show less</T>
          </IonLabel>
        </IonItem>
      )}
    </div>
  );
};

export default ExpandableList;
