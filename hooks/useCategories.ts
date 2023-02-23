import { useCallback, useEffect, useState } from 'react';

import { MongoCategory } from '@/lib/mongodb/types';

import { useRefresh } from './useRefresh';

export const fetchCategoryList = async (): Promise<MongoCategory[]> => {
  const res = await fetch('/api/categories');
  if (res.ok && res.status === 200) {
    return (await res.json()) as MongoCategory[];
  }
  return [];
};

export const useCategories = (): {
  categories: MongoCategory[];
  refresh: () => void;
  fetching: boolean;
} => {
  const [categories, setCategories] = useState<MongoCategory[]>([]);
  const [fetching, setFetching] = useState(false);
  const [refreshCount, refresh] = useRefresh();

  const fetchCategories = useCallback(async () => {
    try {
      setFetching(true);
      setCategories(await fetchCategoryList());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching categories', error);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshCount]);

  return {
    categories,
    refresh,
    fetching,
  };
};
