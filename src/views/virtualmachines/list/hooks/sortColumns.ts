import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { getCPU, getMemory } from '@kubevirt-utils/resources/vm';
import { columnSortingCompare, isEmpty } from '@kubevirt-utils/utils/utils';
import { SortByDirection } from '@patternfly/react-table';
import { getDeletionProtectionPrintableStatus } from '@virtualmachines/details/tabs/configuration/details/components/DeletionProtection/utils/utils';
import {
  getVirtualMachineStorageClasses,
  getVMIFromMapper,
  PVCMapper,
  VMIMapper,
} from '@virtualmachines/utils/mappers';

import {
  getCPUUsagePercentage,
  getMemoryUsagePercentage,
  getNetworkUsagePercentage,
} from '../metrics';

export const sortByNode = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
  vmiMapper: VMIMapper,
) => {
  const sortByVMINode = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const aNode = getVMIFromMapper(vmiMapper, a)?.status?.nodeName;
    const bNode = getVMIFromMapper(vmiMapper, b)?.status?.nodeName;

    if (isEmpty(aNode)) return -1;
    if (isEmpty(bNode)) return 1;
    return aNode?.localeCompare(bNode);
  };

  return columnSortingCompare(data, direction, pagination, sortByVMINode);
};

export const sortByCPUUsage = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
  vmiMapper: VMIMapper,
) => {
  const compareCPUUsage = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const aCPU = getCPU(getVMIFromMapper(vmiMapper, a));
    const bCPU = getCPU(getVMIFromMapper(vmiMapper, b));

    const cpuUsageA = getCPUUsagePercentage(a, aCPU);
    const cpuUsageB = getCPUUsagePercentage(b, bCPU);

    if (isEmpty(cpuUsageA)) return -1;
    if (isEmpty(cpuUsageB)) return 1;
    return cpuUsageA - cpuUsageB;
  };

  return columnSortingCompare(data, direction, pagination, compareCPUUsage);
};

export const sortByStorageclassName = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
  pvcMapper: PVCMapper,
) => {
  const compareStorageClasses = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const [storageClassA] = getVirtualMachineStorageClasses(a, pvcMapper);
    const [storageClassB] = getVirtualMachineStorageClasses(b, pvcMapper);

    if (isEmpty(storageClassA)) return -1;
    if (isEmpty(storageClassB)) return 1;
    return storageClassA.localeCompare(storageClassB);
  };

  return columnSortingCompare(data, direction, pagination, compareStorageClasses);
};

export const sortByMemoryUsage = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
  vmiMapper: VMIMapper,
) => {
  const compareMemoryUsage = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const aVMI = getVMIFromMapper(vmiMapper, a);
    const bVMI = getVMIFromMapper(vmiMapper, b);
    const memoryUsageA = getMemoryUsagePercentage(a, getMemory(aVMI));
    const memoryUsageB = getMemoryUsagePercentage(b, getMemory(bVMI));

    if (isEmpty(memoryUsageA)) return -1;
    if (isEmpty(memoryUsageB)) return 1;
    return memoryUsageA - memoryUsageB;
  };

  return columnSortingCompare(data, direction, pagination, compareMemoryUsage);
};

export const sortByDeletionProtection = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
) => {
  const compareDeletionProtection = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const deletionProtectionStatusA = getDeletionProtectionPrintableStatus(a);
    const deletionProtectionStatusB = getDeletionProtectionPrintableStatus(b);

    return deletionProtectionStatusA?.localeCompare(deletionProtectionStatusB);
  };

  return columnSortingCompare(data, direction, pagination, compareDeletionProtection);
};

export const sortByNetworkUsage = (
  data: V1VirtualMachine[],
  direction: SortByDirection,
  pagination: { [key: string]: any },
) => {
  const compareNetworkUsage = (a: V1VirtualMachine, b: V1VirtualMachine): number => {
    const networkUsageA = getNetworkUsagePercentage(a);
    const networkUsageB = getNetworkUsagePercentage(b);

    if (isEmpty(networkUsageA)) return -1;
    if (isEmpty(networkUsageB)) return 1;
    return networkUsageA - networkUsageB;
  };

  return columnSortingCompare(data, direction, pagination, compareNetworkUsage);
};
