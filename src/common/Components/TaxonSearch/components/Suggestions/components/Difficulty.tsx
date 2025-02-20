import { useState } from 'react';
import { IonPopover, IonContent } from '@ionic/react';

type Props = { difficulty?: number };

const Difficulty = ({ difficulty }: Props) => {
  const difficultyColor = [
    '',
    '',
    'border-b-yellow-600',
    'border-b-orange-600',
    'border-b-red-600',
  ][difficulty || 0];

  const [infoState, setShowInfo] = useState<any>({
    showInfo: false,
    event: undefined,
  });

  const showInfo = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo({ showInfo: true, event: e });
  };

  const hideInfo = () => setShowInfo({ showInfo: false, event: undefined });

  return (
    <>
      <div className="relative h-7 w-9" onClick={showInfo}>
        <div
          className={`absolute bottom-0 h-0 w-0 border-[26px] border-x-[13px] border-t-0 border-transparent ${difficultyColor}`}
        />
        <div className="absolute bottom-[1px] left-[9px] text-xs font-bold text-white">
          {difficulty}
        </div>
      </div>

      <IonPopover
        className="info-popover"
        event={infoState.event}
        isOpen={infoState.showInfo}
        onDidDismiss={hideInfo}
      >
        <IonContent className="[--background:white] [--overflow:hidden]">
          <div className="[&>*]:mt-2">
            <div>
              <b>1</b> - Relatively easily identified.
            </div>
            <div>
              <b>2</b> - Care needed for identification.
            </div>
            <div>
              <b>3</b> - Difficult to identify.
            </div>
            <div>
              <b>4</b> - Expert assessment required!
            </div>
          </div>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default Difficulty;
