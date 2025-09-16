import { Perspective, ResolvedExtension } from '@openshift-console/dynamic-plugin-sdk';

import virtualizationIcon from './virtualization-icon';

import './perspective.scss';

export const icon: ResolvedExtension<Perspective>['properties']['icon'] = {
  default: virtualizationIcon,
};

export const getLandingPageURL: ResolvedExtension<Perspective>['properties']['landingPageURL'] =
  () => `/k8s/all-namespaces/virtualization-overview`;

export const getVirtualizationLandingPageURL: ResolvedExtension<Perspective>['properties']['landingPageURL'] =
  () => `/k8s/virtualization-landing`;

export const getImportRedirectURL: ResolvedExtension<Perspective>['properties']['importRedirectURL'] =
  (namespace: string) => `/k8s/ns/${namespace}/virtualization-overview`;

export const getACMLandingPageURL: ResolvedExtension<Perspective>['properties']['landingPageURL'] =
  () => `/k8s/all-clusters/all-namespaces/kubevirt.io~v1~VirtualMachine`;
