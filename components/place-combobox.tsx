import { Dispatch, KeyboardEvent, SetStateAction, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { FormData } from './form';
import { SearchIcon } from './icons';

type Props = {
  place: string;
  updateFields: (fields: Partial<FormData>) => void;
  setAreCleared: Dispatch<SetStateAction<boolean>>;
};

export default function PlaceCombobox({
  place,
  updateFields,
  setAreCleared,
}: Props) {
  const {
    ready,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();
    setAreCleared(true);
    const results = await getGeocode({ address: val });
    const { lat, lng } = getLatLng(results[0]);
    updateFields({ place: val, lat, lng });
  };

  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setFocusedItemIndex((prevIndex) => Math.max(0, prevIndex - 1));
        break;
      case 'ArrowDown':
        setFocusedItemIndex((prevIndex) =>
          Math.min(data.length - 1, prevIndex + 1)
        );
        break;
      case 'Enter':
        if (focusedItemIndex >= 0) {
          handleSelect(data[focusedItemIndex].description);
        }
        break;
    }
  };

  return (
    <div className='space-y-5 pt-10 flex flex-col items-center'>
      <h1 className='text-3xl font-bold text-neutral-600 mb-5'>
        Where do you want to go?
      </h1>
      <div className='space-y-2'>
        <section
          tabIndex={0}
          className='rounded-full flex items-center gap-x-3 shadow-custom text-neutral-500 px-5 py-3 w-96'
        >
          <SearchIcon className='w-6 h-6' />
          <input
            required
            value={place}
            onChange={(e) => {
              setAreCleared(false);
              updateFields({ place: e.target.value });
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={!ready}
            placeholder='Search by city or town'
            className='outline-none w-full'
          />
        </section>
        {status === 'OK' && (
          <ul className='shadow-md rounded-md w-96'>
            {data.map(({ place_id, description }, i) => (
              <li
                key={place_id}
                className={`${
                  i === focusedItemIndex
                    ? 'bg-neutral-100'
                    : 'hover:bg-neutral-100'
                } p-3 cursor-pointer`}
                onClick={() => handleSelect(description)}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
