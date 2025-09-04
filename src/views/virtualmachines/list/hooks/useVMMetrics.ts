import { useEffect, useMemo } from 'react';

import useNamespaceParam from '@kubevirt-utils/hooks/useNamespaceParam';
import useClusterParam from '@multicluster/hooks/useClusterParam';
import useIsAllClustersPage from '@multicluster/hooks/useIsAllClustersPage';
import useVMListQueries from '@multicluster/hooks/useVMListQueries';
import { PrometheusEndpoint } from '@openshift-console/dynamic-plugin-sdk';
import { useFleetPrometheusPoll } from '@stolostron/multicluster-sdk';

import { setVMCPUUsage, setVMMemoryUsage, setVMNetworkUsage } from '../metrics';

import { VMListQueries } from './constants';

const useVMMetrics = () => {
  const namespace = useNamespaceParam();
  const cluster = useClusterParam();
  const allClusters = useIsAllClustersPage();

  const currentTime = useMemo<number>(() => Date.now(), []);

  const queries = useVMListQueries();

  const prometheusPollProps = {
    allClusters,
    cluster,
    endpoint: PrometheusEndpoint?.QUERY,
    endTime: currentTime,
    namespace,
  };

  const [memoryUsageResponse] = useFleetPrometheusPoll({
    ...prometheusPollProps,
    query: queries?.[VMListQueries.MEMORY_USAGE],
  });

  const [networkTotalResponse] = useFleetPrometheusPoll({
    ...prometheusPollProps,
    query: queries?.NETWORK_TOTAL_USAGE,
  });

  const [cpuUsageResponse] = useFleetPrometheusPoll({
    ...prometheusPollProps,
    query: queries?.[VMListQueries.CPU_USAGE],
  });

  useEffect(() => {
    networkTotalResponse?.data?.result?.forEach((result) => {
      const vmName = result?.metric?.name;
      const vmNamespace = result?.metric?.namespace;
      const memoryUsage = parseFloat(result?.value?.[1]);

      setVMNetworkUsage(vmName, vmNamespace, memoryUsage);
    });
  }, [networkTotalResponse]);

  useEffect(() => {
    memoryUsageResponse?.data?.result?.forEach((result) => {
      const vmName = result?.metric?.name;
      const vmNamespace = result?.metric?.namespace;
      const memoryUsage = parseFloat(result?.value?.[1]);

      setVMMemoryUsage(vmName, vmNamespace, memoryUsage);
    });
  }, [memoryUsageResponse]);

  useEffect(() => {
    cpuUsageResponse?.data?.result?.forEach((result) => {
      const vmName = result?.metric?.name;
      const vmNamespace = result?.metric?.namespace;
      const cpuUsage = parseFloat(result?.value?.[1]);

      setVMCPUUsage(vmName, vmNamespace, cpuUsage);
    });
  }, [cpuUsageResponse]);
};

export default useVMMetrics;
