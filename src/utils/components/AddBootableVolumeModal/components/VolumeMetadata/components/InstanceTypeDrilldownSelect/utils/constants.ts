import { ComponentClass } from 'react';

import { t } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import {
  InstanceTypeSeries,
  InstanceTypeSize,
  InstanceTypeSizes,
} from '@kubevirt-utils/resources/instancetype/types';
import {
  MemoryIcon,
  MicrochipIcon,
  ModuleIcon,
  NetworkIcon,
  OutlinedClockIcon,
  RedhatIcon,
  RegistryIcon,
  ServerGroupIcon,
  ServerIcon,
  TrendUpIcon,
  UserIcon,
} from '@patternfly/react-icons';

import { InstanceTypesMenuItemsData } from './types';

export const MENUS = {
  redHatProvided: 'redHatProvided',
  root: 'root',
  series: 'series',
  sizes: 'sizes',
  userProvided: 'userProvided',
};

export const initialMenuItems: InstanceTypesMenuItemsData = {
  redHatProvided: {
    Icon: RedhatIcon,
    id: MENUS.redHatProvided,
    items: [],
    label: t('Red Hat provided'),
  },
  userProvided: {
    Icon: UserIcon,
    id: MENUS.userProvided,
    items: [],
    label: t('User provided'),
  },
};

export const instanceTypeSeriesNameMapper: {
  [key in 'server' | InstanceTypeSeries]: {
    disabled?: boolean;
    Icon: ComponentClass;
    possibleSizes?: InstanceTypeSize[];
    seriesLabel: string;
  };
} = {
  cx1: {
    Icon: RegistryIcon,
    possibleSizes: [
      'medium',
      'large',
      'xlarge',
      '2xlarge',
      '4xlarge',
      '8xlarge',
      'medium1gi',
      'large1gi',
      'xlarge1gi',
      '2xlarge1gi',
      '4xlarge1gi',
      '8xlarge1gi',
    ],
    seriesLabel: t('CX series'),
  },
  gn1: {
    Icon: MicrochipIcon,
    possibleSizes: ['xlarge', '2xlarge', '4xlarge', '8xlarge'],
    seriesLabel: t('GN series'),
  },
  highperformance: {
    disabled: true,
    Icon: TrendUpIcon,
    seriesLabel: t('HP series'),
  },
  m1: {
    Icon: MemoryIcon,
    possibleSizes: [
      'large',
      'xlarge',
      '2xlarge',
      '4xlarge',
      '8xlarge',
      'large1gi',
      'xlarge1gi',
      '2xlarge1gi',
      '4xlarge1gi',
      '8xlarge1gi',
    ],
    seriesLabel: t('M series'),
  },
  n1: {
    Icon: NetworkIcon,
    possibleSizes: ['medium', 'large', 'xlarge', '2xlarge', '4xlarge', '8xlarge'],
    seriesLabel: t('N series'),
  },
  o1: {
    Icon: ModuleIcon,
    possibleSizes: [
      'nano',
      'micro',
      'small',
      'medium',
      'large',
      'xlarge',
      '2xlarge',
      '4xlarge',
      '8xlarge',
    ],
    seriesLabel: t('O series'),
  },
  rt1: {
    Icon: OutlinedClockIcon,
    possibleSizes: [...InstanceTypeSizes],
    seriesLabel: t('RT series'),
  },
  server: {
    disabled: true,
    Icon: ServerIcon,
    seriesLabel: t('S series'),
  },
  u1: {
    Icon: ServerGroupIcon,
    possibleSizes: [
      'nano',
      'micro',
      'small',
      'medium',
      '2xmedium',
      'large',
      'xlarge',
      '2xlarge',
      '4xlarge',
      '8xlarge',
    ],
    seriesLabel: t('U series'),
  },
};

export const REDHAT_COM = 'redhat.com';
export const INSTANCETYPE_CLASS_ANNOTATION = 'instancetype.kubevirt.io/class';
export const INSTANCETYPE_DESCRIPTION_ANNOTATION = 'instancetype.kubevirt.io/description';
export const INSTANCETYPE_CLASS_DISPLAY_NAME = 'instancetype.kubevirt.io/displayName';
