import React, { FC } from 'react';

import { V1VirtualMachineCondition } from '@kubevirt-ui/kubevirt-api/kubevirt';
import PendingChangesBreadcrumb from '@kubevirt-utils/components/PendingChanges/PendingChangesBreadcrumb/PendingChangesBreadcrumb';
import { getPendingChangesByTab } from '@kubevirt-utils/components/PendingChanges/utils/helpers';
import { PendingChange } from '@kubevirt-utils/components/PendingChanges/utils/types';
import { VirtualMachineDetailsTab } from '@kubevirt-utils/constants/tabs-constants';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { List } from '@patternfly/react-core';

type RestartPendingChangesProps = {
  pendingChanges: PendingChange[];
  restartRequiredCondition?: V1VirtualMachineCondition;
};

const RestartPendingChanges: FC<RestartPendingChangesProps> = ({
  pendingChanges,
  restartRequiredCondition,
}) => {
  const { t } = useKubevirtTranslation();

  const tabs = [
    VirtualMachineDetailsTab.Details,
    VirtualMachineDetailsTab.Scheduling,
    VirtualMachineDetailsTab.Environment,
    VirtualMachineDetailsTab.Network,
    VirtualMachineDetailsTab.SSH,
    VirtualMachineDetailsTab.InitialRun,
    VirtualMachineDetailsTab.Storage,
  ];

  return (
    <span>
      {restartRequiredCondition?.message ||
        t(
          'The following areas have pending changes that will be applied when this VirtualMachine is restarted.',
        )}

      <List>
        {tabs.map((tab) => (
          <PendingChangesBreadcrumb
            key={tab}
            pendingChanges={getPendingChangesByTab(pendingChanges, tab)}
          />
        ))}
      </List>
    </span>
  );
};

export default RestartPendingChanges;
