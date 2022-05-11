import type { RSSOption, RSSOptions, SelectProps } from './typings';
import Background from './styled/background';
import Dropdown from './styled/dropdown';
import Wrapper from './styled/wrapper';
import Label from './styled/label';
import Option from './option';
import React, {
  useLayoutEffect, useCallback, FunctionComponent
} from 'react';

// ---------------------------------------------------------------------

import { useFloating, shift, Placement } from '@floating-ui/react-dom';
import { useToggle, useRandomId, useClickOutside } from './hooks';
import * as constants from './constants';
import * as utils from './utils';

const DROPDOWN_CLASS = constants.DROPDOWN_CLASS;
const SELECT_CLASS   = constants.SELECT_CLASS;
const IGNORE_CLASS   = constants.IGNORE_CLASS;
const LABEL_CLASS    = constants.LABEL_CLASS;

const placement = 'bottom-start' as Placement;
const OPTIONS   = {
  middleware: [ shift() ],
  placement
};

// ---------------------------------------------------------------------
/* eslint-disable react/jsx-props-no-spreading */

const SmartSelect: FunctionComponent<SelectProps> = (props) => {
  const {
    disabled = false,
    placeholder,
    className,
    onChange,
    options,
    toggle = false,
    multi = toggle || false,
    value = multi ? [] : null
  } = props;

  const { x, y, refs, reference, floating, strategy, update } = useFloating(OPTIONS);

  const formatLabel = props.formatLabel || utils.formatLabel(placeholder);

  const [ open, onToggle ] = useToggle();

  const btnId = useRandomId();

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

    onChange(selected, selected, options);
    onToggle();
  }, [ options, value, multi, toggle, onToggle, onChange ]);

  // -------------------------------------------------------------------

  useClickOutside(refs.floating, open ? onToggle : undefined);

  useLayoutEffect(() => {
    const ref = refs.floating.current;

    if (ref) {
      ref.style.display = open ? 'block' : '';
      update();
    }
  }, [ open, refs, update ]);

  // -------------------------------------------------------------------

  const wrapClass  = className ? `${SELECT_CLASS} ${className}` : SELECT_CLASS;
  const labelClass = open ? `${LABEL_CLASS} ${IGNORE_CLASS}` : LABEL_CLASS;
  const label      = formatLabel(value, options);
  const hidden     = !open;

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

  const roundX   = x === null ? 0 : Math.round(x);
  const roundY   = y === null ? 0 : Math.round(y);
  const dropdown = {
    ...props.dropdownStyle,
    position: strategy,
    left:     roundX,
    top:      roundY
  };

  return (
    <Wrapper className={wrapClass} style={props.style}>
      <Label type="button" ref={reference} id={btnId} className={labelClass}
        aria-haspopup={true} aria-expanded={open} style={props.labelStyle}
        open={open} disabled={disabled} onClick={onToggle}>
        {label}
      </Label>
      <Background open={open} />
      <Dropdown role="menu" ref={floating} className={DROPDOWN_CLASS}
        aria-labelledby={btnId} aria-hidden={hidden}
        open={open} style={dropdown}>
        {options.map(renderOption)}
      </Dropdown>
    </Wrapper>
  );
};

export default React.memo(SmartSelect);
