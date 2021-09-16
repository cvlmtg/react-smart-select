import type { RSSOption, RSSOptions, SelectProps } from './typings';
import Background from './styled/background';
import Dropdown from './styled/dropdown';
import Wrapper from './styled/wrapper';
import Label from './styled/label';
import Option from './option';
import React, {
  useLayoutEffect, useCallback, useState, FunctionComponent
} from 'react';

// ---------------------------------------------------------------------

import { useToggle, useRandomId, useClickOutside } from './hooks';
import type { Options } from '@popperjs/core';
import { usePopper } from 'react-popper';
import * as constants from './constants';
import * as utils from './utils';

const DROPDOWN_CLASS = constants.DROPDOWN_CLASS;
const SELECT_CLASS   = constants.SELECT_CLASS;
const IGNORE_CLASS   = constants.IGNORE_CLASS;
const LABEL_CLASS    = constants.LABEL_CLASS;

const POPPER: Partial<Options> = {
  placement: 'bottom-start'
};

// ---------------------------------------------------------------------
/* eslint-disable react/jsx-props-no-spreading */

const SmartSelect: FunctionComponent<SelectProps> = (props) => {
  const {
    formatLabel = utils.formatLabel,
    disabled = false,
    className,
    onChange,
    options,
    toggle = false,
    multi = toggle || false,
    value = multi ? [] : null
  } = props;

  const btnId = useRandomId();

  const [ open, onToggle ] = useToggle();

  const popper = useClickOutside(open ? onToggle : undefined);

  const [ ref, setReference ] = useState<HTMLElement | null>(null);

  const { styles, attributes, update } = usePopper(ref, popper.current, POPPER);

  // -------------------------------------------------------------------

  const onClick = useCallback((evt) => {
    const index    = evt.currentTarget.dataset.index;
    const selected = options[index];

    // if "toggle" is true, the first element of the list selects
    // and deselects the whole list. if any other element of the
    // list is deselected, the first element is deselected too

    if (multi === true) {
      const values  = value as RSSOptions;
      const updater = toggle ? utils.toggle : utils.multi;
      const updated = updater(values, selected, index, options);

      onChange(updated, selected, options);
      return;
    }

    onChange(selected);
    onToggle();
  }, [ options, value, multi, toggle, onToggle, onChange ]);

  useLayoutEffect(() => {
    if (open === true && update !== null) {
      update();
    }
  }, [ open, update ]);

  // -------------------------------------------------------------------

  const wrapClass  = className ? `${SELECT_CLASS} ${className}` : SELECT_CLASS;
  const labelClass = open ? `${LABEL_CLASS} ${IGNORE_CLASS}` : LABEL_CLASS;
  const label      = formatLabel(value, options);
  const hidden     = !open;
  const dropdown   = {
    ...props.dropdownStyle,
    ...styles.popper
  };

  const renderOption = (option: RSSOption, index: number) => {
    const formatOption = props.formatOption;
    const style        = props.optionStyle;
    const key          = option.value;

    return (
      <Option option={option} index={index} value={value} multi={multi}
        key={key} style={style} formatOption={formatOption}
        onClick={onClick} />
    );
  };

  return (
    <Wrapper className={wrapClass} style={props.style}>
      <Label type="button" ref={setReference} id={btnId} className={labelClass}
        aria-haspopup={true} aria-expanded={open} style={props.labelStyle}
        open={open} disabled={disabled} onClick={onToggle}>
        {label}
      </Label>
      <Background open={open} />
      <Dropdown role="menu" ref={popper} className={DROPDOWN_CLASS}
        aria-labelledby={btnId} aria-hidden={hidden}
        open={open} style={dropdown}
        {...attributes.popper}>
        {options.map(renderOption)}
      </Dropdown>
    </Wrapper>
  );
};

export default React.memo(SmartSelect);
