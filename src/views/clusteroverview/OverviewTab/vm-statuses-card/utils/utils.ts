import { Fragment } from 'react';

import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { getVMStatus } from '@kubevirt-utils/resources/shared';
import { VM_ERROR_STATUSES, VM_STATUS } from '@kubevirt-utils/resources/vm/utils/vmStatus';
import { RedExclamationCircleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { InProgressIcon, OffIcon, PausedIcon, SyncAltIcon } from '@patternfly/react-icons';

import { ERROR } from './constants';

const PRIMARY_STATUSES = [VM_STATUS.Running, VM_STATUS.Stopped, VM_STATUS.Paused, ERROR];

export const vmStatusIcon = {
  Deleting: Fragment,
  Error: RedExclamationCircleIcon,
  Migrating: InProgressIcon,
  Paused: PausedIcon,
  Provisioning: Fragment,
  Running: SyncAltIcon,
  Starting: Fragment,
  Stopped: OffIcon,
  Stopping: Fragment,
  Terminating: Fragment,
};

const initializeStatusCountsObject = (): { [key in VM_STATUS]?: number } =>
  Object.keys(VM_STATUS).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

export type StatusCounts = {
  additionalStatuses: { [key in VM_STATUS]?: number };
  primaryStatuses: { [key in 'Error' | VM_STATUS]?: number };
};

export const getVMStatuses = (vms: V1VirtualMachine[]): StatusCounts => {
  const statusCounts = initializeStatusCountsObject();

  vms.forEach((vm) => {
    const status = getVMStatus(vm);
    statusCounts[status] = statusCounts[status] + 1;
  });

  statusCounts[ERROR] = VM_ERROR_STATUSES.reduce((acc, state) => {
    const count = acc + (statusCounts?.[state] || 0);
    delete statusCounts[state];
    return count;
  }, 0);

  const primaryStatuses = PRIMARY_STATUSES.reduce((acc, state) => {
    acc[state] = statusCounts?.[state] || 0;
    delete statusCounts[state];
    return acc;
  }, {});

  return { additionalStatuses: statusCounts, primaryStatuses };
};
