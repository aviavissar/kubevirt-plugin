import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';

import { TextInput, TextInputProps } from '@patternfly/react-core';

type SearchFilterProps = {
  className?: string;
  placeholder: string;
} & TextInputProps;

const SearchFilter = forwardRef<HTMLInputElement, SearchFilterProps>((props, ref) => {
  const { className, placeholder, ...otherInputProps } = props;

  const defaultRef = useRef<HTMLInputElement>();

  const inputRef = useMemo(() => ref ?? defaultRef, [ref]);

  useEffect(() => {
    if (!inputRef || !('current' in inputRef) || !inputRef.current) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && inputRef.current !== document.activeElement) {
        inputRef.current.focus();
        event.preventDefault();
      }
    };

    inputRef.current.addEventListener('keydown', onKeyDown);

    return () => {
      if (!inputRef || !('current' in inputRef) || !inputRef.current) return;

      inputRef.current.removeEventListener('keydown', onKeyDown);
    };
  }, [inputRef]);

  return (
    <div className="co-text-filter">
      <TextInput
        {...otherInputProps}
        aria-label={placeholder}
        className={classNames('co-text-filter__text-input', className)}
        data-test-id="item-filter"
        placeholder={placeholder}
        ref={inputRef}
        tabIndex={0}
        type="text"
      />
    </div>
  );
});

export default SearchFilter;
