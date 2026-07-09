import { useEffect } from 'react';
import { observer } from 'mobx-react';
import 'chart.js/auto';
import clsx from 'clsx';
import { checkmarkOutline } from 'ionicons/icons';
import { Button, useToast, useLoader } from '@flumens';
import { IonIcon } from '@ionic/react';
import Doughnut from 'common/Components/Doughnut';
import ExpandableText from 'common/Components/ExpandableText';
import PhotoPicker from 'common/Components/PhotoPickers/PhotoPicker';
import allHabitats, { Habitat } from 'common/data/ukhab';
import Location from 'common/models/location';
import { Data, habitatAttr } from 'Survey/Habitat/Location/config';
import meadow from './meadow.png';

type Props = {
  location: Location<Data>;
  onChange?: (suggestion: Habitat) => void;
  /**
   * If true, the component will automatically fetch habitat suggestions when it mounts. Good for modals, but not for transit pages.
   */
  fetchOnLoad?: boolean;
};

type HabitatWithScore = Habitat & { score: number | null };

const HabitatIdentification = ({
  location,
  onChange,
  fetchOnLoad = false,
}: Props) => {
  const toast = useToast();
  const loader = useLoader();

  const selectedHabitat = location.data[habitatAttr.id];

  const addScores = (h: Habitat) => {
    const suggestion = location.metadata.habitatSuggestions?.find(
      s => s.code === h.id
    );

    if (!suggestion && selectedHabitat === h.id) return { ...h, score: 1 };

    return suggestion ? { ...h, score: suggestion.confidence } : null;
  };

  const habitats = allHabitats
    .map(addScores)
    .filter(Boolean)
    .sort(
      (a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)
    ) as HabitatWithScore[];

  const currentCode = location.data[habitatAttr.id];

  const fetchSuggestions = async () => {
    try {
      loader.show('Analysing habitat photos…');
      const results = await location.identifyHabitat();
      location.metadata.habitatSuggestions = results;
      if (location.isStored) await location.save();
    } catch (e: any) {
      toast.error(e.message, { position: 'bottom' });
    } finally {
      loader.hide();
    }
  };

  useEffect(() => {
    if (!fetchOnLoad) return;
    fetchSuggestions();
  }, [location]);

  const onSuggestionChange = (suggestion: Habitat) => {
    if (!onChange) return;
    onChange(suggestion);
  };

  const getSuggestionItem = (suggestion: HabitatWithScore) => {
    const inputId = `habitat-suggestion-${location.cid}-${suggestion.id}`;

    const isSelected = currentCode === suggestion.id;

    return (
      <label
        key={suggestion.id}
        htmlFor={inputId}
        className={clsx(
          'block overflow-hidden rounded-md border ',
          isSelected
            ? 'border-primary-800 bg-primary-100/30'
            : 'border-neutral-300 bg-white',
          !onChange &&
            'first-of-type:border-primary-800 first-of-type:bg-primary-100/30'
        )}
      >
        <div className="flex items-center justify-between p-3 gap-3">
          {onChange && (
            <span
              className={clsx(
                'flex size-5 shrink-0 items-center justify-center rounded border border-neutral-200',
                isSelected && 'border-primary-800 bg-primary-100'
              )}
            >
              {isSelected && (
                <IonIcon icon={checkmarkOutline} className="size-6" />
              )}

              <input
                id={inputId}
                type="radio"
                name={`habitat-suggestion-${location.cid}`}
                value={suggestion.id}
                checked={isSelected}
                onChange={() => onSuggestionChange(suggestion)}
                disabled={!onChange}
                className="sr-only"
              />
            </span>
          )}

          <div className="flex flex-col justify-center mr-auto">
            <h3 className="font-semibold! my-0!">{suggestion.name}</h3>

            {!!suggestion.definition && (
              <ExpandableText
                text={suggestion.definition}
                textClassName="text-sm italic opacity-80 my-0!"
                buttonClassName="mt-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
              />
            )}
          </div>

          {Number.isFinite(suggestion.score) && (
            <div className="flex flex-col items-center gap-1 justify-between">
              <span className="opacity-60 font-normal">({suggestion.id})</span>
              <Doughnut probability={suggestion.score!} />
            </div>
          )}
        </div>
      </label>
    );
  };

  return (
    <div>
      <div className="bg-white p-4 border-b border-neutral-200 rounded-md overflow-hidden">
        <h3 className="list-title mb-4! mt-0!">
          Take 1-3 photos that best represent the habitat.
        </h3>

        <div className="max-w-xl text-sm bg-neutral-50 rounded-md overflow-hidden border border-neutral-200 flex gap-2 p-2 flex-nowrap">
          <div className="w-2/3 border-r border-neutral-200 pr-2 flex flex-col items-center gap-2">
            <div>⏺ Wide view of vegetation</div>
            <img
              src={meadow}
              alt="Wide view of vegetation"
              className="w-full h-auto rounded-md mt-1"
            />
          </div>
          <div className="w-1/2 px-2 flex flex-col justify-center gap-2">
            <div>⏺ Show boundaries if visible</div>
            <div>⏺ Avoid close-ups of single plants</div>
          </div>
        </div>

        <div className="mt-2 max-w-xl rounded-xl overflow-hidden border border-neutral-200">
          <PhotoPicker
            model={location}
            onChange={fetchSuggestions}
            placeholderCount={2}
            className="[--border-style:none]"
          />
        </div>

        {!!location.media.length && (
          <Button
            onClick={fetchSuggestions}
            className="py-1 px-2 text-sm mx-auto mt-2"
          >
            Re-analyse photos
          </Button>
        )}
      </div>

      <div className="">
        {!habitats.length && (
          <div className="p-6 text-center text-sm text-black/50">
            Add photos of the habitat to get identification suggestions.
          </div>
        )}

        {!!habitats.length && (
          <>
            <div className="mt-4  mb-2 font-bold">Suggested habitat types</div>
            <div className="opacity-80 text-sm">
              Based on your photos, here are the most likely habitat types:
            </div>

            <div className="flex flex-col gap-2 my-4">
              {habitats.map(getSuggestionItem)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(HabitatIdentification);
