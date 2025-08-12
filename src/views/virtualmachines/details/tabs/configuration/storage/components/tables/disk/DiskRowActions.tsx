import React, { FC, useState } from 'react';

import { V1VirtualMachine, V1VirtualMachineInstance } from '@kubevirt-ui/kubevirt-api/kubevirt';
import DiskModal from '@kubevirt-utils/components/DiskModal/DiskModal';
import {
  getRunningVMMissingVolumesFromVMI,
  produceVMDisks,
} from '@kubevirt-utils/components/DiskModal/utils/helpers';
import { useModal } from '@kubevirt-utils/components/ModalProvider/ModalProvider';
import KebabToggle from '@kubevirt-utils/components/toggles/KebabToggle';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { getName } from '@kubevirt-utils/resources/shared';
import { getDataVolumeTemplates, getDisks, getVolumes } from '@kubevirt-utils/resources/vm';
import { DiskRowDataLayout } from '@kubevirt-utils/resources/vm/utils/disk/constants';
import { isCDROMDisk } from '@kubevirt-utils/resources/vm/utils/disk/selectors';
import { getContentScrollableElement } from '@kubevirt-utils/utils/utils';
import { ButtonVariant, Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { updateDisks } from '@virtualmachines/details/tabs/configuration/details/utils/utils';
import { isRunning } from '@virtualmachines/utils';

import CreateBootableVolumeModal from '../../modal/CreateBootableVolumeModal';
import DeleteDiskModal from '../../modal/DeleteDiskModal';
import DetachModal from '../../modal/DetachModal';
import EjectCDROMModal from '../../modal/EjectCDROMModal';
import MakePersistentModal from '../../modal/MakePersistentModal';
import MountCDROMModal from '../../modal/MountCDROMModal';

import { isHotplugVolume, isPVCSource } from './utils/helpers';

type DiskRowActionsProps = {
  customize?: boolean;
  obj: DiskRowDataLayout;
  onDiskUpdate?: (updatedVM: V1VirtualMachine) => Promise<V1VirtualMachine>;
  vm: V1VirtualMachine;
  vmi?: V1VirtualMachineInstance;
};

const DiskRowActions: FC<DiskRowActionsProps> = ({
  customize = false,
  obj,
  onDiskUpdate,
  vm,
  vmi,
}) => {
  const { t } = useKubevirtTranslation();
  const { createModal } = useModal();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const diskName = obj?.name;

  const isVMRunning = isRunning(vm);
  const isHotplug = isHotplugVolume(vm, diskName, vmi);

  const vmDisk = getDisks(vm)?.find((d) => d.name === diskName);
  const isCDROM = vmDisk ? isCDROMDisk(vmDisk) : false;

  // For CD-ROM operations update VM spec directly
  // For other operations use vmi when VM is running
  const volumes = isVMRunning ? vmi?.spec?.volumes : getVolumes(vm);
  const volume = volumes?.find(({ name }) => name === diskName);

  const vmVolumes = getVolumes(vm);
  const vmVolume = vmVolumes?.find(({ name }) => name === diskName);

  const effectiveVolume = isCDROM ? vmVolume : volume;

  const isCDROMOperationsEnabled = React.useMemo(() => {
    return isCDROM;
  }, [isCDROM]);

  const isCDROMMountedState = React.useMemo(() => {
    if (!effectiveVolume) return false;

    const hasDataVolume = !!effectiveVolume.dataVolume?.name;
    const hasPVC = !!effectiveVolume.persistentVolumeClaim?.claimName;

    if (effectiveVolume.containerDisk?.image) {
      const image = effectiveVolume.containerDisk.image.toLowerCase();
      const isEmptyImage =
        image.includes('ubi-micro') ||
        image.includes('scratch') ||
        image.includes('empty') ||
        image.includes('ubi8/ubi-micro');
      return !isEmptyImage;
    }

    return hasDataVolume || hasPVC;
  }, [effectiveVolume]);

  const editBtnText = t('Edit');
  const deleteBtnText = t('Detach');
  const removeHotplugBtnText = t('Make persistent');

  const onCustomizeDeleteDisk = () => {
    const newVM = produceVMDisks(vm, (draftVM) => {
      const volumeToDelete = getVolumes(vm).find((v) => v.name === diskName);
      draftVM.spec.template.spec.domain.devices.disks = getDisks(draftVM)?.filter(
        (disk) => disk.name !== volumeToDelete.name,
      );
      draftVM.spec.template.spec.volumes = getVolumes(draftVM)?.filter(
        (v) => v.name !== volumeToDelete.name,
      );
      draftVM.spec.dataVolumeTemplates = getDataVolumeTemplates(draftVM)?.filter(
        (dataVolume) => getName(dataVolume) !== volumeToDelete?.dataVolume?.name,
      );
    });

    return onDiskUpdate(newVM);
  };

  const createEditDiskModal = () =>
    createModal(({ isOpen, onClose }) => (
      <DiskModal
        createdPVCName={isPVCSource(obj) ? obj?.source : null}
        editDiskName={diskName}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onDiskUpdate || updateDisks}
        vm={vm}
      />
    ));

  const createDeleteDiskModal = () =>
    createModal(({ isOpen, onClose }) =>
      customize ? (
        <DetachModal
          diskName={diskName}
          headerText={t('Detach disk?')}
          isOpen={isOpen}
          obj={vm}
          onClose={onClose}
          onSubmit={onCustomizeDeleteDisk}
          submitBtnText={deleteBtnText}
          submitBtnVariant={ButtonVariant.danger}
        />
      ) : (
        <DeleteDiskModal
          isHotPluginVolume={isHotplug}
          isOpen={isOpen}
          onClose={onClose}
          vm={vm}
          volume={volume}
        />
      ),
    );

  const createBootableVolume = () => {
    createModal(({ isOpen, onClose }) => (
      <CreateBootableVolumeModal diskObj={obj} isOpen={isOpen} onClose={onClose} vm={vm} />
    ));
  };

  const makePersistent = () =>
    createModal(({ isOpen, onClose }) => (
      <MakePersistentModal isOpen={isOpen} onClose={onClose} vm={vm} vmi={vmi} volume={volume} />
    ));

  const ejectCDROM = () =>
    createModal(({ isOpen, onClose }) => (
      <EjectCDROMModal
        cdromName={diskName}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onDiskUpdate || updateDisks}
        vm={vm}
      />
    ));

  const mountCDROM = () =>
    createModal(({ isOpen, onClose }) => (
      <MountCDROMModal
        cdromName={diskName}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onDiskUpdate || updateDisks}
        vm={vm}
      />
    ));

  const onModalOpen = (createModalCallback: () => void) => {
    createModalCallback();
    setIsDropdownOpen(false);
  };

  const onToggle = () => setIsDropdownOpen((prevIsOpen) => !prevIsOpen);

  return (
    <Dropdown
      isOpen={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      onSelect={() => setIsDropdownOpen(false)}
      popperProps={{ appendTo: getContentScrollableElement, position: 'right' }}
      toggle={KebabToggle({ id: 'toggle-id-6', isExpanded: isDropdownOpen, onClick: onToggle })}
    >
      <DropdownList>
        <DropdownItem
          isDisabled={!isPVCSource(obj)}
          key="disk-bootable-volume"
          onClick={() => createBootableVolume()}
        >
          {t('Save as bootable volume')}
        </DropdownItem>
        <DropdownItem key="disk-edit" onClick={() => onModalOpen(createEditDiskModal)}>
          {editBtnText}
        </DropdownItem>
        {isCDROMOperationsEnabled && isCDROMMountedState && (
          <DropdownItem key="cdrom-eject" onClick={() => onModalOpen(ejectCDROM)}>
            {t('Eject')}
          </DropdownItem>
        )}
        {isCDROMOperationsEnabled && !isCDROMMountedState && (
          <DropdownItem key="cdrom-mount" onClick={() => onModalOpen(mountCDROM)}>
            {t('Mount')}
          </DropdownItem>
        )}
        <DropdownItem key="disk-delete" onClick={() => onModalOpen(createDeleteDiskModal)}>
          {deleteBtnText}
        </DropdownItem>
        {isHotplug && (
          <DropdownItem
            description={t('Will make disk persistent on next reboot')}
            key="make-persistent"
            onClick={() => onModalOpen(makePersistent)}
          >
            {removeHotplugBtnText}
          </DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  );
};

export default DiskRowActions;
