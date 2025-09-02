import React, { FC, useState } from 'react';

import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';

import { checkDifferentStorageClassFromBootPVC } from '../../utils/helpers';

import DefaultStorageClassAlert from './DefaultStorageClassAlert';
import EnablePreallocationCheckbox from './EnablePreallocationCheckbox';
import StorageClassSelect from './StorageClassSelect';

type StorageClassAndPreallocationProps = {
  vm: V1VirtualMachine;
};

const StorageClassAndPreallocation: FC<StorageClassAndPreallocationProps> = ({ vm }) => {
  const [showSCAlert, setShowSCAlert] = useState(false);

  return (
    <>
      <StorageClassSelect
        checkSC={(selectedStorageClass) =>
          checkDifferentStorageClassFromBootPVC(vm, selectedStorageClass)
        }
        setShowSCAlert={setShowSCAlert}
      />
      {showSCAlert && <DefaultStorageClassAlert />}
      <EnablePreallocationCheckbox />
    </>
  );
};

export default StorageClassAndPreallocation;
