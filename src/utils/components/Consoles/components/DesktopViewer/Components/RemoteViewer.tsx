import React from 'react';
import { Trans } from 'react-i18next';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Button, Content, ExpandableSection, Flex, Stack } from '@patternfly/react-core';

import { RDP_CONSOLE_TYPE, SPICE_CONSOLE_TYPE, VNC_CONSOLE_TYPE } from '../../utils/ConsoleConsts';
import {
  DEFAULT_RDP_FILENAME,
  DEFAULT_RDP_MIMETYPE,
  DEFAULT_VV_FILENAME,
  DEFAULT_VV_MIMETYPE,
} from '../utils/constants';
import { RemoteViewerProps } from '../utils/types';
import { downloadFile, generateDescriptorFile } from '../utils/utils';

import MoreInformationDefault from './MoreInformationDefault';

const RemoteViewer: React.FC<RemoteViewerProps> = ({
  onDownload = downloadFile,
  onGenerate = generateDescriptorFile,
  rdp = null,
  spice = null,
  textConnectWithRDP,
  textConnectWithRemoteViewer,
  textMoreInfo,
  textMoreInfoContent,
  textMoreRDPInfo,
  textMoreRDPInfoContent,
  vnc = null,
}) => {
  const { t } = useKubevirtTranslation();
  const [isExpandedDefault, setIsExpandedDefault] = React.useState<boolean>(false);
  const [isExpandedRDP, setIsExpandedRDP] = React.useState<boolean>(false);

  const console = spice || vnc;

  const onClickVV = () => {
    const type = spice ? SPICE_CONSOLE_TYPE : VNC_CONSOLE_TYPE;
    if (console) {
      const vv = onGenerate(console, type);
      return onDownload(DEFAULT_VV_FILENAME, vv?.content, vv?.mimeType || DEFAULT_VV_MIMETYPE);
    }
  };

  const onClickRDP = () => {
    const rdpFile = onGenerate(rdp, RDP_CONSOLE_TYPE);
    return onDownload(
      DEFAULT_RDP_FILENAME,
      rdpFile?.content,
      rdpFile?.mimeType || DEFAULT_RDP_MIMETYPE,
    );
  };

  return (
    <Stack hasGutter>
      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
        <Button isDisabled={!console} onClick={onClickVV}>
          {textConnectWithRemoteViewer || t('Launch Remote Viewer')}
        </Button>
        {!!rdp && (
          <Button onClick={onClickRDP}>{textConnectWithRDP || t('Launch Remote Desktop')}</Button>
        )}
      </Flex>
      {!!console && (
        <ExpandableSection
          isExpanded={isExpandedDefault}
          onToggle={(_event, isExpanded) => setIsExpandedDefault(isExpanded)}
          toggleText={textMoreInfo || t('Remote Viewer Details')}
        >
          <MoreInformationDefault textMoreInfoContent={textMoreInfoContent} />
        </ExpandableSection>
      )}
      {!!rdp && (
        <ExpandableSection
          isExpanded={isExpandedRDP}
          onToggle={(_event, isExpanded) => setIsExpandedRDP(isExpanded)}
          toggleText={textMoreRDPInfo || t('Remote Desktop Details')}
        >
          {textMoreRDPInfoContent ?? (
            <Content>
              <Trans ns="plugin__kubevirt-plugin" t={t}>
                <p>
                  Clicking &quot;Launch Remote Desktop&quot; will download an .rdp file and launch{' '}
                  <i>Remote Desktop Viewer</i>.
                </p>
                <p>
                  Since the RDP is native Windows protocol, the best experience is achieved when
                  used on Windows-based desktop.
                </p>
                <p>
                  For other operating systems, the <i>Remote Viewer</i> is recommended. If RDP needs
                  to be accessed anyway, the{' '}
                  <a href="https://www.remmina.org/" rel="noopener noreferrer" target="_blank">
                    Remmina
                  </a>{' '}
                  client is available.
                </p>
              </Trans>
            </Content>
          )}
        </ExpandableSection>
      )}
    </Stack>
  );
};

export default RemoteViewer;
