import React, { FC } from 'react';
import classNames from 'classnames';

import FormPFSelect from '@kubevirt-utils/components/FormPFSelect/FormPFSelect';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Divider, SelectGroup, SelectList } from '@patternfly/react-core';

import { SourceTypes } from '../../utils/types';

import DiskSourceOption from './components/DiskSourceOption/DiskSourceOption';
import { attachExistingGroupOptions, blankOption, cdromOption } from './utils/constants';

import './DiskSourceSelect.scss';

type DiskSourceSelectProps = {
  className?: string;
  onSelect: (value: SourceTypes) => void;
};

const DiskSourceSelect: FC<DiskSourceSelectProps> = ({ className, onSelect }) => {
  const { t } = useKubevirtTranslation();
  return (
    <FormPFSelect
      className={classNames('disk-source-select', className)}
      onSelect={(_, val) => onSelect(val as SourceTypes)}
      selectedLabel={t('Add')}
      toggleProps={{ className: 'pf-v6-u-mb-sm', variant: 'primary' }}
    >
      <SelectList>
        <DiskSourceOption {...blankOption} onSelect={onSelect} />
        <Divider />
        <SelectGroup
          className="disk-source-select__group-title"
          label={attachExistingGroupOptions.groupLabel}
        >
          {attachExistingGroupOptions.items.map((item) => (
            <DiskSourceOption key={item.id} {...item} onSelect={onSelect} />
          ))}
        </SelectGroup>
        <Divider />
        <DiskSourceOption {...cdromOption} onSelect={onSelect} />
      </SelectList>
    </FormPFSelect>
  );
};

export default DiskSourceSelect;
