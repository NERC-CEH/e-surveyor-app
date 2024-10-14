import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Badge, Button } from '@flumens';
import { IonSpinner } from '@ionic/react';
import Sample from 'models/sample';
import './styles.scss';

type Props = {
  sample: Sample;
  onSync: () => void;
  uploadIsPrimary?: boolean;
};

const OnlineStatus = ({ sample, onSync, uploadIsPrimary }: Props) => {
  const { saved } = sample.metadata;
  if (!saved) return <Badge className="max-w-32">Draft</Badge>;

  if (sample.remote.synchronising)
    return <IonSpinner className="mr-2 size-4" />;

  if (!sample.requiresRemoteSync()) return null;

  const isValid = !sample.validateRemote();
  const isUploaded = sample.isUploaded();

  return (
    <Button
      color="secondary"
      onPress={onSync}
      fill={uploadIsPrimary ? undefined : 'outline'}
      preventDefault
      className={clsx(
        'max-w-28 shrink-0 whitespace-nowrap px-4 py-1 text-sm',
        !isValid && 'opacity-50'
      )}
    >
      {isUploaded ? 'Sync' : 'Upload'}
    </Button>
  );
};

export default observer(OnlineStatus);
