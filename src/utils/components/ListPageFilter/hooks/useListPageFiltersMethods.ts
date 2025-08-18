import { useDebounceCallback } from 'src/views/clusteroverview/utils/hooks/useDebounceCallback';

import { OnFilterChange, RowFilter } from '@openshift-console/dynamic-plugin-sdk';

import { STATIC_SEARCH_FILTERS } from '../constants';
import { ApplyTextFilters, ListPageFiltersMethodsOutputs } from '../types';
import { generateRowFilters, intersection } from '../utils';

import { useApplyFiltersWithQuery } from './useApplyFiltersWithQuery';

type ListPageFiltersMethodsInputs = {
  applyFilters: OnFilterChange;
  generatedRowFilters: ReturnType<typeof generateRowFilters>;
  onRowFilterSearchParamChange: (selected: string[]) => void;
  searchFilters: RowFilter[];
  selectedRowFilters: string[];
  setSearchInputText: (text: string) => void;
};

type UseListPageFiltersMethods = (
  inputs: ListPageFiltersMethodsInputs,
) => ListPageFiltersMethodsOutputs;

const useListPageFiltersMethods: UseListPageFiltersMethods = ({
  applyFilters,
  generatedRowFilters,
  onRowFilterSearchParamChange,
  searchFilters,
  selectedRowFilters,
  setSearchInputText,
}) => {
  const applyTextFilters = useApplyFiltersWithQuery(applyFilters);

  const applyTextFiltersWithDebounce: ApplyTextFilters = useDebounceCallback(applyTextFilters, 250);

  const applyRowFilter = (selected: string[]) => {
    generatedRowFilters?.forEach?.(({ items, type }) => {
      const all = items?.map?.(({ id }) => id) ?? [];
      const recognized = intersection(selected, all);
      applyFilters(type, { all, selected: [...new Set(recognized as string[])] });
    });
  };

  const updateRowFilterSelected = (id: string[]) => {
    const selectedNew = Array.from(
      new Set([
        ...id.filter((item) => !selectedRowFilters.includes(item)),
        ...selectedRowFilters.filter((item) => !id.includes(item)),
      ]),
    );
    onRowFilterSearchParamChange(selectedNew);
    applyRowFilter(selectedNew);
  };

  const clearAll = () => {
    updateRowFilterSelected(selectedRowFilters);
    applyTextFilters(STATIC_SEARCH_FILTERS.name);
    applyTextFilters(STATIC_SEARCH_FILTERS.labels);

    searchFilters.forEach((filter) => filter && applyTextFilters(filter.type));
    setSearchInputText('');
  };

  return {
    applyTextFilters,
    applyTextFiltersWithDebounce,
    clearAll,
    updateRowFilterSelected,
  };
};

export default useListPageFiltersMethods;
