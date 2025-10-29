import { useState } from 'react';

import { getDiskSize } from '@catalog/CreateFromInstanceTypes/utils/utils';
import { V1beta1DataVolume } from '@kubevirt-ui/kubevirt-api/containerized-data-importer/models';
import { IoK8sApiCoreV1PersistentVolumeClaim } from '@kubevirt-ui/kubevirt-api/kubernetes';
import {
  V1beta1VirtualMachineClusterPreference,
  V1beta1VirtualMachinePreference,
} from '@kubevirt-ui/kubevirt-api/kubevirt';
import { VolumeSnapshotKind } from '@kubevirt-utils/components/SelectSnapshot/types';
import { PaginationState } from '@kubevirt-utils/hooks/usePagination/utils/types';
import {
  getBootableVolumePVCSource,
  getDataVolumeForPVC,
} from '@kubevirt-utils/resources/bootableresources/helpers';
import { getVolumeSnapshotStorageClass } from '@kubevirt-utils/resources/bootableresources/selectors';
import { BootableVolume } from '@kubevirt-utils/resources/bootableresources/types';
import {
  ClusterNamespacedResourceMap,
  getName,
  getNamespace,
  NamespacedResourceMap,
  ResourceMap,
} from '@kubevirt-utils/resources/shared';
import { DESCRIPTION_ANNOTATION } from '@kubevirt-utils/resources/vm';
import { getArchitecture } from '@kubevirt-utils/utils/architecture';
import { ThSortType } from '@patternfly/react-table/dist/esm/components/Table/base/types';

import { getOSFromDefaultPreference } from '../../VMDetailsSection/utils/utils';

type UseBootVolumeSortColumns = (
  unsortedData: BootableVolume[],
  volumeFavorites: string[],
  clusterPreferencesMap: ResourceMap<V1beta1VirtualMachineClusterPreference>,
  userPreferencesMap: NamespacedResourceMap<V1beta1VirtualMachinePreference>,
  pvcSources: ClusterNamespacedResourceMap<IoK8sApiCoreV1PersistentVolumeClaim>,
  volumeSnapshotSources: {
    [datSourceName: string]: VolumeSnapshotKind;
  },
  pagination: PaginationState,
  includeNamespaceColumn: boolean,
  dvSources: ClusterNamespacedResourceMap<V1beta1DataVolume>,
) => {
  getSortType: (columnIndex: number) => ThSortType;
  sortedData: BootableVolume[];
  sortedPaginatedData: BootableVolume[];
};

const useBootVolumeSortColumns: UseBootVolumeSortColumns = (
  unsortedData = [],
  volumeFavorites,
  clusterPreferencesMap,
  userPreferencesMap,
  pvcSources,
  volumeSnapshotSources,
  pagination,
  includeNamespaceColumn,
  dvSources,
) => {
  const [activeSortIndex, setActiveSortIndex] = useState<null | number>(0);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc' | null>('asc');

  const getSortableRowValues = (bootableVolume: BootableVolume): string[] => {
    const pvcSource = getBootableVolumePVCSource(bootableVolume, pvcSources);
    const dvSource = getDataVolumeForPVC(pvcSource, dvSources);
    const volumeSnapshotSource = volumeSnapshotSources?.[bootableVolume?.metadata?.name];

    return [
      getName(bootableVolume),
      getArchitecture(bootableVolume),
      ...(includeNamespaceColumn ? [getNamespace(bootableVolume)] : []),
      getOSFromDefaultPreference(bootableVolume, clusterPreferencesMap, userPreferencesMap),
      pvcSource?.spec?.storageClassName || getVolumeSnapshotStorageClass(volumeSnapshotSource),
      getDiskSize(dvSource, pvcSource, volumeSnapshotSource),
      bootableVolume?.metadata?.annotations?.[DESCRIPTION_ANNOTATION],
    ];
  };

  const sortVolumes = (a: BootableVolume, b: BootableVolume): number => {
    //favorites is column 0, so we need to decrease index by 1
    const aValue = getSortableRowValues(a)[activeSortIndex - 1];
    const bValue = getSortableRowValues(b)[activeSortIndex - 1];

    if (activeSortDirection === 'asc') {
      return aValue?.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
    }
    return bValue?.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
  };

  const getSortType = (columnIndex: number): ThSortType => ({
    columnIndex,
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    sortBy: {
      defaultDirection: 'asc',
      direction: activeSortDirection,
      index: activeSortIndex,
    },
  });

  // will try to keep the same sorting for other fields such as name and only arrange the favorites to be first
  const arrangeFavorites = (
    acc: [favorites: BootableVolume[], notFavorites: BootableVolume[]],
    volume: BootableVolume,
  ): [BootableVolume[], BootableVolume[]] => {
    if (activeSortIndex === 0) {
      const isASC = activeSortDirection === 'asc';
      if (volumeFavorites?.includes(volume?.metadata?.name)) {
        acc[isASC ? 0 : 1].push(volume);
      } else {
        acc[isASC ? 1 : 0].push(volume);
      }
      return acc;
    }
    acc[0].push(volume);
    return acc;
  };

  const sortedData = unsortedData.sort(sortVolumes).reduce(arrangeFavorites, [[], []]).flat();

  const sortedPaginatedData = sortedData.slice(pagination.startIndex, pagination.endIndex);

  return { getSortType, sortedData, sortedPaginatedData };
};

export default useBootVolumeSortColumns;
