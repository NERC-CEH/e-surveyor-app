import { useState } from 'react';
import { Button } from 'common/flumens';
import CustomAlert from '../CustomAlert';
import addImage from './add.png';
import deleteImage from './delete.png';
import moth1Image from './moth1.png';
import moth2Image from './moth2.png';

// functional component for IntroAlert
const IntroAlert = () => {
  const [showAlert, setShowAlert] = useState(true);
  if (!showAlert) return null;

  // handle continue button click
  const handleContinue = () => {
    setShowAlert(false);
  };

  return (
    <CustomAlert>
      <div className="my-2 bg-neutral-100 border border-neutral-300 rounded-lg p-3">
        For best results photograph:
        <div className="flex flex-col gap-3 my-2">
          <div className="flex gap-2 flex-nowrap justify-between items-center">
            <img src={moth1Image} className="max-w-1/3 rounded-2xl" />
            Larger/flatter moths from above.
          </div>
          <div className="flex gap-2 flex-nowrap justify-between items-center">
            <img src={moth2Image} className="max-w-1/3 rounded-2xl" /> Small
            moths from the side.
          </div>
        </div>
      </div>

      <div className="my-2 bg-neutral-100 border border-neutral-300 rounded-lg p-3">
        Submit 1 photo per moth. Photograph each individual or choose to add
        count where you have multiples of the same species.
      </div>

      <div className="my-2 bg-neutral-100 border border-neutral-300 rounded-lg p-3">
        Press to take. Long press to add from gallery.
        <img src={addImage} className="mx-auto max-w-3/5" />
      </div>

      <div className="my-2 bg-neutral-100 border border-neutral-300 rounded-lg p-3">
        Swipe left to delete the record.
        <img src={deleteImage} className="mx-auto" />
      </div>

      <Button
        color="secondary"
        onPress={handleContinue}
        className="mx-auto bg-secondary-600 my-10 shadow-md"
      >
        Make records
      </Button>
    </CustomAlert>
  );
};

export default IntroAlert;
