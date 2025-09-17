import React, { FC } from 'react';

import { documentationURL } from '@kubevirt-utils/constants/documentation';
import { useIsAdmin } from '@kubevirt-utils/hooks/useIsAdmin';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { getValidNamespace } from '@kubevirt-utils/utils/utils';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';

import GettingStartedSectionContents from '../utils/getting-started-content/GettingStartedSectionContents';
import useMTVResources from '../utils/hooks/useMTVResources';
import { GettingStartedLink } from '../utils/types';

import './RelatedOperatorsSection.scss';

const RelatedOperatorsSection: FC = () => {
  const { t } = useKubevirtTranslation();
  const { mtvLink, mtvLoaded } = useMTVResources();
  const isAdmin = useIsAdmin();
  const [activeNamespace] = useActiveNamespace();
  const validNamespace = getValidNamespace(activeNamespace);

  const moreLink: GettingStartedLink = {
    external: true,
    href: documentationURL.OPERATIONS,
    id: 'openshift-virtualization-related-operators',
    title: t('Learn more about Operators'),
  };

  const links: GettingStartedLink[] = [
    {
      external: !isAdmin,
      href: isAdmin
        ? `/catalog/ns/${validNamespace}?keyword=nmstate`
        : documentationURL.NMSTATE_OPERATOR,
      id: 'kubernetes-nmstate',
      title: t('Kubernetes NMState Operator'),
    },
    {
      external: !isAdmin,
      href: isAdmin
        ? `/catalog/ns/${validNamespace}?keyword=ODF`
        : documentationURL.DATA_FOUNDATION_OPERATOR,
      id: 'openshift-data-foundation',
      title: t('OpenShift Data Foundation'),
    },
    {
      description: t('Migrate multiple virtual machine workloads to OpenShift Virtualization. '),
      external: !isAdmin,
      href: isAdmin ? `/catalog/ns/${validNamespace}?keyword=MTV` : documentationURL.MTV_OPERATOR,
      id: 'openshift-virtualization-mtv',
      secondaryLinkExternal: true,
      secondaryLinkHref: mtvLink,
      secondaryLinkText: t('Launch Migration Toolkit for Virtualization web console'),
      showSecondaryLink: mtvLoaded && !!mtvLink,
      title: t('Migration Toolkit for Virtualization'),
    },
  ];

  return (
    <GettingStartedSectionContents
      icon={
        <i
          aria-hidden="true"
          className="fas fa-cubes"
          id="kv-getting-started--related-operators-icon"
        />
      }
      description={t('Ease operational complexity with virtualization by using Operators.')}
      id="related-operators"
      links={links}
      moreLink={moreLink}
      title={t('Related operators')}
      titleColor={'var(--co-global--palette--orange-400)'}
    />
  );
};

export default RelatedOperatorsSection;
