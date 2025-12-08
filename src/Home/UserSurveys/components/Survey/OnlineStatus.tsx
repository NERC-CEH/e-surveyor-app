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

  if (sample.isSynchronising) return <IonSpinner className="mr-2 size-4" />;

  if (!sample.requiresRemoteSync()) return null;

  const isValid = !sample.validateRemote();

  return (
    <Button
      color="secondary"
      onPress={onSync}
      fill={uploadIsPrimary ? undefined : 'outline'}
      preventDefault
      className={clsx(
        'max-w-28 shrink-0 px-4 py-1 text-sm whitespace-nowrap',
        uploadIsPrimary ? 'bg-secondary-600' : '',
        !isValid && 'opacity-50'
      )}
    >
      {sample.isUploaded ? 'Sync' : 'Upload'}
    </Button>
  );
};

export default observer(OnlineStatus);
