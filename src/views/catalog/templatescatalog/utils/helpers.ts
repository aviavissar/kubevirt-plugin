import { SetStateAction } from 'react';
import produce from 'immer';

import { UpdateValidatedVM } from '@catalog/utils/WizardVMContext';
import { V1Template } from '@kubevirt-ui/kubevirt-api/console';
import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { DEFAULT_NAMESPACE } from '@kubevirt-utils/constants/constants';
import {
  isCommonTemplate,
  isDeprecatedTemplate,
  OS_NAME_TYPES,
} from '@kubevirt-utils/resources/template';
import {
  getTemplateName,
  getTemplateOS,
  getTemplateWorkload,
  isDefaultVariantTemplate,
} from '@kubevirt-utils/resources/template/utils/selectors';
import { getCPUSockets, getMemory } from '@kubevirt-utils/resources/vm';
import { getArchitecture } from '@kubevirt-utils/utils/architecture';
import { ensurePath } from '@kubevirt-utils/utils/utils';

import { TemplateFilters } from './types';

const isUserTemplate = (template: V1Template): boolean =>
  !isDefaultVariantTemplate(template) && !isCommonTemplate(template);

export const filterTemplates = (
  templates: V1Template[],
  filters: TemplateFilters,
): V1Template[] => {
  return (
    templates
      .filter((tmp) => {
        const textFilterLowerCase = filters?.query.toLowerCase();
        const workload = getTemplateWorkload(tmp);

        const textFilter =
          !textFilterLowerCase ||
          getTemplateName(tmp).toLowerCase().includes(textFilterLowerCase) ||
          tmp?.metadata?.name?.includes(textFilterLowerCase);

        const defaultVariantFilter =
          (!filters?.onlyDefault && !hasNoDefaultUserAllFilters(filters)) ||
          isDefaultVariantTemplate(tmp);

        const userFilter = !filters.onlyUser || isUserTemplate(tmp);

        const workloadFilter = filters?.workload?.size <= 0 || filters.workload.has(workload);

        const osNameFilter = filters?.osName?.size <= 0 || filters?.osName?.has(getTemplateOS(tmp));

        const architectureFilter =
          filters?.architecture?.size <= 0 || filters?.architecture?.has(getArchitecture(tmp));

        const hideDeprecatedTemplatesFilter =
          !filters?.hideDeprecatedTemplates || !isDeprecatedTemplate(tmp);

        return (
          defaultVariantFilter &&
          userFilter &&
          textFilter &&
          workloadFilter &&
          osNameFilter &&
          architectureFilter &&
          hideDeprecatedTemplatesFilter
        );
      })
      // show RHEL templates first, then alphabetically
      .sort((a, b) => {
        if (getTemplateOS(a) === OS_NAME_TYPES.rhel) {
          return -1;
        }
        if (getTemplateOS(b) === OS_NAME_TYPES.rhel) {
          return 1;
        }

        const aName = getTemplateName(a) || a?.metadata?.name;
        const bName = getTemplateName(b) || b?.metadata?.name;

        return aName?.localeCompare(bName);
      })
  );
};

export const updateVMCPUMemory = (
  ns: string,
  updateVM: ((vmDraft: V1VirtualMachine) => void) | UpdateValidatedVM,
  setUpdatedVM?: (value: SetStateAction<V1VirtualMachine>) => void,
) => {
  return (vm: V1VirtualMachine) => {
    const updatedVM = produce<V1VirtualMachine>(vm, (vmDraft: V1VirtualMachine) => {
      ensurePath(vmDraft, [
        'spec.template.spec.domain.cpu',
        'spec.template.spec.domain.memory.guest',
      ]);

      vmDraft.metadata.namespace = ns || DEFAULT_NAMESPACE;
      vmDraft.spec.template.spec.domain.cpu.sockets = getCPUSockets(vm);
      vmDraft.spec.template.spec.domain.memory.guest = getMemory(vm);
    });

    setUpdatedVM(updatedVM);

    return updateVM(updatedVM);
  };
};

export const hasNoDefaultUserAllFilters = (filters: TemplateFilters): boolean =>
  !filters?.allItems && !filters?.onlyDefault && !filters?.onlyUser; // none of the filters are set - when first time in
