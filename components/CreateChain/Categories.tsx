import Select from 'react-select';

import { useCategories } from '@/hooks/useCategories';
import { MongoCategory } from '@/lib/mongodb/types';

export const Categories: React.FC<{
  setCategories: (categories: MongoCategory[]) => void;
  defaultValue?: MongoCategory[];
  numberOfCategories: number;
}> = ({ setCategories, defaultValue = [], numberOfCategories }) => {
  const { categories: allCategories, fetching: fetchingCategories } =
    useCategories();

  return (
    <Select
      onChange={v => setCategories(v as MongoCategory[])}
      isMulti
      defaultValue={defaultValue}
      isOptionDisabled={() => numberOfCategories >= 3}
      placeholder="Select up to 3 categories"
      styles={{
        multiValue: b => ({
          ...b,
          background: 'rgba(255, 255, 255, 0.1)',
        }),
        multiValueLabel: b => ({
          ...b,
          color: 'white',
        }),
        multiValueRemove: b => ({
          ...b,
          ':hover': { background: ' rgba(255, 255, 255, 0.1)' },
        }),
        control: (b, s) => ({
          ...b,
          color: 'white',
          background: '#0F172A',
          borderWidth: '1px',
          width: '100%',
          borderColor: s.isFocused ? 'transparent' : 'inherit',
          ':hover': {
            borderColor: 'rgba(255, 255, 255, 0.24)',
          },
          boxShadow: s.isFocused ? '0px 0px 0px 2px #ad90ff' : 'none',
        }),
        menu: b => ({
          width: '100%',
          ...b,
          background: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.24)',
        }),
        option: (b, s) => ({
          ...b,
          background: s.isFocused ? 'rgba(255, 255, 255, 0.1)' : '#0F172A',
        }),
      }}
      isLoading={fetchingCategories}
      options={allCategories}
    />
  );
};
