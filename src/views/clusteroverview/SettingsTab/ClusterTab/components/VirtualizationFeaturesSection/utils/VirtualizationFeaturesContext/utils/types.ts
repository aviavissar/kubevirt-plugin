import { ObjectMetadata } from '@openshift-console/dynamic-plugin-sdk';
import {
  InstallState,
  VirtualizationFeatureOperators,
} from '@overview/SettingsTab/ClusterTab/components/VirtualizationFeaturesSection/utils/types';
import {
  ClusterServiceVersionKind,
  OperatorGroupKind,
  PackageManifestKind,
  SubscriptionKind,
} from '@overview/utils/types';

export enum OLMAnnotation {
  ActionText = 'marketplace.openshift.io/action-text',
  Capabilities = 'capabilities',
  Categories = 'categories',
  CertifiedLevel = 'certifiedLevel',
  CNF = 'features.operators.openshift.io/cnf',
  CNI = 'features.operators.openshift.io/cni',
  ContainerImage = 'containerImage',
  CreatedAt = 'createdAt',
  CSI = 'features.operators.openshift.io/csi',
  Description = 'description',
  Disconnected = 'features.operators.openshift.io/disconnected',
  DisplayName = 'displayName',
  FIPSCompliant = 'features.operators.openshift.io/fips-compliant',
  HealthIndex = 'healthIndex',
  InfrastructureFeatures = 'operators.openshift.io/infrastructure-features',
  InitializationLink = 'operatorframework.io/initialization-link',
  InitializationResource = 'operatorframework.io/initialization-resource',
  InternalObjects = 'operators.operatorframework.io/internal-objects',
  OperatorPlugins = 'console.openshift.io/plugins',
  OperatorType = 'operators.operatorframework.io/operator-type',
  ProxyAware = 'features.operators.openshift.io/proxy-aware',
  RemoteWorkflow = 'marketplace.openshift.io/remote-workflow',
  Repository = 'repository',
  SuggestedNamespaceTemplate = 'operatorframework.io/suggested-namespace-template',
  Support = 'support',
  SupportWorkflow = 'marketplace.openshift.io/support-workflow',
  Tags = 'tags',
  TLSProfiles = 'features.operators.openshift.io/tls-profiles',
  TokenAuthAWS = 'features.operators.openshift.io/token-auth-aws',
  TokenAuthAzure = 'features.operators.openshift.io/token-auth-azure',
  TokenAuthGCP = 'features.operators.openshift.io/token-auth-gcp',
  UninstallMessage = 'operator.openshift.io/uninstall-message',
  ValidSubscription = 'operators.openshift.io/valid-subscription',
}

type AnnotationParserOptions = {
  onError?: (e: any) => void;
};

export type AnnotationParser<
  Result = any,
  Options extends AnnotationParserOptions = AnnotationParserOptions,
> = (annotations: ObjectMetadata['annotations'], options?: Options) => Result;

export type ParseJSONAnnotationOptions = {
  onError?: (error: any) => void;
  validate?: (value: any) => boolean;
};

export enum PackageSource {
  CertifiedOperators = 'Certified',
  CommunityOperators = 'Community',
  Custom = 'Custom',
  RedHatMarketplace = 'Marketplace',
  RedHatOperators = 'Red Hat',
}

export enum DefaultCatalogSource {
  CertifiedOperators = 'certified-operators',
  CommunityOperators = 'community-operators',
  RedHatMarketPlace = 'redhat-marketplace',
  RedHatOperators = 'redhat-operators',
}

export type VirtFeatureOperatorItem = {
  [key: string]: any;
  catalogSource?: string;
  catalogSourceNamespace?: string;
  createdAt?: string;
  installState?: InstallState;
  kind?: string;
  name: string;
  obj: PackageManifestKind;
  provider?: string;
  source?: string;
  subscription?: SubscriptionKind;
  uid: string;
  validSubscription?: string[];
};

export type VirtFeatureOperatorItemsMap = {
  [key in VirtualizationFeatureOperators]: VirtFeatureOperatorItem[];
};

export type OperatorDetails = {
  installState: InstallState;
  operatorHubURL: string;
};

export type OperatorDetailsMap = { [key in VirtualizationFeatureOperators]: OperatorDetails };

export type OperatorResources = {
  clusterServiceVersions: ClusterServiceVersionKind[];
  operatorGroups: OperatorGroupKind[];
  subscriptions: SubscriptionKind[];
};
