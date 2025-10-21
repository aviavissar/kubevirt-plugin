import React, { FC } from 'react';
import xbytes from 'xbytes';

import { V1VirtualMachineInstance } from '@kubevirt-ui/kubevirt-api/kubevirt';
import SubTitleChartLabel from '@kubevirt-utils/components/Charts/ChartLabels/SubTitleChartLabel';
import TitleChartLabel from '@kubevirt-utils/components/Charts/ChartLabels/TitleChartLabel';
import ComponentReady from '@kubevirt-utils/components/Charts/ComponentReady/ComponentReady';
import { getMemorySize } from '@kubevirt-utils/components/CPUMemoryModal/utils/CpuMemoryUtils';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import useVMQueries from '@kubevirt-utils/hooks/useVMQueries';
import { getNamespace } from '@kubevirt-utils/resources/shared';
import { getMemory } from '@kubevirt-utils/resources/vm';
import { isEmpty } from '@kubevirt-utils/utils/utils';
import { getCluster } from '@multicluster/helpers/selectors';
import { PrometheusEndpoint } from '@openshift-console/dynamic-plugin-sdk';
import { ChartDonutUtilization } from '@patternfly/react-charts/victory';
import { useFleetPrometheusPoll } from '@stolostron/multicluster-sdk';
import useDuration from '@virtualmachines/details/tabs/metrics/hooks/useDuration';

import { UtilizationBlock } from '../UtilizationBlock';

type MemoryUtilProps = {
  vmi: V1VirtualMachineInstance;
};

const MemoryUtil: FC<MemoryUtilProps> = ({ vmi }) => {
  const { t } = useKubevirtTranslation();
  const { currentTime } = useDuration();

  const queries = useVMQueries(vmi);
  const memory = getMemorySize(getMemory(vmi));

  const [data] = useFleetPrometheusPoll({
    cluster: getCluster(vmi),
    endpoint: PrometheusEndpoint?.QUERY,
    endTime: currentTime,
    namespace: getNamespace(vmi),
    query: queries?.MEMORY_USAGE,
  });

  const memoryUsed = +data?.data?.result?.[0]?.value?.[1];
  const memoryAvailableBytes = xbytes.parseSize(`${memory?.size} ${memory?.unit}B`);
  const percentageMemoryUsed = (memoryUsed / memoryAvailableBytes) * 100;
  const isReady = !isEmpty(memory) && !Number.isNaN(percentageMemoryUsed);

  return (
    <UtilizationBlock
      dataTestId="util-summary-memory"
      title={t('Memory')}
      usageValue={xbytes(memoryUsed || 0, { fixed: 0, iec: true })}
      usedOfTotalText={t('Used of {{ total }}', { total: `${memory?.size} ${memory?.unit}B` })}
    >
      <ComponentReady isReady={isReady}>
        <ChartDonutUtilization
          data={{
            x: t('Memory used'),
            y: Number(percentageMemoryUsed?.toFixed(2)),
          }}
          labels={({ datum }) =>
            datum.x ? `${datum.x}: ${xbytes(memoryUsed || 0, { iec: true })}` : null
          }
          animate
          constrainToVisibleArea
          style={{ labels: { fontSize: 20 } }}
          subTitle={t('Used')}
          subTitleComponent={<SubTitleChartLabel y={135} />}
          title={`${Number(percentageMemoryUsed?.toFixed(2))}%`}
          titleComponent={<TitleChartLabel />}
        />
      </ComponentReady>
    </UtilizationBlock>
  );
};

export default MemoryUtil;
