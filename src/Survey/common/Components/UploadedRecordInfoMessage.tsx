import { ReactNode } from 'react';
import { informationCircleOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Button, InfoMessage } from '@flumens';
import { IonIcon } from '@ionic/react';
import config from 'common/config';

type Props = { children?: ReactNode };

const UploadedRecordInfoMessage = ({ children: childrenProp }: Props) => {
  const children = childrenProp || (
    <T>This record has been submitted and cannot be edited within this App.</T>
  );

  return (
    <InfoMessage
      color="tertiary"
      prefix={<IonIcon src={informationCircleOutline} className="size-7" />}
      skipTranslation
    >
      {children}
      <Button
        href={`${config.backend.url}/my-records`}
        fill="outline"
        color="tertiary"
        className="mx-auto mt-5 max-w-sm p-2"
      >
        e-Surveyor website
      </Button>
    </InfoMessage>
  );
};

export default UploadedRecordInfoMessage;
