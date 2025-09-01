import React, { FC } from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';

import SelectTypeahead from '../SelectTypeahead/SelectTypeahead';

import useFolderOptions from './hooks/useFolderOptions';
import { createNewFolderOption, getCreateNewFolderOption } from './utils/options';
import { getToggleStatus } from './utils/validation';

type FoldersSelectProps = {
  isFullWidth?: boolean;
  namespace: string;
  selectedFolder: string;
  setSelectedFolder: (newFolder: string) => void;
};
const FolderSelect: FC<FoldersSelectProps> = ({
  isFullWidth = false,
  namespace,
  selectedFolder,
  setSelectedFolder,
}) => {
  const { t } = useKubevirtTranslation();
  const [folderOptions, setFolderOptions] = useFolderOptions(namespace);

  return (
    <SelectTypeahead
      addOption={(input) =>
        setFolderOptions((prev) => [
          ...(prev ?? []).filter((opt) => opt.value !== input),
          createNewFolderOption(input),
        ])
      }
      canCreate
      dataTestId="vm-folder-select"
      getCreateAction={getCreateNewFolderOption}
      getToggleStatus={getToggleStatus}
      isFullWidth={isFullWidth}
      options={folderOptions?.map((option) => ({ optionProps: option, value: option.value })) ?? []}
      placeholder={t('Search folder')}
      selectedValue={selectedFolder}
      setSelectedValue={setSelectedFolder}
    />
  );
};

export default FolderSelect;
