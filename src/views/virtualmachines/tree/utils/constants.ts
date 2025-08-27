export const VM_FOLDER_LABEL = 'vm.openshift.io/folder';
export const PROJECT_SELECTOR_PREFIX = 'projectSelector';
export const FOLDER_SELECTOR_PREFIX = 'folderSelector';
export const CLUSTER_SELECTOR_PREFIX = 'clusterSelector';

export const TREE_VIEW_PANEL_ID = 'vms-tree-view-panel';
export const TREE_VIEW_SEARCH_ID = 'vms-tree-view-search-input';
export const OPEN_DRAWER_SIZE = '400px';
export const CLOSED_DRAWER_SIZE = '30px';
export const PANEL_WIDTH_PROPERTY = '--pf-v6-c-drawer__panel--md--FlexBasis';

export const SYSTEM_NAMESPACES_PREFIX = ['kube-', 'openshift-', 'kubernetes-'];
export const SYSTEM_NAMESPACES = ['default', 'openshift'];
export const SHOW_EMPTY_PROJECTS_KEY = 'showEmptyProjects';
export const TREE_VIEW_LAST_WIDTH = 'treeViewLastWidth';
export const SHOW_TREE_VIEW = 'showTreeView';
export const SELECTED_ITEM = 'selectedItem';
export const SHOW = 'show';
export const HIDE = 'hide';

export const ALL_CLUSTERS_ID = 'ALL_CLUSTERS';

export const VIRTUALIZATION_PATHS = {
  BASE: '/virtualization',
  OVERVIEW: 'virtualization-overview',
} as const;
