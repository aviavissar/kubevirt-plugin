import DataImportCronModel from '@kubevirt-ui/kubevirt-api/console/models/DataImportCronModel';
import DataSourceModel from '@kubevirt-ui/kubevirt-api/console/models/DataSourceModel';
import DataVolumeModel from '@kubevirt-ui/kubevirt-api/console/models/DataVolumeModel';
import {
  V1beta1DataImportCron,
  V1beta1DataSource,
  V1beta1DataVolume,
} from '@kubevirt-ui/kubevirt-api/containerized-data-importer/models';
import {
  V1beta1StorageSpecAccessModesEnum,
  V1beta1StorageSpecVolumeModeEnum,
} from '@kubevirt-ui/kubevirt-api/kubevirt';
import { DEFAULT_DISK_SIZE } from '@kubevirt-utils/components/DiskModal/utils/constants';
import { OPENSHIFT_OS_IMAGES_NS } from '@kubevirt-utils/constants/constants';
import { CDI_BIND_REQUESTED_ANNOTATION } from '@kubevirt-utils/hooks/useCDIUpload/consts';
import { t } from '@kubevirt-utils/hooks/useKubevirtTranslation';

export enum DROPDOWN_FORM_SELECTION {
  UPLOAD_VOLUME = 'volume',
  USE_EXISTING_PVC = 'pvc',
  USE_HTTP = 'http',
  USE_REGISTRY = 'registry',
  USE_SNAPSHOT = 'snapshot',
}

export const optionsValueLabelMapper = {
  [DROPDOWN_FORM_SELECTION.UPLOAD_VOLUME]: t('Volume'),
  [DROPDOWN_FORM_SELECTION.USE_EXISTING_PVC]: t('Volume'),
  [DROPDOWN_FORM_SELECTION.USE_HTTP]: t('URL'),
  [DROPDOWN_FORM_SELECTION.USE_REGISTRY]: t('Registry'),
  [DROPDOWN_FORM_SELECTION.USE_SNAPSHOT]: t('Volume snapshot'),
};

export type AddBootableVolumeState = {
  accessMode?: V1beta1StorageSpecAccessModesEnum;
  annotations?: { [key: string]: string };
  architectures?: string[];
  bootableVolumeCluster?: string;
  bootableVolumeName: string;
  bootableVolumeNamespace: string;
  cronExpression?: string;
  isIso?: boolean;
  labels?: { [key: string]: string };
  pvcName: string;
  pvcNamespace: string;
  registryCredentials?: { password: string; username: string };
  registryURL?: string;
  retainRevisions?: number;
  size?: string;
  snapshotName?: string;
  snapshotNamespace?: string;
  storageClassName?: string;
  storageClassProvisioner?: string;
  uploadFile?: File | string;
  uploadFilename?: string;
  url?: string;
  volumeMode?: V1beta1StorageSpecVolumeModeEnum;
};

export type SetBootableVolumeFieldType = (
  key: keyof AddBootableVolumeState,
  fieldKey?: string,
) => (
  value: { password: string; username: string } | boolean | File | number | string | string[],
) => void;

export const initialBootableVolumeState: AddBootableVolumeState = {
  annotations: {},
  bootableVolumeName: null,
  bootableVolumeNamespace: null,
  cronExpression: null,
  isIso: false,
  labels: {},
  pvcName: null,
  pvcNamespace: null,
  registryCredentials: { password: '', username: '' },
  registryURL: null,
  retainRevisions: 3,
  size: DEFAULT_DISK_SIZE,
  snapshotName: null,
  snapshotNamespace: null,
  storageClassName: null,
  storageClassProvisioner: null,
  uploadFile: null,
  uploadFilename: null,
};

export const initialDataImportCron: V1beta1DataImportCron = {
  apiVersion: 'cdi.kubevirt.io/v1beta1',
  kind: DataImportCronModel.kind,
  metadata: {
    annotations: {
      [CDI_BIND_REQUESTED_ANNOTATION]: 'true',
    },
    name: '',
    namespace: '',
  },
  spec: {
    managedDataSource: '',
    schedule: '',
    template: {
      spec: {},
    },
  },
};

export const emptySourceDataVolume: V1beta1DataVolume = {
  apiVersion: `${DataVolumeModel.apiGroup}/${DataVolumeModel.apiVersion}`,
  kind: DataVolumeModel.kind,
  metadata: {
    annotations: {
      [CDI_BIND_REQUESTED_ANNOTATION]: 'true',
    },
    name: '',
    namespace: OPENSHIFT_OS_IMAGES_NS,
  },
  spec: {
    storage: {
      resources: {
        requests: {
          storage: '',
        },
      },
    },
  },
};

export const emptyDataSource: V1beta1DataSource = {
  apiVersion: `${DataSourceModel.apiGroup}/${DataSourceModel.apiVersion}`,
  kind: DataSourceModel.kind,
  metadata: {
    name: '',
    namespace: OPENSHIFT_OS_IMAGES_NS,
  },
  spec: { source: {} },
};
