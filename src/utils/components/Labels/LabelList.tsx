import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import classNames from 'classnames';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { isEmpty } from '@kubevirt-utils/utils/utils';
import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';
import { Label as PfLabel, LabelGroup as PfLabelGroup } from '@patternfly/react-core';

export type LabelProps = {
  expand: boolean;
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  value: string;
};

export const Label: FC<LabelProps> = ({ expand, groupVersionKind, name, value }) => {
  const navigate = useNavigate();

  const href = `/search?kind=${groupVersionKind.kind}&q=${
    value ? encodeURIComponent(`${name}=${value}`) : name
  }`;
  const kindOf = `co-m-${groupVersionKind.kind.toLowerCase()}`;
  const labelClass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');

  return (
    <PfLabel className={labelClass} onClick={() => navigate(href)}>
      <span className="co-label__key" data-test="label-key">
        {name}
      </span>
      {value && <span className="co-label__eq">=</span>}
      {value && <span className="co-label__value">{value}</span>}
    </PfLabel>
  );
};

type LabelListProps = {
  expand?: boolean;
  groupVersionKind: K8sGroupVersionKind;
  labels: { [key: string]: string };
};

export const LabelList: FC<LabelListProps> = ({ expand = true, groupVersionKind, labels }) => {
  const { t } = useKubevirtTranslation();

  const list = Object.entries(labels || {}).map(([key, label]) => (
    <Label expand={expand} groupVersionKind={groupVersionKind} key={key} name={key} value={label} />
  ));

  return (
    <>
      {isEmpty(list) ? (
        <div className="pf-v6-u-text-color-subtle" content={t('No labels')} key="0">
          {t('No labels')}
        </div>
      ) : (
        <PfLabelGroup
          className="co-label-group"
          data-test="label-list"
          defaultIsOpen={true}
          numLabels={20}
        >
          {list}
        </PfLabelGroup>
      )}
    </>
  );
};
