import React, { CSSProperties, FunctionComponent } from 'react';
import Single from './styled/single';
import Multi from './styled/multi';
import type {
  RSSOption, RSSOptions, RSSValue, FormatOption, EvtHandler
} from './typings';

// ---------------------------------------------------------------------

import { OPTION_CLASS } from './constants';
import { useRandomId } from './hooks';

function formatSimple(option: RSSOption) {
  return option.label;
}

type OptionProps = {
  onClick: EvtHandler;
  option: RSSOption;
  index: number;
  value?: RSSValue;
  style?: CSSProperties;
  formatOption?: FormatOption;
  multi?: boolean;
};

// ---------------------------------------------------------------------

const SmartOption: FunctionComponent<OptionProps> = (props) => {
  const {
    option, index, value, multi, style, onClick,
    formatOption = formatSimple
  } = props;

  const Styled  = multi ? Multi : Single;
  const _values = value as RSSOptions;
  const _value  = value as RSSOption;
  const current = option.value;
  let selected;

  if (multi === true) {
    selected = _values.some((v) => v.value === current);
  } else {
    selected = value ? _value.value === current : false;
  }

  const className = selected ? `${OPTION_CLASS} selected` : OPTION_CLASS;
  const formatted = formatOption(option, selected);
  const id        = useRandomId();

  return (
    <Styled key={current} role="menuitem">
      <input type="checkbox" id={id} name={current} checked={selected}
        data-index={index} onChange={onClick} />
      <label htmlFor={id} className={className} style={style}>
        <span className="check" />
        {formatted}
      </label>
    </Styled>
  );
};

export default React.memo(SmartOption);
