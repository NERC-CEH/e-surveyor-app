import { Trans as T } from 'react-i18next';
import { Button, InfoMessage } from '@flumens';
import config from 'common/config';

type Props = { children?: any };

const UploadedRecordInfoMessage = ({ children: childrenProp }: Props) => {
  const children = childrenProp || (
    <T>This record has been submitted and cannot be edited within this App.</T>
  );

  return (
    <InfoMessage color="tertiary" skipTranslation>
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
