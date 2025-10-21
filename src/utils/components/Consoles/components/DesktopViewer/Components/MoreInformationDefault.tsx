import React from 'react';
import { Trans } from 'react-i18next';

import VirtualMachineDescriptionItem from '@kubevirt-utils/components/VirtualMachineDescriptionItem/VirtualMachineDescriptionItem';
import { documentationURL } from '@kubevirt-utils/constants/documentation';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Content, DescriptionList } from '@patternfly/react-core';

import { MoreInformationDefaultProps } from '../utils/types';

import Detail from './Detail';

const MoreInformationDefault: React.FC<MoreInformationDefaultProps> = ({ textMoreInfoContent }) => {
  const { t } = useKubevirtTranslation();
  return (
    <>
      {textMoreInfoContent || (
        <Content>
          <Trans ns="plugin__kubevirt-plugin" t={t}>
            <p>
              Clicking &quot;Launch Remote Viewer&quot; will download a .vv file and launch{' '}
              <i>Remote Viewer</i>
            </p>
            <p>
              <i>Remote Viewer</i> is available for most operating systems. To install it, search
              for it in GNOME Software or run the following:
            </p>
          </Trans>
        </Content>
      )}
      <DescriptionList className="pf-v6-u-mt-md" isHorizontal>
        <Detail title={'RHEL, CentOS'} value={'sudo yum install virt-viewer'} />
        <Detail title={'Fedora'} value={'sudo dnf install virt-viewer'} />
        <Detail title={'Ubuntu, Debian'} value={'sudo apt-get install virt-viewer'} />
        <VirtualMachineDescriptionItem
          descriptionData={
            <div>
              {t('Download the MSI from ')}
              <a
                href={documentationURL.VIRT_MANAGER_DOWNLOAD}
                rel="noopener noreferrer"
                target="_blank"
              >
                virt-manager.org
              </a>
            </div>
          }
          descriptionHeader={t('Windows')}
        />
      </DescriptionList>
    </>
  );
};

export default MoreInformationDefault;
